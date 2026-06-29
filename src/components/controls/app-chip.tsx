import { X, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface AppChipProps {
  label: string
  selected?: boolean
  onClick?: () => void
  onDelete?: () => void
  icon?: LucideIcon
  className?: string
  variant?: "default" | "secondary" | "outline" | "destructive"
}

const AppChip = ({
  label,
  selected,
  onClick,
  onDelete,
  icon: Icon,
  className,
  variant = "secondary"
}: AppChipProps) => {
  return (
    <Badge
      variant={selected ? "default" : variant}
      className={cn(
        "gap-1 px-3 py-1 cursor-pointer transition-colors",
        onClick && "hover:opacity-80 active:scale-95",
        selected && "bg-brand-primary text-brand-primary-foreground",
        className
      )}
      onClick={onClick}
    >
      {Icon && <Icon className="h-3 w-3" />}
      <span className="text-xs font-medium">{label}</span>
      {onDelete && (
        <button
          className="ml-1 rounded-full outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <X className="h-2.5 w-2.5 opacity-60 hover:opacity-100" />
        </button>
      )}
    </Badge>
  )
}

export { AppChip }
