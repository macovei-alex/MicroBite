import { useAuthContext } from "../auth/hooks/useAuthContext";
import { useEffect, useRef, useState } from "react";
import DropDownArrowSvg from "./DropDownArrowSvg";
import DropDownLink from "./DropDownLink";
import MenuLinkButton from "./MenuLinkButton";
import ProfileIcon from "../components/ProfileIcon";

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
        <MenuLinkButton to="/home" text="Home" />
        <MenuLinkButton to="/menu" text="Menu" />
        <MenuLinkButton to="/cart" text="Cart" />

        {authContext.isAuthenticated() ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-white text-blue-500 px-4 py-2 rounded-full shadow-md hover:bg-blue-200 hover:text-blue-700 transition duration-300 flex items-center gap-1"
            >
              <ProfileIcon className="w-[1.54em] h-[1.54em]" />
              <DropDownArrowSvg isDropdownOpen={isDropdownOpen} />
            </button>

            <div
              className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-50 ${
                isDropdownOpen ? "visible" : "invisible"
              }`}
            >
              <DropDownLink to="/profile" text="Profile" onClick={() => setIsDropdownOpen(false)} />
              <DropDownLink to="/orders" text="Orders" onClick={() => setIsDropdownOpen(false)} />
              <DropDownLink
                to="/login"
                text="Change Account"
                onClick={() => setIsDropdownOpen(false)}
              />
            </div>
          </div>
        ) : (
          <MenuLinkButton to="/login" text="Login" />
        )}

        {authContext.jwtClaims?.role === "admin" && <MenuLinkButton to="/admin" text="Admin" />}
      </nav>
    </header>
  );
}
