import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { DOMAIN_API_URI } from '@/services/apiConstants';
import { ENDPOINTS } from '@/services/apiUrls';
import { ApiResponse } from '@/types/api';
import { TicketScanParams, TicketScanResponse } from '@/types/api/ticket';

/**
 * Attendance / Ticket Scan API Hooks
 *
 * CRITICAL AUTH RULE (per Phase 8 spec):
 *   - Manager  (token in localStorage) → Authorization header is attached → BE marks attendance.
 *   - Public attendee (no token)        → No Authorization header          → BE returns ticket/feedback data only.
 *
 * WHY a dedicated axios call instead of the shared api.ts wrapper:
 *   The shared api.ts response interceptor calls globalLogout() on any 401,
 *   which would incorrectly redirect a public attendee browsing their ticket.
 *   This hook uses a raw axios instance so it can read the token conditionally
 *   and handle errors without triggering the app-wide logout side-effect.
 */

const buildScanHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const useScanAttendance = () => {
  return useMutation({
    mutationFn: async (params: TicketScanParams): Promise<TicketScanResponse> => {
      const response = await axios.get<ApiResponse<TicketScanResponse>>(
        `${DOMAIN_API_URI}${ENDPOINTS.ticket.scan}`,
        {
          params: {
            eventId: params.eventId,
            registrationId: params.registrationId,
            memberId: params.memberId,
          },
          headers: {
            'Content-Type': 'application/json',
            ...buildScanHeaders(),
          },
        },
      );

      const body = response.data;

      // Mirror the shared interceptor's rid-based error handling without globalLogout
      if (body.rid?.startsWith('e-')) {
        throw new Error(body.message || 'A backend error occurred.');
      }

      return body.data;
    },
  });
};
