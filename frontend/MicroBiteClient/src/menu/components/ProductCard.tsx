import { Product } from "../types/Product";

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
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover rounded-lg mb-2"
        />
      )}
      <div className="flex flex-col flex-1">
        <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
        <p className="text-sm text-gray-600 flex-1 line-clamp-3 mb-4">{product.description}</p>
        <div className="flex flex-row justify-between items-center mt-auto">
          <p className="text-lg font-bold text-blue-500">${product.price.toFixed(2)}</p>
          <button
            className="bg-blue-500 text-gray-100 px-6 py-3 text-sm rounded-md hover:bg-blue-700 transition duration-500 cursor-pointer"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
