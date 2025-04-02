import { useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { config } from "../../api";

export function useOrderStatusUpdates(
  onOrderStatusUpdated: (orderId: number, status: string) => void
) {
  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${config.RES_BASE_URL}/notifications`)
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => console.log("Connected to SignalR Hub"))
      .catch((err) => console.error("Connection failed: ", err));

    connection.on("OrderStatusUpdated", onOrderStatusUpdated);

    return () => {
      connection.stop();
    };
  }, [onOrderStatusUpdated]);
}
