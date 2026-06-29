import { Control, Controller, FieldValues, Path } from "react-hook-form"
import { TextField } from "@/components/controls/text-field"
import { TextArea } from "@/components/controls/text-area"
import { AppSelect } from "@/components/controls/app-select"
import { AppRadioGroup } from "@/components/controls/app-radio-group"
import { AppCheckbox } from "@/components/controls/app-checkbox"
import { FormField, FormFieldType } from "@/types/api/form"

// ---------------------------------------------------------------------------
// Type helpers
// ---------------------------------------------------------------------------

/**
 * The subset of `FormField` types that `renderFormFields` can render.
 * Extend this union as the backend introduces new field types.
 */
const SUPPORTED_TYPES: FormFieldType[] = [
  "text",
  "email",
  "number",
  "textarea",
  "select",
  "radio",
  "checkbox",
  "date",
]

interface RenderFormFieldsOptions<T extends FieldValues> {
  /** The `fields` array from `schema.fields` returned by the API. */
  fields: FormField[]
  /** The `control` object from `useForm<T>()`. */
  control: Control<T>
  /**
   * Optional key prefix for the form path.
   * Defaults to `"formData"` so values are collected under `formData.<fieldName>`.
   * Pass `""` to register at the root level.
   */
  pathPrefix?: string
  /** When true, all fields are rendered as disabled. */
  disabled?: boolean
}

// ---------------------------------------------------------------------------
// Helper: build `<option>` tuples from the `options: string[]` array
// ---------------------------------------------------------------------------

function toSelectOptions(raw?: string[]) {
  return (raw ?? []).map((opt) => ({ label: opt, value: opt }))
}

// ---------------------------------------------------------------------------
// Core renderer
// ---------------------------------------------------------------------------

/**
 * `renderFormFields` — iterates the API `schema.fields` array in order and
 * renders the matching control component via `<Controller>`.
 *
 * Usage (inside a `react-hook-form` form):
 * ```tsx
 * const { control } = useForm<MyFormValues>()
 * renderFormFields({ fields: schema.fields, control })
 * ```
 */
function renderFormFields<T extends FieldValues>({
  fields,
  control,
  pathPrefix = "formData",
  disabled = false,
}: RenderFormFieldsOptions<T>) {
  if (!fields?.length) return null

  return fields
    .filter((field) => SUPPORTED_TYPES.includes(field.type))
    .map((field) => {
      const fieldPath = pathPrefix
        ? (`${pathPrefix}.${field.name}` as Path<T>)
        : (field.name as Path<T>)

      switch (field.type) {
        case "textarea":
          return (
            <Controller
              key={field.name}
              name={fieldPath}
              control={control}
              rules={{ required: field.required ? `${field.label} is required` : false }}
              render={({ field: rhfField, fieldState }) => (
                <TextArea
                  {...rhfField}
                  id={`field-${field.name}`}
                  label={field.label}
                  placeholder={`Enter ${field.label.toLowerCase()}…`}
                  disabled={disabled}
                  error={fieldState.error?.message}
                />
              )}
            />
          )

        case "select":
          return (
            <Controller
              key={field.name}
              name={fieldPath}
              control={control}
              rules={{ required: field.required ? `${field.label} is required` : false }}
              render={({ field: rhfField, fieldState }) => (
                <AppSelect
                  label={field.label}
                  options={toSelectOptions(field.options)}
                  value={rhfField.value ?? ""}
                  onChange={rhfField.onChange}
                  placeholder={`Select ${field.label.toLowerCase()}…`}
                  disabled={disabled}
                  error={fieldState.error?.message}
                />
              )}
            />
          )

        case "radio":
          return (
            <Controller
              key={field.name}
              name={fieldPath}
              control={control}
              rules={{ required: field.required ? `${field.label} is required` : false }}
              render={({ field: rhfField, fieldState }) => (
                <AppRadioGroup
                  label={field.label}
                  options={toSelectOptions(field.options)}
                  value={rhfField.value ?? ""}
                  onValueChange={rhfField.onChange}
                  disabled={disabled}
                  error={fieldState.error?.message}
                />
              )}
            />
          )

        case "checkbox":
          return (
            <Controller
              key={field.name}
              name={fieldPath}
              control={control}
              rules={{ required: field.required ? `${field.label} is required` : false }}
              render={({ field: rhfField, fieldState }) => (
                <AppCheckbox
                  ref={rhfField.ref}
                  id={`field-${field.name}`}
                  label={field.label}
                  checked={!!rhfField.value}
                  onCheckedChange={rhfField.onChange}
                  disabled={disabled}
                  error={fieldState.error?.message}
                />
              )}
            />
          )

        // "text" | "email" | "number" | "date" — all map to <TextField>
        default:
          return (
            <Controller
              key={field.name}
              name={fieldPath}
              control={control}
              rules={{ required: field.required ? `${field.label} is required` : false }}
              render={({ field: rhfField, fieldState }) => (
                <TextField
                  {...rhfField}
                  id={`field-${field.name}`}
                  type={field.type === "email" ? "email" : field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                  label={field.label}
                  placeholder={`Enter ${field.label.toLowerCase()}…`}
                  disabled={disabled}
                  error={fieldState.error?.message}
                />
              )}
            />
          )
      }
    })
}

export { renderFormFields }
export type { RenderFormFieldsOptions }
