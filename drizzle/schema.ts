import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Properties table - represents real estate properties
export const properties = mysqlTable("properties", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 255 }).notNull(),
  totalArea: int("totalArea").notNull(), // in sqft
  totalPrice: varchar("totalPrice", { length: 64 }).notNull(), // in rupees, stored as string for precision
  pricePerSqft: varchar("pricePerSqft", { length: 64 }).notNull(), // price per sqft in rupees
  minShareSize: int("minShareSize").notNull().default(1), // minimum sqft to buy
  totalShares: int("totalShares").notNull(), // total sqft available
  soldShares: int("soldShares").notNull().default(0), // sqft already sold
  imageUrl: text("imageUrl"),
  propertyType: varchar("propertyType", { length: 64 }).notNull(), // residential, commercial, etc
  status: mysqlEnum("status", ["available", "sold_out", "pending"]).default("available").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;

// User wallets - cryptocurrency wallets for each user
export const userWallets = mysqlTable("userWallets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  walletAddress: varchar("walletAddress", { length: 255 }).notNull().unique(),
  balance: varchar("balance", { length: 64 }).notNull().default("0"), // in crypto, stored as string
  balanceInRupees: varchar("balanceInRupees", { length: 64 }).notNull().default("0"), // equivalent in rupees
  cryptoType: varchar("cryptoType", { length: 32 }).notNull().default("ETH"), // ETH, BTC, etc
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserWallet = typeof userWallets.$inferSelect;
export type InsertUserWallet = typeof userWallets.$inferInsert;

// User property shares - represents ownership of property fractions
export const userPropertyShares = mysqlTable("userPropertyShares", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  propertyId: int("propertyId").notNull(),
  sharesOwned: int("sharesOwned").notNull(), // number of sqft owned
  investmentAmount: varchar("investmentAmount", { length: 64 }).notNull(), // in rupees
  cryptoInvested: varchar("cryptoInvested", { length: 64 }).notNull(), // amount of crypto used
  purchaseDate: timestamp("purchaseDate").defaultNow().notNull(),
  transactionHash: varchar("transactionHash", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserPropertyShare = typeof userPropertyShares.$inferSelect;
export type InsertUserPropertyShare = typeof userPropertyShares.$inferInsert;

// Transactions - records all buy/sell transactions
export const transactions = mysqlTable("transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  propertyId: int("propertyId").notNull(),
  transactionType: mysqlEnum("transactionType", ["buy", "sell"]).notNull(),
  sharesAmount: int("sharesAmount").notNull(), // sqft amount
  amountInRupees: varchar("amountInRupees", { length: 64 }).notNull(),
  cryptoAmount: varchar("cryptoAmount", { length: 64 }).notNull(),
  exchangeRate: varchar("exchangeRate", { length: 64 }).notNull(), // crypto to rupees rate at time of transaction
  transactionHash: varchar("transactionHash", { length: 255 }).unique(),
  status: mysqlEnum("status", ["pending", "completed", "failed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;