import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AppButton } from "./app-button"

interface AppConfirmationModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
  isLoading?: boolean
}

const AppConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  isLoading
}: AppConfirmationModalProps) => {
  return (
    <Dialog open={open} onOpenChange={(val) => !isLoading && !val && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          {description && (
            <DialogDescription className="pt-2 text-base leading-relaxed">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="mt-6 flex gap-2">
          <AppButton
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </AppButton>
          <AppButton
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { AppConfirmationModal }
