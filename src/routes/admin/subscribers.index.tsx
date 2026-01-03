import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { subscribers, type Subscriber, emailQueue } from '@/db/schema'
import { desc, eq, sql } from 'drizzle-orm'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Trash2,
  Search,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { z } from 'zod'

// 1. Server Functions
const getSubscribersFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Subscriber[]> => {
    return db.query.subscribers.findMany({
      orderBy: [desc(subscribers.createdAt)],
    })
  },
)

const deleteSubscriberFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => z.object({ id: z.number() }).parse(d))
  .handler(async ({ data }) => {
    await db.delete(subscribers).where(eq(subscribers.id, data.id))
    return { success: true }
  })

const getQueueStatsFn = createServerFn({ method: 'GET' }).handler(async () => {
  const pending = await db
    .select({ count: sql<number>`count(*)` })
    .from(emailQueue)
    .where(eq(emailQueue.status, 'pending'))
  const sent = await db
    .select({ count: sql<number>`count(*)` })
    .from(emailQueue)
    .where(eq(emailQueue.status, 'sent'))
  const failed = await db
    .select({ count: sql<number>`count(*)` })
    .from(emailQueue)
    .where(eq(emailQueue.status, 'failed'))

  return {
    pending: Number(pending[0].count),
    sent: Number(sent[0].count),
    failed: Number(failed[0].count),
  }
})

// 2. Route Definition
export const Route = createFileRoute('/admin/subscribers/')({
  component: SubscribersPage,
  loader: async () => {
    const [subscribers, stats] = await Promise.all([
      getSubscribersFn(),
      getQueueStatsFn(),
    ])
    return { subscribers, stats }
  },
})

// 3. Components
function SubscribersPage() {
  const { subscribers: initialData, stats: initialStats } =
    Route.useLoaderData()
  const router = useRouter()
  const queryClient = useQueryClient()

  // Queries
  const { data: subscribersData } = useQuery({
    queryKey: ['subscribers'],
    queryFn: () => getSubscribersFn(),
    initialData: initialData,
  })

  const { data: queueStats, refetch: refetchStats } = useQuery({
    queryKey: ['queueStats'],
    queryFn: () => getQueueStatsFn(),
    initialData: initialStats,
    refetchInterval: 5000, // Auto refresh stats every 5s
  })

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: deleteSubscriberFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscribers'] })
      router.invalidate()
    },
  })

  // Table State
  const [globalFilter, setGlobalFilter] = useState('')

  // Columns
  const columnHelper = createColumnHelper<Subscriber>()
  const columns = [
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-foreground">{info.getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue()
        return (
          <span
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide',
              status === 'subscribed'
                ? 'bg-green-100/10 text-green-500 border border-green-500/20'
                : status === 'unsubscribed'
                  ? 'bg-red-100/10 text-red-500 border border-red-500/20'
                  : 'bg-yellow-100/10 text-yellow-500 border border-yellow-500/20',
            )}
          >
            {status}
          </span>
        )
      },
    }),
    columnHelper.accessor('createdAt', {
      header: 'Joined',
      cell: (info) => {
        const date = info.getValue()
        return date ? new Date(date).toLocaleDateString() : '-'
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
            onClick={() => {
              if (confirm('Are you sure you want to remove this subscriber?')) {
                deleteMutation.mutate({ data: { id: info.row.original.id } })
              }
            }}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    }),
  ]

  const table = useReactTable({
    data: subscribersData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  })

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Subscribers
          </h1>
          <p className="text-muted-foreground">
            Manage your newsletter audience.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="md:col-span-3 grid grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Queued
              </p>
              <h4 className="text-2xl font-bold text-foreground">
                {queueStats.pending}
              </h4>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-500/10 text-green-500">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sent</p>
              <h4 className="text-2xl font-bold text-foreground">
                {queueStats.sent}
              </h4>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-500/10 text-red-500">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Failed
              </p>
              <h4 className="text-2xl font-bold text-foreground">
                {queueStats.failed}
              </h4>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => refetchStats()}
            >
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search subscribers..."
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Total:{' '}
            <span className="font-medium text-foreground">
              {subscribersData.length}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border/50">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 whitespace-nowrap text-sm"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
