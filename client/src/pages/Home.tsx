import { useState } from "react";
import { type Product } from "@shared/schema";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import AdminButton from "@/components/AdminButton";
import cashewsImg from "@assets/generated_images/Premium_cashew_nuts_product_photo_c8b18a7a.png";
import strawberriesImg from "@assets/generated_images/Fresh_organic_strawberries_product_photo_dd4d1d44.png";
import almondsImg from "@assets/generated_images/Roasted_almonds_product_photo_28680ce6.png";

export default function Home() {
  // TODO: remove mock functionality - replace with API call
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Premium Cashews",
      price: "220.00",
      unit: "/kg",
      stock: 50,
      imageUrl: cashewsImg,
      isSpecial: true,
    },
    {
      id: 2,
      name: "Fresh Strawberries",
      price: "85.00",
      unit: "/pack",
      stock: 30,
      imageUrl: strawberriesImg,
      isSpecial: false,
    },
    {
      id: 3,
      name: "Roasted Almonds",
      price: "180.00",
      unit: "/kg",
      stock: 25,
      imageUrl: almondsImg,
      isSpecial: false,
    },
  ]);

  const handleProductClick = (product: Product) => {
    console.log("Product clicked:", product.name);
    // TODO: Navigate to product detail page
  };

  const handleAdminClick = () => {
    console.log("Admin button clicked");
    // TODO: Navigate to admin login page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-2">
            Fresh Fruits & Premium Nuts
          </h2>
          <p className="text-base text-gray-600">
            Quality products delivered to your door
          </p>
        </div>
        <ProductGrid products={products} onProductClick={handleProductClick} />
      </main>
      <AdminButton onClick={handleAdminClick} />
    </div>
  );
}
