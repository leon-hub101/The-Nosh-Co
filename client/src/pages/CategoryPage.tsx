import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Home } from "lucide-react";
import { useProducts, type Product } from "@/hooks/useProducts";
import Header from "@/components/Header";
import BasketModal from "@/components/BasketModal";
import { useState } from "react";
import { useBasket } from "@/contexts/BasketContext";
import { useSpecials } from "@/contexts/SpecialsContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryPage() {
  const [, params] = useRoute("/category/:slug");
  const [, setLocation] = useLocation();
  const [isBasketModalOpen, setIsBasketModalOpen] = useState(false);
  const { addItem: addToBasket } = useBasket();
  const { isSpecial } = useSpecials();
  const { categories, productsByCategory, isLoading } = useProducts();
  
  const slug = params?.slug || "";
  const category = categories.find(c => c.slug === slug);
  
  if (!category) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-serif font-light tracking-wide text-foreground mb-4">
          Category not found
        </h1>
        <Button onClick={() => setLocation('/')} data-testid="button-home">
          Return to Home
        </Button>
      </div>
    );
  }

  const categoryProducts = productsByCategory[category.name] || [];

  const handleAddToBasket = (product: Product, size: "500g" | "1kg") => {
    const price = size === "500g" ? product.price.toString() : product.price2.toString();
    addToBasket(product.id, product.name, size, price);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onBasketClick={() => setIsBasketModalOpen(true)} />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-card-border">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-4">
          <div className="flex items-center gap-2 text-sm font-sans text-gray-600">
            <Link href="/">
              <span className="hover:text-foreground cursor-pointer flex items-center gap-1" data-testid="breadcrumb-home">
                <Home className="w-4 h-4" />
                Home
              </span>
            </Link>
            <span>/</span>
            <span className="text-foreground" data-testid="breadcrumb-category">
              {category.name}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16">
        {/* Category Header */}
        <div className="mb-12 text-center">
          <button
            onClick={() => setLocation('/')}
            className="inline-flex items-center gap-2 mb-6 text-sm font-sans text-gray-600 hover:text-foreground transition-colors"
            data-testid="button-back-home"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </button>
          
          <h1 className="text-4xl md:text-5xl font-serif font-light tracking-wide text-foreground mb-4">
            {category.name}
          </h1>
          <div className="w-24 h-px bg-sage mx-auto mb-4" />
          <p className="text-base font-sans text-gray-700 max-w-2xl mx-auto">
            {category.description}
          </p>
          <p className="text-sm font-sans text-gray-500 mt-2">
            {categoryProducts.length} products
          </p>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-card-border overflow-hidden">
                <Skeleton className="aspect-square" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : categoryProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <p className="text-gray-500 text-lg font-serif font-light">
              No products in this category yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {categoryProducts.map((product) => {
              const productIsSpecial = isSpecial(product.id);
              
              return (
                <div
                  key={product.id}
                  className="bg-white border border-card-border overflow-hidden hover-elevate transition-all"
                  data-testid={`product-card-${product.id}`}
                >
                  <div className="aspect-square bg-stone-50 flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-8">
                        <div className="text-6xl font-serif font-light text-sage mb-2">
                          {product.name[0]}
                        </div>
                        <p className="text-xs font-sans tracking-wider uppercase text-gray-500">
                          {category.name}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    {productIsSpecial && (
                      <div className="inline-block bg-sage/10 border border-sage/30 px-3 py-1 mb-3">
                        <span className="text-xs font-sans tracking-widest uppercase text-sage">
                          Special
                        </span>
                      </div>
                    )}

                    <h3 className="text-xl font-serif font-light tracking-wide text-foreground mb-4">
                      {product.name}
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b border-card-border">
                        <div className="flex-1">
                          <p className="text-sm font-sans text-gray-600">500g</p>
                          <p className="text-lg font-serif text-foreground">R {product.price.toFixed(2)}</p>
                          {product.stock > 0 ? (
                            <p className="text-xs font-sans text-green-600 mt-1" data-testid={`stock-500g-${product.id}`}>
                              In Stock: {product.stock}
                            </p>
                          ) : (
                            <p className="text-xs font-sans text-red-600 mt-1" data-testid={`stock-500g-${product.id}`}>
                              Out of Stock
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddToBasket(product, "500g")}
                          disabled={product.stock === 0}
                          data-testid={`button-add-500g-${product.id}`}
                        >
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Basket'}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-sans text-gray-600">1kg</p>
                          <p className="text-lg font-serif text-foreground">R {product.price2.toFixed(2)}</p>
                          {product.stock2 > 0 ? (
                            <p className="text-xs font-sans text-green-600 mt-1" data-testid={`stock-1kg-${product.id}`}>
                              In Stock: {product.stock2}
                            </p>
                          ) : (
                            <p className="text-xs font-sans text-red-600 mt-1" data-testid={`stock-1kg-${product.id}`}>
                              Out of Stock
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddToBasket(product, "1kg")}
                          disabled={product.stock2 === 0}
                          data-testid={`button-add-1kg-${product.id}`}
                        >
                          {product.stock2 === 0 ? 'Out of Stock' : 'Add to Basket'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="border-t border-card-border bg-white py-12">
        <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
          <p className="text-sm font-sans tracking-wide uppercase text-gray-500">
            © 2025 The Nosh Co. · South Africa
          </p>
        </div>
      </footer>

      <BasketModal
        isOpen={isBasketModalOpen}
        onClose={() => setIsBasketModalOpen(false)}
      />
    </div>
  );
}
