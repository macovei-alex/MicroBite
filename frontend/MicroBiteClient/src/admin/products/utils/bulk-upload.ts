import { Category } from "../../../api/types/Category";
import { Product } from "../../../api/types/Product";
import { FileProduct } from "../types/FileProduct";
import Papa from "papaparse";

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

export function parseCsv(fileString: string, categories: Category[]): Omit<Product, "id">[] {
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

export function parseJson(fileString: string, categories: Category[]): Omit<Product, "id">[] {
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
