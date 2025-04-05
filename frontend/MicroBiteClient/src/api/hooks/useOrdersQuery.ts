import { useQuery } from "@tanstack/react-query";
import { Order } from "../types/Order";
import { AxiosError } from "axios";
import { resApi } from "..";

type FetchedOrder = Omit<Order, "orderTime" | "deliveryTime"> & {
  orderTime: string;
  deliveryTime?: string;
};

export function useOrdersQuery(accountId: string) {
  return useQuery<Order[], AxiosError>({
    queryKey: ["orders", accountId],
    queryFn: async () => {
      const response = await resApi.get<FetchedOrder[]>(`/Order/user/${accountId}`);
      return response.data.map((order) => {
        return {
          ...order,
          deliveryTime: order.deliveryTime ? new Date(order.deliveryTime) : undefined,
          orderTime: new Date(order.orderTime),
        };
      });
    },
  });
}
