import { Link } from "react-router-dom";
import { useAuthContext } from "../auth/hooks/useAuthContext";

function LinkButton({ to, text }: { to: string; text: string }) {
  return (
    <Link
      to={to}
      className="bg-white text-blue-500 px-4 py-2 rounded-lg shadow-md hover:bg-blue-200 hover:text-blue-700 transition duration-300 font-bold"
    >
      {text}
    </Link>
  );
}

export default function Header() {
  const authContext = useAuthContext();

  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">MicroBite</h1>
      <nav className="space-x-4">
        <LinkButton to="/home" text="Home" />
        <LinkButton to="/menu" text="Menu" />
        <LinkButton to="/profile" text="Profile" />
        <LinkButton to="/login" text="Login" />
        <LinkButton to="/cart" text="Shopping cart"/>
        {authContext.jwtClaims?.role === "admin" && <LinkButton to="/admin" text="Admin" />}
      </nav>
    </header>
  );
}
