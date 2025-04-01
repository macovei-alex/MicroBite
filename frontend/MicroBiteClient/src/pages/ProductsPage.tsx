import React from "react";
import { Link } from "react-router-dom";

const products = [
  { id: "1", name: "Bread", price: 5 },
  { id: "2", name: "Milk", price: 8 },
  { id: "3", name: "Eggs", price: 12 },
  { id: "4", name: "Apples", price: 3 }
];

export default function ProductsPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Products</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
            <h3>{product.name}</h3>
            <p>Price: {product.price} RON</p>
            <Link to={`/add-to-cart/${product.id}`}>
              <button
                style={{
                  backgroundColor: "green",
                  color: "white",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                View Product
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}