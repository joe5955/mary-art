import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: { origin: "https://test.example.com" },
      get: (name: string) => name === "host" ? "test.example.com" : undefined,
    } as any,
    res: {
      clearCookie: vi.fn(),
    } as any,
  };
}

function createUserContext(overrides: Partial<AuthenticatedUser> = {}): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-open-id",
    email: "testuser@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };
  return {
    user,
    req: {
      protocol: "https",
      headers: { origin: "https://test.example.com" },
      get: (name: string) => name === "host" ? "test.example.com" : undefined,
    } as any,
    res: {
      clearCookie: vi.fn(),
    } as any,
  };
}

function createAdminContext(overrides: Partial<AuthenticatedUser> = {}): TrpcContext {
  return createUserContext({ role: "admin", id: 99, openId: "admin-open-id", ...overrides });
}

// ─── Products ─────────────────────────────────────────────────────────────────

describe("products", () => {
  it("lists active products publicly", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const products = await caller.products.list();
    expect(Array.isArray(products)).toBe(true);
    // We seeded 6 products
    expect(products.length).toBeGreaterThanOrEqual(1);
    // Each product should have required fields
    for (const p of products) {
      expect(p).toHaveProperty("id");
      expect(p).toHaveProperty("slug");
      expect(p).toHaveProperty("title");
      expect(p).toHaveProperty("basePrice");
      expect(p).toHaveProperty("artworkUrl");
      expect(p.isActive).toBe(1);
    }
  });

  it("fetches a product by slug", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const product = await caller.products.bySlug({ slug: "coffee-dreamer-mug" });
    expect(product).toBeDefined();
    expect(product.slug).toBe("coffee-dreamer-mug");
    expect(product.title).toBe("Coffee Dreamer");
    expect(product.basePrice).toBe(2495);
  });

  it("throws NOT_FOUND for invalid slug", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.products.bySlug({ slug: "nonexistent-product" })).rejects.toThrow();
  });

  it("admin can list all products including inactive", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const products = await caller.products.listAll();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThanOrEqual(1);
  });

  it("non-admin cannot list all products", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.products.listAll()).rejects.toThrow();
  });
});

// ─── Cart ─────────────────────────────────────────────────────────────────────

describe("cart", () => {
  it("requires authentication to view cart", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.cart.list()).rejects.toThrow();
  });

  it("authenticated user can view empty cart", async () => {
    const caller = appRouter.createCaller(createUserContext());
    const items = await caller.cart.list();
    expect(Array.isArray(items)).toBe(true);
  });

  it("authenticated user can add item to cart", async () => {
    // First get a product
    const publicCaller = appRouter.createCaller(createPublicContext());
    const products = await publicCaller.products.list();
    expect(products.length).toBeGreaterThan(0);

    const ctx = createUserContext({ id: 200, openId: "cart-test-user" });
    const caller = appRouter.createCaller(ctx);

    const result = await caller.cart.add({
      productId: products[0].id,
      quantity: 1,
      size: "11oz",
    });
    expect(result.success).toBe(true);

    // Check cart has the item
    const items = await caller.cart.list();
    expect(items.length).toBeGreaterThanOrEqual(1);
    const found = items.find((i) => i.productId === products[0].id);
    expect(found).toBeDefined();

    // Clean up
    await caller.cart.clear();
  });

  it("authenticated user can remove item from cart", async () => {
    const publicCaller = appRouter.createCaller(createPublicContext());
    const products = await publicCaller.products.list();

    const ctx = createUserContext({ id: 201, openId: "cart-remove-test" });
    const caller = appRouter.createCaller(ctx);

    await caller.cart.add({ productId: products[0].id, quantity: 1, size: "11oz" });
    const items = await caller.cart.list();
    expect(items.length).toBeGreaterThanOrEqual(1);

    await caller.cart.remove({ id: items[0].id });
    const afterRemove = await caller.cart.list();
    const found = afterRemove.find((i) => i.id === items[0].id);
    expect(found).toBeUndefined();

    // Clean up
    await caller.cart.clear();
  });

  it("authenticated user can update cart item quantity", async () => {
    const publicCaller = appRouter.createCaller(createPublicContext());
    const products = await publicCaller.products.list();

    const ctx = createUserContext({ id: 202, openId: "cart-qty-test" });
    const caller = appRouter.createCaller(ctx);

    await caller.cart.add({ productId: products[0].id, quantity: 1, size: "11oz" });
    const items = await caller.cart.list();
    expect(items.length).toBeGreaterThanOrEqual(1);

    await caller.cart.updateQuantity({ id: items[0].id, quantity: 3 });
    const updated = await caller.cart.list();
    const found = updated.find((i) => i.id === items[0].id);
    expect(found?.quantity).toBe(3);

    // Clean up
    await caller.cart.clear();
  });

  it("setting quantity to 0 removes the item", async () => {
    const publicCaller = appRouter.createCaller(createPublicContext());
    const products = await publicCaller.products.list();

    const ctx = createUserContext({ id: 203, openId: "cart-zero-test" });
    const caller = appRouter.createCaller(ctx);

    await caller.cart.add({ productId: products[0].id, quantity: 1, size: "11oz" });
    const items = await caller.cart.list();

    await caller.cart.updateQuantity({ id: items[0].id, quantity: 0 });
    const after = await caller.cart.list();
    const found = after.find((i) => i.id === items[0].id);
    expect(found).toBeUndefined();
  });

  it("cannot add non-existent product to cart", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.cart.add({ productId: 999999, quantity: 1, size: "11oz" })).rejects.toThrow();
  });
});

// ─── Orders ───────────────────────────────────────────────────────────────────

describe("orders", () => {
  it("requires authentication to view orders", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.orders.myOrders()).rejects.toThrow();
  });

  it("authenticated user can view their orders (may be empty)", async () => {
    const caller = appRouter.createCaller(createUserContext());
    const orders = await caller.orders.myOrders();
    expect(Array.isArray(orders)).toBe(true);
  });

  it("admin can view all orders", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const orders = await caller.orders.listAll();
    expect(Array.isArray(orders)).toBe(true);
  });

  it("admin can view order stats", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const stats = await caller.orders.stats();
    expect(stats).toHaveProperty("totalOrders");
    expect(stats).toHaveProperty("totalRevenue");
    expect(stats).toHaveProperty("pendingOrders");
  });

  it("non-admin cannot view all orders", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.orders.listAll()).rejects.toThrow();
  });

  it("non-admin cannot view order stats", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.orders.stats()).rejects.toThrow();
  });
});

// ─── Checkout ─────────────────────────────────────────────────────────────────

describe("checkout", () => {
  it("requires authentication", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.checkout.createSession()).rejects.toThrow();
  });

  it("rejects checkout with empty cart", async () => {
    const ctx = createUserContext({ id: 300, openId: "checkout-empty-test" });
    const caller = appRouter.createCaller(ctx);
    // Clear cart first
    await caller.cart.clear();
    await expect(caller.checkout.createSession()).rejects.toThrow("Cart is empty");
  });
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

describe("auth.me", () => {
  it("returns null for unauthenticated user", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("returns user for authenticated user", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeDefined();
    expect(result?.email).toBe("testuser@example.com");
    expect(result?.name).toBe("Test User");
  });
});
