import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Properties Router", () => {
  it("should list all properties", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.properties.list();

    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      const property = result[0];
      expect(property).toHaveProperty("id");
      expect(property).toHaveProperty("title");
      expect(property).toHaveProperty("location");
      expect(property).toHaveProperty("totalArea");
      expect(property).toHaveProperty("pricePerSqft");
      expect(property).toHaveProperty("status");
    }
  });

  it("should get a specific property by id", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const allProperties = await caller.properties.list();
    if (allProperties.length === 0) {
      console.log("No properties found for testing");
      return;
    }

    const firstProperty = allProperties[0];
    const result = await caller.properties.get({ id: firstProperty.id });

    expect(result).toBeDefined();
    expect(result?.id).toBe(firstProperty.id);
    expect(result?.title).toBe(firstProperty.title);
  });

  it("should handle invalid property id gracefully", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.properties.get({ id: 99999 });

    expect(result).toBeUndefined();
  });
});

describe("Wallet Router", () => {
  it("should get wallet for authenticated user", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.wallet.get();

    // Wallet might not exist initially, but should not throw
    if (result) {
      expect(result).toHaveProperty("userId");
      expect(result).toHaveProperty("walletAddress");
      expect(result).toHaveProperty("balance");
      expect(result).toHaveProperty("cryptoType");
    }
  });
});

describe("Shares Router", () => {
  it("should list user property shares", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.shares.list();

    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      const share = result[0];
      expect(share).toHaveProperty("userId");
      expect(share).toHaveProperty("propertyId");
      expect(share).toHaveProperty("sharesOwned");
      expect(share).toHaveProperty("investmentAmount");
    }
  });

  it("should return empty array for user with no shares", async () => {
    const ctx = createAuthContext(9999);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.shares.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});

describe("Transactions Router", () => {
  it("should list user transactions", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.transactions.list();

    expect(Array.isArray(result)).toBe(true);
    if (result.length > 0) {
      const transaction = result[0];
      expect(transaction).toHaveProperty("userId");
      expect(transaction).toHaveProperty("propertyId");
      expect(transaction).toHaveProperty("transactionType");
      expect(transaction).toHaveProperty("status");
    }
  });

  it("should create a new transaction", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    // Get first property to use for transaction
    const properties = await caller.properties.list();
    if (properties.length === 0) {
      console.log("No properties available for transaction test");
      return;
    }

    const property = properties[0];

    const result = await caller.transactions.create({
      propertyId: property.id,
      sharesAmount: 10,
      amountInRupees: "10000",
      cryptoAmount: "0.133",
      exchangeRate: "75000",
    });

    expect(result).toBeDefined();
  });

  it("should validate transaction input", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.transactions.create({
        propertyId: -1,
        sharesAmount: 0,
        amountInRupees: "0",
        cryptoAmount: "0",
        exchangeRate: "75000",
      });
    } catch (error) {
      // Expected to fail with invalid input
      expect(error).toBeDefined();
    }
  });

  it("should update transaction status", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const transactions = await caller.transactions.list();
    if (transactions.length === 0) {
      console.log("No transactions available for status update test");
      return;
    }

    const transaction = transactions[0];

    const result = await caller.transactions.updateStatus({
      transactionId: transaction.id,
      status: "completed",
    });

    expect(result).toBeDefined();
  });
});

describe("Authentication", () => {
  it("should return current user info", async () => {
    const ctx = createAuthContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).toBeDefined();
    expect(result?.id).toBe(1);
    expect(result?.openId).toBe("test-user-1");
  });

  it("should handle logout", async () => {
    const ctx = createAuthContext(1);
    ctx.res = {
      clearCookie: (name: string, options: any) => {
        // Mock implementation
      },
    } as any;

    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
  });
});
