import { useReducer, useEffect, useRef, useCallback } from "react";
import { CartAction, CartContext, CartState } from "./CartContext";

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.cartItems.find((item) => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, action.payload].sort((a, b) =>
            a.name.localeCompare(b.name)
          ),
        };
      }
    }
    case "REMOVE_ITEM":
      return { ...state, cartItems: state.cartItems.filter((item) => item.id !== action.payload) };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      };
    case "SET_CART":
      return { ...action.payload };
    case "CLEAR_CART":
      return { ...state, cartItems: [] };
    case "UPDATE_ADDRESS":
      return { ...state, address: action.payload };
    case "UPDATE_ADDITIONAL_NOTES":
      return { ...state, additionalNotes: action.payload };
  }
  throw new Error("Unhandled action type: " + (action as any).type);
};

type CartContextProviderProps = {
  children: React.ReactNode;
};

export default function CartProvider({ children }: CartContextProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, {
    cartItems: [],
    address: "",
    additionalNotes: "",
  });
  const lastCartAction = useRef<CartAction["type"]>("SET_CART");

  const dispatchWrapper = useCallback<React.Dispatch<CartAction>>((action) => {
    lastCartAction.current = action.type;
    dispatch(action);
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem("shopping_cart");
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart) as CartState;
        dispatchWrapper({
          type: "SET_CART",
          payload: {
            cartItems: parsedCart.cartItems || [],
            address: parsedCart.address || "",
            additionalNotes: parsedCart.additionalNotes || "",
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [dispatchWrapper]);

  useEffect(() => {
    if (lastCartAction.current === "SET_CART") return;
    localStorage.setItem("shopping_cart", JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch: dispatchWrapper }}>
      {children}
    </CartContext.Provider>
  );
}
