import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  placeholder?: string
  disabled?: boolean
  error?: string
  prefixIcon?: LucideIcon
  suffixIcon?: LucideIcon
  containerClassName?: string
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, placeholder, disabled, error, prefixIcon: PrefixIcon, suffixIcon: SuffixIcon, containerClassName, className, ...props }, ref) => {
    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {label && (
          <Label
            htmlFor={props.id}
            className={cn(error ? "text-destructive" : "text-foreground", disabled && "opacity-70")}
          >
            {label}
          </Label>
        )}
        <div className="relative">
          {PrefixIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <PrefixIcon size={18} />
            </div>
          )}
          <Input
            {...props}
            ref={ref}
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              error && "border-destructive focus-visible:ring-destructive/20",
              PrefixIcon && "pl-10",
              SuffixIcon && "pr-10",
              className
            )}
          />
          {SuffixIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <SuffixIcon size={18} />
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs font-medium text-destructive">{error}</p>
        )}
      </div>
    )
  }
)

TextField.displayName = "TextField"

export { TextField }
