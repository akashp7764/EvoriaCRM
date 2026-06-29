import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { ENDPOINTS } from '@/services/apiUrls';
import { ApiResponse } from '@/types/api';
import {
  CreateOrUpdateFormPayload,
  FormDetail,
  FormSummary,
  ListActiveFormsParams,
  PaginatedFormsResponse,
} from '@/types/api/form';

/**
 * Form Management API Hooks
 */

// List Active Forms (Public) — supports pagination and type filter
export const useListActiveForms = (params?: ListActiveFormsParams) => {
  return useQuery({
    queryKey: ['forms', 'list', params],
    queryFn: async () => {
      const response = await api.get<ApiResponse<PaginatedFormsResponse>>(
        ENDPOINTS.forms.base,
        params
      );
      return response.data;
    },
  });
};

// Get Form Details (Public)
// Primary: path param /forms/:id — Fallback: query param /forms?id= when id is undefined
export const useGetFormDetails = (id?: string | number) => {
  return useQuery({
    queryKey: ['forms', 'detail', id],
    queryFn: async () => {
      const endpoint = id
        ? ENDPOINTS.forms.details(id)
        : ENDPOINTS.forms.base;
      const params = id ? undefined : { id };
      const response = await api.get<ApiResponse<FormDetail>>(endpoint, params);
      return response.data;
    },
    enabled: !!id,
  });
};

// Create or Update Form (Admin/Manager Only)
// Handles both REGISTRATION and FEEDBACK types via the `type` field in payload
export const useCreateOrUpdateForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateOrUpdateFormPayload) => {
      const response = await api.post<ApiResponse<FormSummary>>(
        ENDPOINTS.forms.base,
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms', 'list'] });
    },
  });
};

// Soft Delete Form (Admin/Manager Only)
export const useSoftDeleteForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      const response = await api.delete<ApiResponse<null>>(
        ENDPOINTS.forms.details(id)
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms', 'list'] });
    },
  });
};

// Get Registration Form Details by Event ID (Public — No Auth)
export const useGetRegFormDetailsByEventId = (eventId?: string) => {
  return useQuery({
    queryKey: ['forms', 'registration', eventId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<FormDetail>>(
        ENDPOINTS.forms.registrationByEvent(eventId!)
      );
      return response.data;
    },
    enabled: !!eventId,
    retry: false,
  });
};
