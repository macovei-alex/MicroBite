import { BaseDialogProps } from "../types/BaseDialogProps";

type DeleteProductDialogProps = BaseDialogProps & {
  onCommit: (id: number) => void;
};

export default function DeleteProductDialog({
  isVisible,
  onCommit,
  closeDialog,
}: DeleteProductDialogProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      onClick={closeDialog}
      className="absolute inset-0 flex justify-center items-center backdrop-blur-md"
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800">Delete Product</h2>
        <p className="text-gray-600">Dialog content goes here...</p>
      </div>
      <button
        className="mt-4 bg-blue-600 text-white hover:bg-blue-700 rounded-lg py-2 px-6 transition duration-500"
        onClick={() => {
          onCommit(null);
          closeDialog();
        }}
      >
        Save changes
      </button>
    </div>
  );
}
