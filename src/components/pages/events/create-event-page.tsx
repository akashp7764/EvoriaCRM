import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useTheme } from "@/layouts/dashboard-layout"
import { EventWizardProvider, useEventWizard, FormSchemaField } from "@/context/EventWizardContext"
import { EventDetailsForm } from "./components/event-details-form"
import { EventFormBuilder, FeedbackFormBuilder } from "./components/event-form-builder"
import { ChevronRight, Check } from "lucide-react"
import { useGetEventDetails } from "@/hooks/api/eventAPIHooks"

// ---------------------------------------------------------------------------
// Stepper
// ---------------------------------------------------------------------------
function Stepper({ currentStep, isLight }: { currentStep: number; isLight: boolean }) {
  const steps = ["Basic Info", "Registration Form", "Feedback Form"]

  return (
    <div className="flex items-center gap-2">
      {steps.map((label, index) => {
        const stepNum = index + 1
        const isCompleted = currentStep > stepNum
        const isActive = currentStep === stepNum

        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  isCompleted
                    ? (isLight ? "bg-[#e568f5] text-white" : "bg-[#FFBF00] text-black")
                    : isActive
                    ? (isLight ? "bg-[#0A2463] text-white" : "bg-white text-black")
                    : (isLight ? "bg-gray-200 text-gray-400" : "bg-white/10 text-white/40")
                )}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : stepNum}
              </div>
              <span
                className={cn(
                  "text-sm font-medium hidden sm:block",
                  isActive
                    ? (isLight ? "text-[#0A2463]" : "text-white")
                    : isCompleted
                    ? (isLight ? "text-[#e568f5]" : "text-[#FFBF00]")
                    : "text-gray-400"
                )}
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 text-gray-300 dark:text-white/20 mx-1" />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Edit Hydrator — runs on mount if an eventId param exists
// ---------------------------------------------------------------------------
function EditHydrator({ eventId }: { eventId: string }) {
  const { setEventDetails, setFormSchema } = useEventWizard()
  const { data } = useGetEventDetails(eventId)

  useEffect(() => {
    if (!data) return
    const ev = (data as any)?.data || data

    setEventDetails({
      name: ev.title || "",
      description: ev.description || "",
      startDate: ev.startDate || "",
      endDate: ev.endDate || "",
      location: ev.location || "",
      imageURL: ev.imageURL || "",
      eventTypeId: ev.eventTypeId,
      maxguestCapacity: ev.maxguestCapacity,
      eventManagerId: ev.eventManagerId,
      autoApprove: ev.autoApprove ?? false,
    })

    try {
      const parsed: FormSchemaField[] = JSON.parse(ev.customFormSchema || "[]")
      setFormSchema(parsed)
    } catch {
      setFormSchema([])
    }
  }, [data, setEventDetails, setFormSchema])

  return null
}

// ---------------------------------------------------------------------------
// Wizard Shell Component
// ---------------------------------------------------------------------------
function WizardContent() {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const { currentStep } = useEventWizard()
  const { id: eventId } = useParams<{ id?: string }>()
  const isEditMode = !!eventId

  return (
    <div className={cn("min-h-full p-4 md:p-6 space-y-6 max-w-5xl mx-auto", isLight ? "bg-[#f5f6f8]" : "bg-black")}>

      {/* Hydrate store from API if editing */}
      {isEditMode && <EditHydrator eventId={eventId!} />}

      {/* Header & Stepper */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl font-bold", isLight ? "text-[#0A2463]" : "text-white")}>
            {isEditMode ? "Edit Event" : "Create New Event"}
          </h1>
          <p className={cn("text-sm mt-1", isLight ? "text-gray-500" : "text-gray-400")}>
            {isEditMode
              ? "Update your event details and registration form."
              : "Set up your event details, registration, and feedback forms."}
          </p>
        </div>

        <Stepper currentStep={currentStep} isLight={isLight} />
      </div>

      {/* Render Current Step */}
      <div className="w-full">
        {currentStep === 1 && <EventDetailsForm />}
        {currentStep === 2 && <EventFormBuilder />}
        {currentStep === 3 && <FeedbackFormBuilder />}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Exported Page wrapped in Provider
// ---------------------------------------------------------------------------
export default function CreateEventPage() {
  return (
    <EventWizardProvider>
      <WizardContent />
    </EventWizardProvider>
  )
}
