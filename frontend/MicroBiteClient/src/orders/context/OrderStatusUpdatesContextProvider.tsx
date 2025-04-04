import { useEffect, useState } from "react";
import Observable from "../types/Observable";
import { OrderStatusUpdatesContext } from "./OrderStatusUpdatesContext";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { config } from "../../api";
import { StatusUpdateCallback } from "../types/OrderStatusUpdateCallback";

type OrderStatusUpdatesContextProviderProps = {
  children: React.ReactNode;
};

export default function OrderStatusUpdatesContextProvider({
  children,
}: OrderStatusUpdatesContextProviderProps) {
  const observable = useState(new Observable<StatusUpdateCallback>())[0];

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${config.RES_BASE_URL}/notifications`)
      .withAutomaticReconnect()
      .build();

    // the library logs the connection state changes automatically
    connection
      .start()
      .then(() => {})
      .catch(() => {});

    connection.on("OrderStatusUpdated", (orderId: number, status: string) => {
      observable.notify(orderId, status);
    });

    return () => {
      connection.stop();
    };
  }, [observable]);

  return (
    <OrderStatusUpdatesContext.Provider value={{ observable }}>
      {children}
    </OrderStatusUpdatesContext.Provider>
  );
}
