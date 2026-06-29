import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface AppCheckboxProps extends React.ComponentPropsWithoutRef<typeof Checkbox> {
  label?: string
  error?: string
  containerClassName?: string
}

const AppCheckbox = React.forwardRef<React.ElementRef<typeof Checkbox>, AppCheckboxProps>(
  ({ label, error, containerClassName, className, ...props }, ref) => {
    const id = React.useId()
    return (
      <div className={cn("space-y-1", containerClassName)}>
        <div className="flex items-center space-x-2">
          <Checkbox 
            {...props} 
            ref={ref} 
            id={id} 
            className={cn(error && "border-destructive data-[state=checked]:bg-destructive data-[state=checked]:border-destructive", className)} 
          />
          {label && (
            <Label
              htmlFor={id}
              className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", error ? "text-destructive" : "text-foreground")}
            >
              {label}
            </Label>
          )}
        </div>
        {error && (
          <p className="text-xs font-medium text-destructive">{error}</p>
        )}
      </div>
    )
  }
)

AppCheckbox.displayName = "AppCheckbox"

export { AppCheckbox }
