import { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface PudoLocation {
  id: string;
  name: string;
  address: string;
}

export interface Order {
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
  getAllOrders: () => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [currentOrder, setCurrentOrder] = useLocalStorage<Order | null>('currentOrder', null);
  const [orderHistory, setOrderHistory] = useLocalStorage<Order[]>('orderHistory', []);

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
      const updatedOrder = {
        ...currentOrder,
        status: 'paid' as const,
      };
      setCurrentOrder(updatedOrder);
      
      // Add to order history using functional update to ensure we have latest state
      setOrderHistory((prevHistory) => [...prevHistory, updatedOrder]);
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

  const getAllOrders = (): Order[] => {
    return orderHistory;
  };

  return (
    <OrderContext.Provider value={{
      currentOrder,
      createOrder,
      completeOrder,
      failOrder,
      clearOrder,
      getAllOrders,
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
