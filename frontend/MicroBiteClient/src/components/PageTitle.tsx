type PageTitleProps = {
  text: string;
  className?: string;
};

export default function PageTitle({ text, className }: PageTitleProps) {
  return (
    <h1 className={`text-3xl font-bold mb-4 text-center text-blue-500 ${className || ""}`}>
      {text}
    </h1>
  );
}
