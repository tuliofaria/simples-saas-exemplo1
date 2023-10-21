import { z } from "zod";
import { QuoteSchema } from "~/lib/Quote";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  echo: publicProcedure
    .input(z.object({ fullName: z.string() }))
    .query(({ input }) => {
      return {
        saas: `Hello ${input.fullName}`,
      };
    }),

  findAll: publicProcedure.query(async ({ ctx }) => {
    const quotes = await ctx.db.quote.findMany();
    return quotes;
  }),

  createQuote: publicProcedure
    .input(QuoteSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.quote.create({
        data: {
          quote: input.quote,
        },
      });
    }),

  deleteQuote: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.quote.delete({
        where: {
          id: input.id,
        },
      });
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          name: input.name,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
      where: { createdBy: { id: ctx.session.user.id } },
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
