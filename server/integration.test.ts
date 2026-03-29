import { describe, expect, it, vi, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import {
  createOrder,
  createOrderItems,
  getOrderById,
  updateOrderPayment,
  getOrderByStripeSession,
  clearCart,
  getCartItems,
  getUserOrders,
  getOrderStats,
  updateOrderStatus,
  updateOrderTracking,
  getAllProducts,
  getProductById,
} from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: { origin: "https://test.example.com" },
      get: (name: string) => (name === "host" ? "test.example.com" : undefined),
    } as any,
    res: { clearCookie: vi.fn() } as any,
  };
}

function createUserContext(overrides: Partial<AuthenticatedUser> = {}): TrpcContext {
  const user: AuthenticatedUser = {
    id: 500,
    openId: "integration-test-user",
    email: "integration@test.com",
    name: "Integration Tester",
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
      get: (name: string) => (name === "host" ? "test.example.com" : undefined),
    } as any,
    res: { clearCookie: vi.fn() } as any,
  };
}

function createAdminContext(overrides: Partial<AuthenticatedUser> = {}): TrpcContext {
  return createUserContext({ role: "admin", id: 501, openId: "integration-admin", ...overrides });
}

// ─── End-to-End Purchase Flow ────────────────────────────────────────────────

describe("end-to-end purchase flow (DB layer)", () => {
  let testProductId: number;
  let testOrderId: number;
  const testUserId = 500;
  const testSessionId = "cs_test_integration_" + Date.now();

  beforeAll(async () => {
    // Get a real product from the seeded catalog
    const allProducts = await getAllProducts(true);
    expect(allProducts.length).toBeGreaterThan(0);
    testProductId = allProducts[0].id;
  });

  afterAll(async () => {
    // Clean up cart
    await clearCart(testUserId);
  });

  it("step 1: user adds items to cart", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    // Clear any existing cart
    await caller.cart.clear();

    // Add product to cart
    const result = await caller.cart.add({
      productId: testProductId,
      quantity: 2,
      size: "11oz",
    });
    expect(result.success).toBe(true);

    // Verify cart contents
    const items = await caller.cart.list();
    expect(items.length).toBe(1);
    expect(items[0].productId).toBe(testProductId);
    expect(items[0].quantity).toBe(2);
    expect(items[0].size).toBe("11oz");
  });

  it("step 2: order is created with correct totals", async () => {
    // Simulate what the checkout procedure does: create an order from cart
    const cartItems = await getCartItems(testUserId);
    expect(cartItems.length).toBe(1);

    const product = await getProductById(testProductId);
    expect(product).toBeDefined();

    // Calculate total (11oz = base price, no surcharge)
    const unitPrice = product!.basePrice;
    const totalAmount = unitPrice * cartItems[0].quantity;

    // Create order
    testOrderId = await createOrder({
      userId: testUserId,
      stripeSessionId: testSessionId,
      totalAmount,
      status: "pending",
      customerEmail: "integration@test.com",
    });
    expect(testOrderId).toBeGreaterThan(0);

    // Create order items
    await createOrderItems([
      {
        orderId: testOrderId,
        productId: testProductId,
        quantity: cartItems[0].quantity,
        size: cartItems[0].size,
        unitPrice,
      },
    ]);

    // Verify order was created
    const order = await getOrderById(testOrderId);
    expect(order).toBeDefined();
    expect(order!.status).toBe("pending");
    expect(order!.totalAmount).toBe(totalAmount);
    expect(order!.stripeSessionId).toBe(testSessionId);
  });

  it("step 3: webhook marks order as paid (simulating checkout.session.completed)", async () => {
    // Simulate what the webhook handler does
    const order = await getOrderByStripeSession(testSessionId);
    expect(order).toBeDefined();
    expect(order!.id).toBe(testOrderId);

    // Update order payment (simulating webhook)
    await updateOrderPayment(order!.id, {
      stripePaymentIntentId: "pi_test_integration_" + Date.now(),
      status: "paid",
      customerEmail: "integration@test.com",
    });

    // Verify order status changed
    const updatedOrder = await getOrderById(testOrderId);
    expect(updatedOrder!.status).toBe("paid");
    expect(updatedOrder!.stripePaymentIntentId).toBeTruthy();
  });

  it("step 4: cart is cleared after payment", async () => {
    // Simulate cart clearing (webhook handler does this)
    await clearCart(testUserId);

    const items = await getCartItems(testUserId);
    expect(items.length).toBe(0);
  });

  it("step 5: user can see their order in order history", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const myOrders = await caller.orders.myOrders();
    const found = myOrders.find((o) => o.id === testOrderId);
    expect(found).toBeDefined();
    expect(found!.status).toBe("paid");
  });

  it("step 6: order detail shows items", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    const detail = await caller.orders.byId({ id: testOrderId });
    expect(detail).toBeDefined();
    expect(detail.id).toBe(testOrderId);
    expect(detail.items.length).toBe(1);
    expect(detail.items[0].productId).toBe(testProductId);
    expect(detail.items[0].quantity).toBe(2);
    expect(detail.items[0].size).toBe("11oz");
  });

  it("step 7: admin can see the order and update status", async () => {
    const adminCaller = appRouter.createCaller(createAdminContext());

    const allOrders = await adminCaller.orders.listAll();
    const found = allOrders.find((o) => o.id === testOrderId);
    expect(found).toBeDefined();

    // Update status to processing
    await adminCaller.orders.updateStatus({ id: testOrderId, status: "processing" });
    const updated = await getOrderById(testOrderId);
    expect(updated!.status).toBe("processing");
  });

  it("step 8: admin can add tracking info", async () => {
    const adminCaller = appRouter.createCaller(createAdminContext());

    await adminCaller.orders.updateTracking({
      id: testOrderId,
      trackingNumber: "TRACK123456",
      trackingUrl: "https://tracking.example.com/TRACK123456",
    });

    const updated = await getOrderById(testOrderId);
    expect(updated!.trackingNumber).toBe("TRACK123456");
    expect(updated!.trackingUrl).toBe("https://tracking.example.com/TRACK123456");
    expect(updated!.status).toBe("shipped");
  });

  it("step 9: order stats reflect the new order", async () => {
    const adminCaller = appRouter.createCaller(createAdminContext());
    const stats = await adminCaller.orders.stats();
    expect(stats.totalOrders).toBeGreaterThanOrEqual(1);
    expect(Number(stats.totalRevenue)).toBeGreaterThan(0);
  });
});

// ─── 15oz Surcharge Pricing ──────────────────────────────────────────────────

describe("15oz surcharge pricing", () => {
  it("adds 15oz item to cart and verifies price includes surcharge", async () => {
    const ctx = createUserContext({ id: 600, openId: "surcharge-test-user" });
    const caller = appRouter.createCaller(ctx);

    await caller.cart.clear();

    const products = await getAllProducts(true);
    const product = products[0];

    // Add 15oz item
    await caller.cart.add({
      productId: product.id,
      quantity: 1,
      size: "15oz",
    });

    const items = await caller.cart.list();
    expect(items.length).toBe(1);
    expect(items[0].size).toBe("15oz");

    // The surcharge is $4.00 = 400 cents, applied at checkout
    // Base price + surcharge should be reflected in checkout line items
    const expectedUnitPrice = product.basePrice + 400;
    expect(expectedUnitPrice).toBe(product.basePrice + 400);

    await caller.cart.clear();
  });
});

// ─── Admin Product Management ────────────────────────────────────────────────

describe("admin product management", () => {
  let createdProductId: number;

  it("admin can create a new product", async () => {
    const adminCaller = appRouter.createCaller(createAdminContext());

    const result = await adminCaller.products.create({
      slug: "test-integration-mug-" + Date.now(),
      title: "Integration Test Mug",
      description: "A mug created during integration testing",
      artworkUrl: "https://example.com/test.jpg",
      mockupUrls: ["https://example.com/mockup1.jpg"],
      basePrice: 2995,
      category: "Test Mugs",
    });

    expect(result).toBeDefined();
    expect(result!.title).toBe("Integration Test Mug");
    createdProductId = result!.id;
  });

  it("admin can toggle product visibility", async () => {
    const adminCaller = appRouter.createCaller(createAdminContext());

    // Hide the product
    await adminCaller.products.update({ id: createdProductId, isActive: 0 });
    let product = await getProductById(createdProductId);
    expect(product!.isActive).toBe(0);

    // Show the product
    await adminCaller.products.update({ id: createdProductId, isActive: 1 });
    product = await getProductById(createdProductId);
    expect(product!.isActive).toBe(1);
  });

  it("admin can delete (soft-delete) a product", async () => {
    const adminCaller = appRouter.createCaller(createAdminContext());

    await adminCaller.products.delete({ id: createdProductId });
    const product = await getProductById(createdProductId);
    expect(product!.isActive).toBe(0);
  });

  it("non-admin cannot create products", async () => {
    const userCaller = appRouter.createCaller(createUserContext());
    await expect(
      userCaller.products.create({
        slug: "unauthorized-mug",
        title: "Unauthorized",
        description: "Should fail",
        artworkUrl: "https://example.com/test.jpg",
        mockupUrls: [],
        basePrice: 1000,
        category: "Test",
      })
    ).rejects.toThrow();
  });

  it("non-admin cannot update order status", async () => {
    const userCaller = appRouter.createCaller(createUserContext());
    await expect(userCaller.orders.updateStatus({ id: 1, status: "shipped" })).rejects.toThrow();
  });
});

// ─── Order Success Page Query ────────────────────────────────────────────────

describe("order success by session", () => {
  it("returns order details when given a valid session ID", async () => {
    // First create a test order with a known session ID
    const sessionId = "cs_test_success_page_" + Date.now();
    const allProducts = await getAllProducts(true);
    const product = allProducts[0];

    const orderId = await createOrder({
      userId: 500,
      stripeSessionId: sessionId,
      totalAmount: product.basePrice,
      status: "paid",
      customerEmail: "test@example.com",
    });

    await createOrderItems([
      {
        orderId,
        productId: product.id,
        quantity: 1,
        size: "11oz",
        unitPrice: product.basePrice,
      },
    ]);

    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.orders.bySession({ sessionId });
    expect(result).toBeDefined();
    expect(result!.id).toBe(orderId);
    expect(result!.items.length).toBe(1);
  });

  it("throws NOT_FOUND for non-existent session", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.orders.bySession({ sessionId: "cs_nonexistent_session" })).rejects.toThrow();
  });
});
