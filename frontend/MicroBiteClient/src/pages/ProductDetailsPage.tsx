import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate, useParams } from "react-router-dom";

type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
};

const products: Product[] = [
  { 
    id: "1", 
    name: "Bread", 
    price: 5,
    description: "Fresh traditional bread, 500g" 
  },
  { 
    id: "2", 
    name: "Milk", 
    price: 8,
    description: "Whole milk 3.5%, 1L" 
  },
  { 
    id: "3", 
    name: "Eggs", 
    price: 12,
    description: "Free-range chicken eggs, 10 pcs" 
  },
  { 
    id: "4", 
    name: "Apples", 
    price: 3,
    description: "Golden apples, 1kg" 
  }
];

export default function ProductDetailsPage() {
  const { productId } = useParams<{ productId: string }>();
  const { state, dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const product = products.find(p => p.id === productId);

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    const existingItem = state.cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id: product.id, quantity: existingItem.quantity + quantity }
      });
    } else {
      dispatch({
        type: "ADD_ITEM",
        payload: { ...product, quantity }
      });
    }

    navigate("/cart");
  };

  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "600px", 
      margin: "0 auto",
      border: "1px solid #eee",
      borderRadius: "8px"
    }}>
      <h2 style={{ color: "#333" }}>{product.name}</h2>
      {product.description && (
        <p style={{ margin: "10px 0", color: "#666" }}>{product.description}</p>
      )}
      <p style={{ fontSize: "1.2em", fontWeight: "bold" }}>
        Price: {product.price} RON
      </p>
      
      <div style={{ margin: "20px 0" }}>
        <label style={{ marginRight: "10px" }}>Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{ 
            width: "60px", 
            padding: "5px",
            border: "1px solid #ddd",
            borderRadius: "4px"
          }}
        />
      </div>

      <button
        onClick={handleAddToCart}
        style={{ 
          backgroundColor: "#2196F3",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "1em"
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}
