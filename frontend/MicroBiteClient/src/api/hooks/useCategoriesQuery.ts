import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { resApi } from "..";
import { Category } from "../types/Category";

export function useCategoriesQuery() {
  return useQuery<Category[], AxiosError>({
    queryKey: ["categories"],
    queryFn: async () => {
      const categories = (await resApi.get("/ProductCategory")).data as Category[];
      return categories;
    },
  });
}
