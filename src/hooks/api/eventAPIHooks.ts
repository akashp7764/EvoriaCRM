import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { ENDPOINTS } from '@/services/apiUrls';
import { ApiResponse } from '@/types/api';
import { 
  CreateEventRequest, 
  UpdateEventRequest, 
  EventTypeRequest, 
  EventListParams 
} from '@/types/event';

/**
 * Event Management API Hooks
 */

// List Events
export const useGetEvents = (params?: EventListParams) => {
  return useQuery({
    queryKey: ['eventsList', params],
    queryFn: async () => {
      const response = await api.get<ApiResponse>(ENDPOINTS.events.base, params);
      return response.data;
    },
  });
};

// Create Event
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateEventRequest) => {
      const response = await api.post<ApiResponse>(ENDPOINTS.events.base, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventsList'] });
    },
  });
};

// Get Event Details
export const useGetEventDetails = (id: string | number) => {
  return useQuery({
    queryKey: ['eventDetails', id],
    queryFn: async () => {
      const response = await api.get<ApiResponse>(ENDPOINTS.events.details(id));
      return response.data;
    },
    enabled: !!id,
  });
};

// Update Event
export const useUpdateEvent = (id: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateEventRequest) => {
      const response = await api.patch<ApiResponse>(ENDPOINTS.events.details(id), data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventsList'] });
      queryClient.invalidateQueries({ queryKey: ['eventDetails', id] });
    },
  });
};

// Delete Event
export const useDeleteEvent = (id: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await api.delete<ApiResponse>(ENDPOINTS.events.details(id));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventsList'] });
    },
  });
};

// List Event Types
export const useGetEventTypes = () => {
  return useQuery({
    queryKey: ['eventTypes'],
    queryFn: async () => {
      const response = await api.get<ApiResponse>(ENDPOINTS.events.types);
      return response.data;
    },
  });
};

// Create/Update Event Type (Admin)
export const useSaveEventType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: EventTypeRequest) => {
      const response = await api.post<ApiResponse>(ENDPOINTS.events.types, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventTypes'] });
    },
  });
};

// Get Remaining Capacity
export const useGetEventCapacity = (id: string | number) => {
  return useQuery({
    queryKey: ['eventCapacity', id],
    queryFn: async () => {
      const response = await api.get<ApiResponse>(ENDPOINTS.events.capacity(id));
      return response.data;
    },
    enabled: !!id,
  });
};

// Get Registration QR
export const useGetRegistrationQr = (id: string | number) => {
  return useQuery({
    queryKey: ['eventRegistrationQr', id],
    queryFn: async () => {
      const response = await api.get<ApiResponse>(ENDPOINTS.events.registrationQr(id));
      return response.data;
    },
    enabled: !!id,
  });
};
