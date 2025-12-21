import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getAuthenticatedUserFn } from '@/functions/auth'
import { AdminSidebar } from '@/components/admin'
import { getCookie } from '@tanstack/react-start/server'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    if (location.pathname === '/admin/login') {
      return { user: null }
    }
    const user = await getAuthenticatedUserFn()
    console.log(
      '[beforeLoad] User:',
      user ? 'authenticated' : 'not authenticated',
    )

    if (!user) {
      throw redirect({ to: '/admin/login' })
    }

    return { user }
  },
  component: AdminLayout,
})

function AdminLayout() {
  const { user } = Route.useRouteContext()

  if (!user) {
    return <Outlet />
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar user={user} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
