import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, properties, userWallets, userPropertyShares, transactions, InsertProperty, InsertUserWallet, InsertUserPropertyShare, InsertTransaction } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Property queries
export async function getAllProperties() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(properties);
}

export async function getPropertyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
  return result[0];
}

export async function createProperty(data: InsertProperty) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(properties).values(data);
  return result;
}

// Wallet queries
export async function getUserWallet(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(userWallets).where(eq(userWallets.userId, userId)).limit(1);
  return result[0];
}

export async function createOrUpdateWallet(userId: number, walletData: Omit<InsertUserWallet, 'userId'>) {
  const db = await getDb();
  if (!db) return undefined;
  const existing = await getUserWallet(userId);
  if (existing) {
    await db.update(userWallets).set(walletData).where(eq(userWallets.userId, userId));
    return existing;
  }
  const result = await db.insert(userWallets).values({ userId, ...walletData });
  return result;
}

// User property shares queries
export async function getUserPropertyShares(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(userPropertyShares).where(eq(userPropertyShares.userId, userId));
}

export async function getUserPropertyShare(userId: number, propertyId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(userPropertyShares)
    .where(and(eq(userPropertyShares.userId, userId), eq(userPropertyShares.propertyId, propertyId)))
    .limit(1);
  return result[0];
}

export async function createPropertyShare(data: InsertUserPropertyShare) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(userPropertyShares).values(data);
  return result;
}

// Transaction queries
export async function getUserTransactions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(transactions).where(eq(transactions.userId, userId));
}

export async function createTransaction(data: InsertTransaction) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(transactions).values(data);
  return result;
}

export async function updateTransactionStatus(transactionId: number, status: string) {
  const db = await getDb();
  if (!db) return undefined;
  return db.update(transactions).set({ status: status as any }).where(eq(transactions.id, transactionId));
}
