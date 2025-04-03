import { Link } from "react-router-dom";
import { useAuthContext } from "../auth/hooks/useAuthContext";
import { useEffect, useRef, useState } from "react";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">MicroBite</h1>
      <nav className="space-x-4 flex items-center">
        <LinkButton to="/home" text="Home" />
        <LinkButton to="/menu" text="Menu" />
        <LinkButton to="/cart" text="Cart" />
        <LinkButton to="/login" text="Login"/>
        
        {authContext.jwtClaims?.role === "admin" && <LinkButton to="/admin" text="Admin" />}

        {authContext.isAuthenticated() ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-white text-blue-500 px-4 py-2 rounded-lg shadow-md hover:bg-blue-200 hover:text-blue-700 transition duration-300 font-bold flex items-center gap-2"
            >
              {"My Account"}
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Your Profile
                </Link>
                <Link
                  to="/orders"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Your orders
                </Link>
              </div>
            )}
          </div>
        ) : (
          <LinkButton to="/login" text="Login" />
        )}
      </nav>
    </header>
  );
}