import { useMemo } from "react";

type ButtonProps = {
  text: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
};

export default function Button({ text, type, disabled, onClick, className }: ButtonProps) {
  const classNames = useMemo(() => {
    return `w-full text-white px-6 py-3 rounded-md font-medium bg-blue-500 transition duration-300 enabled:cursor-pointer hover:bg-blue-700 disabled:opacity-60 ${className}`;
  }, [className]);

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classNames}>
      {text}
    </button>
  );
}
