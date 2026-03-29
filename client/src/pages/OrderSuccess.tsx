import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderSuccess() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const sessionId = params.get("session_id") || "";

  const orderQuery = trpc.orders.bySession.useQuery(
    { sessionId },
    { enabled: !!sessionId, retry: 3, retryDelay: 2000 }
  );

  return (
    <Layout>
      <div className="container py-16 max-w-2xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <CheckCircle className="h-16 w-16 mx-auto mb-6 text-[oklch(0.55_0.12_150)]" />
          <h1 className="font-sketch text-4xl mb-3">Thank You!</h1>
          <p className="font-typewriter text-base text-muted-foreground mb-8">
            Your order has been placed. We're getting your art-covered mug ready!
          </p>

          {orderQuery.isLoading ? (
            <div className="sketch-border-light p-6 mb-8">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
              <p className="font-typewriter text-sm text-muted-foreground mt-2">Loading order details...</p>
            </div>
          ) : orderQuery.data ? (
            <div className="sketch-border p-6 mb-8 text-left">
              <h2 className="font-sketch text-xl mb-4">Order #{orderQuery.data.id}</h2>
              <div className="space-y-2 font-typewriter text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="capitalize font-bold">{orderQuery.data.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span>${(orderQuery.data.totalAmount / 100).toFixed(2)}</span>
                </div>
              </div>
              {orderQuery.data.items && orderQuery.data.items.length > 0 && (
                <div className="mt-4 pt-4 border-t border-dashed border-border space-y-2">
                  {orderQuery.data.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between font-typewriter text-xs text-muted-foreground">
                      <span>{item.product?.title || "Product"} x{item.quantity} ({item.size})</span>
                      <span>${(item.unitPrice * item.quantity / 100).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/orders">
              <Button variant="outline" className="sketch-border-light bg-transparent font-typewriter text-sm px-6 py-5">
                <Package className="mr-2 h-4 w-4" /> View My Orders
              </Button>
            </Link>
            <Link href="/shop">
              <Button className="sketch-border bg-foreground text-background hover:bg-[oklch(0.40_0.02_60)] font-typewriter text-sm px-6 py-5">
                Keep Shopping <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
