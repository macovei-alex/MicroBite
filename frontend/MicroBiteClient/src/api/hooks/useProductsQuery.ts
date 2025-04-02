import { useQuery } from "@tanstack/react-query";
import { resApi } from "..";
import { AxiosError } from "axios";
import { Product } from "../types/Product";

export function useProductsQuery() {
  return useQuery<Product[], AxiosError>({
    queryKey: ["products"],
    queryFn: async () => {
      const products = (await resApi.get("/Product")).data as Product[];
      return products.sort((p1, p2) => p1.name.localeCompare(p2.name));
    },
  });
}
