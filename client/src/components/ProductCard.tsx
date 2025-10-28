import { type Product } from "@shared/schema";
import { useState } from "react";
import { useBasket } from "@/contexts/BasketContext";
import { useAdmin } from "@/contexts/AdminContext";
import { useSpecials } from "@/contexts/SpecialsContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hoveredSize, setHoveredSize] = useState<'500g' | '1kg' | null>(null);
  const { addItem } = useBasket();
  const { isAdminLoggedIn } = useAdmin();
  const { isSpecial, toggleSpecial } = useSpecials();

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return `R ${numPrice.toFixed(2)}`;
  };

  const handleSizeClick = (size: '500g' | '1kg') => {
    const price = size === '500g' ? product.price500g : product.price1kg;
    addItem(product.id, product.name, size, price);
  };

  const handleToggleSpecial = () => {
    toggleSpecial(product.id);
  };

  const productIsSpecial = isSpecial(product.id);

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
        {productIsSpecial && (
          <div 
            className="absolute top-4 left-4 bg-orange-500 px-4 py-1.5"
            data-testid={`badge-special-${product.id}`}
          >
            <span className="text-xs font-sans uppercase tracking-widest text-white">
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

        {isAdminLoggedIn && (
          <div className="mb-4 flex items-center gap-3 pb-4 border-b border-stone-200">
            <label 
              htmlFor={`special-toggle-${product.id}`}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="relative">
                <input
                  id={`special-toggle-${product.id}`}
                  type="checkbox"
                  checked={productIsSpecial}
                  onChange={handleToggleSpecial}
                  className="sr-only peer"
                  data-testid={`toggle-special-${product.id}`}
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 peer-focus:ring-offset-2 peer-checked:bg-orange-500 transition-colors">
                  <div className="dot absolute left-1 top-1 bg-white w-4 h-4 transition-transform peer-checked:translate-x-5"></div>
                </div>
              </div>
              <span className="text-sm font-sans tracking-wide uppercase text-gray-700">
                Special
              </span>
            </label>
          </div>
        )}
        
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
