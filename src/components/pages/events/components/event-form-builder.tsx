import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  useDraggable
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Type, Mail, List, Plus, Trash2, Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { useTheme } from "@/layouts/dashboard-layout"
import { useEventWizard, FormSchemaField } from "@/context/EventWizardContext"
import { AppButton } from "@/components/controls/app-button"
import { TextField } from "@/components/controls/text-field"
import { AppSelect } from "@/components/controls/app-select"
import { TextArea } from "@/components/controls/text-area"
import { useCreateEvent } from "@/hooks/api/eventAPIHooks"
import { useCreateOrUpdateForm } from "@/hooks/api/formAPIHooks"
import { useGetPresignedUrl } from "@/hooks/api/uploadsAPIHooks"
import { AppAlert } from "@/components/controls/app-alert"
import StarRating from "@/components/common/StarRating"
import axios from "axios"

// ---------------------------------------------------------------------------
// UUID Helper
// ---------------------------------------------------------------------------
function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

// ---------------------------------------------------------------------------
// Toolbox Item Component
// ---------------------------------------------------------------------------
function ToolboxItem({ type, label, icon: Icon, isLight }: { type: string, label: string, icon: any, isLight: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `toolbox-${type}`,
    data: { type, isToolbox: true },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl border cursor-grab hover:border-[#e568f5] dark:hover:border-[#FFBF00] transition-colors",
        isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10 text-white",
        isDragging && "opacity-50"
      )}
    >
      <div className={cn("p-2 rounded-lg", isLight ? "bg-gray-100" : "bg-white/10")}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="font-medium text-sm">{label}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sortable Field Component (Canvas Item)
// ---------------------------------------------------------------------------
interface SortableFieldProps {
  field: FormSchemaField
  isActiveSelection: boolean
  onClick: () => void
  onRemove: () => void
  isLight: boolean
  isFeedbackCanvas?: boolean
}

function SortableField({ field, isActiveSelection, onClick, onRemove, isLight, isFeedbackCanvas }: SortableFieldProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const renderPreview = () => {
    // Intercept rating field in feedback canvas to render StarRating
    if (isFeedbackCanvas && field.id === "rating") {
      return (
        <div className="space-y-1.5 pointer-events-none">
          <label className={cn("text-sm font-medium block", isLight ? "text-foreground" : "text-white")}>
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </label>
          <StarRating value={3} readOnly />
        </div>
      )
    }

    switch (field.type) {
      case "text":
      case "email":
        return <TextField label={field.label} placeholder={`Enter ${field.label.toLowerCase()}`} disabled />
      case "textarea":
        return <TextArea label={field.label} placeholder={`Enter ${field.label.toLowerCase()}`} disabled />
      case "select":
        return (
          <div className="space-y-1.5 pointer-events-none">
            <AppSelect
              label={field.label}
              options={field.options?.map(o => ({ label: o, value: o })) || []}
              value=""
            />
          </div>
        )
      case "number":
        return <TextField type="number" label={field.label} placeholder="0" disabled />
      default:
        return null
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={cn(
        "relative group p-4 rounded-xl border transition-all",
        isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10",
        isActiveSelection && (isLight ? "border-[#e568f5] ring-1 ring-[#e568f5]" : "border-[#FFBF00] ring-1 ring-[#FFBF00]"),
        isDragging && "opacity-50 z-50",
        !isDragging && "hover:border-gray-400 dark:hover:border-white/30"
      )}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-white"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      <div className="pl-6 pr-8 pointer-events-none">
        {renderPreview()}
      </div>

      {/* Remove Button */}
      {isActiveSelection && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Shared Form Builder Pane (used for both Step 2 & Step 3)
// ---------------------------------------------------------------------------
interface FormBuilderPaneProps {
  schema: FormSchemaField[]
  setSchema: (s: FormSchemaField[]) => void
  isLight: boolean
  isFeedbackCanvas?: boolean
  emptyLabel?: string
}

function FormBuilderPane({ schema, setSchema, isLight, isFeedbackCanvas, emptyLabel }: FormBuilderPaneProps) {
  const [activeDragId, setActiveDragId] = useState<string | null>(null)
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const activeFieldProps = schema.find(f => f.id === activeFieldId)

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(String(event.active.id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null)
    const { active, over } = event
    if (!over) return

    if (String(active.id).startsWith("toolbox-")) {
      const type = active.data.current?.type as FormSchemaField["type"]
      const newField: FormSchemaField = {
        id: generateId(),
        type,
        label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
        required: false,
        ...(type === "select" ? { options: ["Option 1", "Option 2"] } : {}),
      }
      setSchema([...schema, newField])
      setActiveFieldId(newField.id)
      return
    }

    if (active.id !== over.id) {
      const oldIndex = schema.findIndex(item => item.id === active.id)
      const newIndex = schema.findIndex(item => item.id === over.id)
      setSchema(arrayMove(schema, oldIndex, newIndex))
    }
  }

  const updateActiveField = (updates: Partial<FormSchemaField>) => {
    if (!activeFieldId) return
    setSchema(schema.map(f => f.id === activeFieldId ? { ...f, ...updates } : f))
  }

  const handleAddClick = (type: FormSchemaField["type"]) => {
    const newField: FormSchemaField = {
      id: generateId(),
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      ...(type === "select" ? { options: ["Option 1", "Option 2"] } : {}),
    }
    setSchema([...schema, newField])
    setActiveFieldId(newField.id)
  }

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]")}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Toolbox */}
        <div className={cn("lg:col-span-3 p-4 rounded-2xl border", isLight ? "bg-white border-gray-200 shadow-sm" : "bg-[#111111] border-white/10")}>
          <h3 className={cn("text-sm font-bold mb-4", isLight ? "text-[#0A2463]" : "text-white")}>Elements</h3>
          <p className="text-xs text-gray-500 mb-4">Drag elements to the canvas or click the + icon.</p>

          <div className="space-y-3">
            {([
              { type: "text" as const, label: "Short Text", icon: Type },
              { type: "email" as const, label: "Email Address", icon: Mail },
              { type: "select" as const, label: "Dropdown Select", icon: List },
              { type: "textarea" as const, label: "Long Text", icon: Type },
              { type: "number" as const, label: "Number", icon: Star },
            ] as const).map(({ type, label, icon }) => (
              <div key={type} className="relative group">
                <ToolboxItem type={type} label={label} icon={icon} isLight={isLight} />
                <button
                  onClick={() => handleAddClick(type)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className={cn("lg:col-span-6 p-4 md:p-6 rounded-2xl border flex flex-col", isLight ? "bg-gray-50 border-gray-200 shadow-inner" : "bg-black/50 border-white/10")}>
          <h3 className={cn("text-sm font-bold mb-6 text-center", isLight ? "text-[#0A2463]" : "text-white")}>Form Canvas</h3>

          <SortableContext items={schema.map(f => f.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4 min-h-[400px] pb-20">
              {schema.length === 0 ? (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl m-4 p-12">
                  <p className="text-gray-400 text-sm font-medium text-center">
                    {emptyLabel ?? "Drag and drop elements here to build your form."}
                  </p>
                </div>
              ) : (
                schema.map((field) => (
                  <SortableField
                    key={field.id}
                    field={field}
                    isActiveSelection={activeFieldId === field.id}
                    onClick={() => setActiveFieldId(field.id)}
                    onRemove={() => {
                      setSchema(schema.filter(f => f.id !== field.id))
                      if (activeFieldId === field.id) setActiveFieldId(null)
                    }}
                    isLight={isLight}
                    isFeedbackCanvas={isFeedbackCanvas}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </div>

        <DragOverlay>
          {activeDragId?.startsWith("toolbox-") ? (
            <div className={cn("p-3 rounded-xl border bg-white dark:bg-black opacity-80 shadow-lg text-sm font-medium")}>
              New Field
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Properties Panel */}
      <div className={cn("lg:col-span-3 p-4 rounded-2xl border", isLight ? "bg-white border-gray-200 shadow-sm" : "bg-[#111111] border-white/10")}>
        <h3 className={cn("text-sm font-bold mb-6", isLight ? "text-[#0A2463]" : "text-white")}>Properties</h3>

        {!activeFieldProps ? (
          <p className="text-xs text-gray-500">Select a field on the canvas to edit its properties.</p>
        ) : (
          <div className="space-y-6">
            <TextField
              label="Field Label"
              value={activeFieldProps.label}
              onChange={(e) => updateActiveField({ label: e.target.value })}
              className={cn(isLight ? "bg-gray-50" : "bg-white/5")}
            />

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="required-toggle"
                checked={activeFieldProps.required}
                onChange={(e) => updateActiveField({ required: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 accent-[#e568f5] dark:accent-[#FFBF00]"
              />
              <label htmlFor="required-toggle" className={cn("text-sm font-medium", isLight ? "text-[#0A2463]" : "text-white")}>
                Required Field
              </label>
            </div>

            {activeFieldProps.type === "select" && (
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-white/10">
                <label className={cn("text-sm font-medium block", isLight ? "text-[#0A2463]" : "text-white")}>Dropdown Options</label>
                <TextArea
                  value={(activeFieldProps.options || []).join("\n")}
                  onChange={(e) => updateActiveField({ options: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })}
                  placeholder="Enter options, one per line"
                  className={cn(isLight ? "bg-gray-50" : "bg-white/5")}
                  rows={6}
                />
                <p className="text-[10px] text-gray-500">Enter each option on a new line.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 2: Registration Form Builder
// ---------------------------------------------------------------------------
export function EventFormBuilder() {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const { formSchema, setFormSchema, setStep } = useEventWizard()

  return (
    <div className="flex flex-col h-full space-y-6">
      <FormBuilderPane
        schema={formSchema}
        setSchema={setFormSchema}
        isLight={isLight}
        emptyLabel="Drag and drop elements here to build your registration form."
      />

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/10">
        <AppButton
          type="button"
          variant="outline"
          onClick={() => setStep(1)}
          className={cn("px-6", isLight ? "border-gray-300 text-gray-700" : "border-white/20 text-white")}
        >
          Back
        </AppButton>
        <AppButton
          type="button"
          onClick={() => setStep(3)}
          className={cn("px-8 rounded-full font-semibold min-w-[200px]", isLight ? "bg-[#e568f5] hover:bg-[#d04de0] text-white" : "bg-[#FFBF00] hover:bg-[#e6ac00] text-black")}
        >
          Next: Feedback Form
        </AppButton>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Step 3: Feedback Form Builder + Final Submission Chain
// ---------------------------------------------------------------------------
export function FeedbackFormBuilder() {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const navigate = useNavigate()

  const {
    feedbackSchema,
    setFeedbackSchema,
    setStep,
    eventDetails,
    formSchema,
    bannerFile,
    resetWizard,
  } = useEventWizard()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<{ variant: "success" | "error"; message: string } | null>(null)

  const createEventMutation = useCreateEvent()
  const createFormMutation = useCreateOrUpdateForm()
  const getPresignedUrlMutation = useGetPresignedUrl()

  const showNotification = (variant: "success" | "error", message: string) => {
    setNotification({ variant, message })
    setTimeout(() => setNotification(null), 6000)
  }

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)

    try {
      // ── Chain Step A: Image Upload (if banner file exists) ──────────────
      let uploadedS3Key: string | undefined = undefined

      if (bannerFile) {
        const presignedData = await getPresignedUrlMutation.mutateAsync({
          fileName: bannerFile.name,
          contentType: bannerFile.type,
        })

        await axios.put(presignedData.url, bannerFile, {
          headers: { "Content-Type": bannerFile.type },
        })

        uploadedS3Key = presignedData.key
      }

      // ── Chain Step B: Create Event ────────────────────────────────────────
      const eventPayload = {
        eventTypeId: Number(eventDetails.eventTypeId) || 1,
        title: eventDetails.name || "",
        location: eventDetails.location || "",
        startDate: eventDetails.startDate ? new Date(eventDetails.startDate as string).toISOString() : "",
        endDate: eventDetails.endDate ? new Date(eventDetails.endDate as string).toISOString() : "",
        maxguestCapacity: Number(eventDetails.maxguestCapacity) || 100,
        eventManagerId: Number(eventDetails.eventManagerId) || 1,
        autoApprove: eventDetails.autoApprove ?? false,
        ...(uploadedS3Key ? { banner: uploadedS3Key } : {}),
      }

      const eventResponse = await createEventMutation.mutateAsync(eventPayload as any)
      const returnedEventId = eventResponse?.eventId ?? eventResponse?.data?.eventId

      if (!returnedEventId) {
        throw new Error("Event was created but the event ID was not returned.")
      }

      // ── Chain Step C: Create Registration Form ────────────────────────────
      await createFormMutation.mutateAsync({
        eventId: Number(returnedEventId),
        type: "REGISTRATION",
        schema: {
          title: `${eventDetails.name || "Event"} Registration Form`,
          description: `Registration for ${eventDetails.name || "Event"}`,
          fields: formSchema.map((field) => ({
            name: field.id,
            type: field.type,
            label: field.label,
            required: field.required,
            options: field.options,
          })),
        },
      })

      // ── Chain Step D: Create Feedback Form ───────────────────────────────
      await createFormMutation.mutateAsync({
        eventId: Number(returnedEventId),
        type: "FEEDBACK",
        schema: {
          title: "Feedback Form",
          description: "Tell us your experience",
          fields: feedbackSchema.map((field) => ({
            name: field.id,
            type: field.type,
            label: field.label,
            required: field.required,
            options: field.options,
          })),
        },
      })

      resetWizard()
      navigate("/events")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred during event creation."
      showNotification("error", message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Global notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-300">
          <AppAlert variant={notification.variant} message={notification.message} />
        </div>
      )}

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className={cn("flex flex-col items-center gap-4 p-8 rounded-2xl shadow-2xl", isLight ? "bg-white" : "bg-[#111111]")}>
            <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: isLight ? "#e568f5 transparent transparent transparent" : "#FFBF00 transparent transparent transparent" }}
            />
            <p className={cn("text-sm font-semibold", isLight ? "text-[#0A2463]" : "text-white")}>
              Publishing your event...
            </p>
            <p className="text-xs text-gray-400 text-center max-w-[220px]">
              Uploading assets and saving forms. Please don&apos;t close this page.
            </p>
          </div>
        </div>
      )}

      <FormBuilderPane
        schema={feedbackSchema}
        setSchema={setFeedbackSchema}
        isLight={isLight}
        isFeedbackCanvas
        emptyLabel="Drag and drop elements here to build your feedback form."
      />

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/10">
        <AppButton
          type="button"
          variant="outline"
          onClick={() => setStep(2)}
          className={cn("px-6", isLight ? "border-gray-300 text-gray-700" : "border-white/20 text-white")}
        >
          Back
        </AppButton>
        <AppButton
          type="button"
          isLoading={isSubmitting}
          onClick={handleFinalSubmit}
          className={cn("px-8 rounded-full font-semibold min-w-[200px]", isLight ? "bg-[#e568f5] hover:bg-[#d04de0] text-white" : "bg-[#FFBF00] hover:bg-[#e6ac00] text-black")}
        >
          Save & Publish Event
        </AppButton>
      </div>
    </div>
  )
}
