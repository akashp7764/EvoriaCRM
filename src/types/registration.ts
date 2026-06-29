import { z } from 'zod';

/**
 * Registration & Feedback Schemas & Types
 */

// Register for Event
export const registerEventSchema = z.object({
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Invalid phone number'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  formData: z.object({
    name: z.string().min(2),
    company: z.string().optional(),
  }).passthrough(), // Allow extra fields in formData
});
export type RegisterEventRequest = z.infer<typeof registerEventSchema>;

// Update Registration Status
export const updateRegistrationStatusSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
});
export type UpdateRegistrationStatusRequest = z.infer<typeof updateRegistrationStatusSchema>;

// Submit Feedback
export const submitFeedbackSchema = z.object({
  formId: z.number(),
  answers: z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
  }).passthrough(),
});
export type SubmitFeedbackRequest = z.infer<typeof submitFeedbackSchema>;

// Scan Attendance QR
export const scanAttendanceSchema = z.object({
  registrationId: z.number(),
  memberId: z.number(),
  signature: z.string(),
});
export type ScanAttendanceRequest = z.infer<typeof scanAttendanceSchema>;
