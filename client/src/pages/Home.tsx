import { useState } from "react";
import { useLocation } from "wouter";
import { ShieldCheck, Settings } from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import AdminLoginModal from "@/components/AdminLoginModal";
import BasketModal from "@/components/BasketModal";
import { useAdmin } from "@/contexts/AdminContext";
import { categories } from "@/data/products";

export default function Home() {
  const [, setLocation] = useLocation();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isBasketModalOpen, setIsBasketModalOpen] = useState(false);
  const { login, isAdminLoggedIn } = useAdmin();

  const handleAdminLoginSuccess = () => {
    login();
    console.log('Admin logged in successfully');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onBasketClick={() => setIsBasketModalOpen(true)} />
      <Hero />
      
      <main className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-24" id="categories">
        <div className="mb-12 md:mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-light tracking-wide text-foreground mb-4">
            Our Collection
          </h2>
          <div className="w-24 h-px bg-sage mx-auto mb-4" />
          <p className="text-base font-sans text-gray-700 max-w-2xl mx-auto">
            Artisan selections of the finest fruits, nuts, and premium ingredients
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </main>
      
      <footer className="border-t border-card-border bg-white py-12">
        <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
          <p className="text-sm font-sans tracking-wide uppercase text-gray-500">
            © 2025 The Nosh Co. · South Africa
          </p>
        </div>
      </footer>

      {/* Floating Admin Button */}
      {!isAdminLoggedIn ? (
        <button
          onClick={() => setIsAdminModalOpen(true)}
          className="fixed bottom-8 left-6 z-40 w-16 h-16 bg-black text-white flex items-center justify-center shadow-2xl border-2 border-white hover:bg-gray-900 transition-colors"
          data-testid="button-admin-float"
        >
          <ShieldCheck className="w-6 h-6" />
        </button>
      ) : (
        <button
          onClick={() => setLocation('/admin')}
          className="fixed bottom-8 left-6 z-40 w-16 h-16 bg-black text-white flex items-center justify-center shadow-2xl border-2 border-white hover:bg-gray-900 transition-colors"
          data-testid="button-admin-dashboard"
        >
          <Settings className="w-6 h-6" />
        </button>
      )}

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
