import { eq } from "drizzle-orm";
import { db } from "./db";
import { users, products, orders } from "@shared/schema";
import type { User, InsertUser, Product, InsertProduct, Order, InsertOrder } from "@shared/schema";
import type { IStorage } from "./storage";

export class DbStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUserPassword(id: string, hashedPassword: string): Promise<void> {
    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, id));
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  async updateProductSpecial(id: number, isSpecial: boolean): Promise<void> {
    await db.update(products)
      .set({ isSpecial })
      .where(eq(products.id, id));
  }

  async updateProductStock(id: number, stock500g: number, stock1kg: number): Promise<void> {
    await db.update(products)
      .set({ stock500g, stock1kg })
      .where(eq(products.id, id));
  }

  // Orders
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(insertOrder as any).returning();
    return result[0];
  }

  async createOrderWithStockDecrement(orderData: InsertOrder, items: Array<{id: number, size: "500g" | "1kg", quantity: number}>): Promise<Order> {
    // Atomic transaction for order creation with stock decrement
    return await db.transaction(async (tx) => {
      // Aggregate quantities by product/size to handle duplicates
      const stockDecrements = new Map<string, {productId: number, size: string, totalQuantity: number}>();
      for (const item of items) {
        const key = `${item.id}-${item.size}`;
        const existing = stockDecrements.get(key);
        if (existing) {
          existing.totalQuantity += item.quantity;
        } else {
          stockDecrements.set(key, {
            productId: item.id,
            size: item.size,
            totalQuantity: item.quantity,
          });
        }
      }

      // Decrement stock for each product/size combination with row-level locking
      for (const decrement of Array.from(stockDecrements.values())) {
        // Lock the product row for update
        const product = await tx.select().from(products)
          .where(eq(products.id, decrement.productId))
          .for('update')
          .then(rows => rows[0]);
        
        if (!product) {
          throw new Error(`Product ${decrement.productId} not found during stock update`);
        }

        // Drizzle returns camelCase property names from schema definition
        const currentStock = decrement.size === "1kg" ? product.stock1kg : product.stock500g;
        if (currentStock < decrement.totalQuantity) {
          throw new Error(`Insufficient stock for ${product.name} (${decrement.size}). Only ${currentStock} available, requested ${decrement.totalQuantity}.`);
        }

        // Calculate and persist new stock using camelCase property names
        const updates = decrement.size === "1kg" 
          ? { stock1kg: product.stock1kg - decrement.totalQuantity }
          : { stock500g: product.stock500g - decrement.totalQuantity };

        await tx.update(products)
          .set(updates)
          .where(eq(products.id, decrement.productId));
      }

      // Create the order within the same transaction
      const createdOrder = await tx.insert(orders)
        .values(orderData as any)
        .returning()
        .then(rows => rows[0]);

      return createdOrder;
    });
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async updateOrderStatus(
    id: string,
    status: string,
    paymentVerified?: boolean,
    payfastTransactionId?: string
  ): Promise<void> {
    const updateData: any = { status, updatedAt: new Date() };
    
    if (paymentVerified !== undefined) {
      updateData.paymentVerified = paymentVerified;
    }
    
    if (payfastTransactionId) {
      updateData.payfastTransactionId = payfastTransactionId;
    }

    await db.update(orders)
      .set(updateData)
      .where(eq(orders.id, id));
  }
}
