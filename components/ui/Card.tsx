import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/* ---------- Card ---------- */

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl bg-white shadow-md overflow-hidden border border-purple-100/60 transition-shadow hover:shadow-lg',
        className,
      )}
      {...props}
    />
  ),
)
Card.displayName = 'Card'

/* ---------- CardHeader ---------- */

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-5 pt-5 pb-3', className)}
      {...props}
    />
  ),
)
CardHeader.displayName = 'CardHeader'

/* ---------- CardContent ---------- */

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-5 py-3', className)}
      {...props}
    />
  ),
)
CardContent.displayName = 'CardContent'

/* ---------- CardFooter ---------- */

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-5 pt-3 pb-5 flex items-center', className)}
      {...props}
    />
  ),
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardContent, CardFooter }
