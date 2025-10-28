import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Package, MapPin, CheckCircle2, XCircle } from "lucide-react";
import { useOrder, type Order } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";

export default function OrderHistory() {
  const [, setLocation] = useLocation();
  const { getAllOrders } = useOrder();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Load all orders from localStorage
    const allOrders = getAllOrders();
    // Sort by date (newest first)
    const sortedOrders = [...allOrders].sort((a: Order, b: Order) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setOrders(sortedOrders);
  }, [getAllOrders]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatPrice = (price: number) => {
    return `R ${price.toFixed(2)}`;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'paid') {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
    if (status === 'failed') {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
    return <Package className="w-5 h-5 text-gray-400" />;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'failed':
        return 'Failed';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-card-border">
        <div className="flex items-center justify-between h-20 md:h-24 px-6 md:px-12 max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/admin')}
              data-testid="button-back-admin"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl md:text-2xl font-serif font-light tracking-widest uppercase text-foreground">
              Order History
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Package className="w-24 h-24 text-gray-300 mb-6" />
            <p className="text-xl font-serif font-light text-gray-500 mb-4" data-testid="text-no-orders">
              No orders yet
            </p>
            <p className="text-sm text-gray-400 mb-8">
              Orders will appear here once customers make purchases.
            </p>
            <Button onClick={() => setLocation('/admin')} data-testid="button-back-to-admin">
              Back to Dashboard
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-card-border p-6 hover:bg-stone-50 transition-colors"
                data-testid={`order-${order.id}`}
              >
                {/* Order Header */}
                <div className="flex items-start justify-between mb-6 pb-4 border-b border-card-border">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(order.status)}
                      <h3 className="text-lg font-serif text-foreground" data-testid={`order-id-${order.id}`}>
                        Order #{order.id.slice(0, 8)}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500" data-testid={`order-date-${order.id}`}>
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-sm font-sans tracking-wide uppercase">
                      {getStatusText(order.status)}
                    </div>
                    <p className="text-xl font-serif text-foreground mt-2" data-testid={`order-total-${order.id}`}>
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="text-sm font-sans tracking-wide uppercase text-gray-700 mb-3">
                    Items
                  </h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={`${order.id}-${index}`}
                        className="flex items-center justify-between text-sm"
                        data-testid={`order-item-${order.id}-${index}`}
                      >
                        <span className="text-foreground">
                          {item.productName} ({item.size}) × {item.quantity}
                        </span>
                        <span className="text-gray-600">
                          {formatPrice(parseFloat(item.price) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Location */}
                {order.pudoLocation && (
                  <div className="pt-4 border-t border-card-border">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-sans tracking-wide uppercase text-gray-700 mb-1">
                          Pickup Location
                        </p>
                        <p className="text-sm text-foreground" data-testid={`order-pudo-${order.id}`}>
                          {order.pudoLocation.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.pudoLocation.address}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
