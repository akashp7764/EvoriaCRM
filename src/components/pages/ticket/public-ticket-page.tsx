import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  CheckCircle2,
  Clock,
  QrCode,
  AlertTriangle,
  Send,
  CalendarCheck,
} from 'lucide-react'

import { useScanAttendance } from '@/hooks/api/attendanceAPIHooks'
import { useSubmitFeedback } from '@/hooks/api/registrationAPIHooks'
import { renderFormFields } from '@/utils/render-form-fields'
import { AppButton } from '@/components/controls/app-button'
import { CompletedTicketData } from '@/types/api/ticket'

// ---------------------------------------------------------------------------
// Feedback form — dynamic schema with a passthrough record for renderFormFields
// ---------------------------------------------------------------------------

const feedbackFormSchema = z.object({
  formData: z.record(z.string(), z.unknown()),
})
type FeedbackFormValues = z.infer<typeof feedbackFormSchema>

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

function TicketSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-navy via-brand-ternary to-background px-4">
      <div className="w-full max-w-sm space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
        <div className="h-6 w-2/3 animate-pulse rounded-lg bg-white/10" />
        <div className="h-4 w-1/2 animate-pulse rounded-lg bg-white/10" />
        <div className="mx-auto h-48 w-48 animate-pulse rounded-2xl bg-white/10" />
        <div className="h-10 animate-pulse rounded-xl bg-white/10" />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Error state
// ---------------------------------------------------------------------------

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex max-w-sm flex-col items-center gap-5 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-9 w-9 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-foreground">Invalid Ticket Link</h1>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Digital Badge — rendered when isEventCompleted === false
// ---------------------------------------------------------------------------

function DigitalBadge({ data }: { data: { eventId: number; member: { name: string; qrCode: string; isAttended: boolean } } }) {
  const { member, eventId } = data

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-navy via-brand-ternary to-background px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/8 shadow-2xl backdrop-blur-xl">

          {/* Header strip */}
          <div className="flex items-center justify-between bg-brand-primary/90 px-6 py-4">
            <div className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-brand-primary-foreground" />
              <span className="text-sm font-bold uppercase tracking-widest text-brand-primary-foreground">
                Digital Pass
              </span>
            </div>
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">
              Event #{eventId}
            </span>
          </div>

          {/* Body */}
          <div className="flex flex-col items-center gap-6 px-6 py-8">
            {/* Attendee name */}
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
                Attendee
              </p>
              <h1 className="mt-1 text-2xl font-bold text-white">
                {member.name}
              </h1>
            </div>

            {/* Base64 QR code — rendered directly from the BE-provided string */}
            <div className="rounded-2xl bg-white p-3 shadow-inner">
              <img
                src={member.qrCode}
                alt={`QR code for ${member.name}`}
                className="h-44 w-44 object-contain"
                draggable={false}
              />
            </div>

            {/* Status pill */}
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                member.isAttended
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-brand-gold/20 text-brand-gold'
              }`}
            >
              {member.isAttended ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Attendance Marked
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4" />
                  Valid Pass — Ready for Scan
                </>
              )}
            </div>
          </div>

          {/* Footer strip */}
          <div className="border-t border-white/10 px-6 py-3 text-center">
            <p className="text-xs text-white/30">
              Present this QR code at the event entrance
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Feedback Form — rendered when isEventCompleted === true
// ---------------------------------------------------------------------------

function FeedbackView({ data }: { data: CompletedTicketData }) {
  const [submitted, setSubmitted] = useState(false)

  const submitFeedback = useSubmitFeedback(data.registrationId)

  const { control, handleSubmit } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: { formData: {} },
  })

  const onSubmit = async (values: FeedbackFormValues) => {
    await submitFeedback.mutateAsync({
      formId: data.feedbackForm.id,
      answers: values.formData as Record<string, unknown>,
    } as any)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="flex max-w-sm flex-col items-center gap-5 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary/10">
            <CalendarCheck className="h-9 w-9 text-brand-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-foreground">Thank You!</h1>
            <p className="text-sm text-muted-foreground">
              Your feedback has been submitted. We appreciate you taking the time.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-4 py-8 shadow-sm">
        <div className="mx-auto max-w-lg">
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <CalendarCheck className="h-3.5 w-3.5" />
            Event Concluded
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {data.feedbackForm.schema.title}
          </h1>
          {data.feedbackForm.schema.description && (
            <p className="mt-1.5 text-sm text-muted-foreground">
              {data.feedbackForm.schema.description}
            </p>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-lg px-4 py-10">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          <section className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
            {renderFormFields({
              fields: data.feedbackForm.schema.fields,
              control,
              pathPrefix: 'formData',
            })}
          </section>

          <AppButton
            type="submit"
            isLoading={submitFeedback.isPending}
            className="w-full bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary/90"
          >
            <Send className="mr-2 h-4 w-4" />
            Submit Feedback
          </AppButton>

          {submitFeedback.isError && (
            <p className="text-center text-sm font-medium text-destructive">
              {String(submitFeedback.error)}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// PublicTicketPage — entry point for /ticket/scan
// ---------------------------------------------------------------------------

export default function PublicTicketPage() {
  const [searchParams] = useSearchParams()

  const eventId = searchParams.get('eventId')
  const registrationId = searchParams.get('registrationId')
  const memberId = searchParams.get('memberId')

  const scanMutation = useScanAttendance()

  // Fire the scan API exactly once on mount, as soon as all three params are present.
  useEffect(() => {
    if (!eventId || !registrationId || !memberId) return
    scanMutation.mutate({ eventId, registrationId, memberId })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Intentionally empty — one-shot on mount

  // ---------------------------------------------------------------------------
  // Guard: missing required params
  // ---------------------------------------------------------------------------

  if (!eventId || !registrationId || !memberId) {
    return (
      <ErrorState message="This link is missing required parameters. Please scan your original QR code again." />
    )
  }

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (scanMutation.isPending) {
    return <TicketSkeleton />
  }

  // ---------------------------------------------------------------------------
  // API error
  // ---------------------------------------------------------------------------

  if (scanMutation.isError) {
    return (
      <ErrorState
        message={
          scanMutation.error instanceof Error
            ? scanMutation.error.message
            : 'We could not load your ticket. Please try again.'
        }
      />
    )
  }

  // ---------------------------------------------------------------------------
  // No data yet (idle, before first fire) — show skeleton
  // ---------------------------------------------------------------------------

  if (!scanMutation.data) {
    return <TicketSkeleton />
  }

  const ticketData = scanMutation.data

  // ---------------------------------------------------------------------------
  // Branch: active event → Digital Badge
  // ---------------------------------------------------------------------------

  if (!ticketData.isEventCompleted) {
    return <DigitalBadge data={ticketData} />
  }

  // ---------------------------------------------------------------------------
  // Branch: event completed → Feedback form
  // ---------------------------------------------------------------------------

  return <FeedbackView data={ticketData} />
}
