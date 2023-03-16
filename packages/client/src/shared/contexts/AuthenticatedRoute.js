import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AuthenticatedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (currentUser) {
    return children;
  }

  return <Navigate to="/login" />;
};

export default AuthenticatedRoute;