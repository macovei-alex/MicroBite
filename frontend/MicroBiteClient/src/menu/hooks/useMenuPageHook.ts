import { useMemo, useState } from "react";
import { useProductsQuery } from "../../api/hooks/useProductsQuery";
import { useCartContext } from "../../cart/context/useCartContext";
import { Category } from "../../api/types/Category";
import { Product } from "../../api/types/Product";

export function useMenuPageHook() {
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

  return {
    productsQuery,
    categories,
    filteredProducts,
    selectedCategory,
    setSelectedCategory,
    handleAddToCart,
  };
}
