import React, { createContext, useContext, useReducer, useEffect } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type CartState = {
  cartItems: CartItem[];
};

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "CLEAR_CART" };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState;

  switch (action.type) {
    case "ADD_ITEM":
      const existingItem = state.cartItems.find(item => item.id === action.payload.id);
      if (existingItem) {
        newState = {
          cartItems: state.cartItems.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      } else {
        newState = { cartItems: [...state.cartItems, action.payload] };
      }
      break;
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

  console.log("Cart Updated:", newState.cartItems);
  return newState;
};
  

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}>({ state: { cartItems: [] }, dispatch: () => {} });

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, { cartItems: [] });
  
    useEffect(() => {
      const storedCart = localStorage.getItem("shopping_cart");
      if (storedCart) {
        console.log("Cart Loaded from LocalStorage:", JSON.parse(storedCart)); // 🔹 Debugging
        dispatch({ type: "SET_CART", payload: JSON.parse(storedCart) });
      }
    }, []);
  
    useEffect(() => {
      console.log("Cart Updated in LocalStorage:", state.cartItems); // 🔹 Debugging
      localStorage.setItem("shopping_cart", JSON.stringify(state.cartItems));
    }, [state.cartItems]);
  
    console.log("CartProvider Initialized", state.cartItems); // 🔹 Debugging
  
    return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
  };
  

export const useCart = () => useContext(CartContext);
