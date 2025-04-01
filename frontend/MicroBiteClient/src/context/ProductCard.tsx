import React from "react";
import { useCart } from "../context/CartContext";

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  weight?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const { dispatch } = useCart();

  const handleAddToCart = () => {
    dispatch({
      type: "ADD_ITEM",
      payload: { ...product, quantity: 1 },
    });
  };

  return (
    <div style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}>
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      <button onClick={handleAddToCart} style={{ backgroundColor: "blue", color: "white" }}>
        Add to Cart
      </button>
    </div>
  );
}
