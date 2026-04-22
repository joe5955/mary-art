import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Loader2, Coffee, ShoppingBag, Frame } from "lucide-react";
import { useMemo } from "react";

const VIGNETTE_COFFEE = "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/vignette_coffee_morning-HrkSN8LhqtgniEv9YDuSEc.webp";
const VIGNETTE_TOTE = "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/vignette_tote_lifestyle_v2-644EoWL6m7zZzzrCJYnDGX.webp";
const VIGNETTE_ART = "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/vignette_art_wall-bfLCMxjCerFtRQdgfoZThQ.webp";

interface VignetteProps {
  image: string;
  alt: string;
  quote: string;
  attribution: string;
  reverse?: boolean;
}

function LifestyleVignette({ image, alt, quote, attribution, reverse }: VignetteProps) {
  return (
    <div className="my-12 md:my-16">
      <div className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-6 md:gap-10`}>
        <motion.div
          className="w-full md:w-3/5 overflow-hidden rounded-sm"
          initial={{ opacity: 0, x: reverse ? 30 : -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={image}
            alt={alt}
            className="w-full h-auto object-cover rounded-sm"
            loading="lazy"
          />
        </motion.div>
        <motion.div
          className="w-full md:w-2/5 text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="border-l-4 border-[oklch(0.55_0.15_250)] pl-5 py-2">
            <p className="font-sketch text-xl md:text-2xl leading-relaxed italic text-foreground/80">
              "{quote}"
            </p>
            <p className="font-typewriter text-xs tracking-widest uppercase text-muted-foreground mt-3">
              — {attribution}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: {
    id: number;
    slug: string;
    title: string;
    category: string | null;
    basePrice: number;
    description: string | null;
    artworkUrl: string | null | undefined;
    mockupUrls: unknown;
  };
  index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
  const mockups = (product.mockupUrls as string[]) || [];
  const imgUrl = mockups[0] || product.artworkUrl || undefined;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: 0.05 * (index % 6) }}
    >
      <Link href={`/shop/${product.slug}`}>
        <div className="group sketch-border-light p-4 hover:sketch-border transition-all duration-200 cursor-pointer">
          <div className="aspect-square overflow-hidden rounded-sm mb-4 bg-white">
            <img
              src={imgUrl}
              alt={product.title}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-sketch text-xl leading-tight">{product.title}</h3>
              {product.category && (
                <p className="font-typewriter text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                  {product.category}
                </p>
              )}
            </div>
            <p className="font-typewriter text-sm font-bold text-[oklch(0.55_0.15_250)] whitespace-nowrap">
              ${(product.basePrice / 100).toFixed(2)}
            </p>
          </div>
          {product.description && (
            <p className="font-typewriter text-xs text-muted-foreground mt-2 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

interface CategorySectionProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  products: ProductCardProps["product"][];
}

function CategorySection({ title, subtitle, icon, products }: CategorySectionProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-[oklch(0.55_0.15_250)]">{icon}</span>
        <h2 className="font-sketch text-2xl md:text-3xl">{title}</h2>
      </div>
      <p className="font-typewriter text-sm text-muted-foreground mb-6 max-w-md">
        {subtitle}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </div>
  );
}

export default function Shop() {
  const productsQuery = trpc.products.list.useQuery();

  const { mugs, totes, prints } = useMemo(() => {
    const all = productsQuery.data || [];
    return {
      mugs: all.filter((p) => p.category === "Coffee Mugs"),
      totes: all.filter((p) => p.category === "Tote Bags"),
      prints: all.filter((p) => p.category === "Art Prints"),
    };
  }, [productsQuery.data]);

  return (
    <Layout>
      <div className="container py-10">
        <div className="mb-8">
          <p className="font-typewriter text-xs tracking-widest uppercase text-muted-foreground mb-1">
            the collection
          </p>
          <h1 className="font-sketch text-4xl md:text-5xl">Shop All Designs</h1>
          <p className="font-typewriter text-sm text-muted-foreground mt-2 max-w-lg">
            Original pop art by Mary Wolford — on coffee mugs, tote bags, and art prints. Each piece printed on demand with vibrant, lasting colors.
          </p>
        </div>

        <div className="border-b-2 border-dashed border-border mb-8" />

        {productsQuery.isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : productsQuery.data && productsQuery.data.length > 0 ? (
          <div>
            {/* Coffee Mugs Section */}
            {mugs.length > 0 && (
              <CategorySection
                title="Coffee Mugs"
                subtitle="Start your morning with original art. Dishwasher & microwave safe ceramic — available in 11oz and 15oz."
                icon={<Coffee className="h-6 w-6" />}
                products={mugs}
              />
            )}

            {/* Vignette: Morning coffee moment */}
            <LifestyleVignette
              image={VIGNETTE_COFFEE}
              alt="Woman enjoying morning coffee from a pop art mug"
              quote="There's something special about starting your day with a cup that makes you smile."
              attribution="The morning ritual"
            />

            {/* Tote Bags Section */}
            {totes.length > 0 && (
              <CategorySection
                title="Tote Bags"
                subtitle="Carry your style everywhere. Sturdy canvas totes with vivid, all-over pop art prints."
                icon={<ShoppingBag className="h-6 w-6" />}
                products={totes}
              />
            )}

            {/* Vignette: Tote bag out in the world */}
            <LifestyleVignette
              image={VIGNETTE_TOTE}
              alt="Woman carrying a pop art tote bag at a farmers market"
              quote="Art shouldn't just hang on a wall — it should go wherever you go."
              attribution="Take it with you"
              reverse
            />

            {/* Art Prints Section */}
            {prints.length > 0 && (
              <CategorySection
                title="Art Prints"
                subtitle="Museum-quality enhanced matte paper. Bold colors that transform any room."
                icon={<Frame className="h-6 w-6" />}
                products={prints}
              />
            )}

            {/* Vignette: Art print on the wall */}
            <LifestyleVignette
              image={VIGNETTE_ART}
              alt="Pop art print hanging in a stylish living room"
              quote="Every wall deserves a conversation piece. Make yours unforgettable."
              attribution="Make it yours"
            />
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-sketch text-2xl text-muted-foreground">No products yet</p>
            <p className="font-typewriter text-sm text-muted-foreground mt-2">
              Check back soon — new designs are always in the works!
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
