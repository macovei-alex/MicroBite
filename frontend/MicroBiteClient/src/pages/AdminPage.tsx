import { useCallback, useState } from "react";
import CreateProductDialog from "../admin/products/components/CreateProductDialog";
import UpdateProductDialog from "../admin/products/components/UpdateProductDialog";
import DeleteProductDialog from "../admin/products/components/DeleteProductDialog";
import { DialogName } from "../admin/products/types/DialogName";

export default function AdminPage() {
  const [activeDialog, setActiveDialog] = useState<DialogName | null>(null);

  const closeDialog = useCallback(() => {
    setActiveDialog(null);
  }, []);

  return (
    <>
      <div
        className={`flex flex-col items-center p-6 min-h-screen transition-all ${
          activeDialog ? "blur-sm opacity-50" : "bg-gray-100"
        }`}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Page</h1>
        <div className="space-y-4 w-full max-w-sm">
          <button
            onClick={() => setActiveDialog("CreateProduct")}
            className="w-full block bg-blue-600 text-white text-center py-3 rounded-lg shadow-md hover:bg-blue-500 transition duration-500 cursor-pointer"
          >
            Create Product
          </button>
          <button
            onClick={() => setActiveDialog("UpdateProduct")}
            className="w-full block bg-yellow-600 text-white text-center py-3 rounded-lg shadow-md hover:bg-yellow-500 transition duration-500 cursor-pointer"
          >
            Update Product
          </button>
          <button
            onClick={() => setActiveDialog("DeleteProduct")}
            className="w-full block bg-red-600 text-white text-center py-3 rounded-lg shadow-md hover:bg-red-500 transition duration-500 cursor-pointer"
          >
            Delete Product
          </button>
        </div>
      </div>

      <CreateProductDialog
        isVisible={activeDialog === "CreateProduct"}
        onCommit={(product) => console.log(product)}
        closeDialog={closeDialog}
      />
      <UpdateProductDialog
        isVisible={activeDialog === "UpdateProduct"}
        onCommit={(product) => console.log(product)}
        closeDialog={closeDialog}
      />
      <DeleteProductDialog
        isVisible={activeDialog === "DeleteProduct"}
        onCommit={(productId) => console.log(productId)}
        closeDialog={closeDialog}
      />
    </>
  );
}
