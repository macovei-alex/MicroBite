import { useState, useEffect, useMemo, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi, resApi } from "../api";
import { Order } from "../api/types/Order";
import { useProductsQuery } from "../api/hooks/useProductsQuery";
import PageTitle from "../components/PageTitle";
import ErrorLabel from "../components/ErrorLabel";
import OrderHistorySkeleton from "../orders/components/OrderHistorySkeleton";
import { useOrderStatusUpdatesContext } from "../orders/context/useOrderStatusUpdatesContext";
import { Account } from "../api/types/Account";
import Button from "../components/Button";
import { Product } from "../api/types/Product";
import { defaultProductImage } from "../assets/defaultProductImage";
import { AuthContext } from "../auth/types/AuthContext"; // Import your AuthContext
import { Navigate } from 'react-router-dom'; // Import Navigate for redirection

async function fetchAllAccounts(): Promise<Account[]> {
  const response = await authApi.get<Account[]>("/Account");
  return response.data;
}

async function fetchUserOrders(accountId: string): Promise<Order[]> {
  const response = await resApi.get<Order[]>(`/Order/user/${accountId}`);
  return response.data;
}

function OrderDetails({ orders, productsMap, dateTimeFormat }: {
  accountId: string;
  orders: Order[];
  productsMap: Map<number, Product>;
  dateTimeFormat: Intl.DateTimeFormat;
}) {
  // No Hooks called directly within this child component, which is good.
  return (
    <div className="space-y-6">
      {orders?.map((order) => (
        <div
          key={order.id}
          className="bg-white border-1 border-gray-300 rounded-lg shadow-md p-6"
        >
          <div className="flex justify-between mb-2 items-center">
            <h2 className="text-xl font-semibold bg-blue-500 text-white w-fit px-4 py-2 rounded-lg">
              Order #{order.id}
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-lg text-center ${
                order.status === "Completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="flex gap-16 my-4">
            <div className="flex flex-wrap flex-col items-start gap-2 font-semibold">
              <p>
                Ordered: {order.orderTime ? dateTimeFormat.format(new Date(order.orderTime)) : 'N/A'}
              </p>
              {order.deliveryTime && (
                <p>
                  Delivery: {order.deliveryTime ? dateTimeFormat.format(new Date(order.deliveryTime)) : 'N/A'}
                </p>
              )}
              <p>Delivery Address: {order.address}</p>
              {order.additionalNotes && <p>Additional Notes: {order.additionalNotes}</p>}
            </div>
          </div>

          <div className="border-t pt-4 text-blue-500">
            <h3 className="mb-2 font-bold">Products:</h3>
            <div className="space-y-3">
              {order.orderItems.map((item) => {
                const product = productsMap.get(item.productId);
                if (!product) {
                  return <p>Error: product with ID {item.productId} not found</p>;
                }
                return (
                  <div key={product.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-4 font-medium">
                      <img
                        src={product.image || defaultProductImage}
                        alt={product.name}
                        className="w-24 h-24 object-contain"
                      />
                      <div>
                        <p>{product.name || "Product unavailable"}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × {product.price.toFixed(2)} RON
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-blue-500">
                      {item.totalPrice.toFixed(2)} RON
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t pt-4 mt-4 flex justify-between text-lg text-blue-500 font-bold">
            <p>Total:</p>
            <p>
              {order.orderItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)} RON
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminUserOrdersPage() {
  const authContext = useContext(AuthContext);

  if (authContext == null || authContext.jwtClaims?.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  const allAccountsQuery = useQuery({
    queryKey: ["admin", "accounts"],
    queryFn: fetchAllAccounts,
  });
  const productsQuery = useProductsQuery();
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);
  const [accountOrders, setAccountOrders] = useState<Record<string, Order[]>>({});
  const [isLoadingOrders, setIsLoadingOrders] = useState<Record<string, boolean>>({});
  const [errorOrders, setErrorOrders] = useState<Record<string, any>>({});

  const orderStatusContext = useOrderStatusUpdatesContext();
  const dateTimeFormat = useMemo(() => Intl.DateTimeFormat("en-CA"), []);
  const productsMap = useMemo(() => {
    if (!productsQuery.data) {
      return new Map<number, Product>();
    }
    return new Map(productsQuery.data.map((p) => [p.id, p]));
  }, [productsQuery.data]);

  useEffect(() => {
    function handleStatusUpdate(orderId: number, status: string) {
      setAccountOrders((prevOrders) => {
        const updatedOrders = { ...prevOrders };
        for (const accountId in updatedOrders) {
          updatedOrders[accountId] = updatedOrders[accountId]?.map((order) =>
            order.id === orderId ? { ...order, status } : order
          );
        }
        return updatedOrders;
      });
    }

    orderStatusContext.observable.subscribe(handleStatusUpdate);

    return () => {
      orderStatusContext.observable.unsubscribe(handleStatusUpdate);
    };
  }, [orderStatusContext.observable]);

  const handleAccountClick = async (account: Account) => {
    if (expandedAccountId === account.id) {
      setExpandedAccountId(null);
      return;
    }

    setExpandedAccountId(account.id);
    if (!accountOrders[account.id]) {
      setIsLoadingOrders((prev) => ({ ...prev, [account.id]: true }));
      setErrorOrders((prev) => ({ ...prev, [account.id]: null }));
      try {
        const orders = await fetchUserOrders(account.id);
        setAccountOrders((prev) => ({ ...prev, [account.id]: orders }));
      } catch (error: any) {
        console.error("Failed to fetch account orders:", error);
        setErrorOrders((prev) => ({ ...prev, [account.id]: error.message }));
      } finally {
        setIsLoadingOrders((prev) => ({ ...prev, [account.id]: false }));
      }
    }
  };

  if (allAccountsQuery.isLoading || productsQuery.isLoading) {
    return <OrderHistorySkeleton />;
  }

  if (allAccountsQuery.error) {
    return <ErrorLabel error={(allAccountsQuery.error as any)?.message || "Failed to load accounts."} />;
  }

  const accounts = allAccountsQuery.data;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageTitle text="Account Order History" />

      {accounts?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No accounts found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-2">Account List</h2>
          <ul className="list-disc pl-5">
            {accounts?.map((account) => (
              <li key={account.id} className="cursor-pointer hover:text-blue-500">
                <Button
                  text={`${account.firstName} ${account.lastName} (${account.email})`}
                  onClick={() => handleAccountClick(account)}
                />
                {expandedAccountId === account.id && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Order History for {account.firstName} {account.lastName}
                    </h3>
                    {isLoadingOrders[account.id] ? (
                      <OrderHistorySkeleton />
                    ) : errorOrders[account.id] ? (
                      <ErrorLabel error={errorOrders[account.id]} />
                    ) : accountOrders[account.id]?.length === 0 ? (
                      <p className="text-gray-600">No orders found for this account.</p>
                    ) : (
                      // Extracted the rendering of order details into a separate component
                      <OrderDetails
                        accountId={account.id}
                        orders={accountOrders[account.id] || []}
                        productsMap={productsMap}
                        dateTimeFormat={dateTimeFormat}
                      />
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}