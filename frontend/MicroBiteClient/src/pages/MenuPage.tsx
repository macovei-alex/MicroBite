import { useMemo, useState } from "react";
import { useProductsQuery } from "../menu/hooks/useProducts";
import { Category } from "../menu/types/Category";
import { Product } from "../menu/types/Product";
import ProductCard from "../menu/components/ProductCard";
import MenuSkeleton from "../menu/components/MenuSkeleton";

export default function MenuPage() {
  const productsQuery = useProductsQuery();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const categories = useMemo<Category[]>(() => {
    if (!productsQuery.data) {
      return [];
    }
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
    if (!productsQuery.data) {
      return [];
    }
    if (!selectedCategory) {
      return productsQuery.data;
    }

    return selectedCategory
      ? productsQuery.data.filter((product) => product.category.id === selectedCategory)
      : productsQuery.data;
  }, [productsQuery.data, selectedCategory]);

  if (productsQuery.isError) {
    console.error(productsQuery.error);
    const message = productsQuery.error.response?.data;
    return <p>Error: {typeof message === "string" ? message : "An unknown error occured"}</p>;
  }

  if (productsQuery.isLoading) {
    return <MenuSkeleton />;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto text-blue-500">
      <h1 className="text-3xl font-bold mb-4 text-center">Menu</h1>
      <div className="flex gap-4 mb-6 justify-center">
        <button
          className={`px-4 py-2 rounded-md font-medium border ${
            selectedCategory === null ? "bg-blue-500 text-white" : "border-blue-500 text-blue-500"
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-md font-medium border ${
              selectedCategory === category.id
                ? "bg-blue-500 text-white"
                : "border-blue-500 text-blue-500"
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={(prod) => console.log(prod)}
          />
        ))}
      </div>
    </div>
  );
}
