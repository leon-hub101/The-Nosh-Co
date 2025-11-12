import { createContext, useContext, ReactNode } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useProducts } from '@/hooks/useProducts';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface SpecialsContextType {
  isSpecial: (productId: number) => boolean;
  toggleSpecial: (productId: number, currentValue: boolean) => Promise<void>;
  isTogglingSpecial: boolean;
}

const SpecialsContext = createContext<SpecialsContextType | undefined>(undefined);

export function SpecialsProvider({ children }: { children: ReactNode }) {
  const { products } = useProducts();
  const { toast } = useToast();

  const toggleSpecialMutation = useMutation({
    mutationFn: async ({ productId, currentValue }: { productId: number; currentValue: boolean }) => {
      await apiRequest(
        'PATCH',
        `/api/products/${productId}/special`,
        { isSpecial: !currentValue }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating special status",
        description: error.message || "Failed to update product special status",
        variant: "destructive",
      });
    },
  });

  const isSpecial = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product?.isSpecial ?? false;
  };

  const toggleSpecial = async (productId: number, currentValue: boolean) => {
    await toggleSpecialMutation.mutateAsync({ productId, currentValue });
  };

  return (
    <SpecialsContext.Provider value={{ 
      isSpecial, 
      toggleSpecial, 
      isTogglingSpecial: toggleSpecialMutation.isPending 
    }}>
      {children}
    </SpecialsContext.Provider>
  );
}

export function useSpecials() {
  const context = useContext(SpecialsContext);
  if (context === undefined) {
    throw new Error('useSpecials must be used within a SpecialsProvider');
  }
  return context;
}
