import { cn } from '@/lib/utils'

interface ArticleRendererProps {
  content: string
  className?: string
}

/**
 * Renders HTML article content with the tokenized prose scale defined in
 * `styles.css` (`--tw-prose-*`), so light and dark need no `prose-invert`.
 *
 * NOTE: The HTML content should be sanitized on the server-side
 * before storing to prevent XSS attacks. For admin-only input,
 * trusting the content is acceptable during development.
 */
export function ArticleRenderer({ content, className }: ArticleRendererProps) {
  return (
    <div
      className={cn(
        'prose prose-lg mt-8 max-w-none',
        'prose-headings:font-semibold prose-headings:tracking-[-0.03em]',
        'prose-blockquote:border-l-2',
        'prose-code:px-1.5 prose-code:py-0.5',
        'prose-pre:border prose-pre:border-line',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
