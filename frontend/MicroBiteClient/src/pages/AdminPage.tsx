import { useCallback, useState } from "react";
import CreateProductDialog from "../admin/products/components/CreateProductDialog";
import UpdateProductDialog from "../admin/products/components/UpdateProductDialog";
import DeleteProductDialog from "../admin/products/components/DeleteProductDialog";
import CreateProductBulkDialog from "../admin/products/components/CreateProductBulkDialog";
import { DialogName } from "../admin/products/types/DialogName";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function AdminPage() {
  const navigate = useNavigate();
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
          <Button
            text="Create Product"
            onClick={() => setActiveDialog("CreateProduct")}
            className="!bg-green-600 hover:!bg-green-500"
          />
          <Button
            text="Update Product"
            onClick={() => setActiveDialog("UpdateProduct")}
            className="!bg-yellow-600 hover:!bg-yellow-500"
          />
          <Button
            text="Delete Product"
            onClick={() => setActiveDialog("DeleteProduct")}
            className="!bg-red-600 hover:!bg-red-500"
          />
          <Button
            text="Create Products in Bulk"
            onClick={() => setActiveDialog("CreateProductBulk")}
            className="!bg-green-600 hover:!bg-green-500"
          />
          <Button
            text="View Orders"
            className="!bg-blue-600 hover:!bg-blue-500"
            onClick={() => navigate("/admin/orders")}
          />
        </div>
      </div>

      <CreateProductDialog isVisible={activeDialog === "CreateProduct"} closeDialog={closeDialog} />
      <UpdateProductDialog isVisible={activeDialog === "UpdateProduct"} closeDialog={closeDialog} />
      <DeleteProductDialog isVisible={activeDialog === "DeleteProduct"} closeDialog={closeDialog} />
      <CreateProductBulkDialog
        isVisible={activeDialog === "CreateProductBulk"}
        closeDialog={closeDialog}
      />
    </>
  );
}
