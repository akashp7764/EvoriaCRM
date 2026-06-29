import { Navigate, Outlet } from "react-router-dom"
import { getLoggedInUser } from "@/helpers/auth"

const AdminRoute = () => {
  const token = localStorage.getItem("token")
  const user = getLoggedInUser()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default AdminRoute
