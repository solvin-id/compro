import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { Hero } from '../components/sections/Hero'
import { Profile } from '../components/sections/Profile'
import { Capabilities } from '../components/sections/Capabilities'
import { Method } from '../components/sections/Method'
import { Personnel } from '../components/sections/Personnel'
import { SelectedWork } from '../components/sections/SelectedWork'
import { Insights } from '../components/sections/Insights'
import { useNavigateStore } from '@/hooks/useNavigateStore'
import { scrollToSection, scrollToTop } from '@/lib/scroll'
import { getPublishedArticlesFn } from '@/functions/articles'
import { BACKEND_ENABLED } from '@/lib/backend'
import { getPublishedPortfolioFn } from '@/functions/portfolio'

export const Route = createFileRoute('/')({
  loader: async () => {
    const portfolioItems = await getPublishedPortfolioFn()
    // Insights are a dynamic surface; with the backend off the section is hidden.
    const articles = BACKEND_ENABLED ? await getPublishedArticlesFn() : []
    return { articles, portfolioItems }
  },
  component: App,
})

function App() {
  const { articles, portfolioItems } = Route.useLoaderData()
  const section = useNavigateStore((state) => state.section)
  const isNavigating = useNavigateStore((state) => state.isNavigating)
  const clearSection = useNavigateStore((state) => state.clearSection)

  useEffect(() => {
    if (!isNavigating || !section) return

    const frame = requestAnimationFrame(() => {
      if (section === 'home') scrollToTop()
      else scrollToSection(section)
      clearSection()
    })

    return () => cancelAnimationFrame(frame)
  }, [isNavigating, section, clearSection])

  return (
    <PageShell>
      <Hero />
      <Profile />
      <Capabilities />
      <Method />
      <Personnel />
      <SelectedWork items={portfolioItems} />
      {BACKEND_ENABLED && <Insights articles={articles} />}
    </PageShell>
  )
}
