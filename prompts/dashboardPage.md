# EVoria Dashboard Implementation Guidelines

This document outlines the strict UI, layout, component architecture, and responsive breakpoints for the main Dashboard. You must achieve 100% structural and visual accuracy based on the provided reference images.

## 1. Design System & Theming (CRITICAL: Strict Monochromatic Dual Themes)
You MUST implement both Light Mode and Dark Mode using Tailwind's `dark:` variant classes. **Do not mix the theme colors.** * **Light Mode Theme (STRICTLY White & Deep Navy ONLY):**
    * **Rule:** Absolutely NO Gold (`#FFBF00`) is allowed in Light Mode. 
    * **Backgrounds:** Use pure White (`bg-white`). For contrasting backgrounds (like the app shell or table headers), use a 5% or 10% opacity of Deep Navy (e.g., `bg-[#0A2463]/5`). Do not use standard Tailwind slates or grays.
    * **Text & Accents:** Deep Navy (`#0A2463`). Use lighter opacities for muted text (e.g., `text-[#0A2463]/60`).
    * **Active States:** Deep Navy backgrounds with White text.

* **Dark Mode Theme (STRICTLY Black & Gold ONLY):**
    * **Rule:** Absolutely NO Deep Navy (`#0A2463`) is allowed in Dark Mode.
    * **Backgrounds:** Pure Black (`#000000` / `dark:bg-black`). For card borders or subtle contrast areas, use very dark grays (e.g., `dark:border-white/10`) or a 5% opacity of Gold (`dark:bg-[#FFBF00]/5`).
    * **Text & Accents:** Gold (`#FFBF00`) for all primary actions, active states, and highlights. Primary reading text must be White or Light Gray (`dark:text-white`) for accessibility.
    * **Active States:** Gold backgrounds with Black text.

## 2. Visual Accuracy & Spacing (CRITICAL)
You must achieve 100% accuracy matching the provided Figma screenshots. 
* **Spacing:** Do NOT default to basic `p-4` or `gap-2`. You must use premium SaaS spacing. Use `gap-6` or `gap-8` between grid columns and `p-6` inside cards.
* **Borders:** Use `rounded-xl` or `rounded-2xl` for all AppCards and image containers to match the modern aesthetic.

## 3. Data Architecture: Strict Mock JSON Requirement
Do NOT hardcode UI elements for repeated data. Define strongly-typed mock data arrays at the top of the file (or in `mockData.ts`) and use `.map()` to render them.
* **Required Arrays:** `MOCK_TOP_STATS`, `MOCK_POPULAR_EVENTS`, `MOCK_UPCOMING_EVENTS`, `MOCK_RECENT_BOOKINGS`, `MOCK_RECENT_ACTIVITY`.

## 4. Responsive Layout Architecture (The App Shell)
Implement a 3-tier responsive design (`base`, `md:`, `xl:`).

### A. Sidebar Navigation
* **Mobile (`< md`):** Hidden. Replaced by a Hamburger Menu icon in the Top Header.
* **Tablet (`md` to `< xl`):** Minimized icon-only sidebar (`w-20 flex flex-col items-center`). 
* **Desktop (`xl:` and up):** Fully expanded sidebar (`w-64`). 
* **Links:** Dashboard, Bookings, Invoices, Inbox, Calendar, Events, Financials, Gallery, Feedback. 
    * *Active Link (Light):* Deep Navy background, White text/icon.
    * *Active Link (Dark):* Gold background, Black text/icon.
* **Footer Actions:** 1.  **Theme Toggle:** Button to switch Light/Dark mode (Sun/Moon icons).
    2.  **Sign Out:** Logout button.

### B. Top Header
* **Layout:** Flexbox, horizontally justified. Background must be `bg-white dark:bg-black dark:border-b dark:border-white/10`.
* **Mobile:** Hamburger menu (left), Logo (center), Profile Avatar (right). 
* **Desktop/Tablet:** Page Title (left), Global Search input (center), Notifications/Settings/Avatar (right).

## 5. Main Content Grid & Breakpoints
The main content area uses Tailwind CSS Grid.

### Section 1: Top Stats
* **Mobile:** `flex overflow-x-auto snap-x` (horizontal scroll).
* **Tablet/Desktop:** `grid grid-cols-3` or `grid-cols-4` with `gap-6`.

### Section 2: Charts & Analytics vs. Right Panel
* **Desktop (`xl:`):** `grid-cols-12`. Left Analytics Section is `col-span-8`. Right Panel is `col-span-4`.
* **Tablet & Mobile (`base` and `md:`):** `grid-cols-1`. The sections stack vertically.

### Section 3: Internal Section Details
* **Charts:** Adapt exactly to the active theme colors.
* **All Events:** Horizontally scrollable row of cards (`flex overflow-x-auto space-x-6`).
* **Recent Bookings Table:** Wrapped in `overflow-x-auto`. Status badges must strictly follow the active theme (Light = Navy shades, Dark = Gold shades).

## 6. Component Strategy (Reusable First)
Check `src/components/controls/` and `src/components/common/` for existing components (`AppCard`, `AppButton`, `TextField`). Create missing wrapper components dynamically.