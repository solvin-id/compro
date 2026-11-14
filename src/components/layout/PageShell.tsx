import { cn } from '@/lib/utils'

interface PageShellProps {
  className?: string
  children: React.ReactNode
}

/**
 * The 1600px page measure with exposed vertical hairlines at md+.
 * Every public route nests inside exactly one PageShell.
 */
export function PageShell({ className, children }: PageShellProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[1600px] border-line md:border-x',
        className,
      )}
    >
      {children}
    </div>
  )
}
