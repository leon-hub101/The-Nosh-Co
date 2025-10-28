import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useBasket } from "@/contexts/BasketContext";
import { Button } from "@/components/ui/button";

interface BasketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BasketModal({ isOpen, onClose }: BasketModalProps) {
  const [, setLocation] = useLocation();
  const { items, updateQuantity, removeItem, getTotalPrice, clearBasket } = useBasket();

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return `R ${price.toFixed(2)}`;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="basket-modal-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        data-testid="backdrop-basket-modal"
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 bg-white border border-card-border max-w-2xl w-full max-h-[90vh] flex flex-col" data-testid="modal-basket">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-card-border">
          <h2 
            id="basket-modal-title"
            className="text-2xl font-serif font-light tracking-wide text-foreground"
          >
            Your Basket
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:opacity-70 transition-opacity"
            data-testid="button-close-basket"
            aria-label="Close basket"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg 
                className="w-24 h-24 text-sage/20 mb-4" 
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
              <p className="text-gray-500 text-lg font-serif font-light" data-testid="text-empty-basket">
                Your basket is empty
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div 
                  key={`${item.productId}-${item.size}`}
                  className="flex items-center gap-4 p-4 border border-card-border"
                  data-testid={`basket-item-${item.productId}-${item.size}`}
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-serif text-foreground" data-testid={`text-basket-item-name-${item.productId}`}>
                      {item.productName}
                    </h3>
                    <p className="text-sm font-sans text-gray-500" data-testid={`text-basket-item-size-${item.productId}`}>
                      {item.size}
                    </p>
                    <p className="text-base font-serif text-foreground mt-1" data-testid={`text-basket-item-price-${item.productId}`}>
                      {formatPrice(parseFloat(item.price))} each
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                      className="p-2 border border-card-border hover:bg-stone-50 transition-colors"
                      data-testid={`button-decrease-${item.productId}-${item.size}`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-sans" data-testid={`text-quantity-${item.productId}-${item.size}`}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                      className="p-2 border border-card-border hover:bg-stone-50 transition-colors"
                      data-testid={`button-increase-${item.productId}-${item.size}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId, item.size)}
                    className="p-2 text-red-600 hover:bg-red-50 transition-colors"
                    data-testid={`button-remove-${item.productId}-${item.size}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-card-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-serif text-foreground">Total</span>
              <span className="text-2xl font-serif text-foreground" data-testid="text-basket-total">
                {formatPrice(getTotalPrice())}
              </span>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={clearBasket}
                className="flex-1 text-sm font-sans tracking-widest uppercase"
                data-testid="button-clear-basket"
              >
                Clear Basket
              </Button>
              <Button
                onClick={() => {
                  onClose();
                  setLocation('/checkout');
                }}
                className="flex-1 text-sm font-sans tracking-widest uppercase"
                data-testid="button-checkout"
              >
                Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
