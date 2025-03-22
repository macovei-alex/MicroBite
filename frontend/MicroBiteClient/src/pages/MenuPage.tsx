import { useState } from "react";
import { api } from "../api";
import { config } from "../api/config";
import { useAuthContext } from "../auth/AuthContext";

export default function MenuPage() {
  const authContext = useAuthContext();
  const [response, setResponse] = useState("");

  function checkCookies() {
    api
      .get(`${config.AUTH_BASE_URL}/check-cookies`, { withCredentials: true })
      .then((res) => setResponse(() => JSON.stringify(res.data)))
      .catch((error) => setResponse(() => JSON.stringify(error)));
  }

  return (
    <>
      <p>Menu Page</p>
      <button onClick={checkCookies}>Check cookies</button>
      <p>{authContext.accessToken}</p>
      <p>{response}</p>
    </>
  );
}
