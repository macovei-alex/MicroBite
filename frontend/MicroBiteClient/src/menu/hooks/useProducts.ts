import { useQuery } from "@tanstack/react-query";
import { resApi } from "../../api";
import { AxiosError } from "axios";
import { Product } from "../types/Product";
import { defaultProductImage } from "../../assets/defaultProductImage";

type FetchedProduct = Product & {
  image?: string;
};

export function useProductsQuery() {
  return useQuery<Product[], AxiosError>({
    queryKey: ["products"],
    queryFn: async () => {
      const products = (await resApi.get("/Product")).data as FetchedProduct[];
      return products.map((product) => ({
        ...product,
        image: product.image || defaultProductImage,
      }));
    },
  });
}
