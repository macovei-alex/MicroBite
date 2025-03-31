type ErrorLabelProps = {
  error: string | undefined | null;
};

export default function ErrorLabel({ error }: ErrorLabelProps) {
  return (
    error && (
      <div className="mb-6 p-4 border-l-4 rounded bg-red-50 border-red-500 text-red-700">
        <p>{error}</p>
      </div>
    )
  );
}
