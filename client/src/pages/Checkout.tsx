import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, MapPin, CreditCard } from "lucide-react";
import { useBasket } from "@/contexts/BasketContext";
import { useOrder, type PudoLocation } from "@/contexts/OrderContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock Pudo locations for South Africa
const PUDO_LOCATIONS: PudoLocation[] = [
  { id: "pudo-1", name: "Pudo Locker - Sandton City", address: "83 Rivonia Rd, Sandhurst, Johannesburg" },
  { id: "pudo-2", name: "Pudo Locker - V&A Waterfront", address: "Dock Rd, Victoria & Alfred Waterfront, Cape Town" },
  { id: "pudo-3", name: "Pudo Locker - Gateway Mall", address: "1 Palm Blvd, Umhlanga, Durban" },
  { id: "pudo-4", name: "Pudo Locker - Menlyn Park", address: "Atterbury Rd, Menlyn, Pretoria" },
  { id: "pudo-5", name: "Pudo Locker - Canal Walk", address: "Century Blvd, Century City, Cape Town" },
];

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, getTotalPrice, clearBasket } = useBasket();
  const { createOrder } = useOrder();
  const { toast } = useToast();
  const [selectedPudo, setSelectedPudo] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [applePayAvailable, setApplePayAvailable] = useState(false);

  const totalPrice = getTotalPrice();

  // Check Apple Pay availability
  useEffect(() => {
    // @ts-ignore - ApplePaySession is only available on Apple devices
    if (window.ApplePaySession && window.ApplePaySession.canMakePayments()) {
      setApplePayAvailable(true);
    }
  }, []);

  // Apple Pay checkout handler
  const handleApplePay = async () => {
    if (!selectedPudo) {
      toast({
        title: "Select Pickup Location",
        description: "Please choose a Pudo locker for delivery.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment request
      const paymentMethods = [{
        supportedMethods: 'https://apple.com/apple-pay',
        data: {
          version: 3,
          merchantIdentifier: 'merchant.com.thenoshco',
          merchantCapabilities: ['supports3DS', 'supportsCredit', 'supportsDebit'],
          supportedNetworks: ['visa', 'masterCard', 'amex'],
          countryCode: 'ZA'
        }
      }];

      const paymentDetails = {
        total: {
          label: 'The Nosh Co.',
          amount: {
            currency: 'ZAR',
            value: totalPrice.toFixed(2)
          }
        },
        displayItems: items.map(item => ({
          label: `${item.productName} ${item.size} (x${item.quantity})`,
          amount: {
            currency: 'ZAR',
            value: (parseFloat(item.price) * item.quantity).toFixed(2)
          }
        }))
      };

      const paymentOptions = {
        requestPayerName: true,
        requestPayerEmail: true,
      };

      const request = new PaymentRequest(paymentMethods, paymentDetails);

      // Show Apple Pay sheet
      const response = await request.show();

      // Process payment (mock for sandbox)
      const pudoLocation = PUDO_LOCATIONS.find(p => p.id === selectedPudo) || null;
      const orderId = createOrder(items, totalPrice, pudoLocation);

      // Complete payment
      await response.complete('success');

      toast({
        title: "Payment Successful",
        description: "Your order has been confirmed!",
      });

      // Redirect to success page
      setLocation(`/checkout/success?order=${orderId}`);
    } catch (error) {
      console.error('Apple Pay error:', error);
      setIsProcessing(false);
      toast({
        title: "Payment Cancelled",
        description: "Your payment was not processed.",
        variant: "destructive",
      });
    }
  };

  // PayFast checkout handler
  const handleCheckout = async () => {
    if (!selectedPudo) {
      toast({
        title: "Select Pickup Location",
        description: "Please choose a Pudo locker for delivery.",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Empty Basket",
        description: "Add items to your basket before checking out.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    const pudoLocation = PUDO_LOCATIONS.find(p => p.id === selectedPudo) || null;
    const orderId = createOrder(items, totalPrice, pudoLocation);

    // TODO (PRODUCTION): Move PayFast integration to secure backend
    // This MVP uses client-side form submission to sandbox.
    // Production must:
    // 1. Move merchant credentials to server environment variables
    // 2. Generate payment signature on backend
    // 3. Create payment via server API endpoint
    // 4. Implement ITN (Instant Transaction Notification) handler
    // 5. Verify payment signatures server-side
    
    // PayFast sandbox integration (MVP ONLY)
    const paymentForm = document.createElement('form');
    paymentForm.method = 'POST';
    paymentForm.action = 'https://sandbox.payfast.co.za/eng/process';
    paymentForm.target = '_self';

    // PayFast required fields (SANDBOX CREDENTIALS - NOT FOR PRODUCTION)
    const fields = {
      merchant_id: '10000100', // PayFast sandbox merchant ID
      merchant_key: '46f0cd694581a', // PayFast sandbox merchant key
      amount: totalPrice.toFixed(2),
      item_name: `The Nosh Co. Order ${orderId}`,
      item_description: items.map(i => `${i.productName} ${i.size} (x${i.quantity})`).join(', '),
      return_url: `${window.location.origin}/checkout/success?order=${orderId}`,
      cancel_url: `${window.location.origin}/checkout`,
      notify_url: `${window.location.origin}/api/payfast/notify`, // TODO: Implement server endpoint
    };

    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      paymentForm.appendChild(input);
    });

    document.body.appendChild(paymentForm);
    paymentForm.submit();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-serif font-light tracking-wide text-foreground mb-4">
          Your basket is empty
        </h1>
        <Button onClick={() => setLocation('/')} data-testid="button-continue-shopping">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-card-border">
        <div className="flex items-center justify-between h-20 md:h-24 px-6 md:px-12 max-w-5xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/')}
              data-testid="button-back-home"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl md:text-2xl font-serif font-light tracking-widest uppercase text-foreground">
              Checkout
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Order Summary */}
          <div>
            <h2 className="text-xl font-serif font-light tracking-wide text-foreground mb-6">
              Order Summary
            </h2>
            <div className="bg-white border border-card-border p-6 space-y-4">
              {items.map((item, index) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex items-center justify-between pb-4 border-b border-card-border last:border-0 last:pb-0"
                  data-testid={`checkout-item-${index}`}
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

              <div className="pt-4 border-t-2 border-foreground">
                <div className="flex items-center justify-between">
                  <p className="text-xl font-serif font-light tracking-wide text-foreground">
                    Total
                  </p>
                  <p className="text-2xl font-serif text-foreground" data-testid="text-total">
                    R{totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Delivery & Payment */}
          <div>
            <h2 className="text-xl font-serif font-light tracking-wide text-foreground mb-6">
              Delivery & Payment
            </h2>

            {/* Pudo Selector */}
            <div className="mb-8">
              <Label htmlFor="pudo-select" className="flex items-center gap-2 mb-3 text-base font-sans tracking-wide uppercase text-foreground">
                <MapPin className="w-5 h-5" />
                Pickup Location
              </Label>
              <Select value={selectedPudo} onValueChange={setSelectedPudo}>
                <SelectTrigger id="pudo-select" data-testid="select-pudo" className="h-auto py-4">
                  <SelectValue placeholder="Select a Pudo locker" />
                </SelectTrigger>
                <SelectContent>
                  {PUDO_LOCATIONS.map((location) => (
                    <SelectItem key={location.id} value={location.id} data-testid={`pudo-option-${location.id}`}>
                      <div className="py-2">
                        <p className="font-serif text-foreground">{location.name}</p>
                        <p className="text-sm text-gray-500">{location.address}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-2">
                Free delivery to any Pudo locker nationwide
              </p>
            </div>

            {/* Payment Options */}
            <div className="bg-stone-50 border border-card-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-foreground" />
                <p className="font-sans tracking-wide uppercase text-foreground">
                  Secure Payment
                </p>
              </div>

              {/* Apple Pay Button (if available) */}
              {applePayAvailable && (
                <div className="mb-6">
                  <button
                    onClick={handleApplePay}
                    disabled={isProcessing}
                    className="apple-pay-button apple-pay-button-black w-full"
                    style={{
                      height: '48px',
                      borderRadius: '4px',
                      cursor: isProcessing ? 'not-allowed' : 'pointer',
                      opacity: isProcessing ? 0.6 : 1
                    }}
                    data-testid="button-apple-pay"
                    aria-label="Pay with Apple Pay"
                  />
                  <div className="flex items-center gap-2 my-4">
                    <div className="flex-1 border-t border-card-border"></div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Or</span>
                    <div className="flex-1 border-t border-card-border"></div>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-600 mb-6">
                You will be redirected to PayFast to complete your payment securely.
              </p>
              <Button
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full h-auto py-4 text-base font-sans tracking-wide uppercase"
                data-testid="button-pay-now"
              >
                {isProcessing ? 'Processing...' : `Pay Now - R${totalPrice.toFixed(2)}`}
              </Button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Powered by PayFast (Sandbox Mode)
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
