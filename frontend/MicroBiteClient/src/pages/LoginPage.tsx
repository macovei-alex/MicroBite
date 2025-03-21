import React, { useState } from "react";
import { api } from "../api";
import { useLocation, useNavigate } from "react-router";
import { useAuthContext } from "../auth/AuthContext";

export default function LoginPage() {
  const authContext = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

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
    setError("");

    try {
      const data = await api.post("/login", { email, password });
      console.log(data);
      navigate("/menu");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 pb-12">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-500"
              required
            />
          </div>
          <div className="h-5 mb-4 mt-8 text-center">
            {error && <p className="text-red-600 text-sm font-bold">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-500 cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>

      <button
        onClick={() => {
          authContext.authenticate("some access token");
          const origin = location.state?.from;
          if (origin) {
            navigate(origin);
          } else {
            navigate("/");
          }
        }}
        className="bg-blue-500 mt-8 text-white p-2 rounded hover:bg-blue-600 transition duration-500 cursor-pointer"
      >
        Development Get Authentication
      </button>
    </div>
  );
}
