import { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface PudoLocation {
  id: string;
  name: string;
  address: string;
}

interface Order {
  id: string;
  items: Array<{
    productId: number;
    productName: string;
    size: '500g' | '1kg';
    price: string;
    quantity: number;
  }>;
  total: number;
  pudoLocation: PudoLocation | null;
  status: 'pending' | 'paid' | 'failed';
  createdAt: string;
}

interface OrderContextType {
  currentOrder: Order | null;
  createOrder: (items: any[], total: number, pudoLocation: PudoLocation | null) => string;
  completeOrder: (orderId: string) => void;
  failOrder: (orderId: string) => void;
  clearOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [currentOrder, setCurrentOrder] = useLocalStorage<Order | null>('currentOrder', null);

  const createOrder = (items: any[], total: number, pudoLocation: PudoLocation | null): string => {
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const order: Order = {
      id: orderId,
      items,
      total,
      pudoLocation,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setCurrentOrder(order);
    return orderId;
  };

  const completeOrder = (orderId: string) => {
    if (currentOrder && currentOrder.id === orderId) {
      setCurrentOrder({
        ...currentOrder,
        status: 'paid',
      });
    }
  };

  const failOrder = (orderId: string) => {
    if (currentOrder && currentOrder.id === orderId) {
      setCurrentOrder({
        ...currentOrder,
        status: 'failed',
      });
    }
  };

  const clearOrder = () => {
    setCurrentOrder(null);
  };

  return (
    <OrderContext.Provider value={{
      currentOrder,
      createOrder,
      completeOrder,
      failOrder,
      clearOrder,
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}

export type { PudoLocation, Order };
