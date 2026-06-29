import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

type AlertVariant = "success" | "error" | "warning" | "info"

interface AppAlertProps {
  variant?: AlertVariant
  title?: string
  message: string
  className?: string
}

const variantStyles = {
  success: {
    icon: CheckCircle,
    className: "border-green-500 bg-green-50 text-green-900 dark:bg-green-900/10 dark:text-green-500",
    iconColor: "text-green-600 dark:text-green-500"
  },
  error: {
    icon: AlertCircle,
    className: "border-destructive bg-destructive/5 text-destructive-foreground dark:bg-destructive/10",
    iconColor: "text-destructive"
  },
  warning: {
    icon: AlertTriangle,
    className: "border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-900/10 dark:text-amber-500",
    iconColor: "text-amber-600 dark:text-amber-500"
  },
  info: {
    icon: Info,
    className: "border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-900/10 dark:text-blue-500",
    iconColor: "text-blue-600 dark:text-blue-500"
  }
}

const AppAlert = ({ variant = "info", title, message, className }: AppAlertProps) => {
  const { icon: Icon, className: variantClasses, iconColor } = variantStyles[variant]
  
  return (
    <Alert className={cn(variantClasses, className)}>
      <Icon className={cn("h-4 w-4", iconColor)} />
      <div className="pl-2">
        {title && <AlertTitle className="font-bold mb-1">{title}</AlertTitle>}
        <AlertDescription className="text-sm opacity-90">{message}</AlertDescription>
      </div>
    </Alert>
  )
}

export { AppAlert }
