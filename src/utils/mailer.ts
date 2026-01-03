import nodemailer from 'nodemailer'
import { env } from '@/env'

// Configure transporter
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST || 'smtp.example.com',
  port: env.SMTP_PORT || 587,
  secure: env.SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER || 'user',
    pass: env.SMTP_PASS || 'pass',
  },
})

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  // In DEV_MODE or if SMTP is not configured, just log the email
  if (env.DEV_MODE || !env.SMTP_HOST || env.SMTP_HOST === 'smtp.example.com') {
    console.log(`
    📧 [MOCKED EMAIL] 
    To: ${to}
    Subject: ${subject}
    Body: ${html.substring(0, 50)}...
    `)
    return { success: true, messageId: 'mock-id' }
  }

  try {
    const info = await transporter.sendMail({
      from: env.SMTP_FROM || '"Solvin Compro" <no-reply@solvin.com>',
      to,
      subject,
      html,
    })
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error }
  }
}
