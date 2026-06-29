import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type BadgeVariant = "default" | "success" | "warning" | "danger" | "outline" | "secondary"

interface AppBadgeProps extends Omit<React.ComponentPropsWithoutRef<typeof Badge>, 'variant'> {
  variant?: BadgeVariant
}

const variantStyles: Record<string, string> = {
  default: "bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary/90",
  secondary: "bg-brand-secondary text-brand-secondary-foreground hover:bg-brand-secondary/90",
  success: "bg-green-500/15 text-green-700 border-green-200 dark:text-green-400 dark:border-green-800",
  warning: "bg-amber-500/15 text-amber-700 border-amber-200 dark:text-amber-400 dark:border-amber-800",
  danger: "bg-destructive/15 text-destructive border-destructive/20 hover:bg-destructive/20",
  outline: "border-brand-primary text-brand-primary bg-transparent"
}

const AppBadge = ({ variant = "default", className, ...props }: AppBadgeProps) => {
  return (
    <Badge
      {...props}
      className={cn(
        "rounded-md border-transparent px-2.5 py-0.5 text-xs font-semibold transition-all",
        variantStyles[variant],
        className
      )}
    />
  )
}

export { AppBadge }
