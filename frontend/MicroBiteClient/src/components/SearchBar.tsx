import { useRef } from "react";
import Button from "./Button";

type SearchBarProps = {
  onTextChange: (filter: string) => void;
  className?: string;
};

export default function SearchBar({ onTextChange, className }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      onTextChange("");
    }
  };

  return (
    <div
      className={`flex flex-row items-center gap-2 bg-white p-4 rounded-lg shadow-md w-full max-w-sm ${className}`}
    >
      <input
        type="text"
        placeholder="Search..."
        ref={inputRef}
        onChange={() => onTextChange(inputRef.current!.value)}
        className="w-full p-2 text-lg outline-none ring-2 ring-blue-500 rounded-lg focus:ring-3 focus:ring-blue-500 transition animation-500 text-blue-500 basis-3/4"
      />
      <Button text="Clear" onClick={handleClear} className="basis-1/4" />
    </div>
  );
}

