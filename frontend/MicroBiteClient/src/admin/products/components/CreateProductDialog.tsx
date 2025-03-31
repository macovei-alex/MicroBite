import { useCallback, useState } from "react";
import { Product } from "../../../api/types/Product";
import { BaseDialogProps as BaseDialogProps } from "../types/BaseDialogProps";
import axios from "axios";
import NamedInput from "../../../components/NamedInput";
import Button from "../../../components/Button";
import ErrorLabel from "../../../components/ErrorLabel";
import { useCategoriesQuery } from "../../../api/hooks/useCategoriesQuery";
import { resApi } from "../../../api";
import ContainedImage from "../../../components/ContainedImage";
import { useQueryClient } from "@tanstack/react-query";

function validateProduct(product: Omit<Product, "id">) {
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

type CreateProductDialogProps = BaseDialogProps;

export default function CreateProductDialog({ isVisible, closeDialog }: CreateProductDialogProps) {
  const queryClient = useQueryClient();
  const categoriesQuery = useCategoriesQuery();
  const [product, setProduct] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    image: undefined,
    category: categoriesQuery.data?.[0] || {
      id: 0,
      name: "",
    },
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    const errorMessage = validateProduct(product);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    try {
      setError(null);
      await resApi.post("/Product", product);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      closeDialog();
    } catch (error) {
      console.error("Error creating product:", error);
      setError(axios.isAxiosError(error) ? error.response?.data : "An unexpected error occurred");
    }
  }, [queryClient, closeDialog, product]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setProduct((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedCategory = categoriesQuery.data?.find(
        (cat) => cat.id === Number(e.target.value)
      );
      if (selectedCategory) {
        setProduct((prev) => ({ ...prev, category: selectedCategory }));
      }
    },
    [categoriesQuery.data]
  );

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProduct((prev) => ({ ...prev, image: reader.result as string }));
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      onClick={closeDialog}
      className="absolute inset-0 flex flex-col justify-center items-center backdrop-blur-md"
    >
      <div
        className="bg-white p-12 rounded-lg shadow-lg min-w-96 w-auto relative flex flex-col gap-4 items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-blue-500">Create Product</h2>
        <ErrorLabel error={error} />
        <div className="flex flex-row gap-8">
          <div className="flex flex-col gap-4 min-w-96">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
              <select
                name="category"
                value={product.category.id}
                onChange={handleCategoryChange}
                className="w-full appearance-none p-2 border border-gray-300 rounded-lg outline-none focus:ring-3 focus:ring-blue-500 transition duration-500"
              >
                {categoriesQuery.data?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <NamedInput
              label="Name"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 outline-none focus:ring-3 focus:ring-blue-500 resize-none transition duration-500"
                rows={4}
                required
              />
            </div>
            <NamedInput
              label="Price"
              name="price"
              value={product.price}
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
              {product.image && <ContainedImage image={product.image} />}
            </div>
          </div>
        </div>
        <Button
          text="Save changes"
          disabled={categoriesQuery.isLoading}
          onClick={handleSubmit}
          className="mt-8"
        />
      </div>
    </div>
  );
}
