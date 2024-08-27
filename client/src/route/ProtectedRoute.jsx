
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/userContext";
import Loader from "../components/layout/Loader";

// eslint-disable-next-line
const ProtectedRoute = ({ isAdmin = true, isManager, isSalesRepresentative }) => {
  const { auth, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin && auth?.user?.role === "Admin") {
    return <Outlet />;
  }

  if (isManager && auth?.user?.role !== "Manager") {
    return <Navigate to="/login" replace />;
  }

  if (isSalesRepresentative && auth?.user?.role !== "Sales Representative") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;