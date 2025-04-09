import { useState, FormEvent } from "react";
import ErrorLabel from "../components/ErrorLabel";
import PageTitle from "../components/PageTitle";
import { useAuthContext } from "../auth/hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const authContext = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    recoveryQuestion: "",
    recoveryAnswer: ""
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const inputClass =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 px-4";

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
        if (!formData.recoveryQuestion.trim()) errors.recoveryQuestion = "Recovery question is required";
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
      const response = await fetch("http://localhost:5095/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authContext?.accessToken}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      navigate("/login");
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
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageTitle text="Register New Account" />

      <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
        {error && <ErrorLabel error={error} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={inputClass}
              disabled={isLoading}
            />
            {validationErrors.firstName && (
              <span className="text-red-500 text-sm">{validationErrors.firstName}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={inputClass}
              disabled={isLoading}
            />
            {validationErrors.lastName && (
              <span className="text-red-500 text-sm">{validationErrors.lastName}</span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
            disabled={isLoading}
          />
          {validationErrors.email && (
            <span className="text-red-500 text-sm">{validationErrors.email}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={inputClass}
            disabled={isLoading}
          />
          {validationErrors.phoneNumber && (
            <span className="text-red-500 text-sm">{validationErrors.phoneNumber}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={inputClass}
            disabled={isLoading}
          />
          {validationErrors.password && (
            <span className="text-red-500 text-sm">{validationErrors.password}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Recovery Question</label>
          <input
            type="text"
            name="recoveryQuestion"
            value={formData.recoveryQuestion}
            onChange={handleChange}
            className={inputClass}
            disabled={isLoading}
          />
          {validationErrors.recoveryQuestion && (
            <span className="text-red-500 text-sm">{validationErrors.recoveryQuestion}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Recovery Answer</label>
          <input
            type="text"
            name="recoveryAnswer"
            value={formData.recoveryAnswer}
            onChange={handleChange}
            className={inputClass}
            disabled={isLoading}
          />
          {validationErrors.recoveryAnswer && (
            <span className="text-red-500 text-sm">{validationErrors.recoveryAnswer}</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? "Registering..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
