export interface ProductData {
  id: number;
  name: string;
  size: string;
  price: number;
  size2: string;
  price2: number;
  category: string;
}

export const products: ProductData[] = [
  // === NUTS ===
  { id: 1, name: "Almonds Plain", size: "500g", price: 125, size2: "1kg", price2: 229, category: "Nuts" },
  { id: 2, name: "Almonds Salted", size: "500g", price: 129, size2: "1kg", price2: 235, category: "Nuts" },
  { id: 3, name: "Brazil Nuts", size: "500g", price: 219, size2: "1kg", price2: 389, category: "Nuts" },
  { id: 4, name: "Cashews Plain", size: "500g", price: 149, size2: "1kg", price2: 259, category: "Nuts" },
  { id: 5, name: "Cashews Salted", size: "500g", price: 149, size2: "1kg", price2: 259, category: "Nuts" },
  { id: 6, name: "Cashews Peri Peri", size: "500g", price: 149, size2: "1kg", price2: 259, category: "Nuts" },
  { id: 7, name: "Macadamias Plain", size: "500g", price: 125, size2: "1kg", price2: 239, category: "Nuts" },
  { id: 8, name: "Macadamias Salted", size: "500g", price: 125, size2: "1kg", price2: 239, category: "Nuts" },
  { id: 9, name: "Mixed Nuts Plain", size: "500g", price: 125, size2: "1kg", price2: 239, category: "Nuts" },
  { id: 10, name: "Mixed Nuts Salted", size: "500g", price: 125, size2: "1kg", price2: 239, category: "Nuts" },
  { id: 11, name: "Peanuts & Raisins Salted", size: "500g", price: 55, size2: "1kg", price2: 85, category: "Nuts" },
  { id: 12, name: "Peanuts Salted", size: "500g", price: 55, size2: "1kg", price2: 85, category: "Nuts" },
  { id: 13, name: "Pecan Nuts Whole", size: "500g", price: 159, size2: "1kg", price2: 285, category: "Nuts" },
  { id: 14, name: "Pecan Nuts Pieces", size: "500g", price: 145, size2: "1kg", price2: 249, category: "Nuts" },
  { id: 15, name: "Pistachios Salted", size: "500g", price: 209, size2: "1kg", price2: 369, category: "Nuts" },
  { id: 16, name: "Walnut Halves", size: "500g", price: 145, size2: "1kg", price2: 259, category: "Nuts" },

  // === DRIED FRUIT ===
  { id: 17, name: "Apple Rings", size: "500g", price: 135, size2: "1kg", price2: 225, category: "Dried Fruit" },
  { id: 18, name: "Apricots Turkish", size: "500g", price: 135, size2: "1kg", price2: 225, category: "Dried Fruit" },
  { id: 19, name: "Banana Chips", size: "500g", price: 79, size2: "1kg", price2: 135, category: "Dried Fruit" },
  { id: 20, name: "Cape Peaches", size: "500g", price: 129, size2: "1kg", price2: 219, category: "Dried Fruit" },
  { id: 21, name: "Cherries Red Broken", size: "500g", price: 115, size2: "1kg", price2: 199, category: "Dried Fruit" },
  { id: 22, name: "Cranberries", size: "500g", price: 109, size2: "1kg", price2: 189, category: "Dried Fruit" },
  { id: 23, name: "Dates", size: "500g", price: 45, size2: "1kg", price2: 69, category: "Dried Fruit" },
  { id: 24, name: "Cape Figs", size: "500g", price: 185, size2: "1kg", price2: 319, category: "Dried Fruit" },
  { id: 25, name: "Mango Strips", size: "500g", price: 179, size2: "1kg", price2: 309, category: "Dried Fruit" },
  { id: 26, name: "Mebos Flakes/Lollies", size: "500g", price: 79, size2: "1kg", price2: 139, category: "Dried Fruit" },
  { id: 27, name: "Mixed Dried Fruit", size: "500g", price: 79, size2: "1kg", price2: 139, category: "Dried Fruit" },
  { id: 28, name: "Pears", size: "500g", price: 89, size2: "1kg", price2: 155, category: "Dried Fruit" },
  { id: 29, name: "Prunes Pitted", size: "500g", price: 105, size2: "1kg", price2: 179, category: "Dried Fruit" },
  { id: 30, name: "Prunes With Pip", size: "500g", price: 69, size2: "1kg", price2: 119, category: "Dried Fruit" },
  { id: 31, name: "Raisins", size: "500g", price: 45, size2: "1kg", price2: 69, category: "Dried Fruit" },
  { id: 32, name: "Trail Mix", size: "500g", price: 79, size2: "1kg", price2: 135, category: "Dried Fruit" },

  // === SWEETS & GUMMIES ===
  { id: 33, name: "Butter Caramel Popcorn", size: "500g", price: 49, size2: "1kg", price2: 89, category: "Sweets & Gummies" },
  { id: 34, name: "Caramel Almonds", size: "500g", price: 149, size2: "1kg", price2: 259, category: "Sweets & Gummies" },
  { id: 35, name: "Caramel Cashews", size: "500g", price: 149, size2: "1kg", price2: 259, category: "Sweets & Gummies" },
  { id: 36, name: "Caramel Peanuts", size: "500g", price: 59, size2: "1kg", price2: 95, category: "Sweets & Gummies" },
  { id: 37, name: "Fruit Salad Gummies", size: "500g", price: 65, size2: "1kg", price2: 105, category: "Sweets & Gummies" },
  { id: 38, name: "Ginger Chunks/Slices", size: "500g", price: 105, size2: "1kg", price2: 179, category: "Sweets & Gummies" },
  { id: 39, name: "Jelly Babies", size: "500g", price: 65, size2: "1kg", price2: 105, category: "Sweets & Gummies" },
  { id: 40, name: "Jelly Beans", size: "500g", price: 89, size2: "1kg", price2: 159, category: "Sweets & Gummies" },
  { id: 41, name: "Mixed Gummies", size: "500g", price: 65, size2: "1kg", price2: 105, category: "Sweets & Gummies" },
  { id: 42, name: "Mixed Sugar & Sour Gummies", size: "500g", price: 65, size2: "1kg", price2: 105, category: "Sweets & Gummies" },
  { id: 43, name: "Pink & White Peanuts", size: "500g", price: 65, size2: "1kg", price2: 105, category: "Sweets & Gummies" },
  { id: 44, name: "Sour Worms", size: "500g", price: 65, size2: "1kg", price2: 105, category: "Sweets & Gummies" },
  { id: 45, name: "Wine Gums", size: "500g", price: 65, size2: "1kg", price2: 105, category: "Sweets & Gummies" },

  // === SEEDS & BAKING ===
  { id: 46, name: "Almond Flour", size: "500g", price: 145, size2: "1kg", price2: 249, category: "Seeds & Baking" },
  { id: 47, name: "Chia Seeds", size: "500g", price: 99, size2: "1kg", price2: 179, category: "Seeds & Baking" },
  { id: 48, name: "Cherries Broken (Red/Green)", size: "500g", price: 115, size2: "1kg", price2: 205, category: "Seeds & Baking" },
  { id: 49, name: "Cocoa Powder", size: "500g", price: 99, size2: "1kg", price2: 169, category: "Seeds & Baking" },
  { id: 50, name: "Coconut Flakes", size: "500g", price: 85, size2: "1kg", price2: 189, category: "Seeds & Baking" },
  { id: 51, name: "Fruit Cake Mix", size: "500g", price: 65, size2: "1kg", price2: 95, category: "Seeds & Baking" },
  { id: 52, name: "Linseeds (Flaxseeds)", size: "500g", price: 55, size2: "1kg", price2: 79, category: "Seeds & Baking" },
  { id: 53, name: "Mixed Seeds", size: "500g", price: 65, size2: "1kg", price2: 119, category: "Seeds & Baking" },
  { id: 54, name: "Oats", size: "500g", price: 39, size2: "1kg", price2: 59, category: "Seeds & Baking" },
  { id: 55, name: "Pumpkin Seeds (Pepitas)", size: "500g", price: 105, size2: "1kg", price2: 185, category: "Seeds & Baking" },
  { id: 56, name: "Quinoa", size: "500g", price: 69, size2: "1kg", price2: 125, category: "Seeds & Baking" },
  { id: 57, name: "Sesame Seeds Black/White", size: "500g", price: 75, size2: "1kg", price2: 129, category: "Seeds & Baking" },
  { id: 58, name: "Sunflower Seeds", size: "500g", price: 45, size2: "1kg", price2: 75, category: "Seeds & Baking" }
];

export interface CategoryInfo {
  name: string;
  slug: string;
  description: string;
}

export const categories: CategoryInfo[] = [
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

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return categories.find(cat => cat.slug === slug);
}

export function getProductsByCategory(categoryName: string): ProductData[] {
  return products.filter(product => product.category === categoryName);
}
