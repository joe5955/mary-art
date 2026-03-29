import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  pending: "text-[oklch(0.65_0.15_55)]",
  paid: "text-[oklch(0.55_0.15_250)]",
  processing: "text-[oklch(0.55_0.15_250)]",
  shipped: "text-[oklch(0.55_0.12_150)]",
  delivered: "text-[oklch(0.55_0.12_150)]",
  cancelled: "text-destructive",
  refunded: "text-muted-foreground",
};

export default function MyOrders() {
  const { isAuthenticated } = useAuth();
  const ordersQuery = trpc.orders.myOrders.useQuery(undefined, { enabled: isAuthenticated });

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h1 className="font-sketch text-3xl mb-3">My Orders</h1>
          <p className="font-typewriter text-sm text-muted-foreground mb-6">
            Sign in to view your order history.
          </p>
          <a href={getLoginUrl()}>
            <Button className="sketch-border bg-foreground text-background font-typewriter text-sm px-6 py-5">
              Sign In
            </Button>
          </a>
        </div>
      </Layout>
    );
  }

  const orders = ordersQuery.data || [];

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="font-sketch text-3xl md:text-4xl mb-6">My Orders</h1>

        {ordersQuery.isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="font-sketch text-2xl text-muted-foreground mb-2">No orders yet</p>
            <p className="font-typewriter text-sm text-muted-foreground mb-6">
              Your first art mug is waiting!
            </p>
            <Link href="/shop">
              <Button className="sketch-border bg-foreground text-background font-typewriter text-sm px-6 py-5">
                Start Shopping <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
              >
                <Link href={`/orders/${order.id}`}>
                  <div className="sketch-border-light p-5 hover:sketch-border transition-all duration-200 cursor-pointer">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-sketch text-lg">Order #{order.id}</h3>
                        <p className="font-typewriter text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-typewriter text-sm font-bold">
                          ${(order.totalAmount / 100).toFixed(2)}
                        </p>
                        <p className={`font-typewriter text-xs capitalize font-bold ${statusColors[order.status] || "text-muted-foreground"}`}>
                          {order.status}
                        </p>
                      </div>
                    </div>
                    {order.trackingNumber && (
                      <p className="font-typewriter text-xs text-muted-foreground mt-2">
                        Tracking: {order.trackingNumber}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
