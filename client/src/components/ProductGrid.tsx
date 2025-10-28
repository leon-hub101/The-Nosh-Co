import { type Product } from "@shared/schema";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  onAddToBasket?: (productId: number, size: '500g' | '1kg') => void;
}

export default function ProductGrid({ products, onAddToBasket }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <svg 
          className="w-32 h-32 text-sage/20 mb-6" 
          viewBox="0 0 100 100" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.5"
        >
          <circle cx="50" cy="40" r="20" />
          <path d="M 50 20 Q 30 5, 20 25" />
          <path d="M 50 20 Q 70 5, 80 25" />
          <path d="M 20 25 Q 15 50, 30 65" />
          <path d="M 80 25 Q 85 50, 70 65" />
          <path d="M 30 65 Q 40 80, 50 85" />
          <path d="M 70 65 Q 60 80, 50 85" />
        </svg>
        <p className="text-gray-500 text-lg font-serif font-light">No products available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToBasket={onAddToBasket}
        />
      ))}
    </div>
  );
}
