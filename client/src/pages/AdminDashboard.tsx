import { useLocation } from "wouter";
import { ArrowLeft, Share2, Send, LogOut, Package, Grid3x3 } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { useSpecials } from "@/contexts/SpecialsContext";
import { useProducts } from "@/hooks/useProducts";
import { usePush } from "@/hooks/usePush";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { logout } = useAdmin();
  const { isSpecial, toggleSpecial, isTogglingSpecial } = useSpecials();
  const { products, isLoading } = useProducts();
  const { hasPermission, requestPermission, sendTestPush } = usePush();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    setLocation('/');
  };

  const handleWhatsAppShare = () => {
    const specialProducts = products.filter(p => isSpecial(p.id));
    
    if (specialProducts.length === 0) {
      toast({
        title: "No Specials",
        description: "Please mark at least one product as special before sharing.",
        variant: "destructive",
      });
      return;
    }

    const productList = specialProducts
      .map(p => `${p.name} - R${p.price2.toFixed(2)}/kg`)
      .join('\n');

    const replitUrl = window.location.origin;
    const message = `The Nosh Co. Special!\n\n${productList}\n\nLimited time only!\n${replitUrl}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp Opened",
      description: "Share today's specials with your customers!",
    });
  };

  const handlePushNotification = async () => {
    if (!hasPermission) {
      await requestPermission();
      return;
    }
    sendTestPush();
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
              onClick={() => setLocation('/')}
              data-testid="button-back-home"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl md:text-2xl font-serif font-light tracking-widest uppercase text-foreground">
              Admin Dashboard
            </h1>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        {/* Action Buttons */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Button
            onClick={handleWhatsAppShare}
            className="bg-[#25D366] text-white border-[#25D366] h-auto py-6 text-base font-sans tracking-wide uppercase"
            data-testid="button-whatsapp-share"
          >
            <Share2 className="w-5 h-5 mr-3" />
            Share on WhatsApp
          </Button>

          <Button
            onClick={handlePushNotification}
            variant="default"
            className="h-auto py-6 text-base font-sans tracking-wide uppercase"
            data-testid="button-send-push"
          >
            <Send className="w-5 h-5 mr-3" />
            {hasPermission ? 'Send Push Notification' : 'Enable Notifications'}
          </Button>

          <Button
            onClick={() => setLocation('/orders')}
            variant="outline"
            className="h-auto py-6 text-base font-sans tracking-wide uppercase"
            data-testid="button-view-orders"
          >
            <Package className="w-5 h-5 mr-3" />
            View Order History
          </Button>

          <Button
            onClick={() => setLocation('/')}
            variant="outline"
            className="h-auto py-6 text-base font-sans tracking-wide uppercase"
            data-testid="button-view-categories"
          >
            <Grid3x3 className="w-5 h-5 mr-3" />
            View Categories
          </Button>
        </div>

        {/* Products List */}
        <div className="bg-white border border-card-border p-8">
          <h2 className="text-2xl font-serif font-light tracking-wide text-foreground mb-6">
            Manage Specials
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-6 border border-card-border">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-stone-200 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-5 w-32 bg-stone-200 animate-pulse" />
                      <div className="h-4 w-24 bg-stone-200 animate-pulse" />
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-stone-200 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => {
                const productIsSpecial = isSpecial(product.id);
                
                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-6 border border-card-border hover:bg-stone-50 transition-colors"
                    data-testid={`admin-product-${product.id}`}
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-stone-50 flex items-center justify-center overflow-hidden">
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-serif text-foreground mb-1" data-testid={`text-product-name-${product.id}`}>
                          {product.name}
                        </h3>
                        <p className="text-sm font-sans text-gray-500">
                          500g: R{product.price.toFixed(2)} • 1kg: R{product.price2.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Label 
                        htmlFor={`admin-special-${product.id}`}
                        className="text-sm font-sans tracking-wide uppercase text-gray-700 cursor-pointer"
                      >
                        Special
                      </Label>
                      <Switch
                        id={`admin-special-${product.id}`}
                        checked={productIsSpecial}
                        onCheckedChange={() => toggleSpecial(product.id, productIsSpecial)}
                        disabled={isTogglingSpecial}
                        data-testid={`admin-toggle-special-${product.id}`}
                        className="data-[state=checked]:bg-orange-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
