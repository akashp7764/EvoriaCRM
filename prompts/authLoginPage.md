# Login Page Implementation Guidelines

This document outlines the strict UI, responsive layout, logic, and routing requirements for generating the Authentication Login Page for Evoria.

## 1. UI & Layout Architecture

The page must use a full-screen background image with a responsive split-layout. 

### Global Design Variables
* You must strictly use existing design tokens for colors and typography (e.g., `text-brand-primary`, `bg-background`, `text-muted-foreground`). Do not hardcode hex codes.
* Use standard Tailwind spacing utilities.

### Background & Overlay
* The root container must be `min-h-screen`, `w-full`, and use the provided conference image as the background (`bg-cover bg-center`).
* Apply a dark semi-transparent overlay (e.g., `bg-black/60`) over the background image to ensure text and form readability.



### Background & Overlay
* The root container must be `min-h-screen`, `w-full`.
* **LOCAL ASSET PATH (CRITICAL):** The background image is located in the project at `src/assets/images/BGimg.jpg`.
* You MUST import this image at the top of the React file (e.g., `import bgImage from '@/assets/images/BGimg.jpg'`).
* Apply the imported image to the root container using an inline style: `style={{ backgroundImage: \`url(${bgImage})\`, backgroundSize: 'cover', backgroundPosition: 'center' }}`. 
* Apply a dark semi-transparent overlay div (e.g., `bg-black/60`) inside the root container to ensure text and form readability.


### Responsive Behavior (Desktop vs. Mobile)
* **Desktop (`md:` and above):** Implement a 50/50 split layout (`grid grid-cols-1 md:grid-cols-2`). 
    * **Left Side (50%):** Display the Evoria branding, welcome text, and tagline. Vertically center this content.
    * **Right Side (50%):** House the login form container.
* **Mobile & Tablet:** * The Left Side branding text MUST be hidden (`hidden md:flex`).
    * The Right Side login form MUST be centered perfectly on the screen over the background image.

## 2. Reusable Component Usage

You are strictly required to use the existing custom wrappers from `src/components/controls/`. Do not use native HTML inputs or base Shadcn components directly.

* **Form Container (Glassmorphism):** The login card MUST have a highly transparent, frosted-glass effect so the background image is visible through it. 
    * Wrap the form in a container using these exact Tailwind classes: `bg-background/30 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-8`. 
    * Do NOT use a solid background color for this card.
* **Email Field:** Use `<TextField>` with `type="email"`, `label="Email"`, and appropriate placeholder.
* **Password Field:** Use `<TextField>` with `type="password"` and `label="Password"`.
* **Submit Button:** Use `<AppButton>` with the text "SIGN IN". Connect this to the loading state of the TanStack Query mutation.
* **Auxiliary Actions:** Below the SIGN IN button, add two `<AppButton variant="link">` components side-by-side:
    1.  "Forgot Password?"
    2.  "Reset Password"
* **Error Handling:** Use `<AppAlert variant="error">` conditionally rendered at the top of the form container to display API error messages.

## 3. Form Logic & Validation

Use `react-hook-form` and `zod` for strict client-side validation.

### Zod Schema Requirements
* **Email:** Must be a valid email string. Provide a custom error message.
* **Password:** Must be a minimum of 8 characters.

### Submission Logic & API Handling
* The `onSubmit` function must trigger the `useLoginMutation` hook.
* The `SIGN IN` button must display a loading spinner (`isLoading={true}`) while the mutation is pending, and all inputs must be disabled.
* **On Error:** Catch the error from the mutation and display the error message inside the `<AppAlert variant="error">` component. Do not use toast notifications for login errors.
* **On Success:** Do NOT show a success toast or popup. Immediately store the token and redirect the user to `/dashboard`.

## 4. Routing & Dashboard Generation

In addition to the Login Page, you must generate a minimal Dashboard page and configure the routing.

* **Dashboard Component (`src/pages/Dashboard.tsx`):** Create a very simple, placeholder protected page. For now, it should only render a minimal layout with a welcome text (e.g., `<h1 className="text-2xl font-bold">Welcome to Evoria Dashboard</h1>`).
* **Routing:** Ensure React Router (or your routing framework) is configured so that a successful login redirects to `/dashboard`, and ensure `/dashboard` cannot be accessed without a valid token.