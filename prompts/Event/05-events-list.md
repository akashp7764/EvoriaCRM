# Phase 6: Event Creation Flow Updates (Category & Sequential Form Submit)
**Goal:** Update the existing Event Creation Wizard to include a dynamic Event Category field and refactor the final submission to use a sequential, two-step API flow.

## 1. Update Step 1: Event Details Form (Category Field)
You need to add a new "Select Category" field to the basic details form. 
* **API Hook:** Import and use `useGetEventTypes` from `src/hooks/api/eventAPIHooks.ts`.
* **UI Component:** Add an Autocomplete/Select dropdown field to the form, styled identically to the existing fields (e.g., the Assign Manager field).
* **Data Mapping:** Map the API response so the dropdown displays the `name` (e.g., "Conference") but the form captures the `eventTypeId` (number).
* **Zod Schema:** Update the Zod validation schema and the React Context state to include `eventTypeId`.

## 2. Refactor Step 2: Final API Submission Flow
Currently, the wizard likely submits the event details and form schema in one payload. You MUST completely rewrite the submit handler in the final integration step to follow this strict, sequential flow:

* **New API Hook:** Import `useCreateOrUpdateForm` from `src/hooks/api/formAPIHooks.ts`.
* **Sequential Execution:**
    1. **Call Event API:** First, fire the Create Event API using the `eventDetails` payload (which now includes `eventTypeId`).
    2. **Extract ID:** Await the success response and extract the newly created `eventId`.
    3. **Construct Form Payload:** Immediately construct the custom form payload using the exact structure below:
```json
       {
           "eventId": <Extracted_ID>,
           "type": "REGISTRATION",
           "schema": {
               "title": "<Event Name> Registration Form",
               "description": "Registration for <Event Name>",
               "fields": [ ...array from the DnD builder context... ]
           }
       }
       ```
    4. **Call Form API:** Fire the `useCreateOrUpdateForm` API using the constructed payload.
* **UI State Management (CRITICAL):** You must maintain a `isLoading` state that keeps the "Save & Publish" button disabled and showing a loading spinner throughout the ENTIRE sequence (from the start of API 1 to the completion of API 2). 
* **Error Handling:** If API 1 succeeds but API 2 fails, display a specific error toast letting the user know the event was created but the form failed to attach.

## 3. Anti-Guessing Constraints (CRITICAL)
* **API Extraction:** When extracting the `eventId` from the first API call, assume the response structure is `response.data.eventId`. Do not guess the object path.
* **Autocomplete UI:** For the Category dropdown, use your specific reusable component for searching/selecting (`<app-select>`). Ensure it handles the mapping of the `name` label and `eventTypeId` value properly.
* **Schema Mapping:** When constructing the `fields` array for the Form API, map the DnD builder's `id` property to the `name` property required by the backend payload.