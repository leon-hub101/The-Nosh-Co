import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Share2, Send, LogOut, Package, Grid3x3, Save, AlertTriangle, Store } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { useSpecials } from "@/contexts/SpecialsContext";
import { useProducts } from "@/hooks/useProducts";
import { usePush } from "@/hooks/usePush";
import { useShopStatus } from "@/hooks/useShopStatus";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { logout } = useAdmin();
  const { isSpecial, toggleSpecial, isTogglingSpecial } = useSpecials();
  const { products, isLoading } = useProducts();
  const { hasPermission, requestPermission, sendTestPush } = usePush();
  const { data: shopStatus, isLoading: isLoadingShopStatus } = useShopStatus();
  const { toast } = useToast();

  // Local state for stock management (productId -> {stock500g, stock1kg})
  const [stockValues, setStockValues] = useState<Record<number, { stock500g: string; stock1kg: string }>>({});

  // Local state for shop status management
  const [shopControlState, setShopControlState] = useState({
    isOpen: shopStatus?.isOpen ?? true,
    closedMessage: shopStatus?.closedMessage ?? "",
    reopenDate: shopStatus?.reopenDate ? new Date(shopStatus.reopenDate).toISOString().slice(0, 16) : "",
  });

  // Sync shop control state when shop status loads
  useEffect(() => {
    if (shopStatus) {
      setShopControlState({
        isOpen: shopStatus.isOpen,
        closedMessage: shopStatus.closedMessage || "",
        reopenDate: shopStatus.reopenDate ? new Date(shopStatus.reopenDate).toISOString().slice(0, 16) : "",
      });
    }
  }, [shopStatus]);

  // Mutation for updating stock
  const updateStockMutation = useMutation({
    mutationFn: async ({ productId, stock500g, stock1kg }: { productId: number; stock500g: number; stock1kg: number }) => {
      return await apiRequest(
        'PATCH',
        `/api/products/${productId}/stock`,
        { stock500g, stock1kg }
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      
      // Reset stockValues for this product to sanitized values
      setStockValues(prev => ({
        ...prev,
        [variables.productId]: {
          stock500g: String(variables.stock500g),
          stock1kg: String(variables.stock1kg),
        },
      }));
      
      toast({
        title: "Stock Updated",
        description: "Product stock levels have been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update stock levels.",
        variant: "destructive",
      });
    },
  });

  // Mutation for updating shop status
  const updateShopStatusMutation = useMutation({
    mutationFn: async (data: { isOpen: boolean; closedMessage?: string | null; reopenDate?: string | null }) => {
      return await apiRequest('PATCH', '/api/shop/toggle', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shop/status'] });
      toast({
        title: "Shop Status Updated",
        description: shopControlState.isOpen ? "Shop is now open for business!" : "Shop is now closed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update shop status.",
        variant: "destructive",
      });
    },
  });

  const handleStockChange = (productId: number, field: 'stock500g' | 'stock1kg', value: string) => {
    setStockValues(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [field]: value,
      },
    }));
  };

  const handleSaveStock = (productId: number) => {
    const values = stockValues[productId];
    if (!values) return;

    // Parse and validate
    const stock500g = parseInt(values.stock500g);
    const stock1kg = parseInt(values.stock1kg);

    // Validate numeric inputs
    if (isNaN(stock500g) || isNaN(stock1kg)) {
      toast({
        title: "Invalid Input",
        description: "Stock values must be numbers.",
        variant: "destructive",
      });
      return;
    }

    // Validate non-negative
    if (stock500g < 0 || stock1kg < 0) {
      toast({
        title: "Invalid Input",
        description: "Stock values cannot be negative.",
        variant: "destructive",
      });
      return;
    }

    updateStockMutation.mutate({ productId, stock500g, stock1kg });
  };

  const handleSaveShopStatus = () => {
    const payload: { isOpen: boolean; closedMessage?: string | null; reopenDate?: string | null } = {
      isOpen: shopControlState.isOpen,
      closedMessage: shopControlState.closedMessage || null,
      reopenDate: shopControlState.reopenDate || null,
    };

    updateShopStatusMutation.mutate(payload);
  };

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

        {/* Shop Control Section */}
        <div className="bg-white border border-card-border p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Store className="w-6 h-6 text-[#8B9F8D]" />
            <h2 className="text-2xl font-serif font-light tracking-wide text-foreground">
              Shop Control
            </h2>
          </div>

          {isLoadingShopStatus ? (
            <div className="space-y-4">
              <div className="h-12 bg-stone-200 animate-pulse rounded" />
              <div className="h-24 bg-stone-200 animate-pulse rounded" />
              <div className="h-12 bg-stone-200 animate-pulse rounded" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Shop Open/Closed Toggle */}
              <div className="flex items-center justify-between p-6 border border-card-border bg-stone-50">
                <div className="flex items-center gap-4">
                  <Label htmlFor="shop-status-toggle" className="text-lg font-sans font-semibold text-foreground cursor-pointer">
                    Shop Status
                  </Label>
                  <Badge 
                    variant={shopControlState.isOpen ? "default" : "secondary"}
                    className={shopControlState.isOpen ? "bg-green-500" : "bg-orange-500"}
                    data-testid="badge-shop-status"
                  >
                    {shopControlState.isOpen ? "OPEN" : "CLOSED"}
                  </Badge>
                </div>
                <Switch
                  id="shop-status-toggle"
                  checked={shopControlState.isOpen}
                  onCheckedChange={(checked) => setShopControlState(prev => ({ ...prev, isOpen: checked }))}
                  data-testid="toggle-shop-status"
                  className="data-[state=checked]:bg-green-500"
                />
              </div>

              {/* Closed Message Input */}
              <div className="space-y-2">
                <Label htmlFor="closed-message" className="text-sm font-sans text-gray-700">
                  Closed Message {!shopControlState.isOpen && <span className="text-red-500">*</span>}
                </Label>
                <Textarea
                  id="closed-message"
                  placeholder="e.g., We're temporarily closed for inventory. We'll be back soon!"
                  value={shopControlState.closedMessage}
                  onChange={(e) => setShopControlState(prev => ({ ...prev, closedMessage: e.target.value }))}
                  disabled={shopControlState.isOpen}
                  rows={3}
                  data-testid="input-closed-message"
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  This message will be displayed to customers when the shop is closed.
                </p>
              </div>

              {/* Reopen Date Input */}
              <div className="space-y-2">
                <Label htmlFor="reopen-date" className="text-sm font-sans text-gray-700">
                  Auto-Reopen Date & Time (Optional)
                </Label>
                <Input
                  id="reopen-date"
                  type="datetime-local"
                  value={shopControlState.reopenDate}
                  onChange={(e) => setShopControlState(prev => ({ ...prev, reopenDate: e.target.value }))}
                  disabled={shopControlState.isOpen}
                  data-testid="input-reopen-date"
                />
                <p className="text-xs text-gray-500">
                  The shop will automatically reopen at this date and time. Leave blank for manual reopening.
                </p>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleSaveShopStatus}
                disabled={updateShopStatusMutation.isPending}
                className="w-full md:w-auto"
                data-testid="button-save-shop-status"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateShopStatusMutation.isPending ? "Saving..." : "Save Shop Status"}
              </Button>
            </div>
          )}
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
                const currentStock = stockValues[product.id] || {
                  stock500g: String(product.stock),
                  stock1kg: String(product.stock2),
                };
                
                return (
                  <div
                    key={product.id}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 border border-card-border hover:bg-stone-50 transition-colors"
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
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-serif text-foreground" data-testid={`text-product-name-${product.id}`}>
                            {product.name}
                          </h3>
                          {(product.stock < 10 || product.stock2 < 10) && (
                            <Badge variant="outline" className="bg-orange-50 border-orange-300 text-orange-700" data-testid={`badge-low-stock-${product.id}`}>
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Low Stock
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-sans text-gray-500">
                          500g: R{product.price.toFixed(2)} • 1kg: R{product.price2.toFixed(2)}
                        </p>
                        {(product.stock < 10 || product.stock2 < 10) && (
                          <p className="text-xs font-sans text-orange-600 mt-1">
                            {product.stock < 10 && `500g: ${product.stock} left`}
                            {product.stock < 10 && product.stock2 < 10 && ' • '}
                            {product.stock2 < 10 && `1kg: ${product.stock2} left`}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      {/* Stock Inputs */}
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`stock-500g-${product.id}`} className="text-sm font-sans text-gray-700 whitespace-nowrap">
                          500g Stock:
                        </Label>
                        <Input
                          id={`stock-500g-${product.id}`}
                          type="number"
                          min="0"
                          value={currentStock.stock500g}
                          onChange={(e) => handleStockChange(product.id, 'stock500g', e.target.value)}
                          className="w-20"
                          data-testid={`input-stock-500g-${product.id}`}
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <Label htmlFor={`stock-1kg-${product.id}`} className="text-sm font-sans text-gray-700 whitespace-nowrap">
                          1kg Stock:
                        </Label>
                        <Input
                          id={`stock-1kg-${product.id}`}
                          type="number"
                          min="0"
                          value={currentStock.stock1kg}
                          onChange={(e) => handleStockChange(product.id, 'stock1kg', e.target.value)}
                          className="w-20"
                          data-testid={`input-stock-1kg-${product.id}`}
                        />
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleSaveStock(product.id)}
                        disabled={updateStockMutation.isPending}
                        data-testid={`button-save-stock-${product.id}`}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Stock
                      </Button>

                      {/* Special Toggle */}
                      <div className="flex items-center gap-3 ml-auto lg:ml-0">
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
