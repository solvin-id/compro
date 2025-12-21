import { cn } from '@/lib/utils'

interface ArticleRendererProps {
  content: string
  className?: string
}

/**
 * Renders HTML article content with proper prose styling.
 * Uses dark:prose-invert for automatic dark mode support.
 *
 * NOTE: The HTML content should be sanitized on the server-side
 * before storing to prevent XSS attacks. For admin-only input,
 * trusting the content is acceptable during development.
 */
export function ArticleRenderer({ content, className }: ArticleRendererProps) {
  return (
    <div
      className={cn(
        'prose prose-lg max-w-none',
        // Brand color customizations
        'prose-headings:text-foreground prose-headings:font-bold',
        'prose-p:text-muted-foreground prose-p:leading-relaxed',
        'prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline',
        'prose-strong:text-foreground',
        'prose-blockquote:border-l-4 prose-blockquote:border-brand-primary',
        'prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-foreground',
        'prose-blockquote:bg-muted/50 prose-blockquote:py-4 prose-blockquote:rounded-r-lg',
        'prose-code:text-brand-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded',
        'prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg',
        'prose-img:rounded-lg prose-img:shadow-md',
        'prose-hr:border-border',
        'prose-ul:text-muted-foreground prose-ol:text-muted-foreground',
        'prose-li:marker:text-brand-primary',
        // Dark mode - automatically inverts colors
        'dark:prose-invert',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
