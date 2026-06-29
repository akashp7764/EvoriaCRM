import { z } from 'zod';

/**
 * Authentication Schemas & Types
 */

// Login
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type LoginRequest = z.infer<typeof loginSchema>;

// Forgot Password
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;

// Verify OTP
export const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});
export type VerifyOtpRequest = z.infer<typeof verifyOtpSchema>;

// Reset Password
export const resetPasswordSchema = z.object({
  resetToken: z.string(),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;

// Change Password
export const changePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>;

// Register Manager (Admin Only)
export const registerManagerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
export type RegisterManagerRequest = z.infer<typeof registerManagerSchema>;

// Delete User (Admin Only)
export const deleteUserSchema = z.object({
  targetUserId: z.number(),
});
export type DeleteUserRequest = z.infer<typeof deleteUserSchema>;

// Manager Interface
export interface Manager {
  userId : number;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

// Get Managers Request Params
export interface GetManagersRequest {
  page: number;
  limit: number;
  search?: string;
}

// Get Managers Response Payload
export interface GetManagersResponse {
  managers: Manager[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

