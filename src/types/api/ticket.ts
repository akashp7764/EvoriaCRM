/**
 * Ticket / Attendance Scan Types
 * Strict TypeScript interfaces for the /api/v1/ticket/scan response.
 */

import { FormSchema } from '@/types/api/form';

// ---------------------------------------------------------------------------
// Request
// ---------------------------------------------------------------------------

export interface TicketScanParams {
  eventId: string | number;
  registrationId: string | number;
  memberId: string | number;
}

// ---------------------------------------------------------------------------
// Response — member detail returned on every scan
// ---------------------------------------------------------------------------

export interface TicketMember {
  id: number;
  name: string;
  /** Base64-encoded QR code PNG */
  qrCode: string;
  isAttended: boolean;
}

// ---------------------------------------------------------------------------
// Response — shape for an active-event scan (attendee digital badge)
// ---------------------------------------------------------------------------

export interface ActiveTicketData {
  isEventCompleted: false;
  eventId: number;
  registrationId: number;
  member: TicketMember;
}

// ---------------------------------------------------------------------------
// Response — shape for a post-event scan (feedback form)
// ---------------------------------------------------------------------------

export interface CompletedTicketData {
  isEventCompleted: true;
  eventId: number;
  registrationId: number;
  member: TicketMember;
  feedbackForm: {
    id: number;
    schema: FormSchema;
  };
}

// ---------------------------------------------------------------------------
// Union — what useScanAttendance actually receives
// ---------------------------------------------------------------------------

export type TicketScanResponse = ActiveTicketData | CompletedTicketData;
