import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Shop() {
  const productsQuery = trpc.products.list.useQuery();

  return (
    <Layout>
      <div className="container py-10">
        <div className="mb-8">
          <p className="font-typewriter text-xs tracking-widest uppercase text-muted-foreground mb-1">
            the collection
          </p>
          <h1 className="font-sketch text-4xl md:text-5xl">Shop All Designs</h1>
          <p className="font-typewriter text-sm text-muted-foreground mt-2 max-w-lg">
            Each mug features an original folk art painting by Mary Wolford. Printed on demand on premium ceramic.
          </p>
        </div>

        <div className="border-b-2 border-dashed border-border mb-8" />

        {productsQuery.isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : productsQuery.data && productsQuery.data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {productsQuery.data.map((product, i) => {
              const mockups = (product.mockupUrls as string[]) || [];
              const imgUrl = mockups[0] || product.artworkUrl;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
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
            })}
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
