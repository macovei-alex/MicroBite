import { useState } from "react";
import { Product } from "../../api/types/Product";
import { defaultProductImage } from "../../assets/defaultProductImage";

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
};

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product, quantity);
  };

  return (
    <div className="p-4 border border-blue-500 hover:bg-blue-100 transition duration-500 rounded-lg shadow-md flex flex-col">
      <div className="flex flex-col justify-center items-center">
        <img
          src={product.image || defaultProductImage}
          alt={product.name}
          className="w-full h-40 object-contain rounded-lg mb-2"
        />
      </div>
      <div className="flex flex-col flex-1">
        <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
        <p className="text-sm text-gray-600 flex-1 line-clamp-3 mb-4 min-h-[5em]">
          {product.description}
        </p>
        
        <div className="flex flex-col gap-2 mt-auto">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
            />
          </div>
          
          <button
            onClick={handleAddClick}
            className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Add to Cart
          </button>
        </div>

        <p className="text-lg font-bold text-blue-500 mt-2">
          {product.price.toFixed(2)} RON
        </p>
      </div>
    </div>
  );
}