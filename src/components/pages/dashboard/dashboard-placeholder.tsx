import { useTheme } from "@/layouts/dashboard-layout"
import { cn } from "@/lib/utils"

export default function DashboardPlaceholder() {
  const { theme } = useTheme()

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 min-h-full">
      <div
        className={cn(
          "flex flex-col items-center gap-3 rounded-2xl border p-10 text-center max-w-sm w-full",
          theme === "light"
            ? "border-[#0A2463]/10 bg-white"
            : "border-white/10 bg-white/5"
        )}
      >
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold",
            theme === "light"
              ? "bg-[#0A2463] text-white"
              : "bg-[#FFBF00] text-black"
          )}
        >
          ✓
        </div>
        <h1
          className={cn(
            "text-xl font-bold",
            theme === "light" ? "text-[#0A2463]" : "text-white"
          )}
        >
          Phase 1 Complete
        </h1>
        <p
          className={cn(
            "text-sm",
            theme === "light" ? "text-[#0A2463]/60" : "text-white/60"
          )}
        >
          The App Shell is ready. Resize your browser to test the sidebar across
          mobile, tablet, and desktop breakpoints, then approve to start Phase 2.
        </p>
      </div>
    </div>
  )
}
