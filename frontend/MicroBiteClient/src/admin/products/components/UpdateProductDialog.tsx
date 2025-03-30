import { Product } from "../../../menu/types/Product";
import { BaseDialogProps } from "../types/BaseDialogProps";

type UpdateProductDialogProps = BaseDialogProps & {
  onCommit: (product: Product) => void;
};

export default function UpdateProductDialog({
  isVisible,
  onCommit,
  closeDialog,
}: UpdateProductDialogProps) {
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
        <h2 className="text-xl font-bold mb-4 text-gray-800">Update Product</h2>
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
