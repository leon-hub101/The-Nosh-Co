import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, numeric, timestamp, jsonb, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("customer"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price500g: numeric("price_500g", { precision: 10, scale: 2 }).notNull(),
  price1kg: numeric("price_1kg", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  isSpecial: boolean("is_special").notNull().default(false),
  stock500g: integer("stock_500g").notNull().default(100),
  stock1kg: integer("stock_1kg").notNull().default(100),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  status: text("status").notNull().default("pending"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  items: jsonb("items").notNull().$type<Array<{productId: number, productName: string, size: string, price: string, quantity: number}>>(),
  pudoLocation: jsonb("pudo_location").$type<{name: string, address: string, code: string} | null>(),
  paymentMethod: text("payment_method"),
  paymentVerified: boolean("payment_verified").notNull().default(false),
  payfastTransactionId: text("payfast_transaction_id"),
  customerEmail: text("customer_email"),
  customerPhone: text("customer_phone"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const shopStatus = pgTable("shop_status", {
  id: serial("id").primaryKey(),
  isOpen: boolean("is_open").notNull().default(true),
  closedMessage: text("closed_message"),
  reopenDate: timestamp("reopen_date", { withTimezone: true }),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products);

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  paymentVerified: true,
});

export const insertShopStatusSchema = createInsertSchema(shopStatus).omit({
  id: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type ShopStatus = typeof shopStatus.$inferSelect;
export type InsertShopStatus = z.infer<typeof insertShopStatusSchema>;
