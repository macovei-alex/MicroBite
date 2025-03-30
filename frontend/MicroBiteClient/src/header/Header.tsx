import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">My App</h1>
      <nav className="space-x-4">
        <Link
          to="/home"
          className="bg-white text-blue-500 px-4 py-2 rounded-lg shadow-md hover:bg-blue-100 font-bold"
        >
          Home
        </Link>
        <Link
          to="/menu"
          className="bg-white text-blue-500 px-4 py-2 rounded-lg shadow-md hover:bg-blue-100 font-bold"
        >
          Menu
        </Link>
        <Link
          to="/profile"
          className="bg-white text-blue-500 px-4 py-2 rounded-lg shadow-md hover:bg-blue-100 font-bold"
        >
          Profile
        </Link>
        <Link
          to="/login"
          className="bg-white text-blue-500 px-4 py-2 rounded-lg shadow-md hover:bg-blue-100 font-bold"
        >
          Login
        </Link>
      </nav>
    </header>
  );
}
