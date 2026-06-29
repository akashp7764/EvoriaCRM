/**
 * API Endpoints
 * Single source of truth for all API endpoint strings.
 */

export const ENDPOINTS = {
  auth: {
    login: '/api/v1/login',
    logout: '/api/v1/logout',
    forgotPassword: '/api/v1/forgot-password',
    verifyOtp: '/api/v1/verify-otp',
    resetPassword: '/api/v1/reset-password',
    changePassword: '/api/v1/change-password',
    registerManager: '/api/v1/register-manager',
    deleteUser: '/api/v1/delete-user',
  },
  users: {
    managers: '/api/v1/users/managers',
    managerDetail: (id: string | number) => `/api/v1/users/managers/${id}`,
  },
  events: {
    base: '/api/v1/events',
    details: (id: string | number) => `/api/v1/events/${id}`,
    types: '/api/v1/events/types',
    capacity: (id: string | number) => `/api/v1/events/${id}/capacity`,
    registrationQr: (id: string | number) => `/api/v1/events/${id}/registration-qr`,
    feedback: (eventId: string | number) => `/api/v1/events/${eventId}/feedback`,
  },
  registrations: {
    base: (eventId: string | number) => `/api/v1/events/${eventId}/registrations`,
    details: (id: string | number) => `/api/v1/registrations/${id}`,
    status: (id: string | number) => `/api/v1/registrations/${id}/status`,
    feedback: (registrationId: string | number) => `/api/v1/registrations/${registrationId}/feedback`,
  },
  attendance: {
    scan: '/api/v1/attendance/scan', // legacy — kept for reference
  },
  ticket: {
    scan: '/api/v1/ticket/scan',
  },
  reports: {
    summary: (eventId: string | number) => `/api/v1/reports/${eventId}/summary`,
    attendance: (eventId: string | number) => `/api/v1/reports/${eventId}/attendance`,
    export: (eventId: string | number) => `/api/v1/reports/${eventId}/export`,
  },
  uploads: {
    presignedUrl: '/api/v1/uploads/presigned-url',
  },
  forms: {
    base: '/api/v1/forms',
    details: (id: string | number) => `/api/v1/forms/${id}`,
    registrationByEvent: (eventId: string | number) => `/api/v1/forms/registration/${eventId}`,
  },
  otp: {
    send: '/api/v1/otp/send',
  },
};
