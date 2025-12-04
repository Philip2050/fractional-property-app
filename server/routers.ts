import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getAllProperties,
  getPropertyById,
  getUserWallet,
  getUserPropertyShares,
  getUserTransactions,
  createTransaction,
  createPropertyShare,
  updateTransactionStatus,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  properties: router({
    list: publicProcedure.query(async () => {
      return getAllProperties();
    }),
    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getPropertyById(input.id);
      }),
  }),

  wallet: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return getUserWallet(ctx.user.id);
    }),
  }),

  shares: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserPropertyShares(ctx.user.id);
    }),
  }),

  transactions: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserTransactions(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        propertyId: z.number(),
        sharesAmount: z.number(),
        amountInRupees: z.string(),
        cryptoAmount: z.string(),
        exchangeRate: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const transaction = await createTransaction({
          userId: ctx.user.id,
          propertyId: input.propertyId,
          transactionType: "buy",
          sharesAmount: input.sharesAmount,
          amountInRupees: input.amountInRupees,
          cryptoAmount: input.cryptoAmount,
          exchangeRate: input.exchangeRate,
          status: "pending",
        });
        return transaction;
      }),
    updateStatus: protectedProcedure
      .input(z.object({
        transactionId: z.number(),
        status: z.enum(["pending", "completed", "failed"]),
      }))
      .mutation(async ({ input }) => {
        return updateTransactionStatus(input.transactionId, input.status);
      }),
  }),
});

export type AppRouter = typeof appRouter;
