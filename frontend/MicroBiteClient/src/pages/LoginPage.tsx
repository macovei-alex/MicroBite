import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuthContext } from "../auth/hooks/useAuthContext";
import NamedInput from "../components/NamedInput";
import Button from "../components/Button";
import ErrorLabel from "../components/ErrorLabel";
import PageTitle from "../components/PageTitle";

export default function LoginPage() {
  const authContext = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Invalid email format");
      return;
    }
    if (password.length < 10) {
      setError("Password must be at least 10 characters long");
      return;
    }
    setError(null);

    try {
      const message = await authContext.login(email, password);
      if (message) {
        setError(message);
        return;
      }
      if (location.state?.from) {
        navigate(location.state.from, { replace: true });
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 pb-12">
        <PageTitle text="Login" />

        <ErrorLabel error={error} />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <NamedInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <NamedInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Link
            to="/password-reset"
            className="text-sm text-blue-500 self-end cursor-pointer hover:underline"
          >
            Forgot your password?
          </Link>
          <Button text="Login" type="submit" disabled={authContext.isAuthenticating} />
        </form>
      </div>
    </div>
  );
}
