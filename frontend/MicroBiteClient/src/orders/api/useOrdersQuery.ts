import { useQuery } from "@tanstack/react-query";
import { Order } from "../../api/types/Order";
import { resApi } from "../../api";
import axios from "axios";

export const useOrdersQuery = () => {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      try {
        const response = await resApi.get<Order[]>("/order/my-orders");
        return response.data.map((order) => {
          return {
            ...order,
            deliveryTime: order.deliveryTime ? new Date(order.deliveryTime) : undefined,
            orderTime: new Date(order.orderTime),
          };
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            throw new Error("Authentication required");
          }
        }
        throw error;
      }
    },
  });
};
