import PageTitle from "../../components/PageTitle";
import MenuSkeleton from "../components/MenuSkeleton";
import ProductCard from "../components/ProductCard";
import { useMenuPageHook } from "../hooks/useMenuPageHook";

export default function MenuPageDesktopLayout() {
  const {
    productsQuery,
    setSelectedCategory,
    selectedCategory,
    categories,
    filteredProducts,
    handleAddToCart,
  } = useMenuPageHook();

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

      <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  );
}
