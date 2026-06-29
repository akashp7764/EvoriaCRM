/**
 * API Types
 * Standard interfaces for backend data payloads.
 */

export interface ApiResponse<T = any> {
  rid: string; // Response ID (e-* for error, s-* for success)
  message: string;
  data: T;
  status: number;
}

export interface ApiError {
  rid: string;
  message: string;
  data?: any;
  status: number;
}
