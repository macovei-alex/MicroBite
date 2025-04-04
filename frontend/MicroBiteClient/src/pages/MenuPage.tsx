import { useMemo, useState } from "react";
import { useProductsQuery } from "../api/hooks/useProductsQuery";
import { Category } from "../api/types/Category";
import { Product } from "../api/types/Product";
import ProductCard from "../menu/components/ProductCard";
import MenuSkeleton from "../menu/components/MenuSkeleton";
import { useCartContext } from "../cart/context/useCartContext";
import PageTitle from "../components/PageTitle";

export default function MenuPage() {
  const productsQuery = useProductsQuery();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { dispatch } = useCartContext();

  const categories = useMemo<Category[]>(() => {
    if (!productsQuery.data) return [];
    const uniqueCategories = new Map<number, Category>();
    productsQuery.data.forEach((product) => {
      uniqueCategories.set(product.category.id, product.category);
    });
    return Array.from(uniqueCategories).map(([id, category]) => ({
      id,
      name: category.name,
    }));
  }, [productsQuery.data]);

  const filteredProducts = useMemo<Product[]>(() => {
    if (!productsQuery.data) return [];
    return selectedCategory
      ? productsQuery.data.filter((p) => p.category.id === selectedCategory)
      : productsQuery.data;
  }, [productsQuery.data, selectedCategory]);

  const handleAddToCart = (product: Product, quantity: number) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        quantity: quantity,
      },
    });
  };

  if (productsQuery.isError) {
    console.error(productsQuery.error);
    const message = productsQuery.error.response?.data;
    return <p>Error: {typeof message === "string" ? message : "An unknown error occurred"}</p>;
  }

  if (productsQuery.isLoading) return <MenuSkeleton />;

  return (
    <div className="p-6 max-w-6xl mx-auto text-blue-500">
      <PageTitle text="Menu" />
      <div className="flex gap-4 mb-6 justify-center">
        <button
          className={`px-4 py-2 rounded-md font-medium border transition duration-500 cursor-pointer ${
            !selectedCategory
              ? "bg-blue-500 text-white"
              : "border-blue-500 text-blue-500 hover:bg-blue-100 hover:text-blue-600"
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-md font-medium border transition duration-500 cursor-pointer ${
              selectedCategory === category.id
                ? "bg-blue-500 text-white"
                : "border-blue-500 text-blue-500 hover:bg-blue-100 hover:text-blue-600"
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  );
}
