import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig(({ mode }) => {
  // Single source of truth for the backend switch: .env, read at dev/build time
  // so the shell can render deterministically during SSR (no hydration mismatch).
  const fileEnv = loadEnv(mode, process.cwd(), '')
  const backendEnabled = (fileEnv.BACKEND_ENABLED ?? 'true') !== 'false'

  return {
    define: {
      __BACKEND_ENABLED__: JSON.stringify(backendEnabled),
    },
    plugins: [
      devtools(),
      nitro(),
      // this is the plugin that enables path aliases
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

export default config
