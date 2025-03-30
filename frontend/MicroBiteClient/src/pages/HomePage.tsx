import { authApi } from "../api";
import { useAuthContext } from "../auth/hooks/useAuthContext";
import { useState } from "react";

export default function HomePage() {
  const authContext = useAuthContext();
  const [response, setResponse] = useState("");

  function checkCookies() {
    authApi
      .get("/auth/jwt-inspect", { withCredentials: true })
      .then((res) => setResponse(() => JSON.stringify(res.data)))
      .catch((error) => setResponse(() => JSON.stringify(error)));
  }

  return (
    <>
      <h1 className="text-3xl font-bold underline">Home</h1>
      <button
        onClick={checkCookies}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-500 cursor-pointer"
      >
        Check tokens
      </button>
      <div>
        <p>Access token from memory: </p>
        {Object.entries(authContext.jwtClaims ?? {}).map((entry) => (
          <p key={entry[0]} className="ml-8">{`${entry[0]}: ${entry[1]}`}</p>
        ))}
      </div>
      <div>
        <p>Tokens mirrored by the server: {response}</p>
      </div>
    </>
  );
}
