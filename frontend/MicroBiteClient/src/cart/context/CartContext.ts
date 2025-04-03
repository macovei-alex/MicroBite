import { createContext } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "SET_CART"; payload: CartState }
  | { type: "CLEAR_CART" }
  | { type: "UPDATE_ADDRESS"; payload: string }
  | { type: "UPDATE_ADDITIONAL_NOTES"; payload: string };

export type CartState = {
  cartItems: CartItem[];
  address: string;
  additionalNotes: string;
};

export type CartContextType = {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
};

export const CartContext = createContext<CartContextType | null>(null);
