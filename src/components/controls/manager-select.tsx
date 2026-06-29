import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/useDebounce"
import { useGetAllManagers, useSearchManagers } from "@/hooks/api/authAPIHooks"
import { Manager } from "@/types/auth"

interface ManagerSelectProps {
  label?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  className?: string
  containerClassName?: string
}

const ManagerSelect = React.forwardRef<HTMLDivElement, ManagerSelectProps>(
  ({ label, value, onChange, placeholder = "Search and assign manager...", disabled, error, className, containerClassName }, ref) => {
    const [open, setOpen] = React.useState(false)
    const [searchInput, setSearchInput] = React.useState("")
    const debouncedSearch = useDebounce(searchInput, 400)

    // Fetch all managers on mount (paginated until empty)
    const { data: allManagers = [], isLoading: isLoadingAll } = useGetAllManagers()

    // Live search when user types
    const { data: searchResults = [], isFetching: isSearching } = useSearchManagers(debouncedSearch)

    // Merge: if user has typed something use search results, otherwise show full list
    const managers: Manager[] = debouncedSearch.length > 0 ? searchResults : allManagers

    const isLoading = isLoadingAll || isSearching

    const selectedManager = allManagers.find((m) => String(m.userId) === value)
      ?? searchResults.find((m) => String(m.userId) === value)

    const displayLabel = selectedManager
      ? `${selectedManager.name} — ${selectedManager.email}`
      : placeholder

    return (
      <div className={cn("space-y-1.5", containerClassName)} ref={ref}>
        {label && (
          <Label className={cn(error ? "text-destructive" : "text-foreground")}>
            {label}
          </Label>
        )}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={disabled || isLoadingAll}
              className={cn(
                "w-full justify-between font-normal text-left",
                !value && "text-muted-foreground",
                error && "border-destructive focus-visible:ring-destructive/20",
                className
              )}
            >
              <span className="truncate">{displayLabel}</span>
              {isLoading
                ? <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-60" />
                : <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              }
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search manager by name or email..."
                value={searchInput}
                onValueChange={setSearchInput}
              />
              <CommandList>
                {isSearching ? (
                  <div className="flex items-center justify-center py-4 gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching...
                  </div>
                ) : managers.length === 0 ? (
                  <CommandEmpty>No managers found.</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {managers.map((manager) => {
                      const managerIdStr = String(manager.userId)
                      const isSelected = value === managerIdStr
                      return (
                        <CommandItem
                          key={managerIdStr}
                          value={managerIdStr}
                          onSelect={() => {
                            onChange?.(isSelected ? "" : managerIdStr)
                            setOpen(false)
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-sm truncate">{manager.name}</span>
                            <span className="text-xs text-muted-foreground truncate">{manager.email}</span>
                          </div>
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {error && <p className="text-xs font-medium text-destructive">{error}</p>}
      </div>
    )
  }
)

ManagerSelect.displayName = "ManagerSelect"

export { ManagerSelect }
