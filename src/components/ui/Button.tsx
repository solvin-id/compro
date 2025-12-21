import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'
import { motion, HTMLMotionProps } from 'framer-motion'

type ButtonBaseProps = ButtonHTMLAttributes<HTMLButtonElement>
type MotionButtonProps = HTMLMotionProps<'button'>

interface ButtonProps
  extends
    Omit<ButtonBaseProps, keyof MotionButtonProps>,
    Partial<Pick<MotionButtonProps, keyof ButtonBaseProps>> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  asMotion?: boolean
  [key: string]: any
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', asMotion = false, ...props },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

    const variants: Record<string, string> = {
      primary:
        'bg-brand-primary text-white hover:bg-brand-primary-hover shadow-md shadow-blue-500/20 border border-transparent',
      outline:
        'border border-gray-200 hover:bg-white text-brand-primary hover:border-brand-primary',
      ghost:
        'bg-transparent hover:bg-brand-primary-hover text-brand-primary hover:text-white',
    }

    const sizes: Record<string, string> = {
      sm: 'h-8 px-4 text-xs',
      md: 'h-10 px-6 text-sm',
      lg: 'h-12 px-8 text-base',
    }

    const classes = cn(
      baseStyles,
      variants[variant || 'primary'],
      sizes[size || 'md'],
      className,
    )

    if (asMotion) {
      const MotionButton = motion.button as any
      return <MotionButton ref={ref} className={classes} {...(props as any)} />
    }

    return <button ref={ref} className={classes} {...props} />
  },
)

Button.displayName = 'Button'

export { Button }
