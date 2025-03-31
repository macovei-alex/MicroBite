import { useState } from "react";
import { AccountInformation } from "../types/AccountInformation";
import NamedInput from "../../components/NamedInput";
import Button from "../../components/Button";

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
    <article className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NamedInput
          label="Email"
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
        />
        <NamedInput
          label="Phone"
          name="phoneNumber"
          value={user.phoneNumber}
          onChange={handleChange}
        />
        <NamedInput
          label="First Name"
          name="firstName"
          value={user.firstName}
          onChange={handleChange}
        />
        <NamedInput
          label="Last Name"
          name="lastName"
          value={user.firstName}
          onChange={handleChange}
        />
      </div>
      <NamedInput
        label="Security Question"
        name="securityQuestion"
        value={user?.securityQuestion || ""}
        onChange={handleChange}
      />
      <NamedInput
        label="Security Answer"
        name="securityAnswer"
        value={user?.securityAnswer || ""}
        onChange={handleChange}
      />
      <div className="flex gap-4 pt-2">
        <Button
          text={isSaving ? "Saving..." : "Save Changes"}
          onClick={() => onSubmit(user)}
          disabled={isSaving}
        />
        <Button text="Cancel" onClick={onCancel} disabled={isSaving} />
      </div>
    </article>
  );
}
