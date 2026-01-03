import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '@/db'
import { subscribers, emailQueue } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { sendEmail } from '@/utils/mailer'
import { randomBytes } from 'crypto'
import { env } from '@/env'

// Schemas
const subscribeSchema = z.object({
  email: z.string().email(),
})

const unsubscribeSchema = z.object({
  token: z.string().min(1),
})

function generateToken() {
  return randomBytes(32).toString('hex')
}

// 1. Subscribe Function
export const subscribeFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => subscribeSchema.parse(data))
  .handler(async ({ data }): Promise<{ success: boolean; message: string }> => {
    const { email } = data

    try {
      // Check if already subscribed
      const [existing] = await db
        .select()
        .from(subscribers)
        .where(eq(subscribers.email, email))

      if (existing) {
        if (existing.status === 'subscribed') {
          return { success: true, message: 'Already subscribed!' }
        }
        // If pending or unsubscribed, resend verification/welcome or just reactivate
        // For simplicity, let's reactivate and send welcome
        await db
          .update(subscribers)
          .set({ status: 'subscribed' })
          .where(eq(subscribers.id, existing.id))
      } else {
        // Create new subscriber
        const token = generateToken()
        await db.insert(subscribers).values({
          email,
          token,
          status: 'subscribed', // Direct subscribe for now, could be 'pending' for double opt-in
        })

        // Enqueue Welcome Email
        const unsubscribeLink = `${env.SERVER_URL || 'http://localhost:3000'}/unsubscribe?token=${token}`
        await db.insert(emailQueue).values({
          to: email,
          subject: 'Welcome to Solvin Newsletter!',
          body: `
            <h1>Welcome!</h1>
            <p>Thanks for subscribing to our newsletter. You'll be the first to know about our latest articles and updates.</p>
            <p>Cheers,<br/>The Solvin Team</p>
            <hr/>
            <small><a href="${unsubscribeLink}">Unsubscribe</a></small>
          `,
          status: 'pending',
        })
      }

      // Trigger queue processing (fire and forget)
      processEmailQueueFn()

      return { success: true, message: 'Successfully subscribed!' }
    } catch (error) {
      console.error('Subscribe error:', error)
      return { success: false, message: 'Failed to subscribe' }
    }
  })

// 2. Unsubscribe Function
export const unsubscribeFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => unsubscribeSchema.parse(data))
  .handler(async ({ data }): Promise<{ success: boolean; message: string }> => {
    const { token } = data

    try {
      const [existing] = await db
        .select()
        .from(subscribers)
        .where(eq(subscribers.token, token))

      if (!existing) {
        return { success: false, message: 'Invalid token' }
      }

      await db
        .update(subscribers)
        .set({ status: 'unsubscribed' })
        .where(eq(subscribers.id, existing.id))

      return { success: true, message: 'Successfully unsubscribed' }
    } catch (error) {
      console.error('Unsubscribe error:', error)
      return { success: false, message: 'Failed to unsubscribe' }
    }
  })

// 3. Process Email Queue (Queue Worker)
export const processEmailQueueFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    // Determine batch size (keep it small for now)
    const BATCH_SIZE = 5

    try {
      // Fetch pending emails
      const pendingEmails = await db
        .select()
        .from(emailQueue)
        .where(eq(emailQueue.status, 'pending'))
        .limit(BATCH_SIZE)

      for (const email of pendingEmails) {
        // Update to 'processing' (optional, but good for concurrency safely if scaled)
        // For simplicity here, we just try to send

        // Send email
        const result = await sendEmail({
          to: email.to,
          subject: email.subject,
          html: email.body,
        })

        if (result.success) {
          await db
            .update(emailQueue)
            .set({ status: 'sent', updatedAt: new Date() })
            .where(eq(emailQueue.id, email.id))
        } else {
          await db
            .update(emailQueue)
            .set({
              status: 'failed',
              error: JSON.stringify(result.error),
              attempts: (email.attempts || 0) + 1,
              updatedAt: new Date(),
            })
            .where(eq(emailQueue.id, email.id))
        }
      }

      return { processed: pendingEmails.length }
    } catch (error) {
      console.error('Queue processing error:', error)
      return { error: 'Queue processing failed' }
    }
  },
)

// 4. Notify Subscribers (Enqueue mass emails)
// Usage: Called after article creation
interface NotifyParams {
  articleId: number
  title: string
  slug: string
  summary: string
}

export const notifySubscribersFn = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => data as NotifyParams)
  .handler(async ({ data }) => {
    const { title, slug, summary } = data
    const articleLink = `${env.SERVER_URL || 'http://localhost:3000'}/blog/${slug}`

    try {
      // Get all active subscribers
      const activeSubscribers = await db
        .select()
        .from(subscribers)
        .where(eq(subscribers.status, 'subscribed'))

      if (activeSubscribers.length === 0) return { queued: 0 }

      const emailValues = activeSubscribers.map((sub) => {
        const unsubscribeLink = `${env.SERVER_URL || 'http://localhost:3000'}/unsubscribe?token=${sub.token}`
        return {
          to: sub.email,
          subject: `New Article: ${title}`,
          body: `
            <h1>New Article Published</h1>
            <h2>${title}</h2>
            <p>${summary}</p>
            <p><a href="${articleLink}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Read More</a></p>
            <hr/>
            <small><a href="${unsubscribeLink}">Unsubscribe</a></small>
          `,
          status: 'pending',
        }
      })

      // Bulk insert into queue
      await db.insert(emailQueue).values(emailValues)

      // Trigger queue (fire and forget)
      processEmailQueueFn()

      return { queued: emailValues.length }
    } catch (error) {
      console.error('Notify subscribers error:', error)
      return { error: 'Failed to notify subscribers' }
    }
  })
