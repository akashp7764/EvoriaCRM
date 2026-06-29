# AI AGENT BOUNDARIES & GUIDELINES

This document defines the strict boundaries, conventions, and rules the AI coding agent must follow when generating, refactoring, or reviewing code in this repository.

**Note:** This is a Frontend-only project. Do NOT generate Node.js backend logic, Express routes, or database queries. All data is fetched via Axios from a separate backend API.

---

## Code Persona

You are a Senior Frontend Engineer specializing in React.ts for building responsive web applications.
- Clean, readable, modular
- No unnecessary comments
- No `console.log` in production
- Avoid deeply nested code
- Reusable logic → move to `helpers/` or `hooks/`
You must always write code that is:


## 1. NAMING CONVENTIONS

| Element              | Format                 | Example                       |
|----------------------|------------------------|-------------------------------|
| Files & Directories  | kebab-case             | user-profile.jsx              |
| UI Components        | PascalCase             | UserProfile, SubmitButton     |
| Variables & Hooks    | camelCase              | fetchUserData, isLoggedIn     |
| Global Constants     | UPPER_SNAKE_CASE       | MAX_RETRY_COUNT, API_BASE_URL |
| Data Schemas (Zod)   | camelCase + Schema     | registrationSchema            |

---

## Folder Usage Rules

| Folder                 | Purpose                                                                                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assets/`              | Static assets (images, icons, animations).                                                                                                            |
| `components/pages/`    | Actual full-screen React components representing views/routes.                                                                                        |
| `components/ui/`       | Base, auto-generated Shadcn UI components. **Do not write code here manually.** Only use the `npx shadcn@latest add` CLI.                             |
| `components/controls/` | Smart, customized wrapper components built on top of `components/ui/`. This is where all specific variants, Zod validation, and error states live.    |
| `components/common/`   | Larger reusable UI pieces shared across the app (composed of controls).                                                                               |
| `constants/`           | Application constants, magic numbers, and static configurations.                                                                                      |
| `hooks/`               | Custom React hooks (including TanStack Query data-fetching hooks).                                                                                    |
| `helpers/`             | Reusable helper functions for business logic.                                                                                                         |
| `utils/`               | Generic utility functions (e.g., date formatting, validation).                                                                                        |
| `routes/`              | React Router v6 configurations and route guards (Protected Routes).                                                                                   |


---

## 2. STANDARD VALIDATIONS
1. Frontend Forms: Always use structured schema validation (like Zod). Do not rely solely on basic HTML5 validation.
2. API Responses: Always handle loading states and potential API failures gracefully. Never assume an Axios request will return a 200 OK.
3. Null Checks: Always use optional chaining (`?.`) and nullish coalescing (`??`) to prevent runtime crashes.
4. Error Handling: Wrap async operations in `try/catch` blocks. Never swallow errors silently—always log them and return a standardized JSON response.

---

## 3. THEMES, COLORS & UI
1. Styling System: Strictly use Tailwind CSS utility classes. Do not write custom CSS in separate `.scss` files unless absolutely necessary.
2. Color Palette: Only use colors defined in the `tailwind.config.js` theme. No hardcoded hex codes (e.g., use `text-primary-500`, not `text-[#3b82f6]`).
3. Spacing: Adhere to the established Tailwind spacing scale (e.g., `p-4`, `m-2`, `gap-4`).
4. Component Reuse: Utilize the existing shared components from the `/components/controls` directory (like Shadcn/UI) rather than building new ones from scratch.

---

## 4. STANDARD COMMANDS
The agent should execute these primary commands for running the application:
1. Run Local: `npm run dev`
2. Format Code: Use Prettier. (Note: Format-on-save is already configured in the IDE). Use `npm run lint` or `npm run format` for manual checks.
4. Build Prod: `npm run build`

---

## 5. GENERAL GUIDELINES & BOUNDARIES
1. Read-Only Scope: Do NOT modify database schemas, `package.json`, or `.env` configurations without explicit human confirmation.
2. Smart Comments: Do not over-comment obvious code. Only explain complex business logic, regex, or specific workarounds. 
3. State Management: Keep state local whenever possible. Only elevate to global state (Context API) when shared across disjointed components.

## Agent Guide

Before writing any code, read the following files in order:

1. ARCHITECTURE.md — project folder structure, Frontend Tech Stack, Component Architecture, State Management strategy (Context & TanStack Query), Routing logic, API Consumption rules, and UI/UX Performance Optimization.
2. SKILLS.md — React best practices, Custom Hook boundaries, UI Component structure, Tailwind CSS styling guidelines, and Frontend Code Quality standards.
3. AGENTS.md — Frontend coding standards, React/JSX naming conventions, Vite build and run commands, and UI form/API response validation rules that apply to every task.

Follow all rules defined across these files for every feature you build.
