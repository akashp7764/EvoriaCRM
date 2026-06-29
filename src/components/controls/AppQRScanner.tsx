import * as React from 'react'
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AppQRScannerProps {
  /** Called with the raw decoded string every time the camera reads a valid QR. */
  onScanSuccess: (decodedText: string) => void
  /**
   * When true, the camera feed is running but the success callback is suppressed,
   * giving the parent full control over the "paused" visual state without stopping
   * the underlying MediaStream (which avoids the camera warm-up delay on resume).
   */
  isPaused: boolean
  className?: string
  
  // ---> NEW: Added facingMode for Kiosk vs Staff mode
  /** * 'environment' = back camera (Staff mode)
   * 'user' = front selfie camera (Kiosk mode) 
   */
  facingMode?: 'environment' | 'user' 
  
  // ---> NEW: Added onError to handle permission denials safely
  /** Called if the user denies camera permission or hardware is unavailable */
  onError?: (errorMessage: string) => void 
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SCANNER_ELEMENT_ID = 'app-qr-scanner-viewport'

const QR_CONFIG = {
  fps: 10,
  qrbox: { width: 250, height: 250 },
  aspectRatio: 1,
  disableFlip: false,
  showTorchButtonIfSupported: true,
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const AppQRScanner = React.forwardRef<HTMLDivElement, AppQRScannerProps>(
  ({ onScanSuccess, isPaused, className, facingMode = 'environment', onError }, ref) => {
    const scannerRef = React.useRef<Html5Qrcode | null>(null)

    // Keep a mutable ref to the latest isPaused + callbacks so the closure inside
    // Html5Qrcode.start() never captures a stale value.
    const isPausedRef = React.useRef(isPaused)
    const onScanSuccessRef = React.useRef(onScanSuccess)
    const onErrorRef = React.useRef(onError) // ---> NEW: Trap the error callback

    React.useEffect(() => {
      isPausedRef.current = isPaused
    }, [isPaused])

    React.useEffect(() => {
      onScanSuccessRef.current = onScanSuccess
    }, [onScanSuccess])

    React.useEffect(() => {
      onErrorRef.current = onError
    }, [onError])

    // ---------------------------------------------------------------------------
    // Initialise scanner once on mount
    // ---------------------------------------------------------------------------
    React.useEffect(() => {
      let isMounted = true

      // Defer start() into the next browser macrotask (setTimeout 0).
      // React StrictMode runs effect → cleanup → effect SYNCHRONOUSLY in the same task.
      // By the time the macrotask fires, StrictMode's cleanup has already run.
      // If cleanup ran (isMounted = false), clearTimeout cancels the timer so start()
      // is NEVER called for the phantom Effect #1 — only Effect #2's timer survives.
      const html5QrCode = new Html5Qrcode(SCANNER_ELEMENT_ID)
      scannerRef.current = html5QrCode

      const startTimer = setTimeout(() => {
        // Check for secure context / mediaDevices support
        if (!navigator.mediaDevices) {
          const isHttp = window.location.protocol === 'http:'
          const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname)
          if (isMounted && onErrorRef.current) {
            if (isHttp && !isLocal) {
              onErrorRef.current('Camera access requires a secure connection (HTTPS). Please configure SSL or test on localhost.')
            } else {
              onErrorRef.current('MediaDevices API is not supported in this browser or context.')
            }
          }
          return
        }

        // Clear any stale video from a previous instance before starting.
        const container = document.getElementById(SCANNER_ELEMENT_ID)
        if (container) container.innerHTML = ''

        html5QrCode
          .start(
            { facingMode },
            QR_CONFIG,
            (decodedText) => {
              if (isMounted && !isPausedRef.current) {
                onScanSuccessRef.current(decodedText)
              }
            },
            undefined,
          )
          .catch((err) => {
            if (isMounted && onErrorRef.current) {
              const errMsg =
                typeof err === 'string' ? err : err?.message || 'Camera permission denied or unavailable.'
              onErrorRef.current(errMsg)
            }
          })
      }, 0)

      return () => {
        isMounted = false
        clearTimeout(startTimer) // Cancels the phantom Effect #1 start before it ever fires
        if (
          html5QrCode.getState() === Html5QrcodeScannerState.SCANNING ||
          html5QrCode.getState() === Html5QrcodeScannerState.PAUSED
        ) {
          html5QrCode
            .stop()
            .then(() => html5QrCode.clear())
            .catch(() => {
              try { html5QrCode.clear() } catch { /* already cleared */ }
            })
        } else {
          try { html5QrCode.clear() } catch { /* already cleared */ }
        }
        scannerRef.current = null
      }
    }, []) // facingMode is intentionally excluded — parent remounts via key prop when mode changes

    return (
      <div ref={ref} className={cn('relative w-full overflow-hidden rounded-xl', className)}>
        {/* html5-qrcode injects the <video> element here */}
        <div id={SCANNER_ELEMENT_ID} className="w-full bg-black/5" />

        {/* Scan-frame decorative corners — positioned over the live feed */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-[250px] w-[250px]">
            {/* Top-left */}
            <span className="absolute left-0 top-0 h-8 w-8 rounded-tl-lg border-l-4 border-t-4 border-brand-primary" />
            {/* Top-right */}
            <span className="absolute right-0 top-0 h-8 w-8 rounded-tr-lg border-r-4 border-t-4 border-brand-primary" />
            {/* Bottom-left */}
            <span className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-lg border-b-4 border-l-4 border-brand-primary" />
            {/* Bottom-right */}
            <span className="absolute bottom-0 right-0 h-8 w-8 rounded-br-lg border-b-4 border-r-4 border-brand-primary" />
          </div>
        </div>
      </div>
    )
  },
)

AppQRScanner.displayName = 'AppQRScanner'

export { AppQRScanner }
export type { AppQRScannerProps }