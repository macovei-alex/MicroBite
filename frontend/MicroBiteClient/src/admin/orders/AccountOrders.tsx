import { useEffect } from "react";
import { useOrdersQuery } from "../../api/hooks/useOrdersQuery";
import { Account } from "../../api/types/Account";
import { Product } from "../../api/types/Product";
import ErrorLabel from "../../components/ErrorLabel";
import OrderDetails from "../../orders/components/OrderDetails";
import OrderHistorySkeleton from "../../orders/components/OrderHistorySkeleton";
import { useOrderStatusUpdatesContext } from "../../orders/context/useOrderStatusUpdatesContext";
import { useQueryClient } from "@tanstack/react-query";
import { Order } from "../../api/types/Order";

type AccountOrdersProps = {
  account: Account;
  productsMap: Map<number, Product>;
};

export default function AccountOrders({ account, productsMap }: AccountOrdersProps) {
  const queryClient = useQueryClient();
  const orderStatusContext = useOrderStatusUpdatesContext();
  const ordersQuery = useOrdersQuery(account.id);

  useEffect(() => {
    const handleStatusUpdate = (orderId: number, status: string) => {
      queryClient.setQueryData<Order[]>(["orders", orderId], (oldData) => {
        const updatedOrders = oldData?.map((order) => {
          if (order.id === orderId) {
            return { ...order, status };
          }
          return order;
        });
        return updatedOrders;
      });
    };

    orderStatusContext.observable.subscribe(handleStatusUpdate);

    return () => {
      orderStatusContext.observable.unsubscribe(handleStatusUpdate);
    };
  }, [orderStatusContext.observable, queryClient]);

  if (ordersQuery.isLoading) {
    return <OrderHistorySkeleton />;
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">
        Order History for {account.firstName} {account.lastName}
      </h3>
      <ErrorLabel error={ordersQuery.error?.message} />
      {ordersQuery.data?.length === 0 ? (
        <p className="text-gray-600">No orders found for this account.</p>
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
