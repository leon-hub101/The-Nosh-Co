import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Share2, Send, LogOut } from "lucide-react";
import { type Product } from "@shared/schema";
import { useAdmin } from "@/contexts/AdminContext";
import { useSpecials } from "@/contexts/SpecialsContext";
import { usePush } from "@/hooks/usePush";
import { useToast } from "@/hooks/use-toast";
import cashewsImg from "@assets/generated_images/Premium_cashew_nuts_product_photo_c8b18a7a.png";
import strawberriesImg from "@assets/generated_images/Fresh_organic_strawberries_product_photo_dd4d1d44.png";
import almondsImg from "@assets/generated_images/Roasted_almonds_product_photo_28680ce6.png";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { logout } = useAdmin();
  const { isSpecial, toggleSpecial } = useSpecials();
  const { hasPermission, requestPermission, sendTestPush } = usePush();
  const { toast } = useToast();

  // TODO: Replace with API call
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Premium Cashews",
      price500g: "110.00",
      price1kg: "220.00",
      imageUrl: cashewsImg,
      isSpecial: true,
    },
    {
      id: 2,
      name: "Fresh Strawberries",
      price500g: "42.50",
      price1kg: "85.00",
      imageUrl: strawberriesImg,
      isSpecial: false,
    },
    {
      id: 3,
      name: "Roasted Almonds",
      price500g: "90.00",
      price1kg: "180.00",
      imageUrl: almondsImg,
      isSpecial: false,
    },
  ]);

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
      .map(p => `• ${p.name} - R${p.price1kg}/kg`)
      .join('\n');

    const message = `🌿 *Today's Special at The Nosh Co.* 🌿\n\n${productList}\n\nOrder now! Visit our store.`;
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
            <button
              onClick={() => setLocation('/')}
              className="p-2 hover:opacity-70 transition-opacity"
              data-testid="button-back-home"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl md:text-2xl font-serif font-light tracking-widest uppercase text-foreground">
              Admin Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2 border border-card-border hover:bg-stone-50 transition-colors text-sm font-sans tracking-wide uppercase"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        {/* Action Buttons */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-3 bg-[#25D366] text-white px-8 py-6 text-base font-sans tracking-wide uppercase hover:bg-[#20BA5A] transition-colors"
            data-testid="button-whatsapp-share"
          >
            <Share2 className="w-5 h-5" />
            Share Today's Special on WhatsApp
          </button>

          <button
            onClick={handlePushNotification}
            className="flex items-center justify-center gap-3 bg-black text-white px-8 py-6 text-base font-sans tracking-wide uppercase hover:bg-gray-900 transition-colors"
            data-testid="button-send-push"
          >
            <Send className="w-5 h-5" />
            {hasPermission ? 'Send Test Push Notification' : 'Enable Push Notifications'}
          </button>
        </div>

        {/* Products List */}
        <div className="bg-white border border-card-border p-8">
          <h2 className="text-2xl font-serif font-light tracking-wide text-foreground mb-6">
            Manage Specials
          </h2>

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
                    <div className="w-20 h-20 bg-stone-50 flex items-center justify-center">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-sage/30">📦</div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-serif text-foreground mb-1" data-testid={`text-product-name-${product.id}`}>
                        {product.name}
                      </h3>
                      <p className="text-sm font-sans text-gray-500">
                        500g: R{product.price500g} • 1kg: R{product.price1kg}
                      </p>
                    </div>
                  </div>

                  <label 
                    htmlFor={`admin-special-${product.id}`}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <span className="text-sm font-sans tracking-wide uppercase text-gray-700">
                      Special
                    </span>
                    <div className="relative">
                      <input
                        id={`admin-special-${product.id}`}
                        type="checkbox"
                        checked={productIsSpecial}
                        onChange={() => toggleSpecial(product.id)}
                        className="sr-only peer"
                        data-testid={`admin-toggle-special-${product.id}`}
                      />
                      <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 peer-focus:ring-offset-2 peer-checked:bg-orange-500 transition-colors">
                        <div className="dot absolute left-1 top-1 bg-white w-4 h-4 transition-transform peer-checked:translate-x-5"></div>
                      </div>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
