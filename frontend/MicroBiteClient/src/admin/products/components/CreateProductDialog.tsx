import { Product } from "../../../menu/types/Product";
import { BaseDialogProps as BaseDialogProps } from "../types/BaseDialogProps";

type CreateProductDialogProps = BaseDialogProps & {
  onCommit: (product: Product) => void;
};

export default function CreateProductDialog({
  isVisible,
  onCommit,
  closeDialog,
}: CreateProductDialogProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      onClick={closeDialog}
      className="absolute inset-0 flex flex-col justify-center items-center backdrop-blur-md"
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg min-w-96 w-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800">Create Product</h2>
        <p className="text-gray-600">Dialog content goes here...</p>
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
    </div>
  );
}
