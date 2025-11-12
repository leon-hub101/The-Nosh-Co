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
