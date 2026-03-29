import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Products table - stores artwork designs available for print-on-demand.
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  seoDescription: text("seoDescription"),
  artworkUrl: text("artworkUrl").notNull(),
  /** JSON array of mockup image URLs */
  mockupUrls: json("mockupUrls").$type<string[]>().default([]),
  /** Base price in cents (USD) */
  basePrice: int("basePrice").notNull().default(2499),
  /** Printful variant IDs for different sizes */
  printfulVariants: json("printfulVariants").$type<{
    size: string;
    variantId: number;
    price: number;
  }[]>().default([]),
  category: varchar("category", { length: 64 }).default("mug"),
  isActive: int("isActive").notNull().default(1),
  sortOrder: int("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Orders table - tracks customer purchases.
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Stripe checkout session ID */
  stripeSessionId: varchar("stripeSessionId", { length: 256 }),
  /** Stripe payment intent ID */
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 256 }),
  /** Printful order ID once submitted */
  printfulOrderId: varchar("printfulOrderId", { length: 128 }),
  status: mysqlEnum("status", [
    "pending",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ]).default("pending").notNull(),
  /** Total amount in cents */
  totalAmount: int("totalAmount").notNull().default(0),
  /** Shipping address as JSON */
  shippingAddress: json("shippingAddress").$type<{
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>(),
  customerEmail: varchar("customerEmail", { length: 320 }),
  trackingNumber: varchar("trackingNumber", { length: 256 }),
  trackingUrl: text("trackingUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order items - individual products within an order.
 */
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").notNull().default(1),
  /** Size variant selected */
  size: varchar("size", { length: 32 }).default("11oz"),
  /** Price per unit in cents at time of purchase */
  unitPrice: int("unitPrice").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Cart items - shopping cart for authenticated users.
 */
export const cartItems = mysqlTable("cartItems", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").notNull().default(1),
  size: varchar("size", { length: 32 }).default("11oz"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;
