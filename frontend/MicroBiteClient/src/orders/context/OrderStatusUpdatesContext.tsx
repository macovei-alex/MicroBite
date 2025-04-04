import { createContext } from "react";
import Observable from "../types/Observable";
import { StatusUpdateCallback } from "../types/OrderStatusUpdateCallback";

type OrderStatusUpdatesContextType = {
  observable: Observable<StatusUpdateCallback>;
};

export const OrderStatusUpdatesContext = createContext<OrderStatusUpdatesContextType | null>(null);
