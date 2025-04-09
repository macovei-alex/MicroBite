import { useCallback, useRef, useState } from "react";
import { PasswordResetData } from "../password-reset/types/PasswordResetData";
import { authApi, config } from "../api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NamedInput from "../components/NamedInput";
import Button from "../components/Button";
import PageTitle from "../components/PageTitle";
import { useMediaQuery } from "react-responsive";

export default function PasswordResetPage() {
  const isDesktop = useMediaQuery({ minWidth: 1024 });
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

  const handleSubmit = useCallback(async () => {
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

    try {
      setIsLoading(true);
      const response = await authApi.post(
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
  }, [navigate, userData]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev!, [name]: value }));
  }, []);

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const fetchSecurityQuestion = useCallback(async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userData.email)) {
      setError("Invalid email format");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`${config.AUTH_BASE_URL}/Account/security-question`, {
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
        <PageTitle text="Reset your Password" className="mb-8" />

        {error && (
          <div className="mb-6 p-4 border-l-4 rounded bg-red-50 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}

        <article className="space-y-6">
          <NamedInput
            label="Email"
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
          {!isDesktop.valueOf() && (
            <Button
              text="Get Security Question"
              onClick={fetchSecurityQuestion}
              disabled={isLoading}
            />
          )}
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
              {isDesktop.valueOf() && (
                <Button
                  text="Get Security Question"
                  onClick={fetchSecurityQuestion}
                  disabled={isLoading}
                />
              )}
            </div>
          </div>
          <NamedInput
            label="Security Answer"
            name="securityAnswer"
            value={userData.securityAnswer}
            onChange={handleChange}
          />
          <NamedInput
            label="New password"
            name="newPassword"
            type="password"
            value={userData.newPassword}
            onChange={handleChange}
          />
          <NamedInput
            label="Confirm password"
            name="newPasswordConfirmation"
            type="password"
            ref={passwordConfirmationRef}
          />
          <div className="flex gap-4 pt-2">
            <Button text="Submit" disabled={isLoading} onClick={handleSubmit} />
            <Button text="Cancel" disabled={isLoading} onClick={handleCancel} />
          </div>
        </article>
      </div>
    </div>
  );
}
