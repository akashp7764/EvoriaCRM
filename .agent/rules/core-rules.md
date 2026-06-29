---
trigger: always_on
---

---
name: Evoria
activation: always
---
# Global Context Rules
You must adhere to the project standards defined in:
- @AGENTS.md (Personas)
- @ARCHITECTURE.md (Structure)


### Mandatory Skill Loading (CRITICAL)
Before you write ANY code, you MUST use your file-reading tool to open and read the relevant skill files. Do not guess the architecture.
- If the user asks for API, Backend, or Data Fetching work: You MUST read `.agent/skills/api-integration-skill/SKILL.md` before replying.
- If the user asks for UI, Pages, Components, or Styling work: You MUST read `.agent/skills/ui-skill/SKILL.md` before replying.

### Global Styling & Responsiveness Architecture (Tailwind)
To ensure the EVoria platform is infinitely scalable across mobile, tablet, and desktop:
* **Mobile-First Paradigm:** Always write default Tailwind classes for mobile first (e.g., `flex-col`, `w-full`), then use media query prefixes (`md:`, `lg:`, `xl:`) for larger screens.
* **Fluid Widths:** NEVER use hardcoded pixel widths for layout containers (e.g., avoid `w-[400px]`). Use fluid percentages or Tailwind's responsive fractions (`w-full`, `w-1/2`).
* **REM-Based Spacing:** Rely strictly on standard Tailwind spacing (`p-4`, `gap-6`, `text-lg`). Do not hardcode text sizes in pixels.

### Global Form Rules (React Hook Form + Zod)
When using custom UI controls (like `TextField`), you MUST wrap every input inside the `<Controller>` component from `react-hook-form`. Pass `control`, extract `field` and `fieldState`, and spread the `field` props into the custom component while passing the error message explicitly.