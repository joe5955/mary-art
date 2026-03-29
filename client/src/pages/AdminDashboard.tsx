import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Loader2,
  Package,
  DollarSign,
  ShoppingBag,
  Plus,
  Pencil,
  Trash2,
  Truck,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-sketch text-3xl mb-3">Access Denied</h1>
          <p className="font-typewriter text-sm text-muted-foreground">
            This page is restricted to administrators.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="font-sketch text-3xl md:text-4xl mb-6">Admin Dashboard</h1>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="overview" className="font-typewriter text-xs">Overview</TabsTrigger>
            <TabsTrigger value="products" className="font-typewriter text-xs">Products</TabsTrigger>
            <TabsTrigger value="orders" className="font-typewriter text-xs">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>
          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>
          <TabsContent value="orders">
            <OrdersTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

function OverviewTab() {
  const statsQuery = trpc.orders.stats.useQuery();
  const stats = statsQuery.data;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[
        {
          icon: ShoppingBag,
          label: "Total Orders",
          value: stats?.totalOrders ?? "...",
          color: "text-[oklch(0.55_0.15_250)]",
        },
        {
          icon: DollarSign,
          label: "Total Revenue",
          value: stats ? `$${(Number(stats.totalRevenue) / 100).toFixed(2)}` : "...",
          color: "text-[oklch(0.55_0.12_150)]",
        },
        {
          icon: Package,
          label: "Pending Orders",
          value: stats?.pendingOrders ?? "...",
          color: "text-[oklch(0.65_0.15_55)]",
        },
      ].map((stat) => (
        <div key={stat.label} className="sketch-border p-6">
          <stat.icon className={`h-8 w-8 mb-3 ${stat.color}`} />
          <p className="font-typewriter text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
          <p className="font-sketch text-3xl mt-1">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

function ProductsTab() {
  const productsQuery = trpc.products.listAll.useQuery();
  const createMutation = trpc.products.create.useMutation();
  const updateMutation = trpc.products.update.useMutation();
  const deleteMutation = trpc.products.delete.useMutation();
  const genDescMutation = trpc.products.generateDescription.useMutation();
  const utils = trpc.useUtils();
  const [showAdd, setShowAdd] = useState(false);
  const [generatingId, setGeneratingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    slug: "",
    title: "",
    description: "",
    artworkUrl: "",
    mockupUrls: "",
    basePrice: "2495",
    category: "Coffee Mugs",
  });

  const handleCreate = async () => {
    try {
      const mockupArr = form.mockupUrls
        .split(",")
        .map((u) => u.trim())
        .filter(Boolean);
      await createMutation.mutateAsync({
        slug: form.slug,
        title: form.title,
        description: form.description,
        artworkUrl: form.artworkUrl,
        mockupUrls: mockupArr,
        basePrice: parseInt(form.basePrice),
        category: form.category,
      });
      utils.products.listAll.invalidate();
      utils.products.list.invalidate();
      setShowAdd(false);
      setForm({ slug: "", title: "", description: "", artworkUrl: "", mockupUrls: "", basePrice: "2495", category: "Coffee Mugs" });
      toast.success("Product created!");
    } catch (e: any) {
      toast.error(e.message || "Failed to create product");
    }
  };

  const toggleActive = async (id: number, currentActive: number) => {
    try {
      await updateMutation.mutateAsync({ id, isActive: currentActive ? 0 : 1 });
      utils.products.listAll.invalidate();
      utils.products.list.invalidate();
      toast.success(currentActive ? "Product hidden" : "Product visible");
    } catch (e: any) {
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure? This will hide the product.")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      utils.products.listAll.invalidate();
      utils.products.list.invalidate();
      toast.success("Product removed");
    } catch (e: any) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-sketch text-2xl">Products</h2>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button className="sketch-border bg-foreground text-background font-typewriter text-xs">
              <Plus className="mr-1 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg bg-card">
            <DialogHeader>
              <DialogTitle className="font-sketch text-xl">Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="font-typewriter text-xs">Slug</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="coffee-dreamer-mug" className="font-typewriter text-sm" />
              </div>
              <div>
                <Label className="font-typewriter text-xs">Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Coffee Dreamer Mug" className="font-typewriter text-sm" />
              </div>
              <div>
                <Label className="font-typewriter text-xs">Description</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="A beautiful mug..." className="font-typewriter text-sm" />
              </div>
              <div>
                <Label className="font-typewriter text-xs">Artwork URL</Label>
                <Input value={form.artworkUrl} onChange={(e) => setForm({ ...form, artworkUrl: e.target.value })} placeholder="https://..." className="font-typewriter text-sm" />
              </div>
              <div>
                <Label className="font-typewriter text-xs">Mockup URLs (comma-separated)</Label>
                <Input value={form.mockupUrls} onChange={(e) => setForm({ ...form, mockupUrls: e.target.value })} placeholder="https://..., https://..." className="font-typewriter text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-typewriter text-xs">Price (cents)</Label>
                  <Input type="number" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} className="font-typewriter text-sm" />
                </div>
                <div>
                  <Label className="font-typewriter text-xs">Category</Label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="font-typewriter text-sm" />
                </div>
              </div>
              <Button onClick={handleCreate} disabled={createMutation.isPending} className="w-full sketch-border bg-foreground text-background font-typewriter text-sm">
                {createMutation.isPending ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {productsQuery.isLoading ? (
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
      ) : (
        <div className="space-y-3">
          {productsQuery.data?.map((p) => {
            const mockups = (p.mockupUrls as string[]) || [];
            const imgUrl = mockups[0] || p.artworkUrl;
            return (
              <div key={p.id} className="sketch-border-light p-4 flex items-center gap-4">
                <div className="w-16 h-12 overflow-hidden rounded-sm flex-shrink-0">
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-typewriter text-sm font-bold">{p.title}</p>
                  <p className="font-typewriter text-xs text-muted-foreground">
                    ${(p.basePrice / 100).toFixed(2)} | {p.category || "Uncategorized"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      setGeneratingId(p.id);
                      try {
                        await genDescMutation.mutateAsync({ id: p.id });
                        utils.products.listAll.invalidate();
                        utils.products.list.invalidate();
                        toast.success(`AI description generated for "${p.title}"!`);
                      } catch (e: any) {
                        toast.error(e.message || "Failed to generate description");
                      } finally {
                        setGeneratingId(null);
                      }
                    }}
                    className="p-2 hover:bg-secondary rounded text-[oklch(0.55_0.15_250)]"
                    title="Generate AI description"
                    disabled={generatingId === p.id}
                  >
                    {generatingId === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => toggleActive(p.id, p.isActive)}
                    className="p-2 hover:bg-secondary rounded"
                    title={p.isActive ? "Hide product" : "Show product"}
                  >
                    {p.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-secondary rounded text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OrdersTab() {
  const ordersQuery = trpc.orders.listAll.useQuery();
  const updateStatusMutation = trpc.orders.updateStatus.useMutation();
  const updateTrackingMutation = trpc.orders.updateTracking.useMutation();
  const utils = trpc.useUtils();
  const [trackingForm, setTrackingForm] = useState<{ id: number; number: string; url: string } | null>(null);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
      utils.orders.listAll.invalidate();
      utils.orders.stats.invalidate();
      toast.success(`Order #${id} updated to ${status}`);
    } catch (e: any) {
      toast.error("Failed to update status");
    }
  };

  const handleAddTracking = async () => {
    if (!trackingForm) return;
    try {
      await updateTrackingMutation.mutateAsync({
        id: trackingForm.id,
        trackingNumber: trackingForm.number,
        trackingUrl: trackingForm.url || undefined,
      });
      utils.orders.listAll.invalidate();
      setTrackingForm(null);
      toast.success("Tracking added!");
    } catch (e: any) {
      toast.error("Failed to add tracking");
    }
  };

  const statusColors: Record<string, string> = {
    pending: "bg-[oklch(0.65_0.15_55/0.2)] text-[oklch(0.55_0.15_55)]",
    paid: "bg-[oklch(0.55_0.15_250/0.2)] text-[oklch(0.45_0.15_250)]",
    processing: "bg-[oklch(0.55_0.15_250/0.2)] text-[oklch(0.45_0.15_250)]",
    shipped: "bg-[oklch(0.55_0.12_150/0.2)] text-[oklch(0.45_0.12_150)]",
    delivered: "bg-[oklch(0.55_0.12_150/0.2)] text-[oklch(0.45_0.12_150)]",
    cancelled: "bg-destructive/10 text-destructive",
    refunded: "bg-muted text-muted-foreground",
  };

  return (
    <div>
      <h2 className="font-sketch text-2xl mb-6">All Orders</h2>

      {ordersQuery.isLoading ? (
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
      ) : ordersQuery.data && ordersQuery.data.length > 0 ? (
        <div className="space-y-3">
          {ordersQuery.data.map((order) => (
            <div key={order.id} className="sketch-border-light p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div>
                  <span className="font-sketch text-lg">Order #{order.id}</span>
                  <span className="font-typewriter text-xs text-muted-foreground ml-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-typewriter font-bold capitalize ${statusColors[order.status] || "bg-muted text-muted-foreground"}`}>
                    {order.status}
                  </span>
                  <span className="font-typewriter text-sm font-bold">
                    ${(order.totalAmount / 100).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {order.customerEmail && (
                  <span className="font-typewriter text-xs text-muted-foreground">{order.customerEmail}</span>
                )}
                <div className="flex-1" />
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="font-typewriter text-xs border border-border rounded px-2 py-1 bg-background"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
                {!order.trackingNumber && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-typewriter text-xs"
                    onClick={() => setTrackingForm({ id: order.id, number: "", url: "" })}
                  >
                    <Truck className="mr-1 h-3 w-3" /> Add Tracking
                  </Button>
                )}
                {order.trackingNumber && (
                  <span className="font-typewriter text-xs text-muted-foreground">
                    Tracking: {order.trackingNumber}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="font-typewriter text-sm text-muted-foreground text-center py-10">No orders yet.</p>
      )}

      {/* Tracking Dialog */}
      <Dialog open={!!trackingForm} onOpenChange={(open) => !open && setTrackingForm(null)}>
        <DialogContent className="max-w-sm bg-card">
          <DialogHeader>
            <DialogTitle className="font-sketch text-xl">Add Tracking</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="font-typewriter text-xs">Tracking Number</Label>
              <Input
                value={trackingForm?.number || ""}
                onChange={(e) => setTrackingForm((prev) => prev ? { ...prev, number: e.target.value } : null)}
                className="font-typewriter text-sm"
              />
            </div>
            <div>
              <Label className="font-typewriter text-xs">Tracking URL (optional)</Label>
              <Input
                value={trackingForm?.url || ""}
                onChange={(e) => setTrackingForm((prev) => prev ? { ...prev, url: e.target.value } : null)}
                className="font-typewriter text-sm"
                placeholder="https://..."
              />
            </div>
            <Button onClick={handleAddTracking} disabled={updateTrackingMutation.isPending} className="w-full sketch-border bg-foreground text-background font-typewriter text-sm">
              {updateTrackingMutation.isPending ? "Saving..." : "Save Tracking"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
