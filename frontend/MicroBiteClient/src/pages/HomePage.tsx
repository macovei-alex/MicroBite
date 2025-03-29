import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api";
import { useAuthContext } from "../auth/context/useAuthContext";
import { useState } from "react";

export default function HomePage() {
  const authContext = useAuthContext();
  const navigate = useNavigate();
  const [response, setResponse] = useState("");

  function checkCookies() {
    authApi
      .get("/jwt-inspect", { withCredentials: true })
      .then((res) => setResponse(() => JSON.stringify(res.data)))
      .catch((error) => setResponse(() => JSON.stringify(error)));
  }

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
      <button
        onClick={checkCookies}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-500 cursor-pointer"
      >
        Check tokens
      </button>
      <p>Access token from memory: {authContext.accessToken}</p>
      <p>Tokens mirrored by the server: {response}</p>
      {/* Buton pentru a merge la My Profile */}
      {authContext.accessToken && (
        <button
          onClick={() => navigate("/profile")}
          className="bg-green-500 text-white px-4 py-2 mt-4 rounded hover:bg-green-600 transition duration-500 cursor-pointer"
        >
          Go to My Profile
        </button>
      )}
    </>
  );
}
