import { createFileRoute, Link, useSearch } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, ArrowLeft, Loader2 } from 'lucide-react'
import { unsubscribeFn } from '@/functions/newsletter'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/unsubscribe')({
  component: UnsubscribePage,
})

function UnsubscribePage() {
  const { token } = useSearch({ from: '/unsubscribe' }) as { token: string }
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) return

    const unsubscribe = async () => {
      setStatus('loading')
      try {
        const result = await unsubscribeFn({ data: { token } })
        if (result.success) {
          setStatus('success')
        } else {
          setStatus('error')
          setMessage(result.message)
        }
      } catch (error) {
        setStatus('error')
        setMessage('Network error. Please try again.')
      }
    }

    unsubscribe()
  }, [token])

  return (
    <div className="min-h-screen py-32 px-6 flex items-center justify-center relative bg-transparent overflow-hidden">
      <div className="absolute inset-0 z-0 bg-linear-to-br from-accent-soft via-transparent to-accent-soft pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div
              className={cn(
                'w-20 h-20 rounded-full flex items-center justify-center border-4',
                status === 'loading' &&
                  'bg-accent-soft border-accent/30 text-accent-strong',
                status === 'success' &&
                  'bg-success/10 border-success/30 text-success',
                status === 'error' &&
                  'bg-signal/10 border-signal/30 text-signal',
                status === 'idle' &&
                  'bg-surface-2 border-line text-ink-muted',
              )}
            >
              {status === 'loading' && (
                <Loader2 className="w-10 h-10 animate-spin" />
              )}
              {status === 'success' && <CheckCircle className="w-10 h-10" />}
              {status === 'error' && <XCircle className="w-10 h-10" />}
              {status === 'idle' && <ArrowLeft className="w-10 h-10" />}
            </div>
          </div>

          {/* Content */}
          <div className="bg-surface border border-line rounded-3xl p-8">
            {status === 'loading' && (
              <>
                <h1 className="text-2xl font-bold mb-2">Unsubscribing...</h1>
                <p className="text-muted-foreground">
                  Please wait while we process your request.
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <h1 className="text-2xl font-bold mb-2 text-success">
                  Unsubscribed
                </h1>
                <p className="text-muted-foreground mb-6">
                  You have been successfully unsubscribed from our newsletter.
                  You will no longer receive updates from us.
                </p>
                <Link to="/">
                  <Button className="w-full">Back to Home</Button>
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <h1 className="text-2xl font-bold mb-2 text-signal">
                  Failed
                </h1>
                <p className="text-muted-foreground mb-6">
                  {message ||
                    'Could not unsubscribe. Invalid or expired token.'}
                </p>
                <Link to="/">
                  <Button variant="outline" className="w-full">
                    Back to Home
                  </Button>
                </Link>
              </>
            )}

            {status === 'idle' && !token && (
              <>
                <h1 className="text-2xl font-bold mb-2">Invalid Link</h1>
                <p className="text-muted-foreground mb-6">
                  New newsletter link found. Please follow the link from your
                  email.
                </p>
                <Link to="/">
                  <Button className="w-full">Back to Home</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
