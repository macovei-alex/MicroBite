import { useState } from "react";
import { AccountInformation } from "../types/AccountInformation";

type ProfileEditProps = {
  onSubmit: (user: AccountInformation) => Promise<void>;
  onCancel: () => void;
  initialUser: AccountInformation;
  isSaving: boolean;
};

export default function ProfileEdit({
  onSubmit,
  onCancel,
  initialUser,
  isSaving,
}: ProfileEditProps) {
  const [user, setUser] = useState<AccountInformation>(initialUser);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev!, [name]: value }));
  };

  return (
    <form
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(user);
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-3 focus:ring-blue-500 outline-none transition duration-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            name="phoneNumber"
            value={user.phoneNumber}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-3 focus:ring-blue-500  outline-none transition duration-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-3 focus:ring-blue-500 outline-none transition duration-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-3 focus:ring-blue-500 outline-none transition duration-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Security Question</label>
        <input
          type="text"
          name="securityQuestion"
          value={user?.securityQuestion || ""}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-3 focus:ring-blue-500 outline-none transition duration-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Security Answer</label>
        <input
          type="text"
          name="securityAnswer"
          value={user?.securityAnswer || ""}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-3 focus:ring-blue-500 outline-none transition duration-500"
        />
      </div>
      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-blue-500 text-white py-3 rounded-md enabled:hover:bg-blue-700 transition duration-500 font-medium disabled:opacity-60 enabled:cursor-pointer"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="w-full bg-gray-300 text-gray-800 py-3 rounded-md enabled:hover:bg-gray-400 transition duration-500 font-medium disabled:opacity-60 enabled:cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
