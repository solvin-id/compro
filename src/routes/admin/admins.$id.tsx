'use client'

import { createFileRoute, useRouter, notFound } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/Button'
import { getAdminFn, updateAdminFn } from '@/functions/admins'

export const Route = createFileRoute('/admin/admins/$id')({
  loader: async ({ params }) => {
    const admin = await getAdminFn({ data: { id: params.id } })
    if (!admin) {
      throw notFound()
    }
    return { admin }
  },
  component: EditAdminPage,
})

function EditAdminPage() {
  const { admin: initialAdmin } = Route.useLoaderData()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(initialAdmin.name)
  const [email, setEmail] = useState(initialAdmin.email)
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'admin' | 'editor'>(
    (initialAdmin.role as 'admin' | 'editor') || 'admin',
  )
  const [avatar, setAvatar] = useState(initialAdmin.avatar || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await updateAdminFn({
        data: {
          id: initialAdmin.id,
          name,
          email,
          password: password || undefined,
          role,
          avatar: avatar || undefined,
        },
      })

      if ('error' in result && result.error) {
        setError(result.error)
        return
      }

      // Invalidate admin queries to refetch data
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] })

      router.navigate({ to: '/admin/admins' })
    } catch (err: any) {
      setError(err.message || 'Failed to update admin')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/admins"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Admin</h1>
            <p className="text-muted-foreground">Update admin user details</p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Update Admin
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              placeholder="Enter name..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              placeholder="Leave blank to keep current password"
              minLength={6}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave blank to keep the current password
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'editor')}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Avatar URL
            </label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              placeholder="https://..."
            />
          </div>
        </div>
      </form>
    </div>
  )
}
