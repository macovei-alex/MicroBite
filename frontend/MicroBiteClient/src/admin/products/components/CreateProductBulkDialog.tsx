import { useQueryClient } from "@tanstack/react-query";
import { Product } from "../../../api/types/Product";
import { BaseDialogProps } from "../types/BaseDialogProps";
import { useCategoriesQuery } from "../../../api/hooks/useCategoriesQuery";
import { useCallback, useState } from "react";
import DialogCard from "./DialogCard";
import ErrorLabel from "../../../components/ErrorLabel";
import Button from "../../../components/Button";
import { useProductsQuery } from "../../../api/hooks/useProductsQuery";
import { parseCsv, parseJson } from "../utils/bulk-upload";
import { resApi } from "../../../api";
import axios from "axios";

type CreateProductBulkDialogProps = BaseDialogProps;

export default function CreateProductBulkDialog({
  isVisible,
  closeDialog,
}: CreateProductBulkDialogProps) {
  const queryClient = useQueryClient();
  const productsQuery = useProductsQuery();
  const categoriesQuery = useCategoriesQuery();
  const [products, setProducts] = useState<Omit<Product, "id">[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const handleSubmit = useCallback(async () => {
    try {
      setIsBusy(true);
      setError(null);
      await resApi.post(
        "/Product/all",
        products.map((p) => {
          return {
            name: p.name,
            categoryId: p.category.id,
            description: p.description,
            price: p.price,
          };
        })
      );
      queryClient.invalidateQueries({ queryKey: ["products"] });
      closeDialog();
    } catch (error) {
      console.error("Error creating product:", error);
      setError(
        axios.isAxiosError(error) && typeof error.response?.data === "string"
          ? error.response.data
          : "An unexpected error occurred"
      );
    } finally {
      setIsBusy(false);
    }
  }, [queryClient, products, closeDialog]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        if (!(typeof reader.result === "string")) {
          setError("File is not a string");
          return;
        }
        const fileTermination = file.name.split(".").pop();
        if (!fileTermination) {
          setError("File does not have a valid extension");
          return;
        }
        try {
          setIsBusy(true);
          switch (fileTermination) {
            case "csv":
              setProducts(parseCsv(reader.result, categoriesQuery.data || []));
              break;
            case "json":
              setProducts(parseJson(reader.result, categoriesQuery.data || []));
              break;
            default:
              setError("File is not a CSV or JSON file");
              break;
          }
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError("Unexpected error parsing file. Check the console for more information");
          }
        } finally {
          setIsBusy(false);
        }
      };

      // reset the value to trigger onChange on the same file selected the second time
      e.target.value = "";
    },
    [categoriesQuery.data]
  );

  if (!isVisible) return null;

  const isLoadingData = productsQuery.isLoading || categoriesQuery.isLoading;

  return (
    <DialogCard closeDialog={closeDialog}>
      <h2 className="text-2xl font-bold text-blue-500">Create Products in Bulk</h2>
      <ErrorLabel error={error} />
      <div className="relative w-full p-2 my-2 outline-none rounded-lg bg-blue-500 hover:bg-blue-700 transition duration-500 cursor-pointer text-center">
        <input
          type="file"
          accept=".csv, .json"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full object-contain opacity-0 cursor-pointer"
        />
        <span className="text-white">Click to upload a CSV/JSON file</span>
      </div>
      <div className="w-180 overflow-y-auto h-100 border border-blue-500 rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="border border-blue-700 px-4 py-2">Name</th>
              <th className="border border-blue-700 px-4 py-2">Description</th>
              <th className="border border-blue-700 px-4 py-2">Price</th>
              <th className="border border-blue-700 px-4 py-2">Category</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="border border-blue-300 hover:bg-blue-100 transition">
                <td className="border border-blue-300 px-4 py-2 text-blue-700">{product.name}</td>
                <td className="border border-blue-300 px-4 py-2 text-blue-700">
                  {product.description}
                </td>
                <td className="border border-blue-300 px-4 py-2 text-blue-700">
                  {product.price} RON
                </td>
                <td className="border border-blue-300 px-4 py-2 text-blue-700">
                  {product.category.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button
        text="Save changes"
        disabled={isLoadingData || isBusy || products.length === 0}
        onClick={handleSubmit}
        className="mt-8"
      />
    </DialogCard>
  );
}
