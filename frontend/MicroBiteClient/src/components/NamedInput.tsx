type NamedInputProps = {
  label: string;
  type?: string;
  name?: string;
  value?: string | number;
  placeholder?: string;
  required?: boolean;
  ref?: React.Ref<HTMLInputElement>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  labelClassName?: string;
};

export default function NamedInput({
  label,
  type,
  name,
  value,
  placeholder,
  required,
  ref,
  onChange,
  labelClassName,
}: NamedInputProps) {
  return (
    <div>
      <label className={`block text-gray-700 text-sm font-bold mb-2 ${labelClassName}`}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        ref={ref}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full p-2 border border-gray-300 rounded outline-none focus:ring-3 focus:ring-blue-500 transition duration-500"
        required={required}
      />
    </div>
  );
}
