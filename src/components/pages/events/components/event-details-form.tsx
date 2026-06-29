import { useEffect, useMemo, useRef, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { UploadCloud, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { useTheme } from "@/layouts/dashboard-layout"
import { useEventWizard } from "@/context/EventWizardContext"

import { AppButton } from "@/components/controls/app-button"
import { TextField } from "@/components/controls/text-field"
import { TextArea } from "@/components/controls/text-area"
import { AppDatePicker } from "@/components/controls/app-date-picker"
import { ManagerSelect } from "@/components/controls/manager-select"
import { AppSelect } from "@/components/controls/app-select"
import { useGetEventTypes } from "@/hooks/api/eventAPIHooks"

// ---------------------------------------------------------------------------
// Zod Schema
// ---------------------------------------------------------------------------
const eventDetailsSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters"),
  description: z.string().min(1, "Description is required"),
  startDate: z.date({
    message: "Start date is required",
  }),
  endDate: z.date({
    message: "End date is required",
  }),
  location: z.string().min(1, "Location is required"),
  eventManagerId: z.string().optional(),
  eventTypeId: z.string().min(1, "Category is required"),
  maxguestCapacity: z.string().min(1, "Capacity is required"),
  autoApprove: z.boolean().default(false),
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date cannot be before start date",
  path: ["endDate"],
})

export type EventDetailsFormData = z.infer<typeof eventDetailsSchema>

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function EventDetailsForm() {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const navigate = useNavigate()
  const { eventDetails, setEventDetails, setStep, resetWizard, bannerFile, setBannerFile } = useEventWizard()

  const [isDragOver, setIsDragOver] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: typesData } = useGetEventTypes()

  const categories = useMemo(() => {
    const items = typesData?.data || typesData?.items || (Array.isArray(typesData) ? typesData : [])
    if (Array.isArray(items)) {
      return items.map((t: any) => ({
        label: t.name || "Unknown",
        value: t.id ? String(t.id) : (t._id ? String(t._id) : (t.eventTypeId ? String(t.eventTypeId) : t.name))
      }))
    }
    return []
  }, [typesData])

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<EventDetailsFormData>({
    resolver: zodResolver(eventDetailsSchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      eventManagerId: "",
      eventTypeId: "",
      maxguestCapacity: "",
      autoApprove: false,
    },
  })

  const watchedStartDate = watch("startDate")

  // Hydrate form if context already has data (e.g. going back from step 2)
  useEffect(() => {
    if (Object.keys(eventDetails).length > 0) {
      reset({
        name: eventDetails.name || "",
        description: eventDetails.description || "",
        startDate: eventDetails.startDate ? new Date(eventDetails.startDate) : undefined,
        endDate: eventDetails.endDate ? new Date(eventDetails.endDate) : undefined,
        location: eventDetails.location || "",
        eventManagerId: eventDetails.eventManagerId ? String(eventDetails.eventManagerId) : "",
        eventTypeId: eventDetails.eventTypeId ? String(eventDetails.eventTypeId) : "",
        maxguestCapacity: eventDetails.maxguestCapacity ? String(eventDetails.maxguestCapacity) : "",
        autoApprove: eventDetails.autoApprove ?? false,
      })
    }
  }, [eventDetails, reset])

  // Restore preview if a bannerFile exists (navigating back)
  useEffect(() => {
    if (bannerFile) {
      const url = URL.createObjectURL(bannerFile)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(null)
    }
  }, [bannerFile])

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) return
    setBannerFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleDropZoneDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleClearBanner = () => {
    setBannerFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const onSubmit = (data: EventDetailsFormData) => {
    setEventDetails({
      name: data.name,
      description: data.description,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
      location: data.location,
      imageURL: "",
      eventManagerId: data.eventManagerId ? Number(data.eventManagerId) : undefined,
      eventTypeId: data.eventTypeId ? Number(data.eventTypeId) : undefined,
      maxguestCapacity: data.maxguestCapacity ? Number(data.maxguestCapacity) : undefined,
      autoApprove: data.autoApprove,
    })

    setStep(2)
  }

  const handleCancel = () => {
    resetWizard()
    navigate("/events")
  }

  return (
    <div className={cn("p-6 rounded-2xl", isLight ? "bg-white shadow-sm" : "bg-[#111111] border border-white/10")}>
      <h2 className={cn("text-xl font-bold mb-6", isLight ? "text-[#0A2463]" : "text-white")}>
        Basic Information
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Name */}
          <div className="md:col-span-2">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Event Name"
                  placeholder="e.g., Annual Tech Conference 2026"
                  error={errors.name?.message}
                  className={cn(isLight ? "bg-[#f5f6f8] border-transparent" : "bg-white/5 border-transparent")}
                />
              )}
            />
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Location"
                  placeholder="e.g., Convention Center, New York"
                  error={errors.location?.message}
                  className={cn(isLight ? "bg-[#f5f6f8] border-transparent" : "bg-white/5 border-transparent")}
                />
              )}
            />
          </div>

          {/* Start Date */}
          <div>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <AppDatePicker
                  label="Start Date"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.startDate?.message}
                  className={cn(isLight ? "bg-[#f5f6f8] border-transparent" : "bg-white/5 border-transparent rounded-lg")}
                />
              )}
            />
          </div>

          {/* End Date — locked until Start Date is selected, min = startDate */}
          <div>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <AppDatePicker
                  label="End Date"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.endDate?.message}
                  disabled={!watchedStartDate}
                  disabledDates={watchedStartDate ? (date) => date < watchedStartDate : undefined}
                  className={cn(isLight ? "bg-[#f5f6f8] border-transparent" : "bg-white/5 border-transparent rounded-lg")}
                />
              )}
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  label="Description"
                  placeholder="Describe your event..."
                  error={errors.description?.message}
                  className={cn("min-h-[120px]", isLight ? "bg-[#f5f6f8] border-transparent" : "bg-white/5 border-transparent")}
                />
              )}
            />
          </div>

          {/* Event Category & Max Capacity */}
          <div className="md:col-span-2 flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              <Controller
                name="eventTypeId"
                control={control}
                render={({ field, fieldState }) => (
                  <AppSelect
                    label="Event Category"
                    options={categories}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select category..."
                    searchable
                    error={fieldState.error?.message}
                    className={cn(isLight ? "bg-[#f5f6f8] border-transparent" : "bg-white/5 border-transparent")}
                  />
                )}
              />
            </div>

            <div className="w-full md:w-1/2">
              <Controller
                name="maxguestCapacity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Max Guest Capacity"
                    placeholder="e.g., 200"
                    error={errors.maxguestCapacity?.message}
                    className={cn(isLight ? "bg-[#f5f6f8] border-transparent" : "bg-white/5 border-transparent")}
                  />
                )}
              />
            </div>
          </div>

          {/* Assign Event Manager */}
          <div className="md:col-span-2">
            <Controller
              name="eventManagerId"
              control={control}
              render={({ field, fieldState }) => (
                <ManagerSelect
                  label="Assign Event Manager"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Search and assign a manager..."
                  error={fieldState.error?.message}
                  className={cn(isLight ? "bg-[#f5f6f8] border-transparent" : "bg-white/5 border-transparent")}
                />
              )}
            />
          </div>

          {/* Auto Approve Checkbox */}
          <div className="md:col-span-2">
            <Controller
              name="autoApprove"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="auto-approve-checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 accent-[#e568f5] dark:accent-[#FFBF00] cursor-pointer"
                  />
                  <label
                    htmlFor="auto-approve-checkbox"
                    className={cn("text-sm font-medium cursor-pointer select-none", isLight ? "text-[#0A2463]" : "text-white")}
                  >
                    Registration Auto Approve
                  </label>
                  <span className={cn("text-xs", isLight ? "text-gray-400" : "text-gray-500")}>
                    (Automatically approve registrations without manual review)
                  </span>
                </div>
              )}
            />
          </div>

          {/* Banner Image — Drag & Drop */}
          <div className="md:col-span-2 space-y-2">
            <label className={cn("text-sm font-medium block", isLight ? "text-foreground" : "text-white")}>
              Banner Image
            </label>

            {previewUrl ? (
              <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
                <img
                  src={previewUrl}
                  alt="Banner preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={handleClearBanner}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                  aria-label="Remove banner image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className={cn("px-3 py-2 text-xs font-medium truncate", isLight ? "bg-gray-50 text-gray-600" : "bg-white/5 text-gray-400")}>
                  {bannerFile?.name}
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDropZoneDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex flex-col items-center justify-center gap-3 w-full h-40 rounded-xl border-2 border-dashed cursor-pointer transition-all",
                  isDragOver
                    ? (isLight ? "border-[#e568f5] bg-[#e568f5]/5" : "border-[#FFBF00] bg-[#FFBF00]/5")
                    : (isLight ? "border-gray-300 bg-gray-50 hover:border-[#e568f5] hover:bg-[#e568f5]/5" : "border-white/20 bg-white/5 hover:border-[#FFBF00] hover:bg-[#FFBF00]/5")
                )}
              >
                <UploadCloud
                  className={cn(
                    "w-8 h-8 transition-colors",
                    isDragOver
                      ? (isLight ? "text-[#e568f5]" : "text-[#FFBF00]")
                      : "text-gray-400"
                  )}
                />
                <div className="text-center">
                  <p className={cn("text-sm font-medium", isLight ? "text-gray-700" : "text-gray-300")}>
                    Drag & drop your banner image here
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    or <span className={cn("font-semibold", isLight ? "text-[#e568f5]" : "text-[#FFBF00]")}>click to browse</span> — PNG, JPG, WEBP (max 1 image)
                  </p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(file)
              }}
            />
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4 mt-6 border-t border-gray-100 dark:border-white/10">
          <AppButton
            type="button"
            variant="ghost"
            onClick={handleCancel}
            className={cn("px-6", isLight ? "text-gray-500 hover:text-gray-700" : "text-gray-400 hover:text-white")}
          >
            Cancel
          </AppButton>
          <AppButton
            type="submit"
            className={cn("px-8 rounded-full font-semibold", isLight ? "bg-[#e568f5] hover:bg-[#d04de0] text-white" : "bg-[#FFBF00] hover:bg-[#e6ac00] text-black")}
          >
            Next: Build Registration Form
          </AppButton>
        </div>
      </form>
    </div>
  )
}
