/**
 * Printful Print-on-Demand Integration
 *
 * This module handles creating orders on Printful when a customer completes payment.
 * Variant IDs are stored on each product's `printfulVariants` JSON field in the database.
 * Admin can configure them via the Admin Dashboard → Products → Edit.
 *
 * SETUP:
 * 1. Create a Printful account at https://www.printful.com
 * 2. Get your API key from Dashboard → Settings → API
 * 3. Add the key as PRINTFUL_API_KEY in Settings → Secrets
 * 4. Set up your products in Printful's product catalog
 * 5. Enter variant IDs in the Admin Dashboard for each product/size
 */

import axios from "axios";

const PRINTFUL_API_URL = "https://api.printful.com";

interface PrintfulShippingAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state_code: string;
  zip: string;
  country_code: string;
  email?: string;
}

interface PrintfulOrderItem {
  variant_id: number;
  quantity: number;
  files: Array<{
    type: string;
    url: string;
  }>;
}

interface PrintfulOrderRequest {
  recipient: PrintfulShippingAddress;
  items: PrintfulOrderItem[];
  retail_costs?: {
    currency: string;
    subtotal: string;
    total: string;
    shipping: string;
  };
}

function getApiKey(): string | null {
  return process.env.PRINTFUL_API_KEY || null;
}

function isConfigured(): boolean {
  const key = getApiKey();
  return !!key && key.length > 10;
}

/**
 * Create an order on Printful for fulfillment.
 * Returns the Printful order ID if successful, or null if Printful is not configured
 * or no items have valid variant mappings.
 *
 * Each item must include a `printfulVariantId` resolved from the product's
 * `printfulVariants` JSON field in the database.
 */
export async function createPrintfulOrder(params: {
  orderId: number;
  items: Array<{
    productSlug: string;
    size: string;
    quantity: number;
    artworkUrl: string;
    printfulVariantId: number; // Resolved from product.printfulVariants in DB
  }>;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  customerEmail?: string;
  totalAmount: number; // in cents
}): Promise<{ printfulOrderId: number; status: string } | null> {
  const apiKey = getApiKey();

  if (!apiKey || !isConfigured()) {
    console.log("[Printful] API key not configured — skipping order creation. Set PRINTFUL_API_KEY in Settings → Secrets.");
    return null;
  }

  // Build Printful order items, filtering out any without valid variant IDs
  const printfulItems: PrintfulOrderItem[] = params.items
    .map((item) => {
      if (!item.printfulVariantId || item.printfulVariantId === 0) {
        console.warn(
          `[Printful] No variant ID for ${item.productSlug} (${item.size}). ` +
            `Set printfulVariants on this product in the Admin Dashboard.`
        );
        return null;
      }

      return {
        variant_id: item.printfulVariantId,
        quantity: item.quantity,
        files: [
          {
            type: "default", // Front print
            url: item.artworkUrl,
          },
        ],
      };
    })
    .filter(Boolean) as PrintfulOrderItem[];

  if (printfulItems.length === 0) {
    console.warn("[Printful] No valid items to submit. Configure printfulVariants on products in Admin Dashboard.");
    return null;
  }

  const orderRequest: PrintfulOrderRequest = {
    recipient: {
      name: params.shippingAddress.name,
      address1: params.shippingAddress.line1,
      address2: params.shippingAddress.line2,
      city: params.shippingAddress.city,
      state_code: params.shippingAddress.state,
      zip: params.shippingAddress.postalCode,
      country_code: params.shippingAddress.country,
      email: params.customerEmail,
    },
    items: printfulItems,
  };

  try {
    const response = await axios.post(
      `${PRINTFUL_API_URL}/orders`,
      orderRequest,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        params: {
          confirm: false, // Don't auto-confirm — allows review in Printful dashboard
        },
      }
    );

    const printfulOrder = response.data.result;
    console.log(`[Printful] Order created: #${printfulOrder.id} (status: ${printfulOrder.status})`);

    return {
      printfulOrderId: printfulOrder.id,
      status: printfulOrder.status,
    };
  } catch (error: any) {
    const errorMsg = error.response?.data?.result || error.message;
    console.error(`[Printful] Failed to create order for #${params.orderId}:`, errorMsg);
    throw new Error(`Printful order creation failed: ${errorMsg}`);
  }
}

/**
 * Get the status of a Printful order.
 */
export async function getPrintfulOrderStatus(printfulOrderId: number): Promise<string | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  try {
    const response = await axios.get(`${PRINTFUL_API_URL}/orders/${printfulOrderId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    return response.data.result.status;
  } catch (error: any) {
    console.error(`[Printful] Failed to get order status for #${printfulOrderId}:`, error.message);
    return null;
  }
}

/**
 * Resolve the Printful variant ID for a given product and size
 * from the product's printfulVariants JSON field.
 */
export function resolvePrintfulVariantId(
  printfulVariants: Array<{ size: string; variantId: number; price: number }> | null | undefined,
  size: string
): number {
  if (!printfulVariants || !Array.isArray(printfulVariants)) return 0;
  const match = printfulVariants.find((v) => v.size === size);
  return match?.variantId || 0;
}

/**
 * Check if Printful integration is properly configured.
 */
export function isPrintfulConfigured(): boolean {
  return isConfigured();
}
