# Phase 9: Event Creation Wizard Finalization (S3 Uploads, Feedback Builder & Validations)

**Goal:** Complete the 3-step Event Creation Wizard by adding the S3 Drag & Drop image upload flow, an "Auto Approve" flag, strict date validations, and a third step specifically for building the Feedback Form with a reusable Star Rating component.

## 1. UI Updates for Step 1: Event Details
Update the existing first step of the Event Creation form:
* **Auto Approve Flag:** Add a new optional checkbox field: `"Registration Auto Approve"`. Bind this to a boolean state `autoApprove`.
* **Date Validation:** Link the Start Date and End Date inputs. If a user selects a Start Date, the End Date input must disable all previous dates (e.g., set the `min` attribute of the End Date input to the selected Start Date).
* **Banner Image (Drag & Drop):** Replace the standard URL text input with a Drag & Drop file upload area. 
    * Restrict to 1 image only.
    * When an image is dropped/selected, store the raw `File` object in local React state (e.g., `const [bannerFile, setBannerFile] = useState<File | null>(null)`). 
    * **CRITICAL:** Do NOT upload the image to the API yet. Just show a local preview of the image using `URL.createObjectURL()`.

## 2. New Component: Reusable Star Rating
Create a new file: `src/components/common/StarRating.tsx`
* Build a reusable 5-star rating component using inline SVGs (or Lucide icons if available).
* Props should include: `value` (number), `onChange` (function), and `readOnly` (boolean).
* It should support interactive hover states and click-to-select logic.

## 3. UI Updates for Step 3: Feedback Form Builder
Add a 3rd step to the wizard called "Feedback Form".
* This UI should look identical to the Registration Form builder, but it must initialize with a **default schema state**.
* **Default State Required:**
    ```json
    [
      { "name": "rating", "label": "Overall Rating (1-5)", "type": "number", "required": true },
      { "name": "comments", "label": "Additional Comments", "type": "textarea", "required": false }
    ]
    ```
* When rendering the "Form Canvas" preview for this step, if a field has `name: "rating"`, intercept it and render the custom `<StarRating />` component instead of a standard number input.

## 4. API Hooks (S3 Presigned URL)
Create a new API hook: `useGetPresignedUrl` in your `uploadsAPIHooks.ts` (or similar).
* **URL:** Map to `/api/v1/uploads/presigned-url` (POST).
* **Payload:** `{ "fileName": string, "contentType": string }`
* **Response handling:** It will return `data.url` (the AWS S3 URL) and `data.key` (the database storage path).

## 5. The Final Submission Execution Chain (CRITICAL)
When the user clicks the final "Submit / Create Event" button on Step 3, you must execute the APIs in this exact sequential order:

**Chain Step A: Image Upload (If file exists in state)**
1.  Call `useGetPresignedUrl` payload: `{ "fileName": bannerFile.name, "contentType": bannerFile.type }`.
2.  Extract `url` and `key` from the response.
3.  Perform a raw `fetch` or `axios.put` to the extracted `url`. 
    * **Method:** `PUT`
    * **Headers:** `"Content-Type": bannerFile.type`
    * **Body:** `bannerFile` (the raw binary file).
4.  Store the `key` string in a variable (e.g., `uploadedS3Key`).

**Chain Step B: Create Event**
1.  Call the existing `useCreateEvent()` API.
2.  Include `autoApprove: true/false` in the payload.
3.  For the banner image, pass the `uploadedS3Key` (NOT the presigned URL).
4.  Capture the returned `eventId`.

**Chain Step C: Create Registration Form**
1.  Call the existing form creation API (`useCreateOrUpdateForm`).
2.  Payload: `{ eventId: returnedEventId, type: "REGISTRATION", schema: { title, description, fields: registrationFields } }`

**Chain Step D: Create Feedback Form**
1.  Call the existing form creation API (`useCreateOrUpdateForm`).
2.  Payload: `{ eventId: returnedEventId, type: "FEEDBACK", schema: { title: "Feedback Form", description: "Tell us your experience", fields: feedbackFields } }`

*Wrap this entire sequence in a Try/Catch block. Show a loading spinner overlay while the chain executes.*