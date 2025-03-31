import { authApi } from "../api";
import { useAuthContext } from "../auth/hooks/useAuthContext";
import { useState } from "react";

function mapObjectEntries(obj: any, indent = 8): any {
  return Object.entries(obj).map(([key, value]) => {
    if (typeof value === "string") {
      return <p key={key} style={{ marginLeft: indent }}>{`${key}: ${value}`}</p>;
    }

    if (Array.isArray(value)) {
      return (
        <div style={{ marginLeft: indent }}>
          <p>{key}:</p>
          {value.map((item) => mapObjectEntries(item, indent + 8))}
        </div>
      );
    }

    if (typeof value === "object" && value !== null) {
      return mapObjectEntries(value, indent + 8);
    }

    return null;
  });
}

export default function HomePage() {
  const authContext = useAuthContext();
  const [response, setResponse] = useState({});

  function checkCookies() {
    authApi
      .get("/auth/jwt-inspect", { withCredentials: true })
      .then((res) => setResponse(res.data))
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
        <p>Tokens mirrored by the server:</p>
        {response && mapObjectEntries(response)}
      </div>
    </>
  );
}
