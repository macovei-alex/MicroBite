import { useState } from "react";
import { api } from "../api";
import { useAuthContext } from "../auth/context/useAuthContext";
import { useNavigate } from "react-router";

export default function MenuPage() {
  const authContext = useAuthContext();
  const [response, setResponse] = useState("");
  const navigate = useNavigate();

  function checkCookies() {
    api
      .get("/auth/jwt-inspect", { withCredentials: true })
      .then((res) => setResponse(() => JSON.stringify(res.data)))
      .catch((error) => setResponse(() => JSON.stringify(error)));
  }

  return (
    <>
      <p>Menu Page</p>
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
