/**
 * API Constants
 * This is the ONLY file allowed to read from environment variables.
 */

export const DOMAIN_API_URI = import.meta.env.VITE_API_BASE_URL ?? '';

// Add other base URIs here if needed
// export const REPORT_DOMAIN_API_URI = import.meta.env.VITE_REPORT_API_BASE_URL;
