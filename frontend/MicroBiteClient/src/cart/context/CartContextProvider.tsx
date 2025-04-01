import { useReducer, useEffect } from "react";
import { CartAction, CartContext, CartState } from "./CartContext";

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.cartItems.find((item) => item.id === action.payload.id);
      if (existingItem) {
        newState = {
          cartItems: state.cartItems.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      } else {
        newState = { cartItems: [...state.cartItems, action.payload] };
      }
      break;
    }
    case "REMOVE_ITEM":
      newState = { cartItems: state.cartItems.filter((item) => item.id !== action.payload) };
      break;
    case "UPDATE_QUANTITY":
      newState = {
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      };
      break;
    case "SET_CART":
      newState = { cartItems: action.payload };
      break;
    case "CLEAR_CART":
      newState = { cartItems: [] };
      break;

    default:
      newState = state;
  }

  return newState;
};

type CartContextProviderProps = {
  children: React.ReactNode;
};

export default function CartProvider({ children }: CartContextProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, { cartItems: [] });

  useEffect(() => {
    const storedCart = localStorage.getItem("shopping_cart");
    if (storedCart) {
      dispatch({ type: "SET_CART", payload: JSON.parse(storedCart) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("shopping_cart", JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}
