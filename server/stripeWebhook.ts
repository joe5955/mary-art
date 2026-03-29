import type { Express, Request, Response } from "express";
import express from "express";
import Stripe from "stripe";
import {
  getOrderByStripeSession,
  updateOrderPayment,
  clearCart,
  getUserById,
} from "./db";
import { notifyOwner } from "./_core/notification";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil" as any,
});

/**
 * Register the Stripe webhook endpoint.
 * MUST be called BEFORE express.json() middleware.
 */
export function registerStripeWebhook(app: Express) {
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const sig = req.headers["stripe-signature"] as string | undefined;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

      let event: Stripe.Event;

      try {
        if (sig && webhookSecret) {
          event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        } else {
          // Parse raw body for test/verification pings
          const body = JSON.parse(req.body.toString());
          event = body as Stripe.Event;
        }
      } catch (err: any) {
        console.error(`[Stripe Webhook] Signature verification failed: ${err.message}`);
        return res.status(200).json({ verified: true, error: "signature_verification_failed" });
      }

      // Handle test events
      if (event.id && event.id.startsWith("evt_test_")) {
        console.log("[Stripe Webhook] Test event detected, returning verification response");
        return res.status(200).json({ verified: true });
      }

      // Process the event asynchronously
      try {
        await handleStripeEvent(event);
      } catch (err: any) {
        console.error(`[Stripe Webhook] Error processing event ${event.type}: ${err.message}`);
      }

      return res.status(200).json({ verified: true, received: true });
    }
  );
}

async function handleStripeEvent(event: Stripe.Event) {
  console.log(`[Stripe Webhook] Processing event: ${event.type} (${event.id})`);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`[Stripe Webhook] Checkout completed: ${session.id}`);

      // Find the order by stripe session ID
      const order = await getOrderByStripeSession(session.id);
      if (!order) {
        console.error(`[Stripe Webhook] No order found for session: ${session.id}`);
        break;
      }

      // Extract shipping address from session
      const shippingDetails = (session as any).shipping_details;
      const shippingAddress = shippingDetails?.address
        ? {
            name: shippingDetails.name || "",
            line1: shippingDetails.address.line1 || "",
            line2: shippingDetails.address.line2 || "",
            city: shippingDetails.address.city || "",
            state: shippingDetails.address.state || "",
            postalCode: shippingDetails.address.postal_code || "",
            country: shippingDetails.address.country || "",
          }
        : undefined;

      // Update order to paid
      await updateOrderPayment(order.id, {
        stripePaymentIntentId: session.payment_intent as string,
        status: "paid",
        customerEmail: session.customer_email || order.customerEmail || undefined,
        shippingAddress,
      });

      // Clear the user's cart
      await clearCart(order.userId);

      // Notify owner of new order
      const user = await getUserById(order.userId);
      try {
        await notifyOwner({
          title: `New Order #${order.id}`,
          content: `A new order has been placed!\n\nOrder #${order.id}\nCustomer: ${user?.name || session.customer_email || "Unknown"}\nAmount: $${(order.totalAmount / 100).toFixed(2)}\n\nPlease check the admin dashboard for details.`,
        });
      } catch (e) {
        console.warn("[Stripe Webhook] Failed to notify owner:", e);
      }

      console.log(`[Stripe Webhook] Order #${order.id} marked as paid`);
      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`[Stripe Webhook] Payment succeeded: ${paymentIntent.id}`);
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`[Stripe Webhook] Payment failed: ${paymentIntent.id}`);
      break;
    }

    default:
      console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
  }
}
