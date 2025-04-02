import { useReducer, useEffect, useRef, useCallback, Dispatch } from "react";
import { CartAction, CartContext, CartState } from "./CartContext";

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.cartItems.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return {
          cartItems: state.cartItems.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      } else {
        return {
          cartItems: [...state.cartItems, action.payload].sort((a, b) =>
            a.name.localeCompare(b.name)
          ),
        };
      }
    }
    case "REMOVE_ITEM":
      return { cartItems: state.cartItems.filter((item) => item.id !== action.payload) };
    case "UPDATE_QUANTITY":
      return {
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      };
    case "SET_CART":
      return { cartItems: action.payload };
    case "CLEAR_CART":
      return { cartItems: [] };
  }
  throw new Error("Unhandled action type: " + (action as any).type);
};

type CartContextProviderProps = {
  children: React.ReactNode;
};

export default function CartProvider({ children }: CartContextProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, { cartItems: [] });
  const lastCartAction = useRef<CartAction["type"]>("SET_CART");

  const dispatchWrapper = useCallback<Dispatch<CartAction>>((action) => {
    lastCartAction.current = action.type;
    dispatch(action);
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem("shopping_cart");
    if (storedCart) {
      dispatchWrapper({ type: "SET_CART", payload: JSON.parse(storedCart) });
    }
  }, [dispatchWrapper]);

  useEffect(() => {
    if (lastCartAction.current === "SET_CART") return;
    localStorage.setItem("shopping_cart", JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  return (
    <CartContext.Provider value={{ state, dispatch: dispatchWrapper }}>
      {children}
    </CartContext.Provider>
  );
}
