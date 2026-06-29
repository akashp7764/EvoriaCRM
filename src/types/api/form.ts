/**
 * Form Management Types
 * Strict TypeScript interfaces for all Form module payloads and responses.
 */

// ---------------------------------------------------------------------------
// Enums & Field Primitives
// ---------------------------------------------------------------------------

export type FormType = 'REGISTRATION' | 'FEEDBACK';

export type FormFieldType = 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'email';

export interface FormField {
  name: string;
  label: string;
  type: FormFieldType;
  required: boolean;
  options?: string[];
}

export interface FormSchema {
  title: string;
  description?: string;
  fields: FormField[];
}

// ---------------------------------------------------------------------------
// Request Payloads
// ---------------------------------------------------------------------------

export interface CreateOrUpdateFormPayload {
  eventId: number;
  type: FormType;
  schema: FormSchema;
}

export interface ListActiveFormsParams {
  page?: number;
  limit?: number;
  type?: string;
  id?: number;
}

// ---------------------------------------------------------------------------
// Response Shapes
// ---------------------------------------------------------------------------

export interface FormSummary {
  id: number;
  eventId: number;
  type: FormType;
  version: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FormDetail extends FormSummary {
  schema: FormSchema;
  createdBy?: string;
  deletedAt?: string | null;
}

export interface PaginatedFormsResponse {
  forms: FormSummary[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}
