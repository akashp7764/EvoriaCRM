# Manager Role & Management Dashboard
**Goal:** Implement Role-Based Access Control (RBAC), build the Manager listing page, and create the "Add Manager" workflow using strictly reusable components.

## 1. Constants & Navigation Setup (Mandatory Pre-Flight)
* **Constants:** Check for or create `src/constants/roles.ts`. Define: `ADMIN`, `EVENT_MANAGER`, and `USER`. 
* **Navigation:** Add "Managers" to the Sidebar Navigation array. 
* **Route Security:** The `/managers` route MUST be protected. If the user's role (e.g., from `auth-store` or API) is not `ADMIN`, redirect them to the Dashboard.

## 2. Reusable Component Strategy (CRITICAL CONSTRAINT)
You are strictly forbidden from writing inline modal or pagination logic directly inside the `ManagersPage.tsx` file. 
Before building the page, check `src/components/controls/`. If the following components do not exist, you MUST build them as separate files first:
* `AppPagination.tsx`: Must accept `currentPage`, `totalPages`, and `onPageChange` props.
* `AppModal.tsx` (or `AppDialog.tsx`): Must be a reusable wrapper (using Shadcn or Tailwind) accepting `isOpen`, `onClose`, `title`, and `children` props.
* When building the UI, you MUST import and use `TextField`, `AppButton`, `AppModal`, and `AppPagination` from `src/components/controls/`.

## 3. API Hook Implementation (`authAPIHooks.ts`)
Implement the required API hooks:
* **Fetch Managers:** `useGetManagers` calls `GET /users/managers`. Accepts parameters: `{ page: number, limit: number, search: string }`.
* **Mutations:** `useCreateManager` (POST) and `useDeleteManager` (DELETE). Ensure they invalidate the `useGetManagers` cache on success.

## 4. Strict Data Flow & State Management (The Dashboard)
Build `src/pages/Managers/ManagersPage.tsx` rendering inside the existing `DashboardLayout`.
* **State Variables:** `page` (default: 1), `limit` (default: 10), and `search` (default: empty string).
* **Search Debounce:** The `search` input MUST be debounced by 500ms before triggering the API fetch.
* **The Trigger:** Whenever `page` or debounced `search` changes, `useGetManagers` must re-fetch. 

## 5. UI/UX Layout (The Dashboard Grid)
Match the `rounded-2xl`, `bg-white dark:bg-black`, and `p-6` theme.
* **Page Header:** Flex container (`items-center justify-between`). Left: "Managers" (`text-2xl font-bold`). Right: "Create Manager" solid button.
* **Filters Section:** A `TextField` search bar (`mb-6`).
* **Data Display:** Render managers in a list or table. Show Name, Email, Role, and a "Delete" action button (Trash icon, red). Add a confirmation prompt before executing delete.
* **Pagination:** Render the `<AppPagination />` component at the bottom, passing the API's total pages and local `page` state.

## 6. Create Manager Form (The Modal)
When "Create Manager" is clicked, render the form inside the `<AppModal />` component.
* **Zod Schema:** Name (min 3), Email (valid email), Password (min 6), and Confirm Password.
* **Validation Strictness:** You MUST use Zod's `.refine()` to ensure `password` and `confirmPassword` match perfectly.
* **UI Assembly:** Use React Hook Form `<Controller>` with `<TextField>`. 
* **API Payload:** Drop the `confirmPassword` field before submitting. The payload MUST strictly be: `{ name, email, password }`.
* **Success Flow:** On success, close the modal, show a toast, and reset the form.