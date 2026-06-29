import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { ENDPOINTS } from '@/services/apiUrls';
import { ApiResponse } from '@/types/api';
import { 
  RegisterEventRequest, 
  UpdateRegistrationStatusRequest, 
  SubmitFeedbackRequest, 
  ScanAttendanceRequest 
} from '@/types/registration';

export interface SendOTPPayload {
  email: string;
  number: string;
}

/**
 * Registration & Attendance API Hooks
 */

// Send OTP for Email Verification (Public — No Auth)
export const useSendOTPVerification = () => {
  return useMutation({
    mutationFn: async (payload: SendOTPPayload) => {
      const response = await api.post<ApiResponse<null>>(ENDPOINTS.otp.send, payload);
      return response.data;
    },
  });
};

// Register for Event (Public)
export const useRegisterForEvent = (eventId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: RegisterEventRequest) => {
      const response = await api.post<ApiResponse>(ENDPOINTS.registrations.base(eventId), data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrationsList', eventId] });
      queryClient.invalidateQueries({ queryKey: ['eventCapacity', eventId] });
    },
  });
};

// List Registrations for Event (Admin/Manager)
export const useGetRegistrations = (eventId: string | number, params?: any) => {
  return useQuery({
    queryKey: ['registrationsList', eventId, params],
    queryFn: async () => {
      const response = await api.get<ApiResponse>(ENDPOINTS.registrations.base(eventId), params);
      return response.data;
    },
    enabled: !!eventId,
  });
};

// Get Registration Details
export const useGetRegistrationDetails = (id: string | number) => {
  return useQuery({
    queryKey: ['registrationDetails', id],
    queryFn: async () => {
      const response = await api.get<ApiResponse>(ENDPOINTS.registrations.details(id));
      return response.data;
    },
    enabled: !!id,
  });
};

// Update Registration Status
export const useUpdateRegistrationStatus = (id: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateRegistrationStatusRequest) => {
      const response = await api.patch<ApiResponse>(ENDPOINTS.registrations.status(id), data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrationDetails', id] });
      queryClient.invalidateQueries({ queryKey: ['registrationsList'] });
    },
  });
};

// Scan Attendance QR
export const useScanAttendance = () => {
  return useMutation({
    mutationFn: async (data: ScanAttendanceRequest) => {
      const response = await api.post<ApiResponse>(ENDPOINTS.attendance.scan, data);
      return response.data;
    },
  });
};

// Submit Feedback
export const useSubmitFeedback = (registrationId: string | number) => {
  return useMutation({
    mutationFn: async (data: SubmitFeedbackRequest) => {
      const response = await api.post<ApiResponse>(ENDPOINTS.registrations.feedback(registrationId), data);
      return response.data;
    },
  });
};

// List Feedback for Event
export const useGetEventFeedback = (eventId: string | number, params?: any) => {
  return useQuery({
    queryKey: ['eventFeedback', eventId, params],
    queryFn: async () => {
      const response = await api.get<ApiResponse>(ENDPOINTS.events.feedback(eventId), params);
      return response.data;
    },
    enabled: !!eventId,
  });
};
