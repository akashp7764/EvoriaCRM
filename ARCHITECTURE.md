# Evoria - Event Ticketing Platform

Evoria is a event ticketing platform built with React 19 for managing events. 
It has two main parts: 
1. a mobile-friendly site for people to register and attend events, 
2. a secure desktop dashboard for organizers to manage the event data


**Note**: This repository contains the Frontend application only, Without any server side API.

This React application is strictly a client that consumes REST APIs. All API communication is handled via Axios, and the base API URL is managed through environment variables (VITE_API_BASE_URL).

## Frontend Technology Stack

| Layer                 | Technology                    |        Purpose                                                         |
|-----------------------|-------------------------------|------------------------------------------------------------------------|
| Framework             | React.ts (via Vite)           | Core UI rendering and lightning-fast local development builds.         |
| Language              | TypeScript (ES6+)             | Core logic and application structure.                                  |
| Routing               | React Router DOM              | Client-side routing for public forms, walk-ins, and admin dashboard.   |
| Theme                 | Shadcn/UI                     | Shadcn/UI for all components and pages.                                |
| Font                  | Raleway                       | Raleway font (https://fonts.googleapis.com/css2?family=Raleway).       |
| Styling               | Tailwind CSS + Shadcn/UI      | Utility-first styling                                                  |
| Forms & Validation    | React Hook Form + Zod         | Managing dynamic form state and strict schema validation.              |
| QR Generation         | qrcode.react                  | Generating public Event QRs and private Badge QRs in the browser.      |
| QR Scanning           | html5-qrcode                  | Handling on-site badge scanning via mobile device cameras.             |
| Client State          | createContext + useContext    | Client state management for data fetching and caching.                 |
| Server State          | TanStack Query                | Server state management for data fetching and caching.                 |
| Data Fetching         | Axios                         | Making clean, interceptor-ready HTTP requests to the Node.js backend.  |
| Charts (Admin)        | Recharts                      | Visual analytics (Attendance, Feedback Scores) for the dashboard.      |
| Icons                 | Lucide React                  | Clean, modern SVG icons that integrate seamlessly with Shadcn/UI.      |


## Folder Structure

```
src/
├── assets/                 # Static assets (images, icons, animations, etc.)
│   ├── images/             # images used across the app
│   ├── icons/              # icons used across the app
│   └── animations/         # animations used across the app
├── components/             # Reusable UI components
│   ├── ui/                 # Tier 1: Base auto-generated Shadcn components (DO NOT EDIT MANUALLY)
│   ├── controls/           # Tier 2: Custom wrapper components (Inputs, Buttons with Zod validation)
│   ├── common/             # Tier 3: Larger reusable pieces (Layouts, Navbars, Cards)
│   └── pages/              # Actual full-screen React components representing views/routes
├── constants/              # Application constants and configuration
├── hooks/                  # Custom React hooks
├── helpers/                # helper functions
├── routes/                    # React Router v6 Configuration
│    ├── AppRouter.tsx         # Main routing logic
│    └── ProtectedRoute.tsx    # Route guards for auth
├── utils/                  # Utility functions
├── App.tsx                 # Root component (Usually just renders <AppProviders> and <AppRouter>)
└── main.tsx                # Vite entry point (ReactDOM.createRoot)
```
