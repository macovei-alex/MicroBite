export default function NamedField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-3">
      <span className="text-sm font-medium text-gray-500 sm:w-1/3">{label}:</span>
      <span className="font-medium text-gray-800 mt-1 sm:mt-0">{value}</span>
    </div>
  );
}
