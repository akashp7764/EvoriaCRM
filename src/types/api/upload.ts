/**
 * Upload API Types
 */

export interface PresignedUrlRequest {
  fileName: string;
  contentType: string;
}

export interface PresignedUrlResponse {
  url: string;
  key: string;
}
