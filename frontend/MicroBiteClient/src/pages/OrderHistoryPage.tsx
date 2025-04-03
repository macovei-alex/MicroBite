import { useQuery } from "@tanstack/react-query";
import { resApi } from "../api";
import OrderHistorySkeleton from "../components/OrderHistorySkeleton";

type OrderStatus = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image?: string;
  category: {
    id: number;
    name: string;
  };
};

type OrderItem = {
  id: number;
  product?: Product;
  totalPrice: number;
  count: number;
};

type Order = {
  id: number;
  status: OrderStatus;
  accountId: string;
  address: string;
  orderTime: string;
  deliveryTime?: string;
  additionalNotes?: string;
  orderItems: OrderItem[];
};

export const useOrdersQuery = () => {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await resApi.get('/order/my-orders');
      return response.data;
    }
  });
};

export default function OrderHistoryPage() {
  const { data: orders, isLoading, error } = useOrdersQuery();

  if (isLoading) return <OrderHistorySkeleton />;
  
  if (error) return <div className="p-4 text-red-500">Eroare la încărcarea istoricului: {error.message}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-500">Istoric Comenzi</h1>
      
      {(orders && orders.length === 0) ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Nu aveți comenzi înregistrate</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders?.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-wrap justify-between items-start mb-4">
                <div className="mb-2">
                  <h2 className="text-xl font-semibold">Comanda #{order.id}</h2>
                  <p className="text-gray-600">
                    Dată: {new Date(order.orderTime).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status.name === 'Finalizată' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status.name}
                  </span>
                  {order.deliveryTime && (
                    <p className="text-sm text-gray-600 mt-1">
                      Livrare: {new Date(order.deliveryTime).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <p className="font-medium">Adresă livrare:</p>
                <p className="text-gray-600">{order.address}</p>
                {order.additionalNotes && (
                  <p className="mt-2 text-gray-600">
                    <span className="font-medium">Note adiționale:</span> {order.additionalNotes}
                  </p>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Produse:</h3>
                <div className="space-y-3">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        {item.product?.image && (
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-16 h-16 object-contain"
                          />
                        )}
                        <div>
                          <p className="font-medium">{item.product?.name || 'Produs indisponibil'}</p>
                          <p className="text-sm text-gray-600">
                            {item.count} × {item.product?.price.toFixed(2)} RON
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">{item.totalPrice.toFixed(2)} RON</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 mt-4 flex justify-end">
                <p className="text-lg font-bold">
                  Total: {order.orderItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)} RON
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}