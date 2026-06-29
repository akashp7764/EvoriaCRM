# Phase 1: Events Dashboard & Data Grid
**Goal:** Build the main Events listing page with API integration, dynamic filtering, pagination, and premium styling.

## 1. Mandatory Pre-Flight (CRITICAL APP SHELL CONTEXT)
* **The `DashboardLayout` is ALREADY BUILT.** Do NOT build the sidebar or top header. The `EventsPage.tsx` must render inside the `<Outlet />`.
* Read `@.agent/rules/core-rules.md` for information and style. 
* Use `rounded-2xl`, `p-6`, and `bg-white dark:bg-black` for all cards to match the existing dashboard theme.

## 2. Strict Data Flow & API Management (DO NOT SKIP)
You must implement a dynamic, parameter-driven data fetching strategy. Do NOT hardcode filter options.

* **API Call 1 (Categories):** On component mount, call the API to fetch Event Categories. Use this dynamic response to populate the "Type" `<AppSelect>` dropdown.
* **API Call 2 (Events List):** The main event fetching function MUST accept a parameters object. 
* **State Management:** You must maintain state (or use URL Search Params) for the following variables:
    * `page` (default: 1)
    * `limit` (default: 10)
    * `eventTypeId` (default: empty/all. This ID comes from the dynamic Category dropdown).
    * `search` (default: empty string from search bar). **MUST BE DEBOUNCED by 500ms before triggering API.**
    * `isPast` (default: false. API accepts values: true or false).
    * `sort` (default: 'createdAt:desc').

* **The Trigger:** Whenever `page`, `limit`, `eventTypeId`, the debounced `search`, `sort`, or `isPast` changes, the Events API must re-fetch using those exact keys as query parameters. **Analyze the API response to extract total pages/count for the pagination UI.**

## 3. UI/UX Layout & Alignment
* **Page Header:** Flex container (`items-center justify-between`). Left: "Events" (`text-2xl font-bold`). Right: "Create Event" solid button.
* **Filters Section (`mb-6 flex gap-4 flex-wrap`):**
    * *Search Bar:* `TextField` component.
    * *Type Filter:* `AppSelect` populated by API Call 1.
    * *Status Filter:* `AppSelect` (Options: All, Active, Past - mapping to the active/inactive API values).
    * *Sort Filter:* `AppSelect` (Options: Newest First, Oldest First).
* **Data Display:** Render the events in a responsive grid (`grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6`). Show loading skeletons while fetching.
* **Pagination Footer:** Below the grid, implement a standard pagination control (Previous / Next buttons, Current Page indicator). Disable "Previous" on page 1. Disable "Next" if the current page equals the total pages returned by the API.

## 4. Component Strategy
* Rely on `src/components/common/` and `src/components/controls/` for inputs, cards, filters, pagination and buttons.
* If a Pagination component does not exist, build a clean, simple one reusable for multiple pages using Tailwind flexbox inside `src/components/common/`.