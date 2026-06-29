import { useMutation } from '@tanstack/react-query';
import api from '@/services/api';
import { ENDPOINTS } from '@/services/apiUrls';
import { ApiResponse } from '@/types/api';
import { PresignedUrlRequest, PresignedUrlResponse } from '@/types/api/upload';

/**
 * Uploads API Hooks
 * Handles S3 presigned URL generation for file uploads.
 */

const fetchPresignedUrl = async (
  payload: PresignedUrlRequest
): Promise<PresignedUrlResponse> => {
  const response = await api.post<ApiResponse<PresignedUrlResponse>>(
    ENDPOINTS.uploads.presignedUrl,
    payload
  );
  return response.data;
};

export const useGetPresignedUrl = () => {
  return useMutation({
    mutationFn: fetchPresignedUrl,
  });
};
