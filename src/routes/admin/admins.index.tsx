'use client'

import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { getAdminsFn, deleteAdminFn } from '@/functions/admins'

export const Route = createFileRoute('/admin/admins/')({
  component: AdminsListPage,
})

function AdminsListPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => getAdminsFn(),
  })

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const handleDelete = async (id: string) => {
    try {
      setDeleteError(null)
      setIsDeleting(true)
      const result = await deleteAdminFn({ data: { id } })
      if ('error' in result && result.error) {
        setDeleteError(result.error)
        return
      }
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to delete admin:', error)
      setDeleteError('Failed to delete admin')
    } finally {
      setIsDeleting(false)
    }
  }

  const getRoleColor = (role: string | null) => {
    switch (role) {
      case 'admin':
        return 'bg-brand-primary/10 text-brand-primary'
      case 'editor':
        return 'bg-purple-500/10 text-purple-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admins</h1>
          <p className="text-muted-foreground">
            Manage admin users and their access
          </p>
        </div>
        <Link to="/admin/admins/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Admin
          </Button>
        </Link>
      </div>

      {deleteError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {deleteError}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search admins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Name
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Email
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Role
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Created
                </th>
                <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    {searchQuery
                      ? 'No admins match your search'
                      : 'No admins yet. Create your first one!'}
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin, i) => (
                  <motion.tr
                    key={admin.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-medium">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="font-medium text-foreground">
                          {admin.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {admin.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs font-medium capitalize',
                          getRoleColor(admin.role),
                        )}
                      >
                        {admin.role || 'admin'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {admin.createdAt
                          ? new Date(admin.createdAt).toLocaleDateString()
                          : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to="/admin/admins/$id"
                          params={{ id: admin.id }}
                          className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        {deleteConfirm === admin.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(admin.id)}
                              disabled={isDeleting}
                              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                            >
                              {isDeleting ? 'Deleting...' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 text-xs bg-muted text-foreground rounded hover:bg-muted/80"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(admin.id)}
                            className="p-2 rounded-md hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
