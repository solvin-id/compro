import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import { fileURLToPath } from 'node:url'

const config = defineConfig({
  build: {
    rollupOptions: { external: [/^cloudflare:/] },
  },
  resolve: {
    alias: {
      pg: fileURLToPath(new URL('./node_modules/pg/lib/index.js', import.meta.url)),
      'pg-cloudflare': fileURLToPath(
        new URL('./node_modules/pg-cloudflare/dist/index.js', import.meta.url),
      ),
    },
  },
  plugins: [
    devtools(),
    nitro({
      compatibilityDate: '2025-01-01',
    }),
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
})

export default config
