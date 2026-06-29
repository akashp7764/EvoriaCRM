# Phase 7: Public Event Registration & Dynamic Guest Flow
**Goal:** Build a public registration page that renders dynamic form fields, handles dynamic guest additions, and processes registration via a secure OTP modal.

## 1. Routing & Initial States (Mandatory Pre-Flight)
* **Route Setup:** Create the page for `/form/registration/:eventId`. This MUST be a public route with a clean, minimal UI (do not use the Admin `DashboardLayout`).
* **Param Extraction:** Extract the `eventId` from the URL parameters (e.g., using `useParams`).
* **404 / Invalid Event:** If the `eventId` is missing or the API returns an error/404, render a standard 404 Not Found component. Do not crash the app.

## 2. API Hooks Implementation (Strict Setup)
Implement the following inside your API hook files:
* **In `formAPIHooks.ts`:** * `useGetRegFormDetailsByEventId`: Calls `GET /api/v1/forms/registration/{eventId}` (No Auth).
* **In `registrationAPIHooks.ts`:**
  * `useSendOTPVerification`: Calls `POST /api/v1/otp/send` with payload `{ "email": string, "number": string }` (No Auth). *Do NOT confuse this with the auth `verify-otp` API.*
  * `useRegisterForEvent`: Calls the final POST registration endpoint.

## 3. Reusable Components Strategy (CRITICAL)
You MUST build these in `src/components/controls/` or `src/utils/` before building the page:
* **`AppOTPInput.tsx`:** A 6-digit OTP component. 
  * **Props:** `otpLimit` (number), `confirmButtonName` (string), `onSubmit` (function returning OTP string), `onClose` (function), `resendOTPAPICall` (optional function to trigger resend).
* **`renderFormFields` (Utils or Component):** A reusable function/component that accepts the `schema.fields` array and iterates over it, rendering our standard `TextField`, `TextArea`, etc., in the exact sequence of the array.

## 4. Page Load & The "Inactive" State
Fetch the event details on mount. Evaluate `data.isActive`.
* **If `isActive === false`:** Do NOT render any forms. Render a beautiful empty state:
  * *Heading:* "Registrations Closed" or "This Event Has Concluded."
  * *Subtext:* "Thank you to everyone who made this event a success. Registrations are no longer being accepted."
* **If `isActive === true`:** Render the Form UI. 
  * Top: Display `schema.title` (`text-3xl font-bold`) and `schema.description` (`text-gray-500` subtitle) from the response.

## 5. Form Assembly & Dynamic Guests (`react-hook-form`)
Initialize a React Hook Form. You MUST use `useFieldArray` to manage the dynamic guests. 
* **Fixed Fields:** Render `email` (required) and `mobile` (required).
* **Dynamic Form Fields:** Call `renderFormFields(schema.fields)` to display the custom fields (like rating, comments, etc.).
* **Guest Selector:** Add a `totalMembers` stepper/input (Default: 1, Max: 20). 
  * Use increment/decrement buttons. It only accepts numbers.
  * If `totalMembers > 1`, dynamically render extra fields based on the count:
    * "Guest #1" -> Full Name text field.
    * "Guest #2" -> Full Name text field.
* **Submit Button:** Text should be "Verify Email & Submit".

## 6. The OTP & Final Submission Workflow (Strict Logic)
When the user clicks "Verify Email & Submit", follow this exact sequence:
1. **API 1 (Send OTP):** Call `useSendOTPVerification` with the user's email and mobile. Show a loading state.
2. **Open Modal:** On a 200 Success, open the `<AppOTPInput>` inside a Modal. Pass `confirmButtonName="Submit"` and the resend API function.
3. **API 2 (Register):** The user types the 6 digits and clicks Submit. Construct the final payload exactly like this:
   ```json
   {
       "email": "<primary_email>",
       "phoneNumber": "<primary_mobile>",
       "otp": "<entered_otp>",
       "members": [ { "name": "<guest1>" }, { "name": "<guest2>" } ],
       "formData": { 
           "rating": 5, 
           "comments": "Great!" 
           // ...all dynamic schema fields go inside formData
       }
   }