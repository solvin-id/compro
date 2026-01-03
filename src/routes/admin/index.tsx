import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  FileText,
  Users,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react'
import { getArticlesFn } from '@/functions/articles'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const { user } = Route.useRouteContext()

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: () => getArticlesFn(),
  })

  const totalArticles = articles.length
  const publishedArticles = articles.filter(
    (a) => a.status === 'published',
  ).length
  const draftArticles = articles.filter((a) => a.status === 'draft').length

  const stats = [
    {
      label: 'Total Articles',
      value: isLoading ? '...' : String(totalArticles),
      change: `${publishedArticles + draftArticles} active`,
      icon: FileText,
      color: 'text-brand-primary',
    },
    {
      label: 'Published',
      value: isLoading ? '...' : String(publishedArticles),
      change:
        totalArticles > 0
          ? `${Math.round((publishedArticles / totalArticles) * 100)}% of total`
          : '0% of total',
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      label: 'Drafts',
      value: isLoading ? '...' : String(draftArticles),
      change: draftArticles > 0 ? 'Ready to review' : 'No drafts',
      icon: Clock,
      color: 'text-yellow-500',
    },
  ]

  const quickActions = [
    {
      title: 'Write New Article',
      description: 'Create and publish a new blog post',
      icon: Plus,
      href: '/admin/articles/new',
      color: 'bg-brand-primary/10 text-brand-primary',
    },
    {
      title: 'Manage Articles',
      description: 'View, edit, or delete existing articles',
      icon: FileText,
      href: '/admin/articles',
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: 'Manage Team',
      description: 'Update team member profiles',
      icon: Users,
      href: '/admin/team',
      color: 'bg-purple-500/10 text-purple-500',
    },
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 rounded-2xl p-8 border border-brand-primary/20"
      >
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user!.name}! 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your content today.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold text-foreground mt-2">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </motion.div>
          )
        })}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, i) => {
            const Icon = action.icon
            return (
              <motion.div
                key={action.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <Link
                  to={action.href}
                  className="block bg-card border border-border rounded-xl p-6 hover:border-brand-primary/50 hover:shadow-lg transition-all group"
                >
                  <div
                    className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-brand-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
