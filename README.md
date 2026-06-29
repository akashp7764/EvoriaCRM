# Evoria - Event Ticketing Platform

Evoria is a modern, scalable event management platform built with React 18, TypeScript, and Shadcn/UI. It features a robust component library and mobile-friendly interfaces for both attendees and organizers.

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure Environment**
   Create a `.env` file with:
   ```
   VITE_API_BASE_URL=http://localhost:3000
   ```
4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 (via Vite) |
| **Language** | TypeScript (ES6+) |
| **Styling** | Tailwind CSS v4 + Shadcn/UI |
| **Routing** | React Router DOM v6 |
| **State Management** | Context API (Client) + TanStack Query (Server) |
| **Validation** | Zod + React Hook Form |
| **Icons** | Lucide React |

## 📁 Project Structure

- `src/components/ui/` — Base Shadcn components (Tier 1).
- `src/components/controls/` — Reusable smart wrappers with Zod/logic (Tier 2).
- `src/components/common/` — Shared UI compositions like Navbars/Layouts (Tier 3).
- `src/components/pages/` — Main route views/screen components.
- `src/hooks/` — Custom reactivity and data-fetching logic.
- `src/helpers/` — Business logic and data transformation utilities.

## 📏 Coding Standards

- **Clean UI**: Strictly use Tailwind utility classes.
- **Validation**: All forms must use Zod schemas.
- **Naming**: Kebab-case for files, PascalCase for components, camelCase for logic.
- **State**: Keep state local; elevate only when necessary using Context API.
- **Error Handling**: Standardized Axios interceptors and boundary catches.

---

Built for excellence with the Google Deepmind Advanced Agentic Coding team.
