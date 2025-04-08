import { useMemo } from "react";
import { Order } from "../../api/types/Order";
import { Product } from "../../api/types/Product";
import { defaultProductImage } from "../../assets/defaultProductImage";
import { useMediaQuery } from "react-responsive";

type OrderDetailsProps = {
  order: Order;
  productsMap: Map<number, Product>;
};

export default function OrderDetails({ order, productsMap }: OrderDetailsProps) {
  const dateTimeFormat = useMemo(() => Intl.DateTimeFormat("en-CA"), []);
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  return (
    <div key={order.id} className="bg-white border-1 border-blue-500 rounded-lg shadow-lg p-6">
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
          <p>Ordered:</p>
          {order.deliveryTime && <p>Delivery:</p>}
          <p>Delivery Address:</p>
          {order.additionalNotes && <p>Additional Notes:</p>}
        </div>
        <div className="flex flex-wrap flex-col items-start gap-2 font-semibold">
          <p>{dateTimeFormat.format(order.orderTime)}</p>
          {order.deliveryTime && <p>{dateTimeFormat.format(order.deliveryTime)}</p>}
          <p>{order.address}</p>
          {order.additionalNotes && <p>{order.additionalNotes}</p>}
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
                    {isDesktop.valueOf() ? (
                      <p className="text-sm text-gray-500">
                        {item.quantity} × {product.price.toFixed(2)} RON
                      </p>
                    ) : (
                      <>
                        <p className="font-bold text-blue-500">{item.totalPrice.toFixed(2)} RON</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {item.quantity} × {product.price.toFixed(2)} RON
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {isDesktop.valueOf() && (
                  <p className="font-bold text-blue-500">{item.totalPrice.toFixed(2)} RON</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t pt-4 mt-4 flex justify-between text-lg text-blue-500 font-bold">
        <p>Total:</p>
        <p>{order.orderItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)} RON</p>
      </div>
    </div>
  );
}
