import { Navigate, Outlet } from "react-router-dom";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "../hooks/useAuth";

export default function PublicRoute() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Checking session..." />
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
