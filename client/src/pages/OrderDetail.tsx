import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, ExternalLink } from "lucide-react";

const statusSteps = ["pending", "paid", "processing", "shipped", "delivered"];

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const orderQuery = trpc.orders.byId.useQuery(
    { id: parseInt(id || "0") },
    { enabled: isAuthenticated && !!id }
  );

  const order = orderQuery.data;

  if (orderQuery.isLoading) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-sketch text-3xl mb-4">Order Not Found</h1>
          <Link href="/orders">
            <Button variant="outline" className="font-typewriter text-sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const currentStep = statusSteps.indexOf(order.status);

  return (
    <Layout>
      <div className="container py-8 max-w-3xl mx-auto">
        <Link href="/orders">
          <Button variant="ghost" className="font-typewriter text-sm mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Button>
        </Link>

        <h1 className="font-sketch text-3xl mb-2">Order #{order.id}</h1>
        <p className="font-typewriter text-sm text-muted-foreground mb-6">
          Placed on{" "}
          {new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        {/* Status Progress */}
        {order.status !== "cancelled" && order.status !== "refunded" && (
          <div className="sketch-border p-6 mb-6">
            <h2 className="font-sketch text-lg mb-4">Order Status</h2>
            <div className="flex items-center justify-between">
              {statusSteps.map((step, i) => (
                <div key={step} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        i <= currentStep
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span className="font-typewriter text-[10px] mt-1 capitalize hidden sm:block">
                      {step}
                    </span>
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div
                      className={`h-0.5 w-8 sm:w-12 mx-1 ${
                        i < currentStep ? "bg-foreground" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tracking */}
        {order.trackingNumber && (
          <div className="sketch-border-light p-4 mb-6">
            <h3 className="font-sketch text-base mb-2">Tracking Information</h3>
            <p className="font-typewriter text-sm">
              Tracking #: <span className="font-bold">{order.trackingNumber}</span>
            </p>
            {order.trackingUrl && (
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-typewriter text-sm text-[oklch(0.55_0.15_250)] inline-flex items-center gap-1 mt-1"
              >
                Track Package <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        )}

        {/* Order Items */}
        <div className="sketch-border p-6 mb-6">
          <h2 className="font-sketch text-lg mb-4">Items</h2>
          <div className="space-y-3">
            {order.items?.map((item: any) => {
              const mockups = (item.product?.mockupUrls as string[]) || [];
              const imgUrl = mockups[0] || item.product?.artworkUrl || "";
              return (
                <div key={item.id} className="flex gap-3 items-center">
                  {imgUrl && (
                    <div className="w-16 h-12 overflow-hidden rounded-sm flex-shrink-0">
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-typewriter text-sm">{item.product?.title || "Product"}</p>
                    <p className="font-typewriter text-xs text-muted-foreground">
                      Size: {item.size} | Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-typewriter text-sm">
                    ${((item.unitPrice * item.quantity) / 100).toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="border-t border-dashed border-border mt-4 pt-4">
            <div className="flex justify-between font-sketch text-lg">
              <span>Total</span>
              <span>${(order.totalAmount / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="sketch-border-light p-4">
            <h3 className="font-sketch text-base mb-2">Shipping Address</h3>
            <div className="font-typewriter text-sm text-muted-foreground">
              {(() => {
                const addr = order.shippingAddress as any;
                return (
                  <>
                    {addr.name && <p>{addr.name}</p>}
                    {addr.line1 && <p>{addr.line1}</p>}
                    {addr.line2 && <p>{addr.line2}</p>}
                    <p>
                      {[addr.city, addr.state, addr.postalCode].filter(Boolean).join(", ")}
                    </p>
                    {addr.country && <p>{addr.country}</p>}
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
