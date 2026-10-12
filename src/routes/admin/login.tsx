'use client'

import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react'
import { z } from 'zod'
import { loginFn, validateSessionFn } from '@/functions/auth'
import { getSessionTokenFromCookies } from '@/utils/session'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const Route = createFileRoute('/admin/login')({
  beforeLoad: async () => {
    if (typeof document !== 'undefined') {
      const cookieHeader = document.cookie
      const token = getSessionTokenFromCookies(cookieHeader)
      if (token) {
        const user = await validateSessionFn({ data: token })
        if (user) {
          throw redirect({ to: '/admin' })
        }
      }
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setValidationErrors({})

    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      const errors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as string] = issue.message
        }
      })
      setValidationErrors(errors)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await loginFn({ data: { email, password } })

      if ('error' in response) {
        setError(response.error ?? 'An error occurred')
      } else {
        router.navigate({ to: '/admin' })
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gradient">Solvin</h1>
            <p className="text-muted-foreground mt-2">Admin Dashboard</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 mb-6 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    'w-full pl-10 pr-4 py-2.5 rounded-lg',
                    'bg-background border border-border',
                    'focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary',
                    'transition-colors',
                    validationErrors.email && 'border-red-500',
                  )}
                  placeholder="admin@solvin.com"
                  disabled={isSubmitting}
                />
              </div>
              {validationErrors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    'w-full pl-10 pr-4 py-2.5 rounded-lg',
                    'bg-background border border-border',
                    'focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary',
                    'transition-colors',
                    validationErrors.password && 'border-red-500',
                  )}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />
              </div>
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {validationErrors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Protected area. Unauthorized access is prohibited.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
