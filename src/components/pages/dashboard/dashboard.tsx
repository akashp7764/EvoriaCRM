import { cn } from "@/lib/utils"
import { useTheme } from "@/layouts/dashboard-layout"
import { MapPin, Clock, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { TicketSalesChart, SalesRevenueChart } from "./dashboard-charts"
import {
  MOCK_TOP_STATS, MOCK_POPULAR_EVENTS, MOCK_UPCOMING_EVENT,
  MOCK_SCHEDULE, MOCK_ALL_EVENTS, MOCK_RECENT_BOOKINGS, MOCK_RECENT_ACTIVITY,
} from "./mock-data"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function card(isLight: boolean, extra = "") {
  return cn(
    "rounded-2xl border",
    isLight ? "bg-white border-[#0A2463]/10" : "bg-black border-white/10",
    extra
  )
}

function label(isLight: boolean, muted = false) {
  if (muted) return isLight ? "text-[#0A2463]/50" : "text-white/50"
  return isLight ? "text-[#0A2463]" : "text-white"
}

// ---------------------------------------------------------------------------
// Top Stat Card
// ---------------------------------------------------------------------------
function StatCard({ stat, isLight }: { stat: typeof MOCK_TOP_STATS[0]; isLight: boolean }) {
  return (
    <div className={cn(card(isLight, "p-6 flex items-center gap-4 min-w-[180px] snap-start shrink-0 flex-1"))}>
      <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl text-2xl", isLight ? "bg-[#0A2463]/8" : "bg-[#FFBF00]/10")}>
        {stat.icon}
      </div>
      <div>
        <p className={cn("text-xs font-medium", label(isLight, true))}>{stat.label}</p>
        <p className={cn("text-2xl font-bold mt-0.5", label(isLight))}>{stat.value}</p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Popular Events
// ---------------------------------------------------------------------------
function PopularEvents({ isLight }: { isLight: boolean }) {
  return (
    <div className={card(isLight, "p-6 space-y-4")}>
      <div className="flex items-center justify-between">
        <span className={cn("font-semibold text-sm", label(isLight))}>Popular Events</span>
        <span className={cn("text-xs rounded-lg border px-2 py-1", isLight ? "border-[#0A2463]/15 text-[#0A2463]/60" : "border-white/10 text-white/50")}>Popular ↓</span>
      </div>
      <div className="space-y-4">
        {MOCK_POPULAR_EVENTS.map((ev) => (
          <div key={ev.id} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className={label(isLight)}>{ev.category}</span>
              <span className={label(isLight, true)}>{ev.total}</span>
            </div>
            <div className={cn("h-2 w-full rounded-full overflow-hidden", isLight ? "bg-[#0A2463]/10" : "bg-white/10")}>
              <div
                className={cn("h-full rounded-full", isLight ? "bg-[#0A2463]" : "bg-[#FFBF00]")}
                style={{ width: `${ev.percent}%` }}
              />
            </div>
            <span className={cn("text-xs font-semibold", isLight ? "text-[#0A2463]" : "text-[#FFBF00]")}>{ev.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// All Events – horizontal scroll
// ---------------------------------------------------------------------------
function AllEvents({ isLight }: { isLight: boolean }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className={cn("font-semibold", label(isLight))}>All Events</span>
        <button className={cn("text-xs font-medium", isLight ? "text-[#0A2463]" : "text-[#FFBF00]")}>View All Event →</button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
        {MOCK_ALL_EVENTS.map((ev) => (
          <div key={ev.id} className={cn(card(isLight, "min-w-[220px] shrink-0 snap-start overflow-hidden hover:-translate-y-1 transition-transform duration-200"))}>
            <div className="relative h-36 w-full overflow-hidden">
              <img src={ev.image} alt={ev.title} className="h-full w-full object-cover" />
              <span className={cn("absolute left-2 top-2 rounded-lg px-2 py-0.5 text-xs font-medium", isLight ? "bg-[#0A2463] text-white" : "bg-[#FFBF00] text-black")}>
                {ev.category}
              </span>
            </div>
            <div className="p-3 space-y-1">
              <p className={cn("font-semibold text-sm leading-tight line-clamp-2", label(isLight))}>{ev.title}</p>
              <p className={cn("text-xs", label(isLight, true))}>{ev.location}</p>
              <div className="flex items-center justify-between pt-1">
                <span className={cn("text-xs", label(isLight, true))}>{ev.date}</span>
                <span className={cn("text-base font-bold", isLight ? "text-[#0A2463]" : "text-[#FFBF00]")}>${ev.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Recent Bookings table
// ---------------------------------------------------------------------------
const STATUS_STYLES: Record<string, { light: string; dark: string }> = {
  Confirmed: { light: "bg-[#0A2463]/10 text-[#0A2463]",   dark: "bg-[#FFBF00]/15 text-[#FFBF00]" },
  Pending:   { light: "bg-amber-50 text-amber-700",         dark: "bg-amber-900/30 text-amber-400" },
  Cancelled: { light: "bg-red-50 text-red-600",             dark: "bg-red-900/30 text-red-400" },
}

function RecentBookings({ isLight }: { isLight: boolean }) {
  return (
    <div className={card(isLight, "p-6 space-y-4")}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className={cn("font-semibold", label(isLight))}>Recent Bookings</span>
        <div className="flex items-center gap-2">
          <div className={cn("flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs", isLight ? "border-[#0A2463]/15" : "border-white/10")}>
            <span className={label(isLight, true)}>Search name, event…</span>
          </div>
          <span className={cn("text-xs rounded-lg border px-2 py-1.5", isLight ? "border-[#0A2463]/15 text-[#0A2463]/60" : "border-white/10 text-white/50")}>This Week ↓</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={cn("border-b text-xs", isLight ? "border-[#0A2463]/10 text-[#0A2463]/50" : "border-white/10 text-white/40")}>
              {["Invoice ID", "Date", "Name", "Event", "Qty", "Amount", "Status"].map((h) => (
                <th key={h} className="pb-3 text-left font-medium pr-4 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-transparent">
            {MOCK_RECENT_BOOKINGS.map((b) => {
              const s = STATUS_STYLES[b.status]
              return (
                <tr key={b.invoiceId} className={cn("group text-xs transition-colors", isLight ? "hover:bg-[#0A2463]/3" : "hover:bg-white/3")}>
                  <td className={cn("py-3 pr-4 font-medium", label(isLight))}>{b.invoiceId}</td>
                  <td className={cn("py-3 pr-4 whitespace-nowrap", label(isLight, true))}>{b.date}</td>
                  <td className={cn("py-3 pr-4 font-medium whitespace-nowrap", label(isLight))}>{b.name}</td>
                  <td className={cn("py-3 pr-4", label(isLight, true))}>
                    <div>{b.event}</div>
                    <div className={cn("text-xs", label(isLight, true))}>{b.category}</div>
                  </td>
                  <td className={cn("py-3 pr-4 text-center", label(isLight))}>{b.qty}</td>
                  <td className={cn("py-3 pr-4 font-semibold", label(isLight))}>${b.amount}</td>
                  <td className="py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", isLight ? s.light : s.dark)}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Upcoming Event card (right panel)
// ---------------------------------------------------------------------------
function UpcomingEventCard({ isLight }: { isLight: boolean }) {
  const ev = MOCK_UPCOMING_EVENT
  return (
    <div className={card(isLight, "p-4 space-y-3")}>
      <div className="flex items-center justify-between">
        <span className={cn("font-semibold text-sm", label(isLight))}>Upcoming Event</span>
        <MoreHorizontal className={cn("h-4 w-4", label(isLight, true))} />
      </div>
      <div className="relative rounded-xl overflow-hidden h-40">
        <img src={ev.image} alt={ev.title} className="h-full w-full object-cover" />
        <span className={cn("absolute left-2 top-2 rounded-lg px-2 py-0.5 text-xs font-medium", isLight ? "bg-[#0A2463] text-white" : "bg-[#FFBF00] text-black")}>
          {ev.category}
        </span>
      </div>
      <div className="space-y-1">
        <p className={cn("font-bold text-sm leading-snug", label(isLight))}>{ev.title}</p>
        <p className={cn("text-xs flex items-center gap-1", label(isLight, true))}>
          <MapPin className="h-3 w-3" />{ev.location}
        </p>
        <p className={cn("text-xs line-clamp-2", label(isLight, true))}>{ev.description}</p>
      </div>
      <div className="flex items-center justify-between">
        <div className={cn("text-xs space-y-0.5", label(isLight, true))}>
          <p className="flex items-center gap-1"><Clock className="h-3 w-3" />{ev.date}</p>
          <p className="pl-4">{ev.time}</p>
        </div>
        <button className={cn("rounded-xl px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80", isLight ? "bg-[#0A2463] text-white" : "bg-[#FFBF00] text-black")}>
          View Details
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mini Calendar
// ---------------------------------------------------------------------------
const CAL_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

function MiniCalendar({ isLight }: { isLight: boolean }) {
  const year = 2029, month = 2
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  const today = 14

  return (
    <div className={card(isLight, "p-4 space-y-3")}>
      <div className="flex items-center justify-between">
        <span className={cn("font-semibold text-sm", label(isLight))}>March 2029 ↓</span>
        <div className="flex items-center gap-1">
          <button className={cn("rounded p-1 hover:opacity-70", label(isLight, true))}><ChevronLeft className="h-4 w-4" /></button>
          <button className={cn("rounded p-1 hover:opacity-70", label(isLight, true))}><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {CAL_DAYS.map((d) => (
          <span key={d} className={cn("text-xs font-medium pb-1", label(isLight, true))}>{d}</span>
        ))}
        {cells.map((day, i) => (
          <button
            key={i}
            disabled={!day}
            className={cn(
              "h-7 w-7 mx-auto rounded-full text-xs transition-colors",
              !day && "invisible",
              day === today
                ? isLight ? "bg-[#0A2463] text-white font-bold" : "bg-[#FFBF00] text-black font-bold"
                : isLight ? "text-[#0A2463]/70 hover:bg-[#0A2463]/10" : "text-white/60 hover:bg-white/10"
            )}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Schedule Items
// ---------------------------------------------------------------------------
function ScheduleItems({ isLight }: { isLight: boolean }) {
  return (
    <div className="space-y-3">
      {MOCK_SCHEDULE.map((item) => (
        <div key={item.id} className={card(isLight, "p-3 flex gap-3 items-start")}>
          <div className={cn("flex flex-col items-center justify-center rounded-xl min-w-[44px] h-11 text-center", isLight ? "bg-[#0A2463] text-white" : "bg-[#FFBF00] text-black")}>
            <span className="text-base font-bold leading-none">{item.day}</span>
            <span className="text-xs">{item.dayLabel}</span>
          </div>
          <div className="min-w-0 space-y-0.5">
            <p className={cn("font-semibold text-sm truncate", label(isLight))}>{item.title}</p>
            <p className={cn("text-xs truncate", label(isLight, true))}>{item.venue}</p>
            <div className="flex items-center gap-2 text-xs">
              <span className={cn("rounded px-1.5 py-0.5", isLight ? "bg-[#0A2463]/8 text-[#0A2463]" : "bg-[#FFBF00]/10 text-[#FFBF00]")}>{item.category}</span>
              <span className={cn("flex items-center gap-0.5", label(isLight, true))}><Clock className="h-3 w-3" />{item.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Recent Activity
// ---------------------------------------------------------------------------
function RecentActivity({ isLight }: { isLight: boolean }) {
  return (
    <div className={card(isLight, "p-6 space-y-4")}>
      <div className="flex items-center justify-between">
        <span className={cn("font-semibold", label(isLight))}>Recent Activity</span>
        <MoreHorizontal className={cn("h-4 w-4", label(isLight, true))} />
      </div>
      <div className="space-y-4">
        {MOCK_RECENT_ACTIVITY.map((act) => (
          <div key={act.id} className="flex items-start gap-3">
            <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold", isLight ? "bg-[#0A2463] text-white" : "bg-[#FFBF00] text-black")}>
              {act.avatar}
            </div>
            <div className="min-w-0 space-y-0.5">
              <p className={cn("text-xs leading-relaxed", label(isLight))}>{act.text}</p>
              <p className={cn("text-xs", label(isLight, true))}>{act.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Dashboard Page
// ---------------------------------------------------------------------------
export default function DashboardPage() {
  const { theme } = useTheme()
  const isLight = theme === "light"

  return (
    <div className={cn("min-h-full p-4 md:p-6 space-y-6", isLight ? "bg-[#0A2463]/5" : "bg-black")}>

      {/* Top Stats */}
      <div className="flex gap-4 overflow-x-auto snap-x md:grid md:grid-cols-3 md:overflow-visible pb-1">
        {MOCK_TOP_STATS.map((s) => <StatCard key={s.id} stat={s} isLight={isLight} />)}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* Left column */}
        <div className="xl:col-span-8 space-y-6">
          {/* Charts row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TicketSalesChart />
            <SalesRevenueChart />
          </div>

          <PopularEvents isLight={isLight} />
          <AllEvents isLight={isLight} />
          <RecentBookings isLight={isLight} />
        </div>

        {/* Right column */}
        <div className="xl:col-span-4 space-y-6">
          <UpcomingEventCard isLight={isLight} />
          <MiniCalendar isLight={isLight} />
          <ScheduleItems isLight={isLight} />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity isLight={isLight} />

      {/* Footer */}
      <p className={cn("text-center text-xs pb-2", label(isLight, true))}>
        Copyright © 2025 Peterdraw · Privacy Policy · Terms and conditions · Contact
      </p>
    </div>
  )
}
