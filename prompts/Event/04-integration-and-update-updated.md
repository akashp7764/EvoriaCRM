# Phase 4: Integration, Wizard Shell, & API Submission
**Goal:** Create the parent Wizard component that holds Phase 2 and Phase 3, and wire up the final API POST/PUT calls.

## 1. Mandatory Pre-Flight
* Read `@.agent/skills/api-integration-skill/SKILL.md`.
* Review the `useEventWizardStore`.

## 2. The Wizard Shell (`CreateEventPage.tsx`)
* Build a parent page layout with a simple Stepper UI at the top.
* **CRITICAL:** You must wrap this entire page/layout in the `<EventWizardProvider>` created in Phase 2.
* Conditionally render the Phase 2 component if `currentStep === 1`, and Phase 3 if `currentStep === 2`.

## 3. Strict API Payload Integration
When the user clicks "Save & Publish Event" at the end of Phase 3, you must construct the final payload:
* Extract `eventDetails` and `formSchema` from the `useEventWizard()` context.
* Create a payload object: `{ ...eventDetails, customFormSchema: JSON.stringify(formSchema) }`.
* Call the `POST /events` API endpoint.

## 4. The Edit Flow (Hydration)
* If the URL contains an Event ID (e.g., `/events/edit/:id`), fetch the event data on mount.
* Populate the `useEventWizardStore` by calling `setEventDetails` (with the basic info) and `setFormSchema` (by parsing the saved JSON string). The UI will magically hydrate.