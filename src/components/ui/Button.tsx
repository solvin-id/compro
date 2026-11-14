import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

const BASE =
  'inline-flex items-center justify-center gap-2 border font-mono text-[11px] uppercase tracking-[0.06em] transition-colors duration-150 ease-cad focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong disabled:pointer-events-none disabled:opacity-40'

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'border-accent bg-accent text-accent-ink hover:border-accent hover:bg-accent/90',
  outline:
    'border-line-strong bg-transparent text-ink hover:border-accent hover:text-accent-strong',
  ghost:
    'border-transparent bg-transparent text-ink-muted hover:text-ink',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[10px]',
  md: 'h-10 px-4',
  lg: 'h-12 px-6',
  icon: 'h-9 w-9 p-0',
}

/** Shared class contract so `<Link>` and `<button>` render identically. */
export function buttonClassName(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className)
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, variant = 'primary', size = 'md', ...props }, ref) {
    return (
      <button
        ref={ref}
        className={buttonClassName(variant, size, className)}
        {...props}
      />
    )
  },
)
