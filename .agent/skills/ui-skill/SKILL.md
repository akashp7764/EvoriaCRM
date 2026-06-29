# SKILL.md — Common Project Standards

### Component Architecture (The Two-Tier System)
- **Tier 1 (Base UI):** All base Shadcn components must live untouched in `src/components/ui/`. Install them via the CLI.
- **Tier 2 (Controls):** All custom reusable components requested in `SETUP.md` must be built inside `src/components/controls/`. These components MUST import the base UI components from `@/components/ui/` and wrap them with the required business logic (e.g., React Hook Form integrations, Zod error message displays, custom variant props).

###  React Component Standards (Strict Ref Policy & asChild)

Shadcn, Radix UI primitives, and React Hook Form rely heavily on DOM references. To prevent "Function components cannot be given refs" and "SlotClone" errors, you MUST follow these rules when building Tier 2 custom wrappers in src/components/controls/:

1. **Mandatory forwardRef:** You are strictly forbidden from writing standard functional components for UI controls. ALL wrapper components (especially Buttons, Inputs, and Dropdowns) MUST be wrapped in React.forwardRef.
2. **Pass it Down:** You must explicitly pass the ref to the primary underlying Shadcn component (e.g., <Button ref={ref} {...props} />).
3. **The asChild Rule:** If a component is ever going to be used inside a Shadcn Trigger (like DialogTrigger asChild or PopoverTrigger asChild), it absolutely must be capable of receiving a forwarded ref.
4. **Display Name:** Always append ComponentName.displayName = "ComponentName" at the bottom of the file.



### Component Binding (CRITICAL)
Do not use the standard register function directly on the custom form components. Because we are using custom reusable UI controls, you MUST wrap every input inside the <Controller> component from react-hook-form.

Pass the control object from useForm to the Controller.
Use the render prop to extract field (which contains onChange, onBlur, value, ref) and fieldState (which contains the error).

Spread the field props into the custom <TextField> and pass the error message explicitly.

### Logging & Debugging

- Remove console.log statements before merging to production.

- Use structured error logging for caught API exceptions.

- Do not log sensitive user data (passwords, PII, tokens) in the browser console.


### Styling Rules (Tailwind Only)

- No custom .scss files unless absolutely necessary for complex animations.

- No inline styles (style={{ color: 'red' }}).

- Use standard Tailwind utility classes.

```javascript
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" />
```

# Install core frontend dependencies
npm install axios @tanstack/react-query react-hook-form @hookform/resolvers zod react-router-dom

# Start development server
npm run dev

# Build for production
npm run build


### State Management Rules

| State Type            | Tool                  | Purpose                                                                               |
|-----------------------|-----------------------|---------------------------------------------------------------------------------------|
| Server State          | TanStack Query        | API data fetching, caching, loading states, and mutations.                            |
| Global Client State   | Context API           | App-wide UI state (e.g., active theme, sidebar toggle, logged-in user profile).       |
| Local UI State        | useState              | Component-specific state (e.g., opening a specific dropdown, form input).             |




## Don't

- Do not mutate React state directly (e.g., state.value = "new").

- Do not forget to handle loading (isLoading) and error (isError) states in your UI components.

- Do not build complex UI components from scratch if a Shadcn/UI component already exists.

- Do not store sensitive keys or secrets in the frontend repository.

---

**Note:** This file only contains common standards followed across the entire project.
