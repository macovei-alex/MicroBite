import { useCallback } from "react";
import Button from "../../../components/Button";
import { BaseDialogProps } from "../types/BaseDialogProps";

type UpdateProductDialogProps = BaseDialogProps;

export default function UpdateProductDialog({ isVisible, closeDialog }: UpdateProductDialogProps) {
  const saveChanges = useCallback(async () => {
    try {
      closeDialog();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  }, [closeDialog]);

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
        <p className="text-gray-600 mb-8">Dialog content goes here...</p>
        <Button text="Save changes" onClick={saveChanges} />
      </div>
    </div>
  );
}
