import { createContext, useContext, useState, ReactNode } from 'react';

export interface BasketItem {
  productId: number;
  productName: string;
  size: '500g' | '1kg';
  price: string;
  quantity: number;
}

interface BasketContextType {
  items: BasketItem[];
  addItem: (productId: number, productName: string, size: '500g' | '1kg', price: string) => void;
  removeItem: (productId: number, size: '500g' | '1kg') => void;
  updateQuantity: (productId: number, size: '500g' | '1kg', quantity: number) => void;
  clearBasket: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export function BasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);

  const addItem = (productId: number, productName: string, size: '500g' | '1kg', price: string) => {
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(
        item => item.productId === productId && item.size === size
      );

      if (existingItemIndex > -1) {
        const newItems = [...currentItems];
        newItems[existingItemIndex].quantity += 1;
        return newItems;
      }

      return [...currentItems, {
        productId,
        productName,
        size,
        price,
        quantity: 1,
      }];
    });
  };

  const removeItem = (productId: number, size: '500g' | '1kg') => {
    setItems(currentItems => 
      currentItems.filter(item => !(item.productId === productId && item.size === size))
    );
  };

  const updateQuantity = (productId: number, size: '500g' | '1kg', quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size);
      return;
    }

    setItems(currentItems => {
      const itemIndex = currentItems.findIndex(
        item => item.productId === productId && item.size === size
      );

      if (itemIndex > -1) {
        const newItems = [...currentItems];
        newItems[itemIndex].quantity = quantity;
        return newItems;
      }

      return currentItems;
    });
  };

  const clearBasket = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0);
  };

  return (
    <BasketContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearBasket,
      getTotalItems,
      getTotalPrice,
    }}>
      {children}
    </BasketContext.Provider>
  );
}

export function useBasket() {
  const context = useContext(BasketContext);
  if (context === undefined) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
}
