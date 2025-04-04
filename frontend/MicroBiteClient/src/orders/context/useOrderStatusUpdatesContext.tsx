import { useContext } from "react";
import { OrderStatusUpdatesContext } from "./OrderStatusUpdatesContext";

export function useOrderStatusUpdatesContext() {
  const orderStatusUpdates = useContext(OrderStatusUpdatesContext);
  if (!orderStatusUpdates) {
    throw new Error(
      "useOrderStatusUpdatesContext must be used within an OrderStatusUpdatesProvider"
    );
  }
  return orderStatusUpdates;
}
