import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"
import { useTheme } from "@/layouts/dashboard-layout"
import { MOCK_REVENUE, MOCK_TICKET_SEGMENTS } from "./mock-data"

// ---------------------------------------------------------------------------
// Ticket Sales – Donut
// ---------------------------------------------------------------------------
export function TicketSalesChart() {
  const { theme } = useTheme()
  const isLight = theme === "light"

  const colors = isLight
    ? ["#0A2463", "#0A2463aa", "#0A246340"]
    : ["#FFBF00", "#FFBF00aa", "#FFBF0040"]

  const total = MOCK_TICKET_SEGMENTS.reduce((s, d) => s + d.value, 0)

  return (
    <div
      className={cn(
        "rounded-2xl border p-6 space-y-4",
        isLight ? "bg-white border-[#0A2463]/10" : "bg-black border-white/10"
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn("font-semibold text-sm", isLight ? "text-[#0A2463]" : "text-white")}>
          Ticket Sales
        </span>
        <span className={cn("text-xs rounded-lg border px-2 py-1", isLight ? "border-[#0A2463]/15 text-[#0A2463]/60" : "border-white/10 text-white/50")}>
          This Week ↓
        </span>
      </div>

      <div className="relative flex justify-center">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={MOCK_TICKET_SEGMENTS} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
              {MOCK_TICKET_SEGMENTS.map((_, i) => (
                <Cell key={i} fill={colors[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={cn("text-xs", isLight ? "text-[#0A2463]/50" : "text-white/50")}>Total Ticket</span>
          <span className={cn("text-2xl font-bold", isLight ? "text-[#0A2463]" : "text-white")}>
            {total.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {MOCK_TICKET_SEGMENTS.map((seg, i) => (
          <div key={seg.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm inline-block" style={{ background: colors[i] }} />
              <span className={cn("text-xs", isLight ? "text-[#0A2463]/70" : "text-white/60")}>{seg.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn("text-sm font-semibold", isLight ? "text-[#0A2463]" : "text-white")}>{seg.value.toLocaleString()}</span>
              <span className={cn("text-xs rounded px-1.5 py-0.5", isLight ? "bg-[#0A2463]/8 text-[#0A2463]" : "bg-[#FFBF00]/10 text-[#FFBF00]")}>{seg.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sales Revenue – Bar Chart
// ---------------------------------------------------------------------------
export function SalesRevenueChart() {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const barColor = isLight ? "#0A2463" : "#FFBF00"
  const barColorMuted = isLight ? "#0A246340" : "#FFBF0040"

  return (
    <div
      className={cn(
        "rounded-2xl border p-6 space-y-4",
        isLight ? "bg-white border-[#0A2463]/10" : "bg-black border-white/10"
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={cn("font-semibold text-sm", isLight ? "text-[#0A2463]" : "text-white")}>Sales Revenue</p>
          <p className={cn("text-xs mt-0.5", isLight ? "text-[#0A2463]/50" : "text-white/50")}>Total Revenue</p>
          <p className={cn("text-xl font-bold", isLight ? "text-[#0A2463]" : "text-white")}>$348,805</p>
        </div>
        <span className={cn("text-xs rounded-lg border px-2 py-1 self-start", isLight ? "border-[#0A2463]/15 text-[#0A2463]/60" : "border-white/10 text-white/50")}>
          Last 8 Months ↓
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <span className={cn("flex items-center gap-1.5", isLight ? "text-[#0A2463]/60" : "text-white/50")}>
          <span className="h-2 w-2 rounded-full inline-block" style={{ background: barColor }} /> Revenue
        </span>
        <span className={cn("flex items-center gap-1.5", isLight ? "text-[#0A2463]/60" : "text-white/50")}>
          <span className="h-2 w-2 rounded-full inline-block" style={{ background: barColorMuted }} /> Profit
        </span>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={MOCK_REVENUE} barGap={2} barCategoryGap="30%">
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: isLight ? "#0A246399" : "#ffffff80" }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip
            contentStyle={{ background: isLight ? "#fff" : "#000", border: `1px solid ${isLight ? "#0A246320" : "#ffffff20"}`, borderRadius: 8, fontSize: 11 }}
            labelStyle={{ color: isLight ? "#0A2463" : "#fff" }}
            itemStyle={{ color: isLight ? "#0A2463" : "#fff" }}
            formatter={(v: any) => [`$${(Number(v) / 1000).toFixed(0)}K`]}
          />
          <Bar dataKey="revenue" fill={barColor} radius={[4, 4, 0, 0]} />
          <Bar dataKey="profit" fill={barColorMuted} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
