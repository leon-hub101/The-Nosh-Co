import { useEffect } from "react";
import { useLocation } from "wouter";
import { CheckCircle, Package, MapPin } from "lucide-react";
import { useOrder } from "@/contexts/OrderContext";
import { useBasket } from "@/contexts/BasketContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccess() {
  const [, setLocation] = useLocation();
  const { currentOrder, completeOrder } = useOrder();
  const { clearBasket } = useBasket();
  const { toast } = useToast();

  useEffect(() => {
    // TODO (PRODUCTION): Replace with server-side verification
    // This MVP implementation trusts client-side URL params.
    // Production must:
    // 1. Implement server-side PayFast ITN handler
    // 2. Verify PayFast signature on backend
    // 3. Update order status in database only after verification
    // 4. Fetch verified order status from API instead of localStorage
    
    // Get order ID from URL params (SANDBOX ONLY)
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order');

    if (orderId && currentOrder && currentOrder.id === orderId) {
      // Mark order as completed (SANDBOX ONLY - no verification)
      completeOrder(orderId);
      // Clear the basket
      clearBasket();
      
      // Show success toast
      toast({
        title: "Order Confirmed",
        description: "Your payment was successful. We'll prepare your order!",
      });
    }
  }, [currentOrder, completeOrder, clearBasket, toast]);

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-serif font-light tracking-wide text-foreground mb-4">
          No order found
        </h1>
        <Button onClick={() => setLocation('/')} data-testid="button-home">
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-green-50 border-2 border-green-500 flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-light tracking-wide text-foreground mb-4">
            Thank You for Your Order
          </h1>
          <p className="text-lg text-gray-600">
            Order <span className="font-mono text-foreground" data-testid="text-order-id">{currentOrder.id}</span>
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white border border-card-border p-8 mb-8">
          <h2 className="text-xl font-serif font-light tracking-wide text-foreground mb-6">
            Order Details
          </h2>

          {/* Items */}
          <div className="space-y-4 mb-6">
            {currentOrder.items.map((item, index) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="flex items-center justify-between pb-4 border-b border-card-border last:border-0 last:pb-0"
                data-testid={`success-item-${index}`}
              >
                <div>
                  <p className="font-serif text-foreground">{item.productName}</p>
                  <p className="text-sm text-gray-500">{item.size} × {item.quantity}</p>
                </div>
                <p className="font-serif text-foreground">
                  R{(parseFloat(item.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Delivery Info */}
          {currentOrder.pudoLocation && (
            <div className="bg-stone-50 border border-card-border p-4 mb-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-foreground mt-1" />
                <div>
                  <p className="font-serif text-foreground mb-1">
                    {currentOrder.pudoLocation.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {currentOrder.pudoLocation.address}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="pt-4 border-t-2 border-foreground">
            <div className="flex items-center justify-between">
              <p className="text-xl font-serif font-light tracking-wide text-foreground">
                Total Paid
              </p>
              <p className="text-2xl font-serif text-foreground" data-testid="text-total-paid">
                R{currentOrder.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-stone-50 border border-card-border p-6 mb-8">
          <div className="flex items-start gap-3">
            <Package className="w-6 h-6 text-foreground mt-1" />
            <div>
              <h3 className="font-serif text-lg text-foreground mb-2">What's Next?</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• You'll receive a confirmation email shortly</li>
                <li>• We'll prepare your order within 24 hours</li>
                <li>• Track your delivery to the Pudo locker</li>
                <li>• Collect using your unique PIN code</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => setLocation('/')}
            data-testid="button-continue-shopping"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
