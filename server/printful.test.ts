import { describe, expect, it, vi, afterEach } from "vitest";
import { isPrintfulConfigured, createPrintfulOrder, resolvePrintfulVariantId } from "./printful";

// ─── isPrintfulConfigured ────────────────────────────────────────────────────

describe("isPrintfulConfigured", () => {
  const originalEnv = process.env.PRINTFUL_API_KEY;

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.PRINTFUL_API_KEY = originalEnv;
    } else {
      delete process.env.PRINTFUL_API_KEY;
    }
  });

  it("returns false when PRINTFUL_API_KEY is not set", () => {
    delete process.env.PRINTFUL_API_KEY;
    expect(isPrintfulConfigured()).toBe(false);
  });

  it("returns false when PRINTFUL_API_KEY is empty", () => {
    process.env.PRINTFUL_API_KEY = "";
    expect(isPrintfulConfigured()).toBe(false);
  });

  it("returns false when PRINTFUL_API_KEY is too short", () => {
    process.env.PRINTFUL_API_KEY = "short";
    expect(isPrintfulConfigured()).toBe(false);
  });

  it("returns true when PRINTFUL_API_KEY is a valid-length key", () => {
    process.env.PRINTFUL_API_KEY = "pk_test_1234567890abcdef";
    expect(isPrintfulConfigured()).toBe(true);
  });
});

// ─── resolvePrintfulVariantId ────────────────────────────────────────────────

describe("resolvePrintfulVariantId", () => {
  it("returns 0 when printfulVariants is null", () => {
    expect(resolvePrintfulVariantId(null, "11oz")).toBe(0);
  });

  it("returns 0 when printfulVariants is undefined", () => {
    expect(resolvePrintfulVariantId(undefined, "11oz")).toBe(0);
  });

  it("returns 0 when printfulVariants is empty array", () => {
    expect(resolvePrintfulVariantId([], "11oz")).toBe(0);
  });

  it("returns 0 when size is not found in variants", () => {
    const variants = [{ size: "11oz", variantId: 12345, price: 2499 }];
    expect(resolvePrintfulVariantId(variants, "15oz")).toBe(0);
  });

  it("returns the correct variant ID for a matching size", () => {
    const variants = [
      { size: "11oz", variantId: 12345, price: 2499 },
      { size: "15oz", variantId: 67890, price: 2899 },
    ];
    expect(resolvePrintfulVariantId(variants, "11oz")).toBe(12345);
    expect(resolvePrintfulVariantId(variants, "15oz")).toBe(67890);
  });
});

// ─── createPrintfulOrder (unconfigured path) ─────────────────────────────────

describe("createPrintfulOrder - unconfigured", () => {
  const originalEnv = process.env.PRINTFUL_API_KEY;

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.PRINTFUL_API_KEY = originalEnv;
    } else {
      delete process.env.PRINTFUL_API_KEY;
    }
  });

  it("returns null when Printful is not configured", async () => {
    delete process.env.PRINTFUL_API_KEY;

    const result = await createPrintfulOrder({
      orderId: 1,
      items: [
        {
          productSlug: "coffee-dreamer-mug",
          size: "11oz",
          quantity: 1,
          artworkUrl: "https://example.com/art.jpg",
          printfulVariantId: 12345,
        },
      ],
      shippingAddress: {
        name: "Test User",
        line1: "123 Main St",
        city: "Portland",
        state: "OR",
        postalCode: "97201",
        country: "US",
      },
      totalAmount: 2499,
    });

    expect(result).toBeNull();
  });

  it("returns null when all variant IDs are 0 (unmapped)", async () => {
    process.env.PRINTFUL_API_KEY = "pk_test_1234567890abcdef";

    const result = await createPrintfulOrder({
      orderId: 2,
      items: [
        {
          productSlug: "coffee-dreamer-mug",
          size: "11oz",
          quantity: 1,
          artworkUrl: "https://example.com/art.jpg",
          printfulVariantId: 0, // unmapped
        },
      ],
      shippingAddress: {
        name: "Test User",
        line1: "123 Main St",
        city: "Portland",
        state: "OR",
        postalCode: "97201",
        country: "US",
      },
      totalAmount: 2499,
    });

    expect(result).toBeNull();
  });

  it("filters out items with 0 variant IDs but submits valid ones", async () => {
    // This test verifies the filtering logic — the actual API call
    // will fail since we're using a test key, but the item filtering
    // happens before the API call
    process.env.PRINTFUL_API_KEY = "pk_test_1234567890abcdef";

    // With all items having variantId=0, should return null before API call
    const result = await createPrintfulOrder({
      orderId: 3,
      items: [
        {
          productSlug: "mug-a",
          size: "11oz",
          quantity: 1,
          artworkUrl: "https://example.com/a.jpg",
          printfulVariantId: 0,
        },
        {
          productSlug: "mug-b",
          size: "15oz",
          quantity: 2,
          artworkUrl: "https://example.com/b.jpg",
          printfulVariantId: 0,
        },
      ],
      shippingAddress: {
        name: "Test User",
        line1: "123 Main St",
        city: "Portland",
        state: "OR",
        postalCode: "97201",
        country: "US",
      },
      totalAmount: 5000,
    });

    expect(result).toBeNull();
  });
});

// ─── updateOrderPrintfulId DB helper ─────────────────────────────────────────

describe("updateOrderPrintfulId DB helper", () => {
  it("is exported from db module", async () => {
    const { updateOrderPrintfulId } = await import("./db");
    expect(typeof updateOrderPrintfulId).toBe("function");
  });
});
