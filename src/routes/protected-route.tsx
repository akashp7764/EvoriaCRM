import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute component to guard routes that require authentication.
 */
const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
