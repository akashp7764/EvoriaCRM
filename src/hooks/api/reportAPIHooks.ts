import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/services/api';
import { ENDPOINTS } from '@/services/apiUrls';
import { ApiResponse } from '@/types/api';

/**
 * Reports & Uploads API Hooks
 */

// Get Event Summary
export const useGetEventSummary = (eventId: string | number) => {
  return useQuery({
    queryKey: ['eventSummary', eventId],
    queryFn: async () => {
      const response = await api.get<ApiResponse>(ENDPOINTS.reports.summary(eventId));
      return response.data;
    },
    enabled: !!eventId,
  });
};

// Get Attendance Report
export const useGetAttendanceReport = (eventId: string | number, params?: any) => {
  return useQuery({
    queryKey: ['attendanceReport', eventId, params],
    queryFn: async () => {
      const response = await api.get<ApiResponse>(ENDPOINTS.reports.attendance(eventId), params);
      return response.data;
    },
    enabled: !!eventId,
  });
};

// Export Report (Excel)
export const useExportReport = (eventId: string | number, type: 'attendance' | 'registrations' = 'attendance') => {
  return useMutation({
    mutationFn: async () => {
      // For file downloads, we might need a different approach (e.g., window.open or blob handling)
      // But we'll implement it as an API call for now as per Postman
      const response = await api.get<any>(ENDPOINTS.reports.export(eventId), { type });
      return response;
    },
  });
};

// Get Pre-signed Upload URL
export const useGetPresignedUrl = () => {
  return useMutation({
    mutationFn: async (data: { fileName: string; contentType: string }) => {
      const response = await api.post<ApiResponse>(ENDPOINTS.uploads.presignedUrl, data);
      return response.data;
    },
  });
};
