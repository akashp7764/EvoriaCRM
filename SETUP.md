# Event Registration & Management Platform - Frontend Setup

This project is a scalable frontend system for managing event registrations, approvals, QR-based attendance tracking, and feedback collection.

---

## Frontend Technology Stack

| Layer                 | Technology                    |        Purpose                                                         |
|-----------------------|-------------------------------|------------------------------------------------------------------------|
| Framework             | React.ts (via Vite)           | Core UI rendering and lightning-fast local development builds.         |
| Language              | TypeScript (ES6+)             | Core logic and application structure.                                  |
| Routing               | React Router DOM              | Client-side routing for public forms, walk-ins, and admin dashboard.   |
| Theme                 | Shadcn/UI                     | Shadcn/UI for all components and pages.                                |
| Font                  | Raleway                       | Raleway font (https://fonts.googleapis.com/css2?family=Raleway).       |
| Styling               | Tailwind CSS                  | Utility-first styling                                                  |
| Forms & Validation    | React Hook Form + Zod         | Managing dynamic form state and strict schema validation.              |
| QR Generation         | qrcode.react                  | Generating public Event QRs and private Badge QRs in the browser.      |
| QR Scanning           | html5-qrcode                  | Handling on-site badge scanning via mobile device cameras.             |
| Client State          | createContext + useContext    | Client state management for data fetching and caching.                 |
| Server State          | TanStack Query                | Server state management for data fetching and caching.                 |
| Data Fetching         | Axios                         | Making clean, interceptor-ready HTTP requests to the Node.js backend.  |
| Charts (Admin)        | Recharts                      | Visual analytics (Attendance, Feedback Scores) for the dashboard.      |
| Icons                 | Lucide React                  | Clean, modern SVG icons that integrate seamlessly with Shadcn/UI.      |

---

## Colors

- **Primary:** #B8860B
- **Secondary:** #000000
**Ternary:** #0A2463



## Reusable Components List 
---

### 1. Text Field
Variants:
- Default
- With label
- With placeholder
- Disabled
- Error state (Zod validation)
- With icon (prefix/suffix)

---

### 2. Button
Variants:
- Styles: "default", "outline", "ghost", "destructive", "secondary", "link"
- With icon + label (prefix/suffix)
- With icon only
- Disabled state
- Loading state (with spinner)
---

### 3. Checkbox
Variants:
- Default
- Checked
- Disabled
- With label
- Error state (Zod validation)

---

### 4. Radio Button
Variants:
- Default
- Selected
- Disabled
- Grouped options

---

### 5. Dropdown (Select / Combobox)
Variants:
- Default standard select
- Searchable (Combobox pattern)
- Disabled
- Error state (Zod validation)

### 6. Multi Select Dropdown
Variants:
- Select multiple options
- With search
- With checkboxes
- Display selected items
- Error state (Zod validation)

---

### 7. Date Picker
Variants:
- Single date selection
- Range selection
- Disabled dates
- With default value
- Error state (Zod validation)

---

### 8. Chips (Interactive)
Variants:
- Selectable filter state
- Closable (removable with 'X' icon)
- With leading icon

---


### 9. Card (StatCard)
Variants:
- Basic card
- With image (Event banners)
- With actions (Buttons for "Export")
- Hoverable card

---

### 10. Alert
Variants:
- Success
- Error
- Warning
- Info

---

### 11. Confirmation Modal
Variants:
- Default confirmation
- With title & description
- Danger action (Delete event/Reject candidate)
- With loading state (During QR generation)

---

### 12. Badges (Static Status)
Variants:
- Default solid
- Colored variants (Green/Success, Yellow/Warning, Red/Danger)
- Outline variant


## Create Initial Landing Page
create a component viewer page where will render all reusable components along with its style variants


--

## Environment Configuration (.env)

### API Configuration (The base URL for your Node.js backend (Must start with VITE_))
VITE_API_BASE_URL=http://localhost:3000

---

## Build and Run

1. Install dependencies:
   npm install

2. Start server:
   npm run dev



## Agent Guide

Before writing any code, read the following files in order:

1. ARCHITECTURE.md — project folder structure, Frontend Tech Stack, Component Architecture, State Management strategy (Context & TanStack Query), Routing logic, API Consumption rules, and UI/UX Performance Optimization.
2. SKILLS.md — React best practices, Custom Hook boundaries, UI Component structure, Tailwind CSS styling guidelines, and Frontend Code Quality standards.
3. AGENTS.md — Frontend coding standards, React/JSX naming conventions, Vite build and run commands, and UI form/API response validation rules that apply to every task.

Follow all rules defined across these files for every feature you build.
Use ARCHITECTURE.md, SKILLS.md, and AGENTS.md to create README.md
