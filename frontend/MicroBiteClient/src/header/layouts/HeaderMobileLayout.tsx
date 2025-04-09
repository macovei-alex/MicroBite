import ProfileIcon from "../../components/ProfileIcon";
import DropDownArrowSvg from "../components/DropDownArrowSvg";
import DropDownLink from "../components/DropDownLink";
import { useHeaderHook } from "../hooks/useHeaderHook";
import MenuLinkButton from "../components/MenuLinkButton";

export default function HeaderMobileLayout() {
  const { authContext, isDropdownOpen, setIsDropdownOpen, dropdownRef } = useHeaderHook();

  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">MicroBite</h1>
      <nav className="space-x-4 flex items-center">
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
              <DropDownLink to="/home" text="Home" onClick={() => setIsDropdownOpen(false)} />
              <DropDownLink to="/menu" text="Menu" onClick={() => setIsDropdownOpen(false)} />
              <DropDownLink to="/cart" text="Cart" onClick={() => setIsDropdownOpen(false)} />
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
