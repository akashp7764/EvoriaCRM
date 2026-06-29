# Phase 3: Custom Registration Form Builder (Drag & Drop)
**Goal:** Build the interactive form builder using `@dnd-kit` and save the schema to the shared Wizard Store.

## 1. Architecture & Libraries (STRICT)
* You MUST use `@dnd-kit/core` and `@dnd-kit/sortable` (use `SortableContext` and `verticalListSortingStrategy`). 
* Define the JSON schema structure: `{ id: string, type: 'text' | 'email' | 'select', label: string, required: boolean, options?: string[] }`.

## 2. State Integration (React Context)
* Connect this component to the `EventWizardContext` created in Phase 2 using the `useEventWizard()` hook. 
* Initialize the local DnD state using the context's `formSchema`. 
* Every time a field is added, reordered, or its properties are edited, update the global `formSchema` state via the context immediately.
* Bottom row buttons: "Back" (calls `setStep(1)`) and "Save & Publish Event".

## 3. UI/UX Layout (The 3-Pane Structure)
Use CSS Grid (`grid-cols-1 lg:grid-cols-12 gap-6 h-[700px]`). Match the `rounded-2xl` dashboard styling.
* **Pane 1: Toolbox (lg:col-span-3):** Draggable field types (Text, Email, Dropdown).
* **Pane 2: Canvas (lg:col-span-6):** The droppable `<SortableContext>` area. Render the `formSchema` array. 
    * When a field is clicked, outline it in Gold (`border-[#FFBF00]`) to mark it as `activeFieldId`.
    * You MUST render the actual EVoria components (`TextField`, `AppSelect`) here for the preview.
* **Pane 3: Properties (lg:col-span-3):** Renders inputs (Label, Required Checkbox, Options list for Selects) bound to the `activeFieldId`. 

## 4. Navigation Actions
* Bottom row buttons: "Back" (calls `setStep(1)` in store) and "Save & Publish Event".