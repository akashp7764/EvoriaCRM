import { z } from 'zod';

/**
 * Event Schemas & Types
 */

// Create Event
export const createEventSchema = z.object({
  eventTypeId: z.number(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  maxguestCapacity: z.number().positive(),
  eventManagerId: z.number(),
  autoApprove: z.boolean().default(true),
});
export type CreateEventRequest = z.infer<typeof createEventSchema>;

// Update Event (All fields optional)
export const updateEventSchema = createEventSchema.partial();
export type UpdateEventRequest = z.infer<typeof updateEventSchema>;

// Event Type (Note: 'discription' spelling matches Postman/Backend)
export const eventTypeSchema = z.object({
  name: z.string().min(2),
  discription: z.string().optional(),
});
export type EventTypeRequest = z.infer<typeof eventTypeSchema>;

// Event List Params
export const eventListParamsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  eventTypeId: z.union([z.string(), z.number()]).optional(),
  search: z.string().optional(),
  isPast: z.boolean().optional(),
  status: z.string().optional(),
  sort: z.string().optional(),
});
export type EventListParams = z.infer<typeof eventListParamsSchema>;
