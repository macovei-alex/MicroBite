import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export default function AuthProtectedOutlet({ redirectTo }: { redirectTo: string }) {
  const authContext = useAuthContext();
  const location = useLocation();

  if (authContext.isAuthenticated()) {
    return <Outlet />;
  } else if (authContext.isAuthenticating) {
    return <div>Authenticating</div>;
  } else {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }
}
