import * as React from "react"
import { Textarea as UITextarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  containerClassName?: string
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, containerClassName, className, disabled, ...props }, ref) => {
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
        <UITextarea
          {...props}
          ref={ref}
          disabled={disabled}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive/20",
            "min-h-[100px]",
            className
          )}
        />
        {error && (
          <p className="text-xs font-medium text-destructive">{error}</p>
        )}
      </div>
    )
  }
)

TextArea.displayName = "TextArea"

export { TextArea }
