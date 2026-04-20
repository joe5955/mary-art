import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ShoppingCart, ArrowLeft, Check } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";

const MUG_SIZES = [
  { value: "11oz", label: "11 oz — Standard", priceAdd: 0 },
  { value: "15oz", label: "15 oz — Large", priceAdd: 400 },
];

type CategoryKey = "Coffee Mugs" | "Tote Bags" | "Art Prints";

const PRODUCT_DETAILS: Record<CategoryKey, string[]> = {
  "Coffee Mugs": [
    "Premium white ceramic mug",
    "Dishwasher and microwave safe",
    "Vibrant, fade-resistant print",
    "Printed on demand — made just for you",
    "Ships within 3-7 business days",
  ],
  "Tote Bags": [
    "Premium natural canvas tote bag",
    "Sturdy cotton handles",
    "Spacious interior — perfect for everyday use",
    "Vibrant, fade-resistant print",
    "Printed on demand — made just for you",
    "Ships within 3-7 business days",
  ],
  "Art Prints": [
    "Museum-quality giclée print",
    "Printed on heavyweight matte paper",
    "Vibrant, true-to-art color reproduction",
    "Unframed — ready for your favorite frame",
    "Printed on demand — made just for you",
    "Ships within 3-7 business days",
  ],
};

function isCategoryKey(cat: string): cat is CategoryKey {
  return cat in PRODUCT_DETAILS;
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const productQuery = trpc.products.bySlug.useQuery({ slug: slug || "" }, { enabled: !!slug });
  const addToCartMutation = trpc.cart.add.useMutation();
  const utils = trpc.useUtils();

  const [selectedSize, setSelectedSize] = useState("11oz");
  const [selectedImage, setSelectedImage] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const product = productQuery.data;
  if (productQuery.isLoading) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3 mx-auto" />
            <div className="h-64 bg-muted rounded max-w-lg mx-auto" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-sketch text-3xl mb-4">Design Not Found</h1>
          <Link href="/shop">
            <Button variant="outline" className="font-typewriter text-sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const mockups = (product.mockupUrls as string[]) || [];
  const allImages = mockups.length > 0 ? mockups : [product.artworkUrl];
  const category = product.category || "Coffee Mugs";
  const isMug = category === "Coffee Mugs";

  // Only mugs have size options with surcharges
  const sizeInfo = isMug ? (MUG_SIZES.find((s) => s.value === selectedSize) || MUG_SIZES[0]) : null;
  const totalPrice = product.basePrice + (sizeInfo?.priceAdd || 0);

  // Get category-specific product details
  const details = isCategoryKey(category) ? PRODUCT_DETAILS[category] : PRODUCT_DETAILS["Coffee Mugs"];

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        quantity: 1,
        size: isMug ? selectedSize : "standard",
      });
      utils.cart.list.invalidate();
      setJustAdded(true);
      toast.success("Added to cart!");
      setTimeout(() => setJustAdded(false), 2000);
    } catch (e: any) {
      toast.error(e.message || "Failed to add to cart");
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <Link href="/shop">
          <Button variant="ghost" className="font-typewriter text-sm mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <div className="sketch-border overflow-hidden mb-4 bg-white">
              <img
                src={allImages[selectedImage]}
                alt={product.title}
                className="w-full h-auto object-contain"
              />
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-3">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-16 overflow-hidden rounded-sm border-2 transition-all ${
                      i === selectedImage
                        ? "border-foreground shadow-md"
                        : "border-border opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {product.category && (
              <p className="font-typewriter text-xs tracking-widest uppercase text-muted-foreground mb-2">
                {product.category}
              </p>
            )}
            <h1 className="font-sketch text-3xl md:text-4xl mb-3">{product.title}</h1>
            <p className="font-typewriter text-2xl text-[oklch(0.55_0.15_250)] mb-6">
              ${(totalPrice / 100).toFixed(2)}
            </p>

            {product.description && (
              <div className="mb-6">
                <p className="font-typewriter text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Size selector — only for mugs */}
            {isMug && (
              <div className="border-t border-dashed border-border pt-6 mb-6">
                <h3 className="font-sketch text-lg mb-3">Select Size</h3>
                <div className="flex gap-3">
                  {MUG_SIZES.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setSelectedSize(size.value)}
                      className={`px-4 py-3 rounded-sm font-typewriter text-sm transition-all ${
                        selectedSize === size.value
                          ? "sketch-border bg-card font-bold"
                          : "sketch-border-light hover:bg-secondary"
                      }`}
                    >
                      {size.label}
                      {size.priceAdd > 0 && (
                        <span className="text-muted-foreground ml-1">(+${(size.priceAdd / 100).toFixed(2)})</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending || justAdded}
              className="w-full sketch-border bg-foreground text-background hover:bg-[oklch(0.40_0.02_60)] font-typewriter text-sm py-6"
            >
              {justAdded ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Added to Cart
                </>
              ) : addToCartMutation.isPending ? (
                "Adding..."
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </>
              )}
            </Button>

            <div className="mt-8 space-y-3 sketch-border-light p-4">
              <h4 className="font-sketch text-base">Product Details</h4>
              <ul className="space-y-1 font-typewriter text-xs text-muted-foreground">
                {details.map((detail, i) => (
                  <li key={i}>- {detail}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
