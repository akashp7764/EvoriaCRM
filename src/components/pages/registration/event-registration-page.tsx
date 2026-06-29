import { useState } from "react"
import { useParams } from "react-router-dom"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CalendarX2, Minus, Plus, ShieldCheck, Users } from "lucide-react"

import { useGetRegFormDetailsByEventId } from "@/hooks/api/formAPIHooks"
import {
  useRegisterForEvent,
  useSendOTPVerification,
} from "@/hooks/api/registrationAPIHooks"

import { AppModal } from "@/components/controls/AppModal"
import { AppOTPInput } from "@/components/controls/app-otp-input"
import { AppButton } from "@/components/controls/app-button"
import { TextField } from "@/components/controls/text-field"
import { renderFormFields } from "@/utils/render-form-fields"

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const registrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  mobile: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .regex(/^\d+$/, "Only numbers are allowed"),
  totalMembers: z.number().min(1).max(20),
  guests: z.array(z.object({ name: z.string().min(2, "Full name is required") })),
  formData: z.record(z.string(), z.unknown()),
})

type RegistrationFormValues = z.infer<typeof registrationSchema>

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function InactiveEventState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <CalendarX2 className="h-9 w-9 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Registrations Closed
          </h1>
          <p className="text-base text-muted-foreground">
            Thank you to everyone who made this event a success. Registrations
            are no longer being accepted.
          </p>
        </div>
      </div>
    </div>
  )
}

function NotFoundState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <ShieldCheck className="h-9 w-9 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Event Not Found
          </h1>
          <p className="text-base text-muted-foreground">
            The registration link you followed is invalid or has expired. Please
            check the link and try again.
          </p>
        </div>
      </div>
    </div>
  )
}

function PageSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-xl space-y-6 px-4 py-12">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function EventRegistrationPage() {
  const { eventId } = useParams<{ eventId: string }>()

  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    data: formDetail,
    isLoading,
    isError,
  } = useGetRegFormDetailsByEventId(eventId)

  const sendOTPMutation = useSendOTPVerification()
  const registerMutation = useRegisterForEvent(eventId ?? "")

  const {
    control,
    handleSubmit,
    getValues,
    watch,
    setValue,
    formState: {},
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      mobile: "",
      totalMembers: 1,
      guests: [],
      formData: {},
    },
  })

  const { fields: guestFields, replace } = useFieldArray({
    control,
    name: "guests",
  })

  const totalMembers = watch("totalMembers")

  // Keep the guests array in sync with the totalMembers stepper
  const syncGuestCount = (newCount: number) => {
    const clamped = Math.min(Math.max(newCount, 1), 20)
    setValue("totalMembers", clamped)
    const guestCount = Math.max(clamped - 1, 0)
    const current = getValues("guests")
    const next = Array.from({ length: guestCount }, (_, i) => ({
      name: current[i]?.name ?? "",
    }))
    replace(next)
  }

  // Step 1: Validate the form → send OTP
  const onSubmitStep1 = handleSubmit(async () => {
    const { email, mobile } = getValues()
    await sendOTPMutation.mutateAsync({ email, number: mobile })
    setIsOTPModalOpen(true)
  })

  // Step 2: User enters OTP → fire registration
  const onOTPConfirm = async (otp: string) => {
    const values = getValues()
    const payload = {
      email: values.email,
      phoneNumber: values.mobile,
      otp,
      members: [
        { name: values.fullName },
        ...values.guests.map((g) => ({ name: g.name })),
      ],
      formData: values.formData as Record<string, unknown>,
    }
    await registerMutation.mutateAsync(payload as any)
    setIsOTPModalOpen(false)
    setSuccessMessage("You're registered! Check your email for the confirmation.")
  }

  const handleResendOTP = async () => {
    const { email, mobile } = getValues()
    await sendOTPMutation.mutateAsync({ email, number: mobile })
  }

  // ---------------------------------------------------------------------------
  // Render gates
  // ---------------------------------------------------------------------------

  if (!eventId) return <NotFoundState />
  if (isLoading) return <PageSkeleton />
  if (isError || !formDetail) return <NotFoundState />
  if (!formDetail.isActive) return <InactiveEventState />

  const schema = formDetail.schema

  // ---------------------------------------------------------------------------
  // Success state
  // ---------------------------------------------------------------------------

  if (successMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="flex max-w-md flex-col items-center gap-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary/10">
            <ShieldCheck className="h-9 w-9 text-brand-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Registration Successful!
            </h1>
            <p className="text-base text-muted-foreground">{successMessage}</p>
          </div>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Form UI
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-background">
      {/* Header band */}
      <div className="border-b bg-card px-4 py-8 shadow-sm">
        <div className="mx-auto max-w-xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {schema.title}
          </h1>
          {schema.description && (
            <p className="mt-2 text-base text-muted-foreground">
              {schema.description}
            </p>
          )}
        </div>
      </div>

      {/* Form body */}
      <div className="mx-auto max-w-xl px-4 py-10">
        <form onSubmit={onSubmitStep1} noValidate className="space-y-6">

          {/* ── Fixed: Contact Details ── */}
          <section className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              Contact Details
            </h2>
            <Controller
              name="fullName"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  id="reg-full-name"
                  type="text"
                  label="Full Name"
                  placeholder="Your full name"
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  id="reg-email"
                  type="email"
                  label="Email Address"
                  placeholder="you@example.com"
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="mobile"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  id="reg-mobile"
                  type="tel"
                  label="Mobile Number"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  error={fieldState.error?.message}
                />
              )}
            />
          </section>

          {/* ── Dynamic schema fields ── */}
          {schema.fields?.length > 0 && (
            <section className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Additional Information
              </h2>
              {renderFormFields({ fields: schema.fields, control })}
            </section>
          )}

          {/* ── Guest Selector ── */}
          <section className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Group Size
              </h2>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-3">
              <AppButton
                type="button"
                variant="outline"
                size="icon"
                onClick={() => syncGuestCount(totalMembers - 1)}
                disabled={totalMembers <= 1}
                aria-label="Decrease member count"
              >
                <Minus className="h-4 w-4" />
              </AppButton>
              <span className="w-10 text-center text-xl font-semibold tabular-nums">
                {totalMembers}
              </span>
              <AppButton
                type="button"
                variant="outline"
                size="icon"
                onClick={() => syncGuestCount(totalMembers + 1)}
                disabled={totalMembers >= 20}
                aria-label="Increase member count"
              >
                <Plus className="h-4 w-4" />
              </AppButton>
              <span className="text-sm text-muted-foreground">
                {totalMembers === 1 ? "Just me" : `${totalMembers} people`}
              </span>
            </div>

            {/* Dynamic guest name fields */}
            {guestFields.map((guestField, index) => (
              <Controller
                key={guestField.id}
                name={`guests.${index}.name`}
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    id={`guest-name-${index}`}
                    label={`Guest #${index + 1} — Full Name`}
                    placeholder="Enter full name"
                    error={fieldState.error?.message}
                  />
                )}
              />
            ))}
          </section>

          {/* ── Submit ── */}
          <AppButton
            type="submit"
            isLoading={sendOTPMutation.isPending}
            className="w-full bg-brand-primary text-brand-primary-foreground hover:bg-brand-primary/90"
          >
            Verify Email &amp; Submit
          </AppButton>

          {/* Inline API errors */}
          {sendOTPMutation.isError && (
            <p className="text-center text-sm font-medium text-destructive">
              {String(sendOTPMutation.error)}
            </p>
          )}
        </form>
      </div>

      {/* ── OTP Modal ── */}
      <AppModal
        isOpen={isOTPModalOpen}
        onClose={() => setIsOTPModalOpen(false)}
        title="Verify Your Email"
        className="sm:max-w-md"
      >
        <p className="mb-5 text-sm text-muted-foreground">
          A 6-digit code has been sent to{" "}
          <span className="font-semibold text-foreground">
            {watch("email")}
          </span>
          . Enter it below to complete your registration.
        </p>
        <AppOTPInput
          otpLimit={6}
          confirmButtonName="Submit"
          onSubmit={onOTPConfirm}
          onClose={() => setIsOTPModalOpen(false)}
          resendOTPAPICall={handleResendOTP}
          isLoading={registerMutation.isPending}
        />
        {registerMutation.isError && (
          <p className="mt-3 text-center text-sm font-medium text-destructive">
            {String(registerMutation.error)}
          </p>
        )}
      </AppModal>
    </div>
  )
}
