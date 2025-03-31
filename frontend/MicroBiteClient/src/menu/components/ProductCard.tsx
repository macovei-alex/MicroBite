import Button from "../../components/Button";
import { Product } from "../../api/types/Product";
import { defaultProductImage } from "../../assets/defaultProductImage";

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product) => void;
};

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div
      key={product.id}
      className="p-4 border border-blue-500 rounded-lg shadow-md flex flex-col h-full"
    >
      <img
        src={product.image || defaultProductImage}
        alt={product.name}
        className="w-full h-40 object-cover rounded-lg mb-2"
      />
      <div className="flex flex-col flex-1">
        <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
        <p className="text-sm text-gray-600 flex-1 line-clamp-3 mb-4 min-h-[5em]">
          {product.description}
        </p>
        <div className="flex flex-row justify-between items-center mt-auto">
          <p className="text-lg font-bold text-blue-500">${product.price.toFixed(2)}</p>
          <div>
            <Button text="Add to Cart" onClick={() => onAddToCart(product)} />
          </div>
        </div>
      </div>
    </div>
  );
}
