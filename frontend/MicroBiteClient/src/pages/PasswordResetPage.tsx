import { useCallback, useRef, useState } from "react";
import { PasswordResetData } from "../password-reset/types/PasswordResetData";
import { api, config } from "../api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PasswordResetPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<PasswordResetData>({
    email: "",
    newPassword: "",
    securityAnswer: "",
  });
  const [securityQuestion, setSecurityQuestion] = useState<string | null>(null);
  const passwordConfirmationRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(userData.email)) {
        setError("Invalid email format");
        return;
      }
      if (userData.newPassword.length < 10) {
        setError("Password must be at least 10 characters long");
        return;
      }
      if (userData.newPassword !== passwordConfirmationRef.current?.value) {
        setError("Passwords do not match");
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.post(
          "/Account/password-reset",
          {
            ...userData,
            clientId: config.CLIENT_ID,
          },
          { withCredentials: true }
        );
        console.log(response);
        navigate("/home");
      } catch (error) {
        if (axios.isAxiosError(error) && typeof error.response?.data === "string") {
          setError(error.response.data);
        } else {
          setError("Failed to reset password. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, userData]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev!, [name]: value }));
  }, []);

  const handleCancel = useCallback(() => {
    navigate("/home");
  }, [navigate]);

  const fetchSecurityQuestion = useCallback(async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userData.email)) {
      setError("Invalid email format");
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.get("/Account/security-question", {
        params: { email: userData.email },
      });
      setSecurityQuestion(
        response.status === axios.HttpStatusCode.NoContent
          ? "No security question set up"
          : response.data.securityQuestion
      );
    } catch (error) {
      console.error("Error fetching security question:", error);
      if (axios.isAxiosError(error) && typeof error.response?.data === "string") {
        setError(error.response.data);
      } else {
        setError("Failed to fetch security question. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [userData.email]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800">Reset your password</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 border-l-4 rounded bg-red-50 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-3 focus:ring-blue-500 outline-none transition duration-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Security Question
            </label>
            <div className="flex flex-row gap-4">
              <div className="grow">
                <input
                  type="text"
                  name="securityQuestion"
                  value={securityQuestion || ""}
                  disabled={true}
                  className="w-full p-3 rounded-md outline-none"
                />
              </div>
              <button
                onClick={fetchSecurityQuestion}
                disabled={isLoading}
                className="bg-blue-500 text-white px-3 rounded-md enabled:hover:bg-blue-700 transition duration-500 font-medium disabled:opacity-60 enabled:cursor-pointer"
              >
                Get security question
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Security Answer</label>
            <input
              type="text"
              name="securityAnswer"
              value={userData.securityAnswer}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-3 focus:ring-blue-500 outline-none transition duration-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
            <input
              type="password"
              name="newPassword"
              value={userData.newPassword}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-3 focus:ring-blue-500 outline-none transition duration-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
            <input
              type="password"
              name="newPasswordConfirmation"
              ref={passwordConfirmationRef}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-3 focus:ring-blue-500 outline-none transition duration-500"
            />
          </div>
          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-3 rounded-md enabled:hover:bg-blue-700 transition duration-500 font-medium disabled:opacity-60 enabled:cursor-pointer"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full bg-gray-300 text-gray-800 py-3 rounded-md enabled:hover:bg-gray-400 transition duration-500 font-medium disabled:opacity-60 enabled:cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
