import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { ENDPOINTS } from '@/services/apiUrls';
import { ApiResponse } from '@/types/api';
import { 
  LoginRequest, 
  ForgotPasswordRequest, 
  VerifyOtpRequest, 
  ResetPasswordRequest, 
  ChangePasswordRequest, 
  RegisterManagerRequest, 
  DeleteUserRequest,
  GetManagersRequest,
  GetManagersResponse
} from '@/types/auth';

/**
 * Authentication & User Management API Hooks
 */

// Login
export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const response = await api.post<ApiResponse>(ENDPOINTS.auth.login, data);
      // Store token and user data on success
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    },
  });
};

// Logout
export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await api.post<ApiResponse>(ENDPOINTS.auth.logout);
      // Clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return response.data;
    },
    onSuccess: () => {
      window.location.href = '/login';
    }
  });
};

// Forgot Password
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest) => {
      const response = await api.post<ApiResponse>(ENDPOINTS.auth.forgotPassword, data);
      return response.data;
    },
  });
};

// Verify OTP
export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: async (data: VerifyOtpRequest) => {
      const response = await api.post<ApiResponse>(ENDPOINTS.auth.verifyOtp, data);
      return response.data;
    },
  });
};

// Reset Password
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      const response = await api.post<ApiResponse>(ENDPOINTS.auth.resetPassword, data);
      return response.data;
    },
  });
};

// Change Password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      const response = await api.post<ApiResponse>(ENDPOINTS.auth.changePassword, data);
      return response.data;
    },
  });
};

// Register Manager (Admin)
export const useRegisterManager = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: RegisterManagerRequest) => {
      const response = await api.post<ApiResponse>(ENDPOINTS.auth.registerManager, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usersList'] });
      queryClient.invalidateQueries({ queryKey: ['managersList'] });
    },
  });
};

// Delete User (Admin)
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: DeleteUserRequest) => {
      const response = await api.delete<ApiResponse>(ENDPOINTS.auth.deleteUser, data); // DELETE with body depends on backend expectation, Postman showed body
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usersList'] });
      queryClient.invalidateQueries({ queryKey: ['managersList'] });
    },
  });
};

// Fetch Managers (Admin) — paginated
export const useGetManagers = (params: GetManagersRequest) => {
  return useQuery({
    queryKey: ['managersList', params],
    queryFn: async () => {
      const response = await api.get<ApiResponse<GetManagersResponse>>(ENDPOINTS.users.managers, params);
      return response.data;
    },
  });
};

// Search Managers (Admin) — live search with a query string, returns flat Manager[]
export const useSearchManagers = (search: string) => {
  return useQuery({
    queryKey: ['managersSearch', search],
    queryFn: async () => {
      const response = await api.get<ApiResponse<GetManagersResponse>>(
        ENDPOINTS.users.managers,
        { page: 1, limit: 20, ...(search ? { search } : {}) }
      );
      return response.data?.managers ?? [];
    },
    enabled: true,
    staleTime: 30_000,
  });
};

// Fetch All Managers (Admin) — paginates until the response managers array is empty
export const useGetAllManagers = () => {
  return useQuery({
    queryKey: ['managersAll'],
    queryFn: async () => {
      const allManagers: GetManagersResponse['managers'] = [];
      let page = 1;
      const limit = 50;

      while (true) {
        const response = await api.get<ApiResponse<GetManagersResponse>>(
          ENDPOINTS.users.managers,
          { page, limit }
        );
        const batch = response.data?.managers ?? [];
        if (batch.length === 0) break;
        allManagers.push(...batch);
        if (batch.length < limit) break;
        page += 1;
      }

      return allManagers;
    },
    staleTime: 60_000,
  });
};
