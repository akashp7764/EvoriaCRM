import { useState, useCallback, createContext, useContext } from "react"
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Inbox,
  CalendarDays,
  Ticket,
  DollarSign,
  Image,
  MessageSquare,
  LogOut,
  Sun,
  Moon,
  Menu,
  Search,
  Bell,
  Settings,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getLoggedInUser } from "@/helpers/auth"

// ---------------------------------------------------------------------------
// Theme Context
// ---------------------------------------------------------------------------
type Theme = "light" | "dark"
interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

// ---------------------------------------------------------------------------
// Navigation items
// ---------------------------------------------------------------------------
const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Bookings", icon: BookOpen, to: "/bookings" },
  { label: "Invoices", icon: FileText, to: "/invoices" },
  { label: "Inbox", icon: Inbox, to: "/inbox" },
  { label: "Calendar", icon: CalendarDays, to: "/calendar" },
  { label: "Events", icon: Ticket, to: "/events" },
  { label: "Financials", icon: DollarSign, to: "/financials" },
  { label: "Gallery", icon: Image, to: "/gallery" },
  { label: "Feedback", icon: MessageSquare, to: "/feedback" },
  { label: "Managers", icon: Users, to: "/managers" },
]

// ---------------------------------------------------------------------------
// Shared nav-link builder
// ---------------------------------------------------------------------------
interface NavItemProps {
  item: (typeof NAV_ITEMS)[number]
  collapsed: boolean
  theme: Theme
  onClick?: () => void
}

function SidebarNavItem({ item, collapsed, theme, onClick }: NavItemProps) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
          collapsed && "justify-center px-2",
          isActive
            ? theme === "light"
              ? "bg-[#0A2463] text-white"
              : "bg-[#FFBF00] text-black"
            : theme === "light"
              ? "text-[#0A2463]/70 hover:bg-[#0A2463]/10 hover:text-[#0A2463]"
              : "text-white/60 hover:bg-[#FFBF00]/10 hover:text-[#FFBF00]"
        )
      }
      title={collapsed ? item.label : undefined}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  )
}

// ---------------------------------------------------------------------------
// Sidebar content (shared between fixed & mobile drawer)
// ---------------------------------------------------------------------------
interface SidebarContentProps {
  collapsed: boolean
  theme: Theme
  toggleTheme: () => void
  onNavClick?: () => void
  onSignOut: () => void
}

function SidebarContent({
  collapsed,
  theme,
  toggleTheme,
  onNavClick,
  onSignOut,
}: SidebarContentProps) {
  const user = getLoggedInUser()
  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (item.to === "/managers") {
      return user?.role === "ADMIN"
    }
    return true
  })

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b px-4",
          theme === "light" ? "border-[#0A2463]/10" : "border-white/10",
          collapsed ? "justify-center" : "gap-2"
        )}
      >
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-sm",
            theme === "light"
              ? "bg-[#0A2463] text-white"
              : "bg-[#FFBF00] text-black"
          )}
        >
          E
        </div>
        {!collapsed && (
          <span
            className={cn(
              "text-lg font-bold tracking-tight",
              theme === "light" ? "text-[#0A2463]" : "text-white"
            )}
          >
            Evoria
          </span>
        )}
      </div>

      {/* Nav links */}
      <nav className="sidebar-nav flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {filteredNavItems.map((item) => (
          <SidebarNavItem
            key={item.to}
            item={item}
            collapsed={collapsed}
            theme={theme}
            onClick={onNavClick}
          />
        ))}
      </nav>

      {/* Footer actions */}
      <div
        className={cn(
          "shrink-0 border-t px-3 py-4 space-y-1",
          theme === "light" ? "border-[#0A2463]/10" : "border-white/10"
        )}
      >
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
            collapsed && "justify-center px-2",
            theme === "light"
              ? "text-[#0A2463]/70 hover:bg-[#0A2463]/10 hover:text-[#0A2463]"
              : "text-white/60 hover:bg-[#FFBF00]/10 hover:text-[#FFBF00]"
          )}
          title={collapsed ? (theme === "light" ? "Dark Mode" : "Light Mode") : undefined}
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5 shrink-0" />
          ) : (
            <Sun className="h-5 w-5 shrink-0" />
          )}
          {!collapsed && (
            <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
          )}
        </button>

        {/* Sign out */}
        <button
          onClick={onSignOut}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
            collapsed && "justify-center px-2",
            theme === "light"
              ? "text-[#0A2463]/70 hover:bg-[#0A2463]/10 hover:text-[#0A2463]"
              : "text-white/60 hover:bg-[#FFBF00]/10 hover:text-[#FFBF00]"
          )}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// DashboardLayout (Phase 1 shell)
// ---------------------------------------------------------------------------
export default function DashboardLayout() {
  const [theme, setTheme] = useState<Theme>("light")
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const user = getLoggedInUser()
  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (item.to === "/managers") {
      return user?.role === "ADMIN"
    }
    return true
  })

  const pageTitle = filteredNavItems.find(item => location.pathname.startsWith(item.to))?.label || "Dashboard"

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light"
      if (next === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
      return next
    })
  }, [])

  const handleSignOut = useCallback(() => {
    navigate("/login")
  }, [navigate])

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        className={cn(
          "flex h-screen w-full overflow-hidden",
          theme === "light" ? "bg-[#0A2463]/5" : "bg-black"
        )}
      >
        {/* ----------------------------------------------------------------
            Fixed Desktop Sidebar  (xl: full-width | md: icon-only | base: hidden)
            Text labels are rendered but visually hidden at md: via xl:block.
        ---------------------------------------------------------------- */}
        <aside
          className={cn(
            "hidden md:flex md:w-20 xl:w-64 shrink-0 flex-col h-screen sticky top-0 transition-all duration-300",
            theme === "light"
              ? "bg-white border-r border-[#0A2463]/10"
              : "bg-black border-r border-white/10"
          )}
        >
          {/* Logo */}
          <div
            className={cn(
              "flex h-16 shrink-0 items-center justify-center xl:justify-start border-b px-2 xl:px-4 gap-2",
              theme === "light" ? "border-[#0A2463]/10" : "border-white/10"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-sm",
                theme === "light"
                  ? "bg-[#0A2463] text-white"
                  : "bg-[#FFBF00] text-black"
              )}
            >
              E
            </div>
            <span
              className={cn(
                "hidden xl:block text-lg font-bold tracking-tight",
                theme === "light" ? "text-[#0A2463]" : "text-white"
              )}
            >
              Evoria
            </span>
          </div>

          {/* Nav */}
          <nav className="sidebar-nav flex-1 overflow-y-auto px-2 xl:px-3 py-4 space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={item.label}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-2 xl:px-3 py-2.5 text-sm font-medium transition-all duration-150 justify-center xl:justify-start",
                      isActive
                        ? theme === "light"
                          ? "bg-[#0A2463] text-white"
                          : "bg-[#FFBF00] text-black"
                        : theme === "light"
                          ? "text-[#0A2463]/70 hover:bg-[#0A2463]/10 hover:text-[#0A2463]"
                          : "text-white/60 hover:bg-[#FFBF00]/10 hover:text-[#FFBF00]"
                    )
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="hidden xl:block">{item.label}</span>
                </NavLink>
              )
            })}
          </nav>

          {/* Footer */}
          <div
            className={cn(
              "shrink-0 border-t px-2 xl:px-3 py-4 space-y-1",
              theme === "light" ? "border-[#0A2463]/10" : "border-white/10"
            )}
          >
            <button
              onClick={toggleTheme}
              title={theme === "light" ? "Dark Mode" : "Light Mode"}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-2 xl:px-3 py-2.5 text-sm font-medium transition-all duration-150 justify-center xl:justify-start",
                theme === "light"
                  ? "text-[#0A2463]/70 hover:bg-[#0A2463]/10 hover:text-[#0A2463]"
                  : "text-white/60 hover:bg-[#FFBF00]/10 hover:text-[#FFBF00]"
              )}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 shrink-0" />
              ) : (
                <Sun className="h-5 w-5 shrink-0" />
              )}
              <span className="hidden xl:block">
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </span>
            </button>

            <button
              onClick={handleSignOut}
              title="Sign Out"
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-2 xl:px-3 py-2.5 text-sm font-medium transition-all duration-150 justify-center xl:justify-start",
                theme === "light"
                  ? "text-[#0A2463]/70 hover:bg-[#0A2463]/10 hover:text-[#0A2463]"
                  : "text-white/60 hover:bg-[#FFBF00]/10 hover:text-[#FFBF00]"
              )}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span className="hidden xl:block">Sign Out</span>
            </button>
          </div>
        </aside>

        {/* ----------------------------------------------------------------
            Mobile Drawer Overlay
        ---------------------------------------------------------------- */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeMobile}
            />
            {/* Drawer panel */}
            <aside
              className={cn(
                "absolute left-0 top-0 h-full w-72 shadow-2xl z-50",
                theme === "light"
                  ? "bg-white"
                  : "bg-black border-r border-white/10"
              )}
            >
              <SidebarContent
                collapsed={false}
                theme={theme}
                toggleTheme={toggleTheme}
                onNavClick={closeMobile}
                onSignOut={handleSignOut}
              />
            </aside>
          </div>
        )}

        {/* ----------------------------------------------------------------
            Main column (header + content)
        ---------------------------------------------------------------- */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          {/* Top Header */}
          <header
            className={cn(
              "flex h-16 shrink-0 items-center gap-4 px-4 md:px-6 border-b",
              theme === "light"
                ? "bg-white border-[#0A2463]/10"
                : "bg-black border-white/10"
            )}
          >
            {/* Mobile: hamburger left */}
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu
                className={cn(
                  "h-6 w-6",
                  theme === "light" ? "text-[#0A2463]" : "text-white"
                )}
              />
            </button>

            {/* Mobile: centered logo */}
            <div
              className={cn(
                "md:hidden flex-1 flex justify-center text-base font-bold tracking-tight",
                theme === "light" ? "text-[#0A2463]" : "text-white"
              )}
            >
              Evoria
            </div>

            {/* Desktop/Tablet: page title */}
            <div className="hidden md:flex flex-col">
              <span
                className={cn(
                  "text-xs font-medium mb-0.5",
                  theme === "light" ? "text-fuchsia-500" : "text-[#FFBF00]"
                )}
              >
                Dashboard / {pageTitle}
              </span>
              <span
                className={cn(
                  "text-xl font-bold leading-none",
                  theme === "light" ? "text-[#0A2463]" : "text-white"
                )}
              >
                {pageTitle}
              </span>
            </div>

            {/* Desktop: global search (hidden on tablet) */}
            <div className="hidden xl:flex flex-1 mx-6">
              <div
                className={cn(
                  "flex w-full max-w-md items-center gap-2 rounded-xl border px-3 py-2",
                  theme === "light"
                    ? "border-[#0A2463]/15 bg-[#0A2463]/5"
                    : "border-white/10 bg-white/5"
                )}
              >
                <Search
                  className={cn(
                    "h-4 w-4 shrink-0",
                    theme === "light" ? "text-[#0A2463]/40" : "text-white/40"
                  )}
                />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className={cn(
                    "flex-1 bg-transparent text-sm outline-none",
                    theme === "light"
                      ? "text-[#0A2463] placeholder:text-[#0A2463]/40"
                      : "text-white placeholder:text-white/40"
                  )}
                />
              </div>
            </div>

            {/* Right actions */}
            <div className="ml-auto flex items-center gap-2 md:gap-3">
              {/* Notification bell */}
              <button
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                  theme === "light"
                    ? "bg-[#0A2463]/5 text-[#0A2463] hover:bg-[#0A2463]/10"
                    : "bg-white/5 text-white hover:bg-white/10"
                )}
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
              </button>

              {/* Settings */}
              <button
                className={cn(
                  "hidden md:flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
                  theme === "light"
                    ? "bg-[#0A2463]/5 text-[#0A2463] hover:bg-[#0A2463]/10"
                    : "bg-white/5 text-white hover:bg-white/10"
                )}
                aria-label="Settings"
              >
                <Settings className="h-4 w-4" />
              </button>

              {/* Avatar */}
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold cursor-pointer select-none",
                  theme === "light"
                    ? "bg-[#0A2463] text-white"
                    : "bg-[#FFBF00] text-black"
                )}
              >
                OL
              </div>

              {/* Mobile close — hidden since backdrop handles it */}
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  )
}
