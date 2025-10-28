import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";
import { products as productsTable } from "@shared/schema";

// Configure neon to use WebSocket
neonConfig.webSocketConstructor = ws;

const products = [
  // === NUTS ===
  { id: 1, name: "Almonds Plain", category: "Nuts", price500g: "125.00", price1kg: "229.00" },
  { id: 2, name: "Almonds Salted", category: "Nuts", price500g: "129.00", price1kg: "235.00" },
  { id: 3, name: "Brazil Nuts", category: "Nuts", price500g: "219.00", price1kg: "389.00" },
  { id: 4, name: "Cashews Plain", category: "Nuts", price500g: "149.00", price1kg: "259.00" },
  { id: 5, name: "Cashews Salted", category: "Nuts", price500g: "149.00", price1kg: "259.00" },
  { id: 6, name: "Cashews Peri Peri", category: "Nuts", price500g: "149.00", price1kg: "259.00" },
  { id: 7, name: "Macadamias Plain", category: "Nuts", price500g: "125.00", price1kg: "239.00" },
  { id: 8, name: "Macadamias Salted", category: "Nuts", price500g: "125.00", price1kg: "239.00" },
  { id: 9, name: "Mixed Nuts Plain", category: "Nuts", price500g: "125.00", price1kg: "239.00" },
  { id: 10, name: "Mixed Nuts Salted", category: "Nuts", price500g: "125.00", price1kg: "239.00" },
  { id: 11, name: "Peanuts & Raisins Salted", category: "Nuts", price500g: "55.00", price1kg: "85.00" },
  { id: 12, name: "Peanuts Salted", category: "Nuts", price500g: "55.00", price1kg: "85.00" },
  { id: 13, name: "Pecan Nuts Whole", category: "Nuts", price500g: "159.00", price1kg: "285.00" },
  { id: 14, name: "Pecan Nuts Pieces", category: "Nuts", price500g: "145.00", price1kg: "249.00" },
  { id: 15, name: "Pistachios Salted", category: "Nuts", price500g: "209.00", price1kg: "369.00" },
  { id: 16, name: "Walnut Halves", category: "Nuts", price500g: "145.00", price1kg: "259.00" },

  // === DRIED FRUIT ===
  { id: 17, name: "Apple Rings", category: "Dried Fruit", price500g: "135.00", price1kg: "225.00" },
  { id: 18, name: "Apricots Turkish", category: "Dried Fruit", price500g: "135.00", price1kg: "225.00" },
  { id: 19, name: "Banana Chips", category: "Dried Fruit", price500g: "79.00", price1kg: "135.00" },
  { id: 20, name: "Cape Peaches", category: "Dried Fruit", price500g: "129.00", price1kg: "219.00" },
  { id: 21, name: "Cherries Red Broken", category: "Dried Fruit", price500g: "115.00", price1kg: "199.00" },
  { id: 22, name: "Cranberries", category: "Dried Fruit", price500g: "109.00", price1kg: "189.00" },
  { id: 23, name: "Dates", category: "Dried Fruit", price500g: "45.00", price1kg: "69.00" },
  { id: 24, name: "Cape Figs", category: "Dried Fruit", price500g: "185.00", price1kg: "319.00" },
  { id: 25, name: "Mango Strips", category: "Dried Fruit", price500g: "179.00", price1kg: "309.00" },
  { id: 26, name: "Mebos Flakes/Lollies", category: "Dried Fruit", price500g: "79.00", price1kg: "139.00" },
  { id: 27, name: "Mixed Dried Fruit", category: "Dried Fruit", price500g: "79.00", price1kg: "139.00" },
  { id: 28, name: "Pears", category: "Dried Fruit", price500g: "89.00", price1kg: "155.00" },
  { id: 29, name: "Prunes Pitted", category: "Dried Fruit", price500g: "105.00", price1kg: "179.00" },
  { id: 30, name: "Prunes With Pip", category: "Dried Fruit", price500g: "69.00", price1kg: "119.00" },
  { id: 31, name: "Raisins", category: "Dried Fruit", price500g: "45.00", price1kg: "69.00" },
  { id: 32, name: "Trail Mix", category: "Dried Fruit", price500g: "79.00", price1kg: "135.00" },

  // === SWEETS & GUMMIES ===
  { id: 33, name: "Butter Caramel Popcorn", category: "Sweets & Gummies", price500g: "49.00", price1kg: "89.00" },
  { id: 34, name: "Caramel Almonds", category: "Sweets & Gummies", price500g: "149.00", price1kg: "259.00" },
  { id: 35, name: "Caramel Cashews", category: "Sweets & Gummies", price500g: "149.00", price1kg: "259.00" },
  { id: 36, name: "Caramel Peanuts", category: "Sweets & Gummies", price500g: "59.00", price1kg: "95.00" },
  { id: 37, name: "Fruit Salad Gummies", category: "Sweets & Gummies", price500g: "65.00", price1kg: "105.00" },
  { id: 38, name: "Ginger Chunks/Slices", category: "Sweets & Gummies", price500g: "105.00", price1kg: "179.00" },
  { id: 39, name: "Jelly Babies", category: "Sweets & Gummies", price500g: "65.00", price1kg: "105.00" },
  { id: 40, name: "Jelly Beans", category: "Sweets & Gummies", price500g: "89.00", price1kg: "159.00" },
  { id: 41, name: "Mixed Gummies", category: "Sweets & Gummies", price500g: "65.00", price1kg: "105.00" },
  { id: 42, name: "Mixed Sugar & Sour Gummies", category: "Sweets & Gummies", price500g: "65.00", price1kg: "105.00" },
  { id: 43, name: "Pink & White Peanuts", category: "Sweets & Gummies", price500g: "65.00", price1kg: "105.00" },
  { id: 44, name: "Sour Worms", category: "Sweets & Gummies", price500g: "65.00", price1kg: "105.00" },
  { id: 45, name: "Wine Gums", category: "Sweets & Gummies", price500g: "65.00", price1kg: "105.00" },

  // === SEEDS & BAKING ===
  { id: 46, name: "Almond Flour", category: "Seeds & Baking", price500g: "145.00", price1kg: "249.00" },
  { id: 47, name: "Chia Seeds", category: "Seeds & Baking", price500g: "99.00", price1kg: "179.00" },
  { id: 48, name: "Cherries Broken (Red/Green)", category: "Seeds & Baking", price500g: "115.00", price1kg: "205.00" },
  { id: 49, name: "Cocoa Powder", category: "Seeds & Baking", price500g: "99.00", price1kg: "169.00" },
  { id: 50, name: "Coconut Flakes", category: "Seeds & Baking", price500g: "85.00", price1kg: "189.00" },
  { id: 51, name: "Fruit Cake Mix", category: "Seeds & Baking", price500g: "65.00", price1kg: "95.00" },
  { id: 52, name: "Linseeds (Flaxseeds)", category: "Seeds & Baking", price500g: "55.00", price1kg: "79.00" },
  { id: 53, name: "Mixed Seeds", category: "Seeds & Baking", price500g: "65.00", price1kg: "119.00" },
  { id: 54, name: "Oats", category: "Seeds & Baking", price500g: "39.00", price1kg: "59.00" },
  { id: 55, name: "Pumpkin Seeds (Pepitas)", category: "Seeds & Baking", price500g: "105.00", price1kg: "185.00" },
  { id: 56, name: "Quinoa", category: "Seeds & Baking", price500g: "69.00", price1kg: "125.00" },
  { id: 57, name: "Sesame Seeds Black/White", category: "Seeds & Baking", price500g: "75.00", price1kg: "129.00" },
  { id: 58, name: "Sunflower Seeds", category: "Seeds & Baking", price500g: "45.00", price1kg: "75.00" }
];

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  console.log("🌱 Seeding database...");

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  try {
    // Insert all products
    console.log(`📦 Inserting ${products.length} products...`);
    
    for (const product of products) {
      await db.insert(productsTable).values(product).onConflictDoNothing();
    }

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed();
