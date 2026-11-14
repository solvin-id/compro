import { defineConfig, loadEnv } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

/**
 * Cloudflare Workers build. The default `vite.config.ts` keeps the Nitro node
 * server for local/production Node; this config swaps the server environment
 * for workerd and is only used by `yarn build:worker` + `wrangler deploy`.
 */
export default defineConfig(({ mode }) => {
  const fileEnv = loadEnv(mode, process.cwd(), '')
  const backendEnabled =
    (process.env.BACKEND_ENABLED ?? fileEnv.BACKEND_ENABLED ?? 'true') !== 'false'

  return {
    define: {
      __BACKEND_ENABLED__: JSON.stringify(backendEnabled),
    },
    plugins: [
      cloudflare({ viteEnvironment: { name: 'ssr' } }),
      viteTsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tailwindcss(),
      tanstackStart(),
      viteReact({
        babel: {
          plugins: ['babel-plugin-react-compiler'],
        },
      }),
    ],
  }
})
