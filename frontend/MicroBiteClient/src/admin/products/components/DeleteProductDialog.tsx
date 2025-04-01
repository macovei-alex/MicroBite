import { useCallback, useState } from "react";
import Button from "../../../components/Button";
import { BaseDialogProps } from "../types/BaseDialogProps";
import { useProductsQuery } from "../../../api/hooks/useProductsQuery";
import { useQueryClient } from "@tanstack/react-query";
import { Product } from "../../../api/types/Product";
import ContainedImage from "../../../components/ContainedImage";
import ErrorLabel from "../../../components/ErrorLabel";
import { resApi } from "../../../api";
import DialogCard from "./DialogCard";

type DeleteProductDialogProps = BaseDialogProps;

export default function DeleteProductDialog({ isVisible, closeDialog }: DeleteProductDialogProps) {
  const queryClient = useQueryClient();
  const productsQuery = useProductsQuery();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleProductChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedProduct = productsQuery.data?.find((p) => p.id === Number(e.target.value));
      if (selectedProduct) {
        setProduct(selectedProduct);
      }
    },
    [productsQuery.data]
  );

  const confirmDelete = useCallback(async () => {
    try {
      setIsSaving(true);
      setError(null);
      await resApi.delete(`/Product/${product?.id}`);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      closeDialog();
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsSaving(false);
    }
  }, [closeDialog, queryClient, product]);

  if (!isVisible) {
    return null;
  }

  return (
    <DialogCard closeDialog={closeDialog}>
      <h2 className="text-xl font-bold mb-4 text-gray-800">Delete Product</h2>
      <ErrorLabel error={error} />
      <div>
        <select
          name="product"
          disabled={productsQuery.isLoading}
          onChange={handleProductChange}
          className="w-full appearance-none p-2 border border-gray-300 rounded-lg outline-none focus:ring-3 focus:ring-blue-500 transition duration-500 text-blue-500 font-bold"
        >
          {productsQuery.data?.map((product) => (
            <option key={product.id} value={product.id} className="font-bold">
              {product.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-120 h-80 flex flex-col justify-center items-center">
        {product?.image && <ContainedImage image={product.image} />}
      </div>

      <Button
        text="Confirm delete"
        disabled={productsQuery.isLoading || isSaving}
        onClick={confirmDelete}
      />
    </DialogCard>
  );
}
