import { useState, useCallback, useEffect, useRef } from 'react'
import { CheckCircle2, XCircle, ScanLine, RefreshCw, CameraOff, Camera, FlipHorizontal, X, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppQRScanner } from '@/components/controls/AppQRScanner'
import { AppButton } from '@/components/controls/app-button'
import { useScanAttendance } from '@/hooks/api/attendanceAPIHooks'
import { TicketScanParams, TicketScanResponse } from '@/types/api/ticket'
import { useQueries, useQueryClient } from '@tanstack/react-query'
import api from '@/services/api'
import { ENDPOINTS } from '@/services/apiUrls'

// Global set — survives React remounts and HMR
const scannedEventIdsSet = new Set<number>()

// Kept outside the component so it never forms a stale closure
function registerEventId(
  eventId: number,
  setIds: React.Dispatch<React.SetStateAction<number[]>>,
) {
  if (!scannedEventIdsSet.has(eventId)) {
    scannedEventIdsSet.add(eventId)
    setIds(Array.from(scannedEventIdsSet))
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FacingMode = 'environment' | 'user'

type OverlayState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: TicketScanResponse }
  | { status: 'error'; message: string }

// ---------------------------------------------------------------------------
// Safe QR URL parser
// ---------------------------------------------------------------------------

function parseScanParams(decodedText: string): TicketScanParams {
  const url = new URL(decodedText)
  const eventId = url.searchParams.get('eventId')
  const registrationId = url.searchParams.get('registrationId')
  const memberId = url.searchParams.get('memberId')

  if (!eventId || !registrationId || !memberId) {
    throw new Error('Invalid QR Format')
  }

  return { eventId, registrationId, memberId }
}

// ---------------------------------------------------------------------------
// ScannerPage
// ---------------------------------------------------------------------------

export default function ScannerPage() {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false)
  const [activeFacing, setActiveFacing] = useState<FacingMode | null>(null)
  const [isSwitching, setIsSwitching] = useState(false)
  const [overlay, setOverlay] = useState<OverlayState>({ status: 'idle' })
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [scannerKey, setScannerKey] = useState(0)
  const switchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scanMutation = useScanAttendance()
  const queryClient = useQueryClient()

  // Local state mirror of the global Set — drives useQueries
  const [scannedEventIds, setScannedEventIds] = useState<number[]>(() => Array.from(scannedEventIdsSet))

  // ---------------------------------------------------------------------------
  // Fetch attendance reports for all scanned event IDs (parallel)
  // ---------------------------------------------------------------------------
  const attendanceQueries = useQueries({
    queries: scannedEventIds.map((eventId) => ({
      queryKey: ['attendanceReport', eventId],
      queryFn: async () => {
        const response = await api.get<any>(ENDPOINTS.reports.attendance(eventId))
        // api interceptor already returns the full JSON body (not an AxiosResponse),
        // so we return it as-is. The attendance array lives at response.data.attendance.
        return response
      },
      enabled: true,
    })),
  })

  // Combine all attendance entries from each report and sort most recent first
  const sortedAttendance = attendanceQueries
    .flatMap((q) => q.data?.data?.attendance ?? [])
    .sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime())

  const isScannerActive = activeFacing !== null
  const isScannerPaused = overlay.status !== 'idle'

  // Reactive device detection for mobile/tablet vs desktop/laptop
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px), (pointer: coarse)')
    const handleQueryChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobileOrTablet(e.matches)
    }
    handleQueryChange(mediaQuery)
    mediaQuery.addEventListener('change', handleQueryChange)
    return () => {
      mediaQuery.removeEventListener('change', handleQueryChange)
      if (switchTimerRef.current) clearTimeout(switchTimerRef.current)
    }
  }, [])

  // ---------------------------------------------------------------------------
  // Camera control handlers
  // ---------------------------------------------------------------------------

  const closeCamera = useCallback(() => {
    if (switchTimerRef.current) clearTimeout(switchTimerRef.current)
    setActiveFacing(null)
    setIsSwitching(false)
    setOverlay({ status: 'idle' })
    setCameraError(null)
  }, [])

  const handleOpenCamera = useCallback(
    (mode: FacingMode) => {
      if (activeFacing === mode) {
        // Tapping the active camera button → close
        closeCamera()
        return
      }

      setCameraError(null)
      setOverlay({ status: 'idle' })
      if (switchTimerRef.current) clearTimeout(switchTimerRef.current)

      if (activeFacing === null) {
        // Camera is closed → open directly
        setActiveFacing(mode)
      } else {
        // Different camera is open → switch with 600ms gate so the old
        // MediaStream has time to release before the new one starts.
        setIsSwitching(true)
        switchTimerRef.current = setTimeout(() => {
          setActiveFacing(mode)
          setIsSwitching(false)
        }, 600)
      }
    },
    [activeFacing, closeCamera],
  )

  // ---------------------------------------------------------------------------
  // Scan handlers
  // ---------------------------------------------------------------------------

  const resumeScanner = useCallback(() => {
    setOverlay({ status: 'idle' })
  }, [])

  const handleScanSuccess = useCallback(
    async (decodedText: string) => {
      setOverlay({ status: 'loading' })

      let params: TicketScanParams

      try {
        params = parseScanParams(decodedText)
      } catch {
        setOverlay({ status: 'error', message: 'Invalid QR Format' })
        return
      }

      // Register the eventId immediately from QR params — no need to wait for API.
      // This is safe because eventId is already validated inside parseScanParams.
      const eventIdNum = Number(params.eventId)
      registerEventId(eventIdNum, setScannedEventIds)

      try {
        const data = await scanMutation.mutateAsync(params)
        // Invalidate the report for this event so it re-fetches and shows the new attendee
        await queryClient.invalidateQueries({ queryKey: ['attendanceReport', eventIdNum] })
        setOverlay({ status: 'success', data })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred.'
        setOverlay({ status: 'error', message })
      }
    },
    [scanMutation, queryClient],
  )

  const handleCameraError = useCallback((errorMessage: string) => {
    setCameraError(errorMessage)
  }, [])

  const retryCamera = useCallback(() => {
    setCameraError(null)
    setScannerKey((k) => k + 1)
  }, [])

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  const renderOverlayContent = () => {
    switch (overlay.status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-12 w-12 animate-spin text-white" />
            <p className="text-lg font-semibold text-white">Verifying…</p>
          </div>
        )

      case 'success':
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <CheckCircle2 className="h-16 w-16 text-white drop-shadow-lg" />
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">✅ Checked In</p>
              <p className="text-lg font-medium text-white/90">{overlay.data.member.name}</p>
            </div>

            {/* Response debug card — surfaces API data on mobile without DevTools */}
            <div className="w-full rounded-xl bg-black/25 px-4 py-3 text-left space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">Member ID</span>
                <span className="font-mono text-white/80">#{overlay.data.member.id}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">Registration</span>
                <span className="font-mono text-white/80">#{overlay.data.registrationId}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">Check-in</span>
                <span className={cn(
                  'text-xs font-semibold',
                  overlay.data.member.isAttended ? 'text-yellow-300' : 'text-emerald-300',
                )}>
                  {overlay.data.member.isAttended ? '⚠ Already Attended' : '✓ First Check-in'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/50">Event</span>
                <span className="text-white/80">
                  {overlay.data.isEventCompleted ? '🔒 Completed' : '🟢 Active'}
                </span>
              </div>
            </div>

            <AppButton
              onClick={resumeScanner}
              className="mt-2 border border-white/40 bg-white/20 text-white hover:bg-white/30"
            >
              <ScanLine className="mr-2 h-4 w-4" />
              Scan Next Ticket
            </AppButton>
          </div>
        )

      case 'error':
        return (
          <div className="flex flex-col items-center gap-4 text-center">
            <XCircle className="h-16 w-16 text-white drop-shadow-lg" />
            <div className="space-y-1">
              <p className="text-2xl font-bold text-white">Scan Failed</p>
              <p className="text-base text-white/80">{overlay.message}</p>
            </div>
            {/* Full raw error detail for mobile debugging */}
            <div className="w-full max-h-20 overflow-y-auto rounded-xl bg-black/25 px-4 py-3">
              <p className="break-all text-left font-mono text-xs text-white/50">{overlay.message}</p>
            </div>
            <AppButton
              onClick={resumeScanner}
              className="mt-2 border border-white/40 bg-white/20 text-white hover:bg-white/30"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </AppButton>
          </div>
        )

      default:
        return null
    }
  }

  const overlayBg =
    overlay.status === 'success'
      ? 'bg-emerald-600/90'
      : overlay.status === 'error'
        ? 'bg-destructive/90'
        : 'bg-black/60'

  // ---------------------------------------------------------------------------
  // JSX
  // ---------------------------------------------------------------------------

  return (
    <div className="flex min-h-screen flex-col bg-background">

      {/* ── Header ── */}
      <header className="flex items-center justify-between border-b bg-card px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <ScanLine className="h-5 w-5 text-brand-primary" />
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            QR Check-in Scanner
          </h1>
        </div>

        {/* Camera control buttons */}
        <div className="flex items-center gap-2">
          {isMobileOrTablet ? (
            <>
              {/* Back (rear) camera */}
              <button
                id="btn-back-camera"
                type="button"
                onClick={() => handleOpenCamera('environment')}
                aria-pressed={activeFacing === 'environment'}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                  activeFacing === 'environment'
                    ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                    : 'border-border bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                <Camera className="h-4 w-4" />
                <span>Back</span>
              </button>

              {/* Front (selfie) camera */}
              <button
                id="btn-front-camera"
                type="button"
                onClick={() => handleOpenCamera('user')}
                aria-pressed={activeFacing === 'user'}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                  activeFacing === 'user'
                    ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                    : 'border-border bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                <FlipHorizontal className="h-4 w-4" />
                <span>Front</span>
              </button>
            </>
          ) : (
            /* Desktop/Laptop - single Camera button */
            <button
              id="btn-toggle-camera"
              type="button"
              onClick={() => handleOpenCamera(activeFacing ? activeFacing : 'environment')}
              aria-pressed={isScannerActive}
              className={cn(
                'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                isScannerActive
                  ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                  : 'border-border bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )}
            >
              <Camera className="h-4 w-4" />
              <span>{isScannerActive ? 'Stop Scanner' : 'Start Scanner'}</span>
            </button>
          )}
        </div>
      </header>

      {/* ── Main area ── */}
      <main className="flex flex-1 flex-col items-center gap-6 px-4 py-6">

        {/* Camera card — visible only when a camera is active */}
        {isScannerActive && (
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl">

            {/* Close button — pinned to top-right of the camera card */}
            {!isSwitching && (
              <button
                id="btn-close-camera"
                type="button"
                onClick={closeCamera}
                aria-label="Close camera"
                className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Camera switching spinner */}
            {isSwitching ? (
              <div className="flex min-h-[300px] items-center justify-center rounded-2xl bg-muted">
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Switching camera…</p>
                </div>
              </div>
            ) : cameraError ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-2xl bg-muted px-6 py-10 text-center">
                <CameraOff className="h-12 w-12 text-destructive" />
                <div className="space-y-1">
                  <p className="text-base font-bold text-foreground">Camera Unavailable</p>
                  <p className="text-sm text-muted-foreground">{cameraError}</p>
                </div>
                <AppButton onClick={retryCamera} className="mt-2">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry Camera
                </AppButton>
              </div>
            ) : (
              <>
                <AppQRScanner
                  key={scannerKey}
                  onScanSuccess={handleScanSuccess}
                  isPaused={isScannerPaused}
                  facingMode={activeFacing ?? 'environment'}
                  onError={handleCameraError}
                  className="w-full"
                />

                {/* Scan result overlay */}
                {overlay.status !== 'idle' && (
                  <div
                    className={cn(
                      'absolute inset-0 flex items-center justify-center p-4',
                      'transition-colors duration-300',
                      overlayBg,
                    )}
                  >
                    {renderOverlayContent()}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Scan hint — shown only when camera is live and idle */}
        {isScannerActive && !isSwitching && !cameraError && overlay.status === 'idle' && (
          <p className="text-sm text-muted-foreground">
            Point the camera at an attendee's QR code
          </p>
        )}

        {/* ── Registration list ── */}
        <div className="w-full max-w-2xl">
          <div className="mb-4 flex items-center gap-2 border-b pb-3">
            <Users className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Registrations</h2>
          </div>

          {sortedAttendance.length > 0 ? (
            <ul className="space-y-4">
              {sortedAttendance.map((item) => (
                <li key={item.id} className="rounded-xl bg-background p-4 shadow-sm border border-muted">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-foreground">Member ID: {item.memberId}</span>
                    <span className="text-sm text-muted-foreground">Check‑in: {new Date(item.checkInTime).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Reg: {item.registrationId}</span>
                    <span>{item.attended ? '✅ Attended' : '❌ Not Attended'}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted p-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm font-medium text-foreground">No registrations yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                The registration list will appear here once the API is connected
              </p>
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
