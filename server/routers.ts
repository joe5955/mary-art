import { z } from "zod";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import {
  getAllProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCartItems,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  createOrder,
  createOrderItems,
  getOrderById,
  getOrderItems,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  updateOrderTracking,
  getOrderStats,
  updateUserStripeCustomerId,
} from "./db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil" as any,
});

// Admin guard middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Products ───────────────────────────────────────────────────────────────
  products: router({
    list: publicProcedure.query(async () => {
      return getAllProducts(true);
    }),
    listAll: adminProcedure.query(async () => {
      return getAllProducts(false);
    }),
    bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
      const product = await getProductBySlug(input.slug);
      if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      return product;
    }),
    create: adminProcedure
      .input(
        z.object({
          slug: z.string().min(1),
          title: z.string().min(1),
          description: z.string().optional(),
          seoDescription: z.string().optional(),
          artworkUrl: z.string().url(),
          mockupUrls: z.array(z.string()).optional(),
          basePrice: z.number().int().min(50),
          category: z.string().optional(),
          sortOrder: z.number().int().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createProduct(input as any);
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number().int(),
          slug: z.string().min(1).optional(),
          title: z.string().min(1).optional(),
          description: z.string().optional(),
          seoDescription: z.string().optional(),
          artworkUrl: z.string().url().optional(),
          mockupUrls: z.array(z.string()).optional(),
          basePrice: z.number().int().min(50).optional(),
          category: z.string().optional(),
          isActive: z.number().int().min(0).max(1).optional(),
          sortOrder: z.number().int().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateProduct(id, data as any);
      }),
    delete: adminProcedure.input(z.object({ id: z.number().int() })).mutation(async ({ input }) => {
      await deleteProduct(input.id);
      return { success: true };
    }),
    generateDescription: adminProcedure
      .input(z.object({ id: z.number().int() }))
      .mutation(async ({ input }) => {
        const product = await getProductById(input.id);
        if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });

        const { invokeLLM } = await import("./_core/llm");
        const result = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `You are a creative copywriter for an artisan e-commerce store selling coffee mugs featuring original folk art by Mary Wolford. Write compelling, SEO-optimized product descriptions. Return JSON with two fields: "description" (2-3 engaging paragraphs, ~120 words) and "seoDescription" (meta description, max 155 characters). Focus on the artistry, the warmth of handmade feel, and the joy of drinking from a unique piece of art.`,
            },
            {
              role: "user",
              content: [
                {
                  type: "text" as const,
                  text: `Generate a product description for: "${product.title}" in the category "${product.category || "Coffee Mugs"}". The artwork URL is provided for visual reference.`,
                },
                {
                  type: "image_url" as const,
                  image_url: { url: product.artworkUrl, detail: "low" as const },
                },
              ],
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "product_copy",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  description: { type: "string", description: "2-3 paragraph product description" },
                  seoDescription: { type: "string", description: "Meta description, max 155 chars" },
                },
                required: ["description", "seoDescription"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = result.choices[0]?.message?.content;
        if (!content || typeof content !== "string") {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "LLM returned empty response" });
        }

        const parsed = JSON.parse(content);
        await updateProduct(input.id, {
          description: parsed.description,
          seoDescription: parsed.seoDescription,
        });

        return { description: parsed.description, seoDescription: parsed.seoDescription };
      }),
  }),

  // ─── Cart ───────────────────────────────────────────────────────────────────
  cart: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getCartItems(ctx.user.id);
    }),
    add: protectedProcedure
      .input(
        z.object({
          productId: z.number().int(),
          quantity: z.number().int().min(1).default(1),
          size: z.string().default("11oz"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const product = await getProductById(input.productId);
        if (!product || !product.isActive) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Product not found or unavailable" });
        }
        const id = await addToCart(ctx.user.id, input.productId, input.quantity, input.size);
        return { success: true, cartItemId: id };
      }),
    updateQuantity: protectedProcedure
      .input(z.object({ id: z.number().int(), quantity: z.number().int().min(0) }))
      .mutation(async ({ ctx, input }) => {
        await updateCartItemQuantity(input.id, ctx.user.id, input.quantity);
        return { success: true };
      }),
    remove: protectedProcedure.input(z.object({ id: z.number().int() })).mutation(async ({ ctx, input }) => {
      await removeCartItem(input.id, ctx.user.id);
      return { success: true };
    }),
    clear: protectedProcedure.mutation(async ({ ctx }) => {
      await clearCart(ctx.user.id);
      return { success: true };
    }),
  }),

  // ─── Checkout ───────────────────────────────────────────────────────────────
  checkout: router({
    createSession: protectedProcedure.mutation(async ({ ctx }) => {
      const items = await getCartItems(ctx.user.id);
      if (items.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cart is empty" });
      }

      // Size surcharges
      const SIZE_SURCHARGE: Record<string, number> = { "11oz": 0, "15oz": 400 };
      const getItemPrice = (item: typeof items[0]) => item.product.basePrice + (SIZE_SURCHARGE[item.size || "11oz"] || 0);

      // Calculate total
      const totalAmount = items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);

      // Create order in pending state
      const orderId = await createOrder({
        userId: ctx.user.id,
        status: "pending",
        totalAmount,
        customerEmail: ctx.user.email || undefined,
      });

      // Create order items
      await createOrderItems(
        items.map((item) => ({
          orderId,
          productId: item.productId,
          quantity: item.quantity,
          size: item.size || "11oz",
          unitPrice: getItemPrice(item),
        }))
      );

      // Build Stripe line items
      const lineItems = items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.title,
            description: `Size: ${item.size || "11oz"}`,
            images: item.product.mockupUrls && (item.product.mockupUrls as string[]).length > 0
              ? [(item.product.mockupUrls as string[])[0]]
              : [item.product.artworkUrl],
          },
          unit_amount: getItemPrice(item),
        },
        quantity: item.quantity,
      }));

      const origin = ctx.req.headers.origin || `${ctx.req.protocol}://${ctx.req.get("host")}`;

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cart`,
        client_reference_id: ctx.user.id.toString(),
        customer_email: ctx.user.email || undefined,
        metadata: {
          user_id: ctx.user.id.toString(),
          order_id: orderId.toString(),
          customer_name: ctx.user.name || "",
        },
        shipping_address_collection: {
          allowed_countries: ["US", "CA", "GB", "AU"],
        },
        allow_promotion_codes: true,
      });

      // Update order with stripe session ID
      const { getDb } = await import("./db");
      const db = await getDb();
      if (db) {
        const { orders } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        await db.update(orders).set({ stripeSessionId: session.id }).where(eq(orders.id, orderId));
      }

      return { checkoutUrl: session.url, sessionId: session.id, orderId };
    }),
  }),

  // ─── Orders ─────────────────────────────────────────────────────────────────
  orders: router({
    myOrders: protectedProcedure.query(async ({ ctx }) => {
      return getUserOrders(ctx.user.id);
    }),
    byId: protectedProcedure.input(z.object({ id: z.number().int() })).query(async ({ ctx, input }) => {
      const order = await getOrderById(input.id);
      if (!order) throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      // Only allow user to see their own orders (unless admin)
      if (order.userId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }
      const items = await getOrderItems(input.id);
      return { ...order, items };
    }),
    // Admin: list all orders
    listAll: adminProcedure.query(async () => {
      return getAllOrders();
    }),
    // Admin: update order status
    updateStatus: adminProcedure
      .input(z.object({ id: z.number().int(), status: z.string() }))
      .mutation(async ({ input }) => {
        await updateOrderStatus(input.id, input.status);
        return { success: true };
      }),
    // Admin: update tracking
    updateTracking: adminProcedure
      .input(
        z.object({
          id: z.number().int(),
          trackingNumber: z.string(),
          trackingUrl: z.string().url().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await updateOrderTracking(input.id, input.trackingNumber, input.trackingUrl || "");
        return { success: true };
      }),
    // Admin: get stats
    stats: adminProcedure.query(async () => {
      return getOrderStats();
    }),
    // Check order by session ID (for success page)
    bySession: protectedProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const { orders } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        const result = await db
          .select()
          .from(orders)
          .where(eq(orders.stripeSessionId, input.sessionId))
          .limit(1);
        if (result.length === 0) throw new TRPCError({ code: "NOT_FOUND" });
        const order = result[0];
        if (order.userId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const items = await getOrderItems(order.id);
        return { ...order, items };
      }),
  }),
});

export type AppRouter = typeof appRouter;
