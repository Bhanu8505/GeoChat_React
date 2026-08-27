import { Navigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const ProtectedRoute = ({ children }) => {
  const { authUser, authLoading } = useAuth();

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
