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

type FileProduct = {
  name: string;
  description: string;
  price: number;
  category: string;
};

function validateFileProducts(products: any[]): boolean {
  let areValid = true;
  for (const product of products) {
    let mes = null;
    if (!mes && !product) mes = "Product is null";
    if (!mes && !product.name) mes = "Product name is required";
    if (!mes && !product.description) mes = "Product description is required";
    if (!mes && !product.price) mes = "Product price is required";
    product.price = parseFloat(product.price);
    if (!mes && isNaN(product.price)) mes = "Product price must be a number";
    if (!mes && product.price <= 0) mes = "Product price must be greater than 0";
    if (!product.category) mes = "Product category is required";

    if (mes) {
      areValid = false;
      console.error("Error validating product:", product, mes);
    }
  }
  return areValid;
}

function mapFileProducts(
  fileProducts: FileProduct[],
  categories: Category[]
): Omit<Product, "id">[] {
  const mappedProducts = [] as Omit<Product, "id">[];
  let areValid = true;
  for (const fileProduct of fileProducts) {
    let mes = null;
    const category = categories.find((cat) => cat.name === fileProduct.category);
    if (!mes && !category) mes = `Category "${fileProduct.category}" not found`;

    if (mes) {
      areValid = false;
      console.error("Error mapping product:", fileProduct, mes);
    } else {
      mappedProducts.push({
        ...fileProduct,
        category: {
          id: category!.id,
          name: category!.name,
        },
      });
    }
  }
  if (!areValid) {
    throw new Error("Invalid product found. Check the console for more information");
  }
  return mappedProducts;
}

function parseCsv(fileString: string, categories: Category[]): Omit<Product, "id">[] {
  const result = Papa.parse(fileString, { header: true, skipEmptyLines: true });
  if (result.errors.length > 0) {
    console.error("File parsing errors:");
    result.errors.forEach((error) => {
      console.error(error);
    });
    throw new Error("Error parsing file. Check the console for more information");
  }
  const validationResult = validateFileProducts(result.data);
  if (!validationResult) {
    throw new Error("Invalid file format. Check the console for more information");
  }
  return mapFileProducts(result.data as FileProduct[], categories);
}

function parseJson(fileString: string, categories: Category[]): Omit<Product, "id">[] {
  const result = JSON.parse(fileString);
  console.log(result);
  if (!result || !Array.isArray(result)) {
    throw new Error("Invalid JSON file format. Expected an array of products.");
  }
  const validationResult = validateFileProducts(result);
  if (!validationResult) {
    throw new Error("Invalid JSON file format. Check the console for more information");
  }
  return mapFileProducts(result as FileProduct[], categories);
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
