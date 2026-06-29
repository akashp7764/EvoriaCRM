import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import LoginPage from "@/components/pages/auth/login-page"
import ProtectedRoute from "@/routes/protected-route"
import ComponentViewer from "@/components/pages/component-viewer"
import DashboardLayout from "@/layouts/dashboard-layout"
import DashboardPage from "@/components/pages/dashboard/dashboard"
import EventsPage from "@/components/pages/events/events-page"
import CreateEventPage from "@/components/pages/events/create-event-page"
import AdminRoute from "@/routes/admin-route"
import ManagersPage from "@/pages/Managers/ManagersPage"
import EventRegistrationPage from "@/components/pages/registration/event-registration-page"
import ScannerPage from "@/components/pages/scanner/scanner-page"
import PublicTicketPage from "@/components/pages/ticket/public-ticket-page"

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/events",
            element: <EventsPage />,
          },
          {
            path: "/events/create",
            element: <CreateEventPage />,
          },
          {
            path: "/events/edit/:id",
            element: <CreateEventPage />,
          },
          {
            element: <AdminRoute />,
            children: [
              {
                path: "/managers",
                element: <ManagersPage />,
              },
            ],
          },
          {
            path: "/manager/scanner",
            element: <ScannerPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/component-viewer",
    element: <ComponentViewer />,
  },
  {
    path: "/form/registration/:eventId",
    element: <EventRegistrationPage />,
  },
  {
    path: "/ticket/scan",
    element: <PublicTicketPage />,
  },
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}

