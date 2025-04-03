import { useContext } from "react";
import { CartContext } from "./CartContext";

export function useCartContext() {
  const cartContext = useContext(CartContext);
  if (!cartContext) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return cartContext;
}
