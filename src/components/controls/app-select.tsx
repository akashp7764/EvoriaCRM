import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface AppSelectProps {
  label?: string
  options: { label: string; value: string }[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  searchable?: boolean
  disabled?: boolean
  error?: string
  className?: string
  containerClassName?: string
}

const AppSelect = React.forwardRef<HTMLDivElement, AppSelectProps>(
  ({ label, options, value, onChange, placeholder = "Select option...", searchable, disabled, error, className, containerClassName }, ref) => {
    const [open, setOpen] = React.useState(false)

    return (
      <div className={cn("space-y-1.5", containerClassName)} ref={ref}>
        {label && <Label className={cn(error ? "text-destructive" : "text-foreground")}>{label}</Label>}
        
        {searchable ? (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "w-full justify-between font-normal",
                  !value && "text-muted-foreground",
                  error && "border-destructive focus-visible:ring-destructive/20",
                  className
                )}
                disabled={disabled}
              >
                {value
                  ? options.find((option) => option.value === value)?.label
                  : placeholder}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <Command>
                <CommandInput placeholder={`Search ${label || "options"}...`} />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={(currentValue) => {
                          onChange?.(currentValue === value ? "" : currentValue)
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === option.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        ) : (
          <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger className={cn(error && "border-destructive focus-visible:ring-destructive/20", className)}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {error && <p className="text-xs font-medium text-destructive">{error}</p>}
      </div>
    )
  }
)

AppSelect.displayName = "AppSelect"

export { AppSelect }
