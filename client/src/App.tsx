import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BasketProvider } from "@/contexts/BasketContext";
import { AdminProvider, useAdmin } from "@/contexts/AdminContext";
import { SpecialsProvider } from "@/contexts/SpecialsContext";
import { OrderProvider } from "@/contexts/OrderContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ShopClosedOverlay } from "@/components/ShopClosedOverlay";
import { useShopStatus } from "@/hooks/useShopStatus";
import Home from "@/pages/Home";
import CategoryPage from "@/pages/CategoryPage";
import AdminDashboard from "@/pages/AdminDashboard";
import Checkout from "@/pages/Checkout";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import OrderHistory from "@/pages/OrderHistory";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/checkout/success" component={CheckoutSuccess} />
      <Route path="/admin">
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/orders">
        <ProtectedRoute>
          <OrderHistory />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { data: shopStatus, isLoading: shopStatusLoading } = useShopStatus();
  const { isAdminLoggedIn, isLoading: adminLoading } = useAdmin();

  // Show overlay if shop is closed AND user is not an admin (but not while loading)
  const shouldShowOverlay = 
    !shopStatusLoading && 
    !adminLoading && 
    shopStatus && 
    !shopStatus.isOpen && 
    !isAdminLoggedIn;

  if (shouldShowOverlay) {
    return (
      <ShopClosedOverlay 
        closedMessage={shopStatus.closedMessage}
        reopenDate={shopStatus.reopenDate}
      />
    );
  }

  return (
    <>
      <Toaster />
      <Router />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AdminProvider>
          <SpecialsProvider>
            <BasketProvider>
              <OrderProvider>
                <AppContent />
              </OrderProvider>
            </BasketProvider>
          </SpecialsProvider>
        </AdminProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
