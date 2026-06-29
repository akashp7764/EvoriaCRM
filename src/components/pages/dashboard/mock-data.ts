// ---------------------------------------------------------------------------
// Dashboard Mock Data
// ---------------------------------------------------------------------------

export interface TopStat {
  id: string
  label: string
  value: string
  icon: string
}

export interface RevenuePoint {
  month: string
  revenue: number
  profit: number
}

export interface PopularEvent {
  id: string
  category: string
  percent: number
  total: string
}

export interface UpcomingScheduleItem {
  id: string
  day: number
  dayLabel: string
  title: string
  venue: string
  category: string
  time: string
  color: string
}

export interface AllEvent {
  id: string
  title: string
  location: string
  date: string
  price: number
  category: string
  image: string
}

export interface RecentBooking {
  invoiceId: string
  date: string
  name: string
  event: string
  category: string
  qty: number
  amount: number
  status: "Confirmed" | "Pending" | "Cancelled"
}

export interface RecentActivity {
  id: string
  avatar: string
  text: string
  time: string
}

// ---------------------------------------------------------------------------

export const MOCK_TOP_STATS: TopStat[] = [
  { id: "upcoming", label: "Upcoming Events", value: "345", icon: "📅" },
  { id: "bookings", label: "Total Bookings", value: "1,798", icon: "📖" },
  { id: "tickets", label: "Tickets Sold", value: "1,250", icon: "🎟️" },
]

export const MOCK_REVENUE: RevenuePoint[] = [
  { month: "Jan", revenue: 30000, profit: 12000 },
  { month: "Feb", revenue: 28000, profit: 10000 },
  { month: "Mar", revenue: 35000, profit: 15000 },
  { month: "Apr", revenue: 56320, profit: 22000 },
  { month: "May", revenue: 42000, profit: 18000 },
  { month: "Jun", revenue: 38000, profit: 14000 },
  { month: "Jul", revenue: 50000, profit: 20000 },
  { month: "Aug", revenue: 45000, profit: 17000 },
]

export const MOCK_TICKET_SEGMENTS = [
  { name: "Sold Out",     value: 1251, pct: 45 },
  { name: "Fully Booked", value: 834,  pct: 30 },
  { name: "Available",    value: 695,  pct: 25 },
]

export const MOCK_POPULAR_EVENTS: PopularEvent[] = [
  { id: "music",   category: "Music",   percent: 40, total: "20,000 Events" },
  { id: "sports",  category: "Sports",  percent: 35, total: "17,500 Events" },
  { id: "fashion", category: "Fashion", percent: 15, total: "12,500 Events" },
]

export const MOCK_UPCOMING_EVENT = {
  title: "Rhythm & Beats Music Festival",
  location: "Sunset Park, Los Angeles, CA",
  description:
    "Immerse yourself in electrifying performances by top pop, rock, EDM, and hip-hop artists, indulge in delicious food and drinks…",
  date: "Apr 20, 2029",
  time: "12:00 PM – 11:00 PM",
  category: "Music",
  image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
}

export const MOCK_SCHEDULE: UpcomingScheduleItem[] = [
  {
    id: "s1",
    day: 3,
    dayLabel: "Sat",
    title: "Panel Discussion",
    venue: "Tech Beyond 2024",
    category: "Technology",
    time: "10:00 AM – 12:00 PM",
    color: "navy",
  },
  {
    id: "s2",
    day: 5,
    dayLabel: "Mon",
    title: "Live Concert",
    venue: "Echo Beats Festival",
    category: "Music",
    time: "6:00 PM – 11:00 PM",
    color: "accent",
  },
  {
    id: "s3",
    day: 23,
    dayLabel: "Fri",
    title: "Fashion Showcase",
    venue: "Spring Trends Runway Show",
    category: "Fashion",
    time: "3:00 PM – 5:00 PM",
    color: "muted",
  },
]

export const MOCK_ALL_EVENTS: AllEvent[] = [
  {
    id: "e1",
    title: "Champions League Screening Night",
    location: "SkyDome Stadium, Toronto, ON",
    date: "Apr 20, 2029",
    price: 30,
    category: "Sport",
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&q=80",
  },
  {
    id: "e2",
    title: "Culinary Delights Festival",
    location: "Gourmet Plaza, San Francisco, CA",
    date: "Mar 3, 2029",
    price: 40,
    category: "Food & Culinary",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80",
  },
  {
    id: "e3",
    title: "Artistry Unveiled: Modern Art Expo",
    location: "Vogue Hall, Los Angeles, CA",
    date: "Mar 10, 2029",
    price: 110,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=400&q=80",
  },
  {
    id: "e4",
    title: "Symphony Under the Stars",
    location: "Millennium Park, Chicago, IL",
    date: "May 15, 2029",
    price: 75,
    category: "Music",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80",
  },
]

export const MOCK_RECENT_BOOKINGS: RecentBooking[] = [
  { invoiceId: "INV10011", date: "2029/02/15 10:30 AM", name: "Jackson Moore",    event: "Symphony Under the Stars",          category: "Music",            qty: 2, amount: 100, status: "Confirmed" },
  { invoiceId: "INV10012", date: "2029/02/16 03:45 PM", name: "Alicia Smithson",  event: "Runway Revolution 2024",            category: "Fashion",          qty: 1, amount: 120, status: "Pending"   },
  { invoiceId: "INV10013", date: "2029/02/17 01:15 PM", name: "Marcus Rawles",    event: "Global Wellness Summit",            category: "Beauty & Wellness",qty: 3, amount: 240, status: "Confirmed" },
  { invoiceId: "INV10014", date: "2029/02/18 09:00 AM", name: "Patrick Cooper",   event: "Champions League Screening Night",  category: "Sport",            qty: 4, amount: 120, status: "Cancelled" },
  { invoiceId: "INV10015", date: "2029/02/18 05:30 PM", name: "Gilda Ramos",      event: "Artistry Unveiled: Modern Art Expo",category: "Art & Design",     qty: 2, amount: 50,  status: "Confirmed" },
]

export const MOCK_RECENT_ACTIVITY: RecentActivity[] = [
  {
    id: "a1",
    avatar: "SW",
    text: 'Admin Stefanus Weber reviewed a refund request for Invoice ID: "INV1004".',
    time: "05:30 PM",
  },
  {
    id: "a2",
    avatar: "WM",
    text: 'Wella McGrath updated ticket prices for the event: "Runway Revolution 2024" under the category "Fashion".',
    time: "02:00 PM",
  },
  {
    id: "a3",
    avatar: "PC",
    text: 'Patrick Cooper canceled a booking with Invoice ID: "INV10014".',
    time: "11:15 AM",
  },
  {
    id: "a4",
    avatar: "AS",
    text: 'Andrew Shaw created a new event: "Symphony Under the Stars" under the category "Music".',
    time: "09:30 AM",
  },
]
