import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../auth/context/useAuthContext";
import { api } from "../api";
import ProfileSkeletonLoader from "../profile/components/ProfileSkeletonLoader";
import ProfileEdit from "../profile/components/ProfileEdit";
import { AccountInformation } from "../profile/types/AccountInformation";
import ProfileIcon from "../profile/components/ProfileIcon";
import ProfileField from "../profile/components/ProfileField";

export default function ProfilePage() {
  const { accessToken } = useAuthContext();
  const [user, setUser] = useState<AccountInformation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "error" | "success" | null;
    text: string;
  }>({ type: null, text: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const clearMessage = () => {
    setMessage({ type: null, text: "" });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        clearMessage();

        const response = await api.get<AccountInformation>("/account/profile");
        setUser({ ...response.data, securityAnswer: "" });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setMessage({ type: "error", text: "Failed to load profile data. Please try again." });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [accessToken]);

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
    clearMessage();
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    clearMessage();
  }, []);

  const handleSubmit = useCallback(async (user: AccountInformation) => {
    clearMessage();

    try {
      setIsSaving(true);
      const response = await api.put("/account/profile", user);
      console.log(response.status, response);
      setUser(user);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setIsSaving(false);
    }
  }, []);

  if (isLoading) {
    return <ProfileSkeletonLoader />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="w-full max-w-xl p-8 bg-white rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4">
            <ProfileIcon />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600 mt-1">View and update your personal information</p>
        </div>

        {message.type !== null && (
          <div
            className={`mb-6 p-4 border-l-4 rounded ${
              message.type === "error"
                ? "bg-red-50 border-red-500 text-red-700"
                : "bg-green-50 border-green-500 text-green-700"
            }`}
          >
            <p>{message.text}</p>
          </div>
        )}

        {user ? (
          <div className="space-y-6">
            {!isEditing ? (
              <>
                <div className="space-y-4 divide-y divide-gray-100">
                  <ProfileField label="Email" value={user.email} />
                  <ProfileField label="Full Name" value={`${user.firstName} ${user.lastName}`} />
                  <ProfileField label="Phone" value={user.phoneNumber} />
                  <ProfileField label="Security Question" value={user.securityQuestion || ""} />
                </div>
                <button
                  onClick={handleEditClick}
                  className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition duration-300 font-medium"
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <ProfileEdit
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                initialUser={user}
                isSaving={isSaving}
              />
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No user data available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
