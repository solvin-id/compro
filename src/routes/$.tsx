import { createFileRoute } from '@tanstack/react-router'
import { NotFound } from '../components/NotFound'

// Catch-all route for 404 handling (SSR compatible)
export const Route = createFileRoute('/$')({
  component: NotFound,
})
