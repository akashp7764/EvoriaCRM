import * as React from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface AppRadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadioGroup> {
  options: { label: string; value: string; disabled?: boolean }[]
  label?: string
  error?: string
}

const AppRadioGroup = React.forwardRef<React.ElementRef<typeof RadioGroup>, AppRadioGroupProps>(
  ({ label, options, error, className, ...props }, ref) => {
    return (
      <div className={cn("space-y-3", className)}>
        {label && <Label className={cn(error ? "text-destructive" : "text-foreground")}>{label}</Label>}
        <RadioGroup {...props} ref={ref} className="grid gap-4">
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} disabled={option.disabled} />
              <Label htmlFor={option.value} className={cn(option.disabled && "opacity-70")}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
        {error && <p className="text-xs font-medium text-destructive">{error}</p>}
      </div>
    )
  }
)

AppRadioGroup.displayName = "AppRadioGroup"

export { AppRadioGroup }
