import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { NotFound } from '../components/NotFound'
import { Suspense } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import { ThemeProvider } from '../components/ThemeProvider'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

// @ts-ignore
import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Solvin | Solve with Innovation',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'true' as any,
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
      },
    ],
  }),

  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

import { ScrollToTop } from '../components/ui/ScrollToTop'
import { SmoothScroll } from '../components/ui/SmoothScroll'

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <I18nextProvider i18n={i18n}>
            <Suspense
              fallback={
                <div
                  className="min-h-screen"
                  style={{ backgroundColor: 'hsl(var(--background))' }}
                />
              }
            >
              <SmoothScroll />
              <ScrollToTop />
              <Navbar />
              <main className="pt-16">{children}</main>
              <Footer />
            </Suspense>
          </I18nextProvider>
        </ThemeProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-left',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
