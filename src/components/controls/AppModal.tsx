import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface AppModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

export const AppModal = React.forwardRef<HTMLDivElement, AppModalProps>(
  ({ isOpen, onClose, title, children, className }, ref) => {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className={cn("sm:max-w-[425px]", className)} ref={ref}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          </DialogHeader>
          <div className="pt-2">{children}</div>
        </DialogContent>
      </Dialog>
    )
  }
)

AppModal.displayName = "AppModal"
