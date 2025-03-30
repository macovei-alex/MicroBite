type NamedInputProps = {
  label: string;
  type?: string;
  name?: string;
  value?: string | number;
  required?: boolean;
  ref?: React.Ref<HTMLInputElement>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function NamedInput({
  label,
  type,
  name,
  value,
  required,
  ref,
  onChange,
}: NamedInputProps) {
  return (
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <input
        type={type}
        name={name}
        ref={ref}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded outline-none focus:ring-3 focus:ring-blue-500 transition duration-500"
        required={required}
      />
    </div>
  );
}
