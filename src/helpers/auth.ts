import { Role } from "@/constants/roles"

export interface User {
  id: number
  name: string
  email: string
  role: Role
}

export const getLoggedInUser = (): User | null => {
  const userStr = localStorage.getItem("user")
  if (!userStr) return null
  try {
    return JSON.parse(userStr) as User
  } catch {
    return null
  }
}

export const isAdmin = (): boolean => {
  const user = getLoggedInUser()
  return user?.role === "ADMIN"
}
