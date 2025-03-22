import { useState } from "react";
import { api, config } from "../api";
import { useAuthContext } from "../auth/context/useAuthContext";

export default function MenuPage() {
  const authContext = useAuthContext();
  const [response, setResponse] = useState("");

  function checkCookies() {
    api
      .get(`${config.AUTH_BASE_URL}/check-tokens`, { withCredentials: true })
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
    </>
  );
}
