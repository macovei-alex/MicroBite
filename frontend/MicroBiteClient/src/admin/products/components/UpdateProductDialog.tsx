import { useCallback, useEffect, useState } from "react";
import Button from "../../../components/Button";
import { BaseDialogProps } from "../types/BaseDialogProps";
import { useCategoriesQuery } from "../../../api/hooks/useCategoriesQuery";
import { Product } from "../../../api/types/Product";
import { resApi } from "../../../api";
import axios from "axios";
import ErrorLabel from "../../../components/ErrorLabel";
import NamedInput from "../../../components/NamedInput";
import ContainedImage from "../../../components/ContainedImage";
import { useProductsQuery } from "../../../api/hooks/useProductsQuery";
import { useQueryClient } from "@tanstack/react-query";
import DialogCard from "./DialogCard";

function validateProduct(product: Product) {
  if (!product) return "Product is null";
  if (!product.name) return "Product name is required";
  if (!product.description) return "Product description is required";
  if (product.price <= 0) return "Product price must be greater than 0";
  if (!product.category) return "Product category is required";
  if (!product.category.id) return "Product category ID is required";
  if (product.category.id <= 0) return "Product category ID must be greater than 0";
  if (!product.image) return "Product image is required";
  return null;
}

type UpdateProductDialogProps = BaseDialogProps;

export default function UpdateProductDialog({ isVisible, closeDialog }: UpdateProductDialogProps) {
  const queryClient = useQueryClient();
  const productsQuery = useProductsQuery();
  const categoriesQuery = useCategoriesQuery();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (productsQuery.data && productsQuery.data.length > 0) {
      setProduct((prev) => {
        if (!prev) {
          return { ...productsQuery.data[0] };
        }
        return prev;
      });
    }
  }, [productsQuery.data]);

  const handleSubmit = useCallback(async () => {
    if (!product) return;

    const errorMessage = validateProduct(product);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    try {
      setError(null);
      setIsSaving(true);
      console.log(product);
      await resApi.put(`/Product/${product.id}`, product);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      closeDialog();
    } catch (error) {
      console.error("Error updating product:", error);
      setError(axios.isAxiosError(error) ? error.response?.data : "An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  }, [queryClient, closeDialog, product]);

  const handleProductChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedProduct = productsQuery.data?.find((p) => p.id === Number(e.target.value));
      if (selectedProduct) {
        setProduct({ ...selectedProduct });
      }
    },
    [productsQuery.data]
  );

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedCategory = categoriesQuery.data?.find(
        (cat) => cat.id === Number(e.target.value)
      );
      if (selectedCategory) {
        setProduct((prev) => prev && { ...prev, category: selectedCategory });
      }
    },
    [categoriesQuery.data]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setProduct((prev) => prev && { ...prev, [name]: value });
    },
    []
  );

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProduct((prev) => prev && { ...prev, image: reader.result as string });
      }
    };
  }, []);

  if (!isVisible) return null;

  const isLoadingData = productsQuery.isLoading || categoriesQuery.isLoading;

  return (
    <DialogCard closeDialog={closeDialog}>
      <h2 className="text-2xl font-bold text-blue-500">Update Product</h2>
      <ErrorLabel error={error} />
      <div>
        <select
          name="product"
          disabled={isLoadingData}
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
      <div className="flex flex-row gap-8">
        <div className="flex flex-col gap-4 min-w-96">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
            <select
              name="category"
              onChange={handleCategoryChange}
              className="w-full appearance-none p-2 border border-gray-300 rounded-lg outline-none focus:ring-3 focus:ring-blue-500 transition duration-500"
            >
              {categoriesQuery.data?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <NamedInput
            label="Name"
            name="name"
            value={product?.name || ""}
            onChange={handleChange}
            required
          />
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <textarea
              name="description"
              value={product?.description || ""}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 outline-none focus:ring-3 focus:ring-blue-500 resize-none transition duration-500"
              rows={4}
              required
            />
          </div>
          <NamedInput
            label="Price"
            name="price"
            value={product?.price || ""}
            onChange={handleChange}
            required
            type="number"
          />
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold">Image</label>
            <div className="relative w-full p-2 my-2 outline-none rounded-lg bg-blue-500 hover:bg-blue-700 transition duration-500 cursor-pointer text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full object-contain opacity-0 cursor-pointer"
              />
              <span className="text-white">Click to upload an image</span>
            </div>
          </div>
          <div className="w-120 h-80">
            {product?.image && <ContainedImage image={product.image} />}
          </div>
        </div>
      </div>
      <Button
        text="Save changes"
        disabled={isLoadingData || isSaving || !product}
        onClick={handleSubmit}
        className="mt-8"
      />
    </DialogCard>
  );
}
