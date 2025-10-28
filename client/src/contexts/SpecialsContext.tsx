import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SpecialsContextType {
  specials: Set<number>;
  toggleSpecial: (productId: number) => void;
  isSpecial: (productId: number) => boolean;
}

const SpecialsContext = createContext<SpecialsContextType | undefined>(undefined);

const STORAGE_KEY = 'specials';

export function SpecialsProvider({ children }: { children: ReactNode }) {
  const [specials, setSpecials] = useState<Set<number>>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return new Set(parsed);
      } catch {
        return new Set();
      }
    }
    return new Set();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(specials)));
  }, [specials]);

  const toggleSpecial = (productId: number) => {
    setSpecials(current => {
      const newSet = new Set(current);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const isSpecial = (productId: number) => {
    return specials.has(productId);
  };

  return (
    <SpecialsContext.Provider value={{ specials, toggleSpecial, isSpecial }}>
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
