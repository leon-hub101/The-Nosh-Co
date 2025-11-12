import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

// Backend API response type (camelCase from Drizzle ORM)
interface ProductFromAPI {
  id: number;
  name: string;
  price500g: string;
  price1kg: string;
  imageUrl: string | null;
  isSpecial: boolean;
}

// Frontend product type (camelCase for UI compatibility)
export interface Product {
  id: number;
  name: string;
  size: string;
  price: number;
  size2: string;
  price2: number;
  category: string;
  imageUrl: string | null;
  isSpecial: boolean;
}

// Category information
export interface CategoryInfo {
  name: string;
  slug: string;
  description: string;
}

const categories: CategoryInfo[] = [
  {
    name: "Nuts",
    slug: "nuts",
    description: "Premium quality nuts, salted and plain varieties"
  },
  {
    name: "Dried Fruit",
    slug: "dried-fruit",
    description: "Naturally sweet dried fruits and healthy snacks"
  },
  {
    name: "Sweets & Gummies",
    slug: "sweets-gummies",
    description: "Delicious treats and confectionery delights"
  },
  {
    name: "Seeds & Baking",
    slug: "seeds-baking",
    description: "Wholesome seeds, flours, and baking essentials"
  }
];

// Product ID ranges for category mapping
const categoryRanges = {
  "Nuts": { start: 1, end: 16 },
  "Dried Fruit": { start: 17, end: 32 },
  "Sweets & Gummies": { start: 33, end: 45 },
  "Seeds & Baking": { start: 46, end: 58 }
};

function getCategoryForProduct(productId: number): string {
  for (const [category, range] of Object.entries(categoryRanges)) {
    if (productId >= range.start && productId <= range.end) {
      return category;
    }
  }
  return "Other";
}

function transformProduct(apiProduct: ProductFromAPI): Product {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    size: "500g",
    price: parseFloat(apiProduct.price500g),
    size2: "1kg",
    price2: parseFloat(apiProduct.price1kg),
    category: getCategoryForProduct(apiProduct.id),
    imageUrl: apiProduct.imageUrl,
    isSpecial: apiProduct.isSpecial,
  };
}

export function useProducts() {
  const { data: apiProducts, isLoading, error } = useQuery<ProductFromAPI[]>({
    queryKey: ['/api/products'],
  });

  const products = useMemo(() => {
    if (!apiProducts) return [];
    return apiProducts.map(transformProduct);
  }, [apiProducts]);

  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    products.forEach(product => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category].push(product);
    });
    return grouped;
  }, [products]);

  return {
    products,
    productsByCategory,
    categories,
    isLoading,
    error,
  };
}
