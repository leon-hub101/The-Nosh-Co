import { type Product } from "@shared/schema";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  onAddToBasket?: (productId: number, size: '500g' | '1kg') => void;
}

export default function ProductCard({ product, onAddToBasket }: ProductCardProps) {
  const [hoveredSize, setHoveredSize] = useState<'500g' | '1kg' | null>(null);

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return `R ${numPrice.toFixed(2)}`;
  };

  const handleSizeClick = (size: '500g' | '1kg') => {
    console.log(`Added ${product.name} - ${size} to basket`);
    onAddToBasket?.(product.id, size);
  };

  return (
    <div
      className="bg-white border border-card-border hover:border-foreground transition-all duration-300"
      data-testid={`card-product-${product.id}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-50">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            data-testid={`img-product-${product.id}`}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <svg 
              className="w-24 h-24 text-sage/30" 
              viewBox="0 0 100 100" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1"
            >
              <circle cx="50" cy="40" r="15" />
              <path d="M 50 25 Q 35 15, 30 30" />
              <path d="M 50 25 Q 65 15, 70 30" />
              <path d="M 30 30 Q 25 45, 35 55" />
              <path d="M 70 30 Q 75 45, 65 55" />
              <path d="M 35 55 Q 40 65, 50 70" />
              <path d="M 65 55 Q 60 65, 50 70" />
            </svg>
          </div>
        )}
        {product.isSpecial && (
          <div 
            className="absolute top-4 left-4 bg-stone-100 border border-sage px-4 py-1.5"
            data-testid={`badge-special-${product.id}`}
          >
            <span className="text-xs font-sans uppercase tracking-widest text-foreground">
              Special
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 
          className="text-lg md:text-xl font-serif font-normal tracking-wide text-foreground mb-4" 
          data-testid={`text-product-name-${product.id}`}
        >
          {product.name}
        </h3>
        
        <div className="flex items-stretch divide-x divide-stone-200">
          <button
            onClick={() => handleSizeClick('500g')}
            onMouseEnter={() => setHoveredSize('500g')}
            onMouseLeave={() => setHoveredSize(null)}
            className={`flex-1 py-3 px-4 text-center transition-colors ${
              hoveredSize === '500g' ? 'bg-stone-50' : ''
            }`}
            data-testid={`button-add-500g-${product.id}`}
          >
            <div className="text-xs font-sans tracking-wide uppercase text-gray-500 mb-1">
              500g
            </div>
            <div className="text-base font-serif text-foreground" data-testid={`text-price-500g-${product.id}`}>
              {formatPrice(product.price500g)}
            </div>
          </button>
          
          <button
            onClick={() => handleSizeClick('1kg')}
            onMouseEnter={() => setHoveredSize('1kg')}
            onMouseLeave={() => setHoveredSize(null)}
            className={`flex-1 py-3 px-4 text-center transition-colors ${
              hoveredSize === '1kg' ? 'bg-stone-50' : ''
            }`}
            data-testid={`button-add-1kg-${product.id}`}
          >
            <div className="text-xs font-sans tracking-wide uppercase text-gray-500 mb-1">
              1kg
            </div>
            <div className="text-base font-serif text-foreground" data-testid={`text-price-1kg-${product.id}`}>
              {formatPrice(product.price1kg)}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
