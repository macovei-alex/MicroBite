import { useState } from "react";
import { Product } from "../../api/types/Product";
import { defaultProductImage } from "../../assets/defaultProductImage";
import Button from "../../components/Button";

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
};

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddClick = () => {
    onAddToCart(product, quantity);
  };

  return (
    <div className="p-4 border border-blue-500 hover:bg-blue-50 transition duration-500 rounded-lg shadow-md flex flex-col">
      <div className="flex flex-col justify-center items-center">
        <img
          src={product.image || defaultProductImage}
          alt={product.name}
          className="w-full h-40 object-contain rounded-lg mb-2"
        />
      </div>
      <div className="flex flex-col flex-1">
        <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
        <p className="text-sm text-gray-600 flex-1 line-clamp-3 mb-4 min-h-[4.3em]">
          {product.description}
        </p>

        <div className="flex flex-row items-center gap-2 mb-4">
          <label className="text-sm text-gray-700">Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseFloat(e.target.value)))}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
          />
          <p className="text-lg font-bold text-blue-500 ml-auto p-2">
            {product.price.toFixed(2)} RON
          </p>
        </div>
        <Button text="Add To Cart" onClick={handleAddClick} />
      </div>
    </div>
  );
}
