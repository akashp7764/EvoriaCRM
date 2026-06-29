export const ROLES = {
  ADMIN: "ADMIN",
  EVENT_MANAGER: "EVENT_MANAGER",
  USER: "USER",
} as const

export type Role = typeof ROLES[keyof typeof ROLES]
