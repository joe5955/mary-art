import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const SIZE_SURCHARGE: Record<string, number> = {
  "11oz": 0,
  "15oz": 400,
};

export default function Cart() {
  const { isAuthenticated } = useAuth();
  const cartQuery = trpc.cart.list.useQuery(undefined, { enabled: isAuthenticated });
  const updateQty = trpc.cart.updateQuantity.useMutation();
  const removeItem = trpc.cart.remove.useMutation();
  const checkoutMutation = trpc.checkout.createSession.useMutation();
  const utils = trpc.useUtils();

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h1 className="font-sketch text-3xl mb-3">Your Cart</h1>
          <p className="font-typewriter text-sm text-muted-foreground mb-6">
            Sign in to view your cart and start shopping.
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

  const items = cartQuery.data || [];
  const getItemPrice = (item: typeof items[0]) => {
    const surcharge = SIZE_SURCHARGE[item.size || "11oz"] || 0;
    return item.product.basePrice + surcharge;
  };
  const total = items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);

  const handleUpdateQty = async (id: number, newQty: number) => {
    try {
      await updateQty.mutateAsync({ id, quantity: newQty });
      utils.cart.list.invalidate();
    } catch (e: any) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await removeItem.mutateAsync({ id });
      utils.cart.list.invalidate();
      toast.success("Item removed");
    } catch (e: any) {
      toast.error("Failed to remove item");
    }
  };

  const handleCheckout = async () => {
    try {
      const result = await checkoutMutation.mutateAsync();
      if (result.checkoutUrl) {
        toast.info("Redirecting to checkout...");
        window.open(result.checkoutUrl, "_blank");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to start checkout");
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <Link href="/shop">
          <Button variant="ghost" className="font-typewriter text-sm mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
          </Button>
        </Link>

        <h1 className="font-sketch text-3xl md:text-4xl mb-6">Your Cart</h1>

        {cartQuery.isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="font-sketch text-2xl text-muted-foreground mb-2">Your cart is empty</p>
            <p className="font-typewriter text-sm text-muted-foreground mb-6">
              Time to find your perfect mug!
            </p>
            <Link href="/shop">
              <Button className="sketch-border bg-foreground text-background font-typewriter text-sm px-6 py-5">
                Browse Designs
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, i) => {
                const mockups = (item.product.mockupUrls as string[]) || [];
                const imgUrl = mockups[0] || item.product.artworkUrl;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * i }}
                    className="sketch-border-light p-4 flex gap-4"
                  >
                    <Link href={`/shop/${item.product.slug}`}>
                      <div className="w-24 h-20 overflow-hidden rounded-sm flex-shrink-0 cursor-pointer">
                        <img src={imgUrl} alt={item.product.title} className="w-full h-full object-cover" />
                      </div>
                    </Link>
                    <div className="flex-1">
                      <Link href={`/shop/${item.product.slug}`}>
                        <h3 className="font-sketch text-lg cursor-pointer hover:text-[oklch(0.55_0.15_250)]">
                          {item.product.title}
                        </h3>
                      </Link>
                      <p className="font-typewriter text-xs text-muted-foreground">Size: {item.size}</p>
                      <p className="font-typewriter text-sm text-[oklch(0.55_0.15_250)] mt-1">
                        ${(getItemPrice(item) / 100).toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button onClick={() => handleRemove(item.id)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center border border-border rounded-sm hover:bg-secondary"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-typewriter text-sm w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center border border-border rounded-sm hover:bg-secondary"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sketch-border p-6 sticky top-24">
                <h2 className="font-sketch text-xl mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between font-typewriter text-xs text-muted-foreground">
                      <span className="truncate mr-2">{item.product.title} x{item.quantity}</span>
                      <span>${((getItemPrice(item) * item.quantity) / 100).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-dashed border-border pt-3 mb-4">
                  <div className="flex justify-between font-typewriter text-sm">
                    <span>Shipping</span>
                    <span className="text-muted-foreground">Calculated at checkout</span>
                  </div>
                </div>
                <div className="border-t border-border pt-3 mb-6">
                  <div className="flex justify-between font-sketch text-xl">
                    <span>Total</span>
                    <span>${(total / 100).toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={checkoutMutation.isPending}
                  className="w-full sketch-border bg-foreground text-background hover:bg-[oklch(0.40_0.02_60)] font-typewriter text-sm py-5"
                >
                  {checkoutMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </Button>
                <p className="font-typewriter text-xs text-muted-foreground text-center mt-3">
                  Secure checkout powered by Stripe
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
