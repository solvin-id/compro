declare const __BACKEND_ENABLED__: boolean | undefined

/**
 * Build-time mirror of the server's `BACKEND_ENABLED` switch (see vite.config.ts).
 * Constant during SSR and hydration, so chrome renders identically on both sides.
 */
export const BACKEND_ENABLED: boolean =
  typeof __BACKEND_ENABLED__ === 'boolean' ? __BACKEND_ENABLED__ : true
