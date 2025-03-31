import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { Role } from "../types/Role";

type AuthProtectedOutletProps = {
  allowedRoles?: Role[];
  redirectTo: string;
};

export default function AuthProtectedOutlet({
  allowedRoles,
  redirectTo,
}: AuthProtectedOutletProps) {
  const authContext = useAuthContext();
  const location = useLocation();

  if (
    authContext.isAuthenticated() &&
    (allowedRoles?.includes(authContext.jwtClaims!.role) ?? true)
  ) {
    return <Outlet />;
  } else if (authContext.isAuthenticating) {
    return <div>Authenticating</div>;
  } else {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }
}
