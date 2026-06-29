import * as React from "react"
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
import { Badge } from "@/components/ui/badge"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

interface AppMultiSelectProps {
  label?: string
  options: { label: string; value: string }[]
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  className?: string
}

const AppMultiSelect = React.forwardRef<HTMLDivElement, AppMultiSelectProps>(
  ({ label, options, value: controlledValue, defaultValue, onChange, placeholder = "Select options...", disabled, error, className }, ref) => {
    const [open, setOpen] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue || [])
    
    const value = controlledValue !== undefined ? controlledValue : internalValue

    const handleUnselect = (optionValue: string) => {
      const newValue = value.filter((val) => val !== optionValue)
      if (controlledValue === undefined) setInternalValue(newValue)
      onChange?.(newValue)
    }

    const handleSelect = (optionValue: string) => {
      const isSelected = value.includes(optionValue)
      const newValue = isSelected
        ? value.filter((val) => val !== optionValue)
        : [...value, optionValue]
      
      if (controlledValue === undefined) setInternalValue(newValue)
      onChange?.(newValue)
    }

    return (
      <div className={cn("space-y-1.5", className)} ref={ref}>
        {label && <Label className={cn(error ? "text-destructive" : "text-foreground")}>{label}</Label>}
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full h-auto min-h-10 justify-between font-normal py-1 pr-2",
                !value.length && "text-muted-foreground",
                error && "border-destructive focus-visible:ring-destructive/20"
              )}
              disabled={disabled}
            >
              <div className="flex flex-wrap gap-1 items-center">
                {value.length > 0 ? (
                  value.map((val) => {
                    const option = options.find((o) => o.value === val)
                    return (
                      <Badge
                        key={val}
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                        onPointerDown={(e) => {
                          e.stopPropagation()
                        }}
                      >
                        {option?.label}
                        <button
                          className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          onPointerDown={(e) => {
                            e.stopPropagation()
                          }}
                          onClick={() => handleUnselect(val)}
                        >
                          <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                      </Badge>
                    )
                  })
                ) : (
                  <span>{placeholder}</span>
                )}
              </div>
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-auto" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <Command>
              <CommandInput placeholder={`Search ${label || "options"}...`} />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => {
                    const isSelected = value.includes(option.value)
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={() => handleSelect(option.value)}
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <Check className={cn("h-4 w-4")} />
                        </div>
                        {option.label}
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        {error && <p className="text-xs font-medium text-destructive">{error}</p>}
      </div>
    )
  }
)

AppMultiSelect.displayName = "AppMultiSelect"

export { AppMultiSelect }
