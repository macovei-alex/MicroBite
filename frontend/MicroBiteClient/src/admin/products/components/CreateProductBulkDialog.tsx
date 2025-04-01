import { useQueryClient } from "@tanstack/react-query";
import { Product } from "../../../api/types/Product";
import { BaseDialogProps } from "../types/BaseDialogProps";
import { useCategoriesQuery } from "../../../api/hooks/useCategoriesQuery";
import { useCallback, useState } from "react";
import DialogCard from "./DialogCard";
import ErrorLabel from "../../../components/ErrorLabel";
import Button from "../../../components/Button";
import { useProductsQuery } from "../../../api/hooks/useProductsQuery";
import Papa from "papaparse";
import { Category } from "../../../api/types/Category";

type CsvProduct = {
  name: string;
  description: string;
  price: number;
  category: string;
};

function mapCsvProduct(csvProduct: any, categories: Category[]): Omit<Product, "id"> {
  if (!csvProduct.name) throw new Error("Product name is required");
  if (!csvProduct.description) throw new Error("Product description is required");
  csvProduct.price = parseFloat(csvProduct.price);
  if (csvProduct.price === "NaN") throw new Error("Product price is invalid");
  if (csvProduct.price <= 0) throw new Error("Product price must be greater than 0");
  if (!csvProduct.category) throw new Error("Product category is required");
  const category = categories.find((cat) => cat.name === csvProduct.category);
  if (!category) throw new Error(`Category "${csvProduct.category}" not found`);
  return {
    ...csvProduct,
    category: {
      id: category.id,
      name: category.name,
    },
  };
}

function validateProduct(product: Omit<Product, "id">) {
  if (!product) return "Product is null";
  if (!product.name) return "Product name is required";
  if (!product.description) return "Product description is required";
  if (product.price <= 0) return "Product price must be greater than 0";
  if (!product.category) return "Product category is required";
  if (product.category.id <= 0) return "Product category ID must be greater than 0";
  return null;
}

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
    queryClient.invalidateQueries({ queryKey: ["products"] });
    console.log(products);
  }, [queryClient, products]);

  const handleCsvFile = useCallback(
    (reader: FileReader) => {
      if (!(typeof reader.result === "string")) return;
      const result = Papa.parse(reader.result, { header: true, skipEmptyLines: true });
      if (result.errors.length > 0) {
        setError("Error parsing file. Check the console for more information");
        console.error("File parsing errors:");
        result.errors.forEach((error) => {
          console.error(error);
        });
        return;
      }
      let invalidProductFound = false;
      const mappedProducts = [] as Omit<Product, "id">[];
      for (const csvProduct of result.data as CsvProduct[]) {
        try {
          const mappedProduct = mapCsvProduct(csvProduct, categoriesQuery.data || []);
          mappedProducts.push(mappedProduct);
          const message = validateProduct(mappedProduct);
          if (message) {
            setError("Invalid product found. Check the console for more information");
            console.error("Invalid product:", mappedProduct, message);
            invalidProductFound = true;
          }
        } catch (error) {
          setError("Invalid product found. Check the console for more information");
          console.error("Invalid product:", csvProduct, error);
          invalidProductFound = true;
          break;
        }
      }
      if (!invalidProductFound) {
        setProducts(mappedProducts);
      }
    },
    [categoriesQuery.data]
  );

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        setIsBusy(true);
        if (typeof reader.result === "string") {
          handleCsvFile(reader);
        }
        setIsBusy(false);
      };

      // reset the value to trigger onChange on the same file selected the second time
      e.target.value = "";
    },
    [handleCsvFile]
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
                <td className="border border-blue-300 px-4 py-2 text-blue-700">${product.price}</td>
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
        disabled={isLoadingData || isBusy}
        onClick={handleSubmit}
        className="mt-8"
      />
    </DialogCard>
  );
}
