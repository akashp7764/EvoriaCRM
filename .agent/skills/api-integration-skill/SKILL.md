---
name: api-integration
description: Use for API endpoints, DTOs, and error handling.
---
# API Skill Logic - Architecture & Data Fetching Setup

This project uses **Axios** (for the HTTP transport layer) and **TanStack Query** (for React server state, caching, and loading management).

We strictly use a modern hook-based architecture. Do NOT use class-based API wrappers and do NOT use Redux for loading/error states. Follow the exact folder structure and implementation rules below.

---

## 1. Folder Structure

All core API configurations live in the `src/services/` directory. All data fetching hooks live in `src/hooks/api/`.

---

## 2. File Implementation Rules

### A. `services/apiConstants.ts`
* **Purpose:** This is the ONLY file allowed to read from environment variables (`import.meta.env`).
* **Implementation:** Export your base URLs here (e.g., `DOMAIN_API_URI`, `REPORT_DOMAIN_API_URI`). Do not read `.env` files directly in components or inside Axios instances.

### B. `services/apiUrls.ts`
* **Purpose:** A single source of truth for all API endpoint strings.
* **Rule:** You are strictly forbidden from hardcoding URL strings inside TanStack Query hooks or Axios calls. 
* **Format:** Export grouped constant objects.
  * *Example:* `export const ENDPOINTS = { auth: { login: '/auth/login' }, reports: { download: '/report/download' } };`

* **The Whitelist (NO TOKEN REQUIRED):** Define an array of unprotected routes at the top of the file: 
  `const UNPROTECTED_ROUTES = ['/login', '/logout', '/forgot-password', '/reset-password', '/verify-otp'];`
* **Request Interceptor Logic:** Before making the API call, check if the `endpoint` matches any string in the `UNPROTECTED_ROUTES` array.
  * If it **DOES** match: Do not attach an Authorization header.
  * If it **DOES NOT** match: Retrieve the token from `localStorage.getItem('token')` and attach it as `Authorization: Bearer <token>`.

---

## Postman Collection Processing Protocol

1. **Strict Method Usage:** When writing the fetcher function, you MUST strictly use the common wrapper methods exported from `api.ts` (i.e., `api.get()`, `api.post()`, `api.put()`, `api.patch()`, `api.delete()`). You are strictly forbidden from writing raw `fetch()` or `axios()` calls inside any custom hook.

2. **Extract Typings First:**
   * Review the `request.body` and `response` arrays in the Postman JSON for every endpoint.
   * Generate strict TypeScript interfaces for all payloads and responses. 
   * Save these interfaces in a dedicated types file (e.g., `src/types/api/[ModuleName].ts`). Do NOT use `any`.

3. **Module Mapping (Folder to File):**
   * Look at the Postman folder structure. Map each root folder in Postman to a specific hook file in `src/hooks/api/`. 
   * *Example:* If the Postman folder is named "Inventory Management", create `inventoryAPIHooks.ts`.

4. **URL Variable Translation (`apiUrls.ts`):**
   * Translate Postman path variables (like `/users/:id` or `/users/{{userId}}`) into functions inside `apiUrls.ts` that accept arguments.
   * *Example:* Instead of hardcoding the ID, write: `getUser: (id: string) => \`/users/\${id}\``

5. **Query Key Standardization:**
   * When generating `useQuery` hooks, standardise the `queryKey` array using the module name, endpoint intent, and any dynamic variables.
   * *Example:* `queryKey: ['users', 'detail', userId]`

---
**Example Implementation:**
```
typescript
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { ENDPOINTS } from '@/services/apiUrls';

const fetchUserData = async () => {
  return await api.get(ENDPOINTS.users.profile);
};

export const useGetUserData = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserData,
  });
};
```