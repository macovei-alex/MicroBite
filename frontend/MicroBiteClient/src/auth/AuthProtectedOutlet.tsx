import { useAuthContext } from "./AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function AuthProtectedOutlet({ redirectTo }: { redirectTo: string }) {
  const authContext = useAuthContext();
  const location = useLocation();
  return authContext.isAuthenticated() ? (
    <Outlet />
  ) : (
    <Navigate to={redirectTo} replace state={{ from: location }} />
  );
}
