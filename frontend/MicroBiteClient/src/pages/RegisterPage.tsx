import { useState, FormEvent } from "react";
import ErrorLabel from "../components/ErrorLabel";
import PageTitle from "../components/PageTitle";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api";
import NamedInput from "../components/NamedInput";
import Button from "../components/Button";
import { useAuthContext } from "../auth/hooks/useAuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const authContext = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    recoveryQuestion: "",
    recoveryAnswer: "",
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) errors.email = "Email is required";

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[0-9\s\-()]{7,15}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Invalid phone number format";
    }

    if (formData.password.length < 10) errors.password = "Password must be at least 10 characters";
    if (!formData.recoveryQuestion.trim())
      errors.recoveryQuestion = "Recovery question is required";
    if (!formData.recoveryAnswer.trim()) errors.recoveryAnswer = "Recovery answer is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      await authApi.post("/register", formData);
      const error = await authContext.login(formData.email, formData.password);
      if (error) {
        throw new Error(error);
      }
      navigate("/menu");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageTitle text="Register New Account" />

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
        <ErrorLabel error={error} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NamedInput
            type="text"
            name="firstName"
            label="First Name"
            value={formData.firstName}
            onChange={handleChange}
            disabled={isLoading}
          />
          {validationErrors.firstName && (
            <span className="text-red-500 text-sm">{validationErrors.firstName}</span>
          )}

          <NamedInput
            type="text"
            name="lastName"
            label="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            disabled={isLoading}
          />
          {validationErrors.lastName && (
            <span className="text-red-500 text-sm">{validationErrors.lastName}</span>
          )}
        </div>

        <NamedInput
          type="email"
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
        />
        {validationErrors.email && (
          <span className="text-red-500 text-sm">{validationErrors.email}</span>
        )}

        <NamedInput
          type="tel"
          name="phoneNumber"
          label="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          disabled={isLoading}
        />
        {validationErrors.phoneNumber && (
          <span className="text-red-500 text-sm">{validationErrors.phoneNumber}</span>
        )}

        <NamedInput
          type="password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
        />
        {validationErrors.password && (
          <span className="text-red-500 text-sm">{validationErrors.password}</span>
        )}

        <NamedInput
          type="text"
          name="recoveryQuestion"
          label="Recovery Question"
          value={formData.recoveryQuestion}
          onChange={handleChange}
          disabled={isLoading}
        />
        {validationErrors.recoveryQuestion && (
          <span className="text-red-500 text-sm">{validationErrors.recoveryQuestion}</span>
        )}

        <NamedInput
          type="text"
          name="recoveryAnswer"
          label="Recovery Answer"
          value={formData.recoveryAnswer}
          onChange={handleChange}
          disabled={isLoading}
        />
        {validationErrors.recoveryAnswer && (
          <span className="text-red-500 text-sm">{validationErrors.recoveryAnswer}</span>
        )}

        <Button
          type="submit"
          text={isLoading ? "Registering..." : "Create Account"}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        />
      </form>
    </div>
  );
}
