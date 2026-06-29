import { useState, useEffect, useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { MapPin, Search, Plus, Calendar, Ticket, ChevronLeft, ChevronRight, LayoutGrid, List, SlidersHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { useTheme } from "@/layouts/dashboard-layout"
import { AppButton } from "@/components/controls/app-button"
import { AppSelect } from "@/components/controls/app-select"
import { AppCard } from "@/components/controls/app-card"
import { useGetEvents, useGetEventTypes } from "@/hooks/api/eventAPIHooks"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function cardClass(isLight: boolean, extra = "") {
  return cn(
    "rounded-[20px] border p-4",
    isLight ? "bg-white border-[#0A2463]/5 shadow-sm" : "bg-black border-white/10",
    extra
  )
}

function labelClass(isLight: boolean, muted = false) {
  if (muted) return isLight ? "text-[#0A2463]/50" : "text-white/50"
  return isLight ? "text-[#0A2463]" : "text-white"
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function EventsPage() {
  const { theme } = useTheme()
  const isLight = theme === "light"
  const navigate = useNavigate()
  
  // Local state for UI
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  
  // State for API Filters
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [eventTypeId, setEventTypeId] = useState<string | number>("")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [isPast, setIsPast] = useState<boolean | undefined>(undefined) // undefined = All, false = Active, true = Past
  const [sort, setSort] = useState("createdAt:desc")

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset to page 1 on new search
    }, 500)
    return () => clearTimeout(handler)
  }, [search])

  // Form for handling filter inputs
  const { control, watch, reset } = useForm({
    defaultValues: {
      type: "all",
      sort: "createdAt:desc"
    }
  })

  // Watch filter changes and update API state
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "type") {
        const selectedVal = value.type === "all" ? "" : value.type || "";
        setEventTypeId(selectedVal ? (isNaN(Number(selectedVal)) ? selectedVal : Number(selectedVal)) : "");
        setPage(1)
      }
      if (name === "sort") {
        setSort(value.sort || "createdAt:desc")
        setPage(1)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  // API Calls
  const { data: typesData } = useGetEventTypes()
  const { data: eventsData, isLoading } = useGetEvents({
    page,
    limit,
    ...(eventTypeId ? { eventTypeId } : {}),
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(isPast !== undefined ? { isPast } : {}),
    sort
  })

  // Parse responses
  const categories = useMemo(() => {
    const defaultOption = { label: "All Category", value: "all" }
    const items = typesData?.data || typesData?.items || (Array.isArray(typesData) ? typesData : [])
    
    if (Array.isArray(items)) {
      return [defaultOption, ...items.map((t: any) => ({
        label: t.name || "Unknown",
        value: t.id ? String(t.id) : (t._id ? String(t._id) : (t.eventTypeId ? String(t.eventTypeId) : t.name))
      }))]
    }
    return [defaultOption]
  }, [typesData])

  const eventsList = useMemo(() => {
    const d = eventsData?.data;
    if (Array.isArray(d)) return d;
    if (d?.items && Array.isArray(d.items)) return d.items;
    if (d?.events && Array.isArray(d.events)) return d.events;
    if (d?.data && Array.isArray(d.data)) return d.data;
    
    if (eventsData?.events && Array.isArray(eventsData.events)) return eventsData.events;
    if (eventsData?.items && Array.isArray(eventsData.items)) return eventsData.items;
    if (Array.isArray(eventsData)) return eventsData;
    
    return [];
  }, [eventsData])

  const totalPages = eventsData?.totalPages || 
                     (eventsData?.total && eventsData?.limit ? Math.ceil(eventsData.total / eventsData.limit) : 1)
  const accentColor = isLight ? "bg-[#e568f5]" : "bg-[#FFBF00]"
  const accentText = isLight ? "text-[#e568f5]" : "text-[#FFBF00]"

  return (
    <div className={cn("min-h-full p-4 md:p-6 space-y-6", isLight ? "bg-[#f5f6f8]" : "bg-black")}>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className={cn("text-2xl font-bold", labelClass(isLight))}>Events</h1>
        <AppButton 
          onClick={() => navigate("/events/create")}
          className={cn("rounded-full px-6", isLight ? "bg-[#e568f5] hover:bg-[#d04de0] text-white" : "bg-[#FFBF00] hover:bg-[#e6ac00] text-black")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </AppButton>
      </div>

      {/* Filters Section */}
      <div className={cn("flex flex-wrap items-center gap-3 p-2 rounded-2xl", isLight ? "bg-white" : "bg-white/5")}>
        
        {/* Left: Toggles */}
        <div className="flex items-center gap-2">
          {['all', 'active', 'past'].map(statusOption => {
            const isActive = (statusOption === 'all' && isPast === undefined) || 
                             (statusOption === 'active' && isPast === false) || 
                             (statusOption === 'past' && isPast === true)
            return (
              <button
                key={statusOption}
                onClick={() => {
                  if (statusOption === 'all') setIsPast(undefined)
                  if (statusOption === 'active') setIsPast(false)
                  if (statusOption === 'past') setIsPast(true)
                  setPage(1)
                }}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold transition-colors capitalize",
                  isActive 
                    ? (isLight ? "bg-[#e568f5] text-white" : "bg-[#FFBF00] text-black")
                    : (isLight ? "bg-transparent text-gray-500 hover:bg-gray-100" : "bg-transparent text-gray-400 hover:bg-white/10")
                )}
              >
                {statusOption}
              </button>
            )
          })}
        </div>

        <div className="flex-1 min-w-[20px]" />

        {/* Search */}
        <div className="relative w-full sm:w-auto min-w-[200px] max-w-[250px]">
          <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4", labelClass(isLight, true))} />
          <input
            type="text"
            placeholder="Search event, location, etc"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "w-full h-10 pl-9 pr-4 rounded-full text-sm outline-none transition-colors",
              isLight ? "bg-gray-50 hover:bg-gray-100 placeholder:text-gray-400" : "bg-black/20 hover:bg-black/40 text-white placeholder:text-white/40"
            )}
          />
        </div>

        {/* Reset Filter Button */}
        <button
          onClick={() => {
            setSearch("")
            setEventTypeId("")
            setIsPast(undefined)
            setSort("createdAt:desc")
            setPage(1)
            reset({ type: "all", sort: "createdAt:desc" })
          }}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-full transition-colors shrink-0",
            isLight ? "bg-gray-50 hover:bg-gray-200 text-[#0A2463]" : "bg-black/20 hover:bg-black/40 text-white"
          )}
          title="Reset Filters"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Dropdowns */}
        <div className="w-36">
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <AppSelect
                {...field}
                options={categories}
                className={cn("w-full rounded-full h-10 border-0", isLight ? "bg-[#f0f4fd] text-[#0A2463]" : "bg-black/20 text-white")}
              />
            )}
          />
        </div>


        <div className="w-36">
          <Controller
            control={control}
            name="sort"
            render={({ field }) => (
              <AppSelect
                {...field}
                options={[
                  { label: "Newest First", value: "createdAt:desc" },
                  { label: "Oldest First", value: "createdAt:asc" },
                ]}
                className={cn("w-full rounded-full h-10 border-0", isLight ? "bg-[#f0f4fd] text-[#0A2463]" : "bg-black/20 text-white")}
              />
            )}
          />
        </div>

        <div className="flex-1" />

        {/* View Toggles */}
        <div className="flex items-center gap-1 bg-black/5 dark:bg-black/20 p-1 rounded-full">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "p-2 rounded-full transition-colors",
              viewMode === "grid" 
                ? (isLight ? "bg-white shadow text-[#e568f5]" : "bg-gray-800 shadow text-[#FFBF00]")
                : (isLight ? "text-gray-400 hover:text-gray-700" : "text-white/40 hover:text-white")
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "p-2 rounded-full transition-colors",
              viewMode === "list" 
                ? (isLight ? "bg-white shadow text-[#e568f5]" : "bg-gray-800 shadow text-[#FFBF00]")
                : (isLight ? "text-gray-400 hover:text-gray-700" : "text-white/40 hover:text-white")
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid/List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e568f5]"></div>
        </div>
      ) : eventsList.length === 0 ? (
        <div className={cn("text-center py-20 rounded-2xl border", isLight ? "bg-white border-[#0A2463]/10" : "bg-black border-white/10")}>
          <p className={labelClass(isLight, true)}>No events found matching your filters.</p>
        </div>
      ) : (
        <div className={cn(
          "transition-all duration-300",
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
            : "flex flex-col gap-4"
        )}>
          {eventsList.map((ev: any, idx: number) => {
            const percentSold = ev.maxguestCapacity ? Math.min(100, Math.round(((ev.registeredGuests || 0) / ev.maxguestCapacity) * 100)) : (ev.percentSold || 0);
            const ticketsLeft = ev.maxguestCapacity ? ev.maxguestCapacity - (ev.registeredGuests || 0) : (ev.ticketsLeft || 0);
            
            return (
              <AppCard 
                key={ev.id || ev.eventId || idx} 
                hoverable
                className={cn(cardClass(isLight, "p-4"), viewMode === "list" ? "flex flex-col md:flex-row md:items-center gap-6" : "flex flex-col")}
              >
                {/* Image Section */}
                <div className={cn(
                  "relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0",
                  viewMode === "list" ? "w-full md:w-48 aspect-[4/3] mb-0" : "w-full aspect-[4/3] mb-4"
                )}>
                  {ev.bannerUrl ? (
                    <img src={ev.bannerUrl} alt={ev.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                  )}
                </div>

                {/* Content Section */}
                <div className={cn(
                  "flex-1 flex flex-col md:flex-row md:items-center gap-4 md:gap-6",
                  viewMode === "list" ? "" : "flex-col"
                )}>
                  
                  {/* Title & Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("px-3 py-1 rounded-full text-[10px] font-semibold", isLight ? "bg-[#f0f4fd] text-[#e568f5]" : "bg-fuchsia-900/30 text-fuchsia-300")}>
                        {ev.type || ev.category || ev.eventType?.name || "Event"}
                      </span>
                      {ev.status && (
                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1", isLight ? "bg-gray-100 text-gray-600" : "bg-gray-800 text-gray-300")}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", ev.status.toLowerCase() === 'active' ? "bg-green-500" : "bg-gray-400")}></span>
                          {ev.status}
                        </span>
                      )}
                    </div>
                    
                    <h3 className={cn("text-lg font-bold", viewMode === "list" ? "line-clamp-2" : "line-clamp-1", labelClass(isLight))}>
                      {ev.title || "Untitled Event"}
                    </h3>
                    
                    <div className="space-y-1.5">
                      <div className={cn("flex items-center gap-1.5 text-xs font-medium", labelClass(isLight, true))}>
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="line-clamp-1">{ev.location || "Location TBA"}</span>
                      </div>
                      <div className={cn("flex items-center gap-1.5 text-xs font-medium", labelClass(isLight, true))}>
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {ev.startDate ? new Date(ev.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Date TBA"} 
                          {" — "} 
                          {ev.startDate ? new Date(ev.startDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : "Time TBA"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Divider in List mode */}
                  {viewMode === "list" && <div className={cn("hidden md:block w-px h-16", isLight ? "bg-gray-100" : "bg-white/10")} />}

                  {/* Progress Section */}
                  <div className={cn(
                    "flex flex-col justify-center",
                    viewMode === "list" ? "w-full md:w-32 shrink-0 border-t md:border-0 border-gray-100 dark:border-white/10 pt-4 md:pt-0" : "mt-2"
                  )}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-baseline gap-1">
                        <span className={cn("text-lg font-bold leading-none", labelClass(isLight))}>{percentSold}%</span>
                        <span className={cn("text-[10px] font-medium", labelClass(isLight, true))}>Ticket Sold</span>
                      </div>
                    </div>
                    <div className={cn("h-1.5 w-full rounded-full overflow-hidden", isLight ? "bg-[#f0f4fd]" : "bg-white/10")}>
                      <div className={cn("h-full rounded-full", accentColor)} style={{ width: `${percentSold}%` }} />
                    </div>
                  </div>

                  {viewMode === "list" && <div className={cn("hidden md:block w-px h-16", isLight ? "bg-gray-100" : "bg-white/10")} />}

                  {/* Stats Section */}
                  <div className={cn(
                    "flex flex-row md:flex-col items-center md:items-start justify-between gap-2",
                    viewMode === "list" ? "w-full md:w-32 shrink-0 border-t md:border-0 border-gray-100 dark:border-white/10 pt-4 md:pt-0" : "mt-2 pt-4 border-t border-gray-100 dark:border-white/10"
                  )}>
                    <div className="flex items-center gap-2">
                      <div className={cn("flex items-center justify-center w-8 h-8 rounded-lg", isLight ? "bg-fuchsia-50 text-fuchsia-400" : "bg-white/5 text-white/50")}>
                        <Ticket className="w-4 h-4" />
                      </div>
                      <div>
                        <span className={cn("block text-sm font-bold", labelClass(isLight))}>{ticketsLeft}</span>
                        <span className={cn("block text-[10px] font-medium", labelClass(isLight, true))}>Tickets Left</span>
                      </div>
                    </div>

                    <div className={cn("px-4 py-2 rounded-xl", isLight ? "bg-[#f0f4fd]" : "bg-white/5")}>
                      <span className={cn("text-lg font-bold", accentText)}>
                        {ev.price ? `$${ev.price}` : "Free"}
                      </span>
                    </div>
                  </div>
                </div>
              </AppCard>
            )
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {!isLoading && eventsList.length > 0 && (
        <div className="flex items-center justify-between pt-4">
          <span className={cn("text-sm font-medium", labelClass(isLight, true))}>
            Showing page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-full transition-colors",
                page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 dark:hover:bg-gray-800",
                isLight ? "bg-white border text-gray-600" : "bg-white/10 text-white"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                // Simple logic for displaying pages (simplified for 5 pages max)
                let pageNum = i + 1;
                if (totalPages > 5 && page > 3) {
                  pageNum = page - 2 + i;
                  if (pageNum > totalPages) return null;
                }
                return (
                  <button
                    key={i}
                    onClick={() => setPage(pageNum)}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors",
                      page === pageNum
                        ? (isLight ? "bg-[#e568f5] text-white" : "bg-[#FFBF00] text-black")
                        : (isLight ? "bg-white text-gray-600 border hover:bg-gray-50" : "bg-transparent text-gray-400 hover:bg-white/10")
                    )}
                  >
                    {pageNum}
                  </button>
                )
              })}
              {totalPages > 5 && page < totalPages - 2 && (
                <>
                  <span className={labelClass(isLight, true)}>...</span>
                  <button
                    onClick={() => setPage(totalPages)}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors",
                      isLight ? "bg-white text-gray-600 border hover:bg-gray-50" : "bg-transparent text-gray-400 hover:bg-white/10"
                    )}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-full transition-colors",
                page === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 dark:hover:bg-gray-800",
                isLight ? "bg-white border text-gray-600" : "bg-white/10 text-white"
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
