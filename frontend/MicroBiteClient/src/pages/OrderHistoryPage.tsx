import OrderHistorySkeleton from "../orders/components/OrderHistorySkeleton";
import ErrorLabel from "../components/ErrorLabel";
import PageTitle from "../components/PageTitle";
import { useEffect, useMemo } from "react";
import { useProductsQuery } from "../api/hooks/useProductsQuery";
import { Product } from "../api/types/Product";
import { useQueryClient } from "@tanstack/react-query";
import { Order } from "../api/types/Order";
import { useOrderStatusUpdatesContext } from "../orders/context/useOrderStatusUpdatesContext";
import OrderDetails from "../orders/components/OrderDetails";
import { useOrdersQuery } from "../api/hooks/useOrdersQuery";
import { useAuthContext } from "../auth/hooks/useAuthContext";

export default function OrderHistoryPage() {
  const authContext = useAuthContext();
  const queryClient = useQueryClient();
  const ordersQuery = useOrdersQuery(authContext.jwtClaims!.sub);
  const productsQuery = useProductsQuery();

  const productsMap = useMemo(() => {
    if (!productsQuery.data) {
      return new Map<number, Product>();
    }
    return new Map(productsQuery.data.map((p) => [p.id, p]));
  }, [productsQuery.data]);

  const orderStatusContext = useOrderStatusUpdatesContext();

  useEffect(() => {
    function handleStatusUpdate(orderId: number, status: string) {
      if (!ordersQuery.data) {
        return;
      }
      queryClient.setQueryData<Order[]>(["orders", authContext.jwtClaims!.sub], (oldData) => {
        const updatedOrders = oldData?.map((order) => {
          if (order.id === orderId) {
            return { ...order, status };
          }
          return order;
        });
        return updatedOrders;
      });
    }

    orderStatusContext.observable.subscribe(handleStatusUpdate);

    return () => {
      orderStatusContext.observable.unsubscribe(handleStatusUpdate);
    };
  }, [orderStatusContext.observable, queryClient, authContext.jwtClaims, ordersQuery.data]);

  const isLoading = ordersQuery.isLoading || productsQuery.isLoading;
  const error = ordersQuery.error || productsQuery.error;

  if (isLoading) {
    return <OrderHistorySkeleton />;
  }

  if (error) {
    return <ErrorLabel error={error.message} />;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageTitle text="My Orders" />

      {ordersQuery.data && ordersQuery.data.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">You have no recorded orders</p>
        </div>
      ) : (
        <div className="space-y-6">
          {ordersQuery.data?.map((order) => (
            <OrderDetails key={order.id} order={order} productsMap={productsMap} />
          ))}
        </div>
      )}
    </div>
  );
}
