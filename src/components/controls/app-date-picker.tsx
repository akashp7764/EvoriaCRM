import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

interface AppDatePickerProps {
  label?: string
  value?: Date | DateRange
  onChange?: (date: Date | DateRange | undefined) => void
  placeholder?: string
  mode?: "single" | "range"
  disabled?: boolean
  error?: string
  className?: string
  disabledDates?: (date: Date) => boolean
}

const AppDatePicker = React.forwardRef<HTMLDivElement, AppDatePickerProps>(
  ({ label, value, onChange, placeholder = "Pick a date", mode = "single", disabled, error, className, disabledDates }, ref) => {
    return (
      <div className={cn("space-y-1.5", className)} ref={ref}>
        {label && <Label className={cn(error ? "text-destructive" : "text-foreground")}>{label}</Label>}
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !value && "text-muted-foreground",
                error && "border-destructive focus-visible:ring-destructive/20"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
              {mode === "single" ? (
                value instanceof Date ? format(value, "PPP") : <span>{placeholder}</span>
              ) : (
                (value as DateRange)?.from ? (
                  (value as DateRange).to ? (
                    <>
                      {format((value as DateRange).from!, "LLL dd, y")} -{" "}
                      {format((value as DateRange).to!, "LLL dd, y")}
                    </>
                  ) : (
                    format((value as DateRange).from!, "LLL dd, y")
                  )
                ) : (
                  <span>{placeholder}</span>
                )
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            {mode === "single" ? (
              <Calendar
                mode="single"
                selected={value as Date}
                onSelect={onChange as any}
                disabled={disabledDates}
                initialFocus
              />
            ) : (
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={(value as DateRange)?.from}
                selected={value as DateRange}
                onSelect={onChange as any}
                disabled={disabledDates}
                numberOfMonths={2}
              />
            )}
          </PopoverContent>
        </Popover>

        {error && <p className="text-xs font-medium text-destructive">{error}</p>}
      </div>
    )
  }
)

AppDatePicker.displayName = "AppDatePicker"

export { AppDatePicker }
