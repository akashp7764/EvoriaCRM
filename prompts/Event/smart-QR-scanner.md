# Phase 8: Smart QR Check-in System & Dynamic Public Ticket
**Goal:** Implement a dual-purpose QR architecture. Event Managers use an in-app scanner to mark attendance, while attendees scanning the same QR code are routed to a digital ticket or feedback form.

## 1. Global Navigation Update
* **Header Icon:** In the main `DashboardLayout` header, add a quick-access QR Code scanner icon next to the Notification bell. Wrap it in a `<Link to="/manager/scanner">`. Do NOT use a modal.

## 2. API Hook Implementation (`attendanceAPIHooks.ts`)
Create a new API hook named `useScanAttendance`.
* **URL:** Map exactly to `/api/v1/ticket/scan`.
* **Payload Structure (CRITICAL):** Do NOT send a JSON body. You MUST pass the data as URL Query Parameters: `?eventId=X&registrationId=Y&memberId=Z`. (If using Axios, pass this in the `params` config object).
* **Auth Logic:** The hook MUST check `localStorage` for an auth token. 
  * If a token exists (Manager): Pass it as `Authorization: Bearer <token>`. The BE will mark attendance.
  * If NO token exists (Public User): Send the request without the Authorization header. The BE will simply return the ticket/feedback data.

## 3. Public Web Route: `/ticket/scan` (Google Lens / Attendee Flow)
Create a public page component `PublicTicketPage.tsx`. 
* **On Mount:** Extract `eventId`, `registrationId`, and `memberId` from the URL Query Parameters (`useSearchParams`).
* **API Call:** Call `useScanAttendance` passing those three extracted IDs.
* **UI State 1 (Active Event Ticket):** If `data.isEventCompleted` is `false`:
  * Render a "Digital Badge" UI.
  * Display the member's Name, Event ID, and a visual QR Code generated from `data.member.qrCode` (Base64).
  * Show a status pill: "Valid Pass - Ready for Scan".
* **UI State 2 (Post-Event Feedback):** If `data.isEventCompleted` is `true`:
  * Do NOT show the digital ticket.
  * Render the `feedbackForm.schema` using the `renderFormFields` component we built in Phase 7. Include a Submit button.

## 4. Reusable Scanner Wrapper
Create `src/components/controls/AppQRScanner.tsx`.
* **Library:** `html5-qrcode`
* **Lifecycle:** Initialize the camera on mount. You MUST properly destroy the camera instance in the `useEffect` cleanup function to prevent memory leaks.
* **Props:** Accept `onScanSuccess(decodedText)` and `isPaused` (boolean).

## 5. Protected Manager Route: `/manager/scanner` (Staff / Kiosk Flow)
Create the protected `ScannerPage.tsx` for Event Managers.
* **Top Bar:** Include a toggle for "Kiosk Mode (Auto-resume)".
* **QR Data Parsing (CRITICAL):** When the camera reads the QR code string, pause the scanner immediately.
  * *Safe Parsing:* Wrap the logic in a try/catch block. Parse the string using `new URL(decodedText)`. 
  * *Extraction:* Extract `eventId`, `registrationId`, and `memberId` using `.searchParams.get()`. If any of the three are missing, throw an error and show an Error Overlay: "Invalid QR Format".
* **API Execution:** Call `useScanAttendance` with the three extracted IDs.
* **Overlay UX Logic:** Do NOT navigate to a new page on success. Show a `<div>` overlay positioned `absolute` over the live camera viewfinder.
  * *Success Rendering:* If the API succeeds, flash the overlay GREEN. Display "✅ Checked In: [data.member.name]". 
* **Continuous Scanning Handling:**
  * *Staff Mode (Default):* Show a "Scan Next Ticket" button on the overlay. Clicking it hides the overlay and unpauses the camera.
  * *Kiosk Mode:* Hide the dashboard sidebar/header. Do not require a button click. Use a `setTimeout` to wait 2.5 seconds, then automatically hide the overlay and unpause the camera.