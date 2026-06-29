# Phase 2: Event Details Form (Basic Info)
**Goal:** Build the primary data entry form using React Hook Form, Zod, and a shared React Context.

## 1. Mandatory Pre-Flight
* Read `@.agent/rules/core-rules.md`.
* This component MUST NOT fetch or submit to the API directly. It is Step 1 of a Wizard.

## 2. Strict State Management (React Context API)
Before building the UI, you MUST create a React Context and Provider (e.g., `src/context/EventWizardContext.tsx`).
* **State required:** `eventDetails` (object), `formSchema` (array, default empty), and `currentStep` (number, default 1).
* **Actions required:** `setEventDetails`, `setFormSchema`, `setStep`, and `resetWizard`.
* **Export:** Export the Context, the Provider component, and a custom hook `useEventWizard()` to consume it easily.

## 3. Form Schema & Validation (Zod)
* Define a Zod schema for: Event Name (string, min 3), Description (string), Start Date (string/date), End Date (string/date), Location (string), and ImageURL (string/url for now).
* Ensure validation error messages are clear.

## 4. UI/UX Assembly
* Map over the fields using the RHF `<Controller>` pattern.
* **Alignment:** Use a 2-column grid (`grid grid-cols-1 md:grid-cols-2 gap-6`). Start Date and End Date sit side-by-side. Use `rounded-2xl` and `p-6` to match the dashboard theme.
* **Action Buttons:** "Cancel" (resets context, navigates back) and "Next" (primary brand button).
* **The "Next" Trigger:** On valid form submit, do NOT call an API. Call `setEventDetails(data)` from the Context, then call `setStep(2)` to transition to the Form Builder.