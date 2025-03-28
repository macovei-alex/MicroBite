import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Home</h1>
      <nav className="flex flex-col">
        <Link to="/login" className="text-blue-500 text-3xl">
          /login
        </Link>
        <Link to="/menu" className="text-blue-500 text-3xl">
          /menu
        </Link>
        <Link to="/profile" className="text-blue-500 text-3xl">
          /profile
        </Link>
        <Link to="/password-reset" className="text-blue-500 text-3xl">
          /password-reset
        </Link>
      </nav>
    </>
  );
}
