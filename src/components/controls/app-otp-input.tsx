import * as React from "react"
import { cn } from "@/lib/utils"
import { AppButton } from "@/components/controls/app-button"
import { RefreshCw } from "lucide-react"

interface AppOTPInputProps {
  /** Total number of OTP digits. Defaults to 6. */
  otpLimit?: number
  /** Label on the confirm/submit button. */
  confirmButtonName: string
  /** Called with the full OTP string when the user clicks confirm. */
  onSubmit: (otp: string) => void
  /** Called when the user wants to dismiss the OTP UI. */
  onClose: () => void
  /** Optional async function to trigger a resend. Shows a countdown after firing. */
  resendOTPAPICall?: () => Promise<void>
  /** Loading state forwarded from the parent mutation (registration call). */
  isLoading?: boolean
}

const RESEND_COOLDOWN_SECONDS = 30

const AppOTPInput = React.forwardRef<HTMLDivElement, AppOTPInputProps>(
  (
    {
      otpLimit = 6,
      confirmButtonName,
      onSubmit,
      onClose,
      resendOTPAPICall,
      isLoading = false,
    },
    ref,
  ) => {
    const [digits, setDigits] = React.useState<string[]>(
      Array(otpLimit).fill(""),
    )
    const [cooldown, setCooldown] = React.useState(0)
    const [isResending, setIsResending] = React.useState(false)
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

    const otp = digits.join("")
    const isComplete = otp.length === otpLimit && digits.every((d) => d !== "")

    React.useEffect(() => {
      inputRefs.current[0]?.focus()
    }, [])

    React.useEffect(() => {
      if (cooldown === 0) return
      const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    }, [cooldown])

    const handleChange = (index: number, value: string) => {
      const char = value.replace(/\D/g, "").slice(-1)
      const next = [...digits]
      next[index] = char
      setDigits(next)
      if (char && index < otpLimit - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    }

    const handleKeyDown = (
      index: number,
      e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (e.key === "Backspace") {
        if (digits[index]) {
          const next = [...digits]
          next[index] = ""
          setDigits(next)
        } else if (index > 0) {
          inputRefs.current[index - 1]?.focus()
          const next = [...digits]
          next[index - 1] = ""
          setDigits(next)
        }
        e.preventDefault()
      }
      if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
      if (e.key === "ArrowRight" && index < otpLimit - 1) {
        inputRefs.current[index + 1]?.focus()
      }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      const pasted = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, otpLimit)
      if (!pasted) return
      const next = Array(otpLimit).fill("")
      pasted.split("").forEach((char, i) => {
        next[i] = char
      })
      setDigits(next)
      const focusIndex = Math.min(pasted.length, otpLimit - 1)
      inputRefs.current[focusIndex]?.focus()
    }

    const handleResend = async () => {
      if (!resendOTPAPICall || cooldown > 0 || isResending) return
      setIsResending(true)
      try {
        await resendOTPAPICall()
        setCooldown(RESEND_COOLDOWN_SECONDS)
        setDigits(Array(otpLimit).fill(""))
        inputRefs.current[0]?.focus()
      } finally {
        setIsResending(false)
      }
    }

    const handleSubmit = () => {
      if (!isComplete) return
      onSubmit(otp)
    }

    return (
      <div ref={ref} className="flex flex-col items-center gap-6 py-2">
        {/* Digit inputs */}
        <div className="flex items-center gap-2 sm:gap-3">
          {digits.map((digit, index) => (
            <React.Fragment key={index}>
              <input
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                id={`otp-digit-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                aria-label={`OTP digit ${index + 1}`}
                className={cn(
                  "h-12 w-10 rounded-lg border text-center text-xl font-semibold",
                  "bg-background text-foreground shadow-sm",
                  "transition-all duration-150 outline-none",
                  "focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/30",
                  digit
                    ? "border-brand-primary bg-brand-primary/5"
                    : "border-input",
                  "sm:h-14 sm:w-12",
                )}
              />
              {index === Math.floor(otpLimit / 2) - 1 && (
                <span className="text-muted-foreground select-none">—</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Resend row */}
        {resendOTPAPICall && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>Didn't receive the code?</span>
            {cooldown > 0 ? (
              <span className="font-medium text-brand-primary">
                Resend in {cooldown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className={cn(
                  "inline-flex items-center gap-1 font-medium text-brand-primary",
                  "underline-offset-4 transition-opacity hover:underline",
                  isResending && "cursor-not-allowed opacity-50",
                )}
              >
                <RefreshCw
                  size={13}
                  className={cn(isResending && "animate-spin")}
                />
                Resend
              </button>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <AppButton
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </AppButton>
          <AppButton
            type="button"
            onClick={handleSubmit}
            disabled={!isComplete}
            isLoading={isLoading}
            className="w-full bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary/90 sm:w-auto"
          >
            {confirmButtonName}
          </AppButton>
        </div>
      </div>
    )
  },
)

AppOTPInput.displayName = "AppOTPInput"

export { AppOTPInput }
