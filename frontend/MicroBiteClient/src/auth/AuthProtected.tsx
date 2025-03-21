import { ReactNode } from "react";
import { useAuthContext } from "./AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function AuthProtected({ children }: { children: ReactNode }) {
  const authContext = useAuthContext();
  const location = useLocation();
  return authContext.isAuthenticated() ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
}
