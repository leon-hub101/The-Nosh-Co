import { type User, type InsertUser, type Product, type InsertProduct, type Order, type InsertOrder } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductSpecial(id: number, isSpecial: boolean): Promise<void>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  updateOrderStatus(id: string, status: string, paymentVerified?: boolean, payfastTransactionId?: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<number, Product>;
  private orders: Map<string, Order>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      role: insertUser.role || "customer",
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.category === category);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct: Product = {
      ...product,
      imageUrl: product.imageUrl || null,
      isSpecial: product.isSpecial || false,
    };
    this.products.set(product.id, newProduct);
    return newProduct;
  }

  async updateProductSpecial(id: number, isSpecial: boolean): Promise<void> {
    const product = this.products.get(id);
    if (product) {
      product.isSpecial = isSpecial;
    }
  }

  // Orders
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const now = new Date();
    const order: Order = {
      id,
      status: "pending",
      total: insertOrder.total,
      items: insertOrder.items as Array<{productId: number, productName: string, size: string, price: string, quantity: number}>,
      pudoLocation: insertOrder.pudoLocation as {name: string, address: string, code: string} | null || null,
      paymentMethod: insertOrder.paymentMethod || null,
      paymentVerified: false,
      payfastTransactionId: insertOrder.payfastTransactionId || null,
      customerEmail: insertOrder.customerEmail || null,
      customerPhone: insertOrder.customerPhone || null,
      createdAt: now,
      updatedAt: now,
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async updateOrderStatus(id: string, status: string, paymentVerified?: boolean, payfastTransactionId?: string): Promise<void> {
    const order = this.orders.get(id);
    if (order) {
      order.status = status;
      order.updatedAt = new Date();
      if (paymentVerified !== undefined) {
        order.paymentVerified = paymentVerified;
      }
      if (payfastTransactionId) {
        order.payfastTransactionId = payfastTransactionId;
      }
    }
  }
}

export const storage = new MemStorage();
