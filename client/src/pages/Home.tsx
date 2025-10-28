import { useState } from "react";
import { type Product } from "@shared/schema";
import { ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import AdminLoginModal from "@/components/AdminLoginModal";
import BasketModal from "@/components/BasketModal";
import cashewsImg from "@assets/generated_images/Premium_cashew_nuts_product_photo_c8b18a7a.png";
import strawberriesImg from "@assets/generated_images/Fresh_organic_strawberries_product_photo_dd4d1d44.png";
import almondsImg from "@assets/generated_images/Roasted_almonds_product_photo_28680ce6.png";

export default function Home() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isBasketModalOpen, setIsBasketModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // TODO: remove mock functionality - replace with API call
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Premium Cashews",
      price500g: "110.00",
      price1kg: "220.00",
      imageUrl: cashewsImg,
      isSpecial: true,
    },
    {
      id: 2,
      name: "Fresh Strawberries",
      price500g: "42.50",
      price1kg: "85.00",
      imageUrl: strawberriesImg,
      isSpecial: false,
    },
    {
      id: 3,
      name: "Roasted Almonds",
      price500g: "90.00",
      price1kg: "180.00",
      imageUrl: almondsImg,
      isSpecial: false,
    },
  ]);

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    console.log('Admin logged in successfully');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onBasketClick={() => setIsBasketModalOpen(true)} />
      <Hero />
      
      <main className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-24" id="products">
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-light tracking-wide text-foreground mb-4">
            Our Collection
          </h2>
          <div className="w-24 h-px bg-sage mx-auto mb-4" />
          <p className="text-base font-sans text-gray-700 max-w-2xl mx-auto">
            Artisan selections of the finest fruits and nuts, carefully curated for discerning palates
          </p>
        </div>
        
        <ProductGrid products={products} />
      </main>
      
      <footer className="border-t border-card-border bg-white py-12">
        <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
          <p className="text-sm font-sans tracking-wide uppercase text-gray-500">
            © 2025 The Nosh Co. · South Africa
          </p>
        </div>
      </footer>

      {/* Floating Admin Button */}
      <button
        onClick={() => setIsAdminModalOpen(true)}
        className="fixed bottom-8 left-6 z-40 w-16 h-16 bg-black text-white flex items-center justify-center shadow-2xl border-2 border-white hover:bg-gray-900 transition-colors"
        data-testid="button-admin-float"
      >
        <ShieldCheck className="w-6 h-6" />
      </button>

      {/* Modals */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
      <BasketModal
        isOpen={isBasketModalOpen}
        onClose={() => setIsBasketModalOpen(false)}
      />
    </div>
  );
}
