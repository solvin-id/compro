'use client'

import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { getArticlesFn, deleteArticleFn } from '@/functions/articles'

export const Route = createFileRoute('/admin/articles/')({
  component: ArticlesListPage,
})

function ArticlesListPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    data: articles = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: () => getArticlesFn(),
  })

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || article.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true)
      await deleteArticleFn({ data: { id } })
      await queryClient.invalidateQueries({ queryKey: ['admin-articles'] })
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to delete article:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/10 text-green-500'
      case 'draft':
        return 'bg-yellow-500/10 text-yellow-500'
      case 'archived':
        return 'bg-gray-500/10 text-gray-500'
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
          <h1 className="text-2xl font-bold text-foreground">Articles</h1>
          <p className="text-muted-foreground">
            Manage your blog posts and articles
          </p>
        </div>
        <Link to="/admin/articles/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Title
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    {searchQuery || statusFilter !== 'all'
                      ? 'No articles match your filters'
                      : 'No articles yet. Create your first one!'}
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article, i) => (
                  <motion.tr
                    key={article.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {article.title}
                        </p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {article.summary}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs font-medium capitalize',
                          getStatusColor(article.status),
                        )}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {article.createdAt
                          ? new Date(article.createdAt).toLocaleDateString()
                          : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to="/articles/$slug"
                          params={{ slug: article.slug }}
                          target="_blank"
                          className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          title="View"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          to="/admin/articles/$id"
                          params={{ id: String(article.id) }}
                          className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        {deleteConfirm === article.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(article.id)}
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
                            onClick={() => setDeleteConfirm(article.id)}
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
