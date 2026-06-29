import * as React from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { LucideIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { VariantProps } from "class-variance-authority"

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  prefixIcon?: LucideIcon
  suffixIcon?: LucideIcon
  iconOnly?: boolean
  variant?: VariantProps<typeof buttonVariants>["variant"]
  size?: VariantProps<typeof buttonVariants>["size"]
}

const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ children, isLoading, prefixIcon: PrefixIcon, suffixIcon: SuffixIcon, iconOnly, variant, size, className, disabled, ...props }, ref) => {
    return (
      <Button
        {...props}
        ref={ref}
        variant={variant ?? undefined}
        size={size ?? undefined}
        disabled={disabled || isLoading}
        className={cn(className)}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {PrefixIcon && <PrefixIcon className={cn("h-4 w-4", !iconOnly && "mr-2")} />}
            {!iconOnly && children}
            {SuffixIcon && <SuffixIcon className="ml-2 h-4 w-4" />}
          </>
        )}
      </Button>
    )
  }
)

AppButton.displayName = "AppButton"

export { AppButton }
