import { useQuery } from "@tanstack/react-query";
import { authApi } from "..";
import { Account } from "../types/Account";
import { AxiosError } from "axios";

export function useAccountsQuery() {
  return useQuery<Account[], AxiosError>({
    queryKey: ["admin", "accounts"],
    queryFn: async () => {
      const response = await authApi.get<Account[]>("/Account");
      return response.data;
    },
  });
}
