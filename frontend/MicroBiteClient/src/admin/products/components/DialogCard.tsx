type DialogCardProps = {
  closeDialog: () => void;
  children: React.ReactNode;
};

export default function DialogCard({ closeDialog, children }: DialogCardProps) {
  return (
    <div
      onClick={closeDialog}
      className="absolute inset-0 flex flex-col justify-center items-center backdrop-blur-md"
    >
      <div
        className="bg-white p-12 rounded-lg shadow-lg min-w-96 w-auto relative flex flex-col gap-4 items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
