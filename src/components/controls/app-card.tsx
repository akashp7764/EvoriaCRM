import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AppCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  title?: string
  description?: string
  image?: string
  actions?: React.ReactNode
  hoverable?: boolean
}

const AppCard = React.forwardRef<HTMLDivElement, AppCardProps>(
  ({ title, description, image, actions, hoverable, className, children, ...props }, ref) => {
    return (
      <Card
        {...props}
        ref={ref}
        className={cn(
          "overflow-hidden transition-all duration-200",
          hoverable && "hover:shadow-lg hover:-translate-y-1 cursor-pointer",
          className
        )}
      >
        {image && (
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <img 
              src={image} 
              alt={title || "Card banner"} 
              className="h-full w-full object-cover" 
            />
          </div>
        )}
        {(title || description) && (
          <CardHeader className={cn(image && "pt-4")}>
            {title && <CardTitle className="text-xl font-bold">{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent className={cn(!(title || description) && "pt-6")}>
          {children}
        </CardContent>
        {actions && <CardFooter className="flex justify-end gap-2 border-t pt-4">{actions}</CardFooter>}
      </Card>
    )
  }
)

AppCard.displayName = "AppCard"

export { AppCard }
