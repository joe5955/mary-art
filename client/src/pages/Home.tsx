import Layout from "@/components/Layout";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Palette, Truck, Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/hero_banner_coffee_mate-WkPy6Yh8AQ7WbVve6dGPQS.webp";
const ARTIST_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/artist_portrait-4LWq9LdafoHpvh5ggP8B2v.webp";

export default function Home() {
  const productsQuery = trpc.products.list.useQuery();
  const featured = productsQuery.data?.slice(0, 4) || [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-typewriter text-sm text-muted-foreground tracking-widest uppercase mb-2">
                ~ original folk art ~
              </p>
              <h1 className="font-sketch text-5xl md:text-7xl leading-tight mb-4">
                Art You Can
                <br />
                <span className="text-[oklch(0.55_0.15_250)]">Sip From</span>
              </h1>
              <p className="font-typewriter text-base text-muted-foreground max-w-md mb-6 leading-relaxed">
                Each mug features an original painting by Mary Wolford, printed on demand just for you. Bold brushstrokes, vibrant colors, and a story in every cup.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/shop">
                  <Button className="sketch-border bg-foreground text-background hover:bg-[oklch(0.40_0.02_60)] font-typewriter text-sm px-6 py-5">
                    Browse the Collection <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="sketch-border-light bg-transparent font-typewriter text-sm px-6 py-5">
                    Meet the Artist
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="sketch-border overflow-hidden">
                <img
                  src={HERO_IMG}
                  alt="Mary Wolford's artistic coffee mugs collection"
                  className="w-full h-auto object-cover"
                  loading="eager"
                />
              </div>
              <div className="absolute -top-3 -right-3 w-8 h-8 border-2 border-dashed border-[oklch(0.55_0.15_250)] rotate-12 opacity-60" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-[oklch(0.70_0.15_65)] rotate-45 opacity-40" />
            </motion.div>
          </div>
        </div>
        <div className="border-b-2 border-dashed border-border mx-8" />
      </section>

      {/* Value Props */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Palette, title: "Original Art", desc: "Every design is a unique painting by Mary Wolford" },
              { icon: Truck, title: "Print on Demand", desc: "Made fresh for each order, shipped to your door" },
              { icon: Heart, title: "Support an Artist", desc: "Your purchase directly supports independent art" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="sketch-border-light p-6 text-center"
              >
                <item.icon className="h-8 w-8 mx-auto mb-3 text-[oklch(0.55_0.15_250)]" />
                <h3 className="font-sketch text-xl mb-1">{item.title}</h3>
                <p className="font-typewriter text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-sketch text-3xl md:text-4xl">Featured Designs</h2>
              <p className="font-typewriter text-sm text-muted-foreground mt-1">Hand-picked favorites from the studio</p>
            </div>
            <Link href="/shop">
              <Button variant="ghost" className="font-typewriter text-sm">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {productsQuery.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="sketch-border-light p-3 animate-pulse">
                  <div className="aspect-[4/3] bg-muted rounded-sm mb-3" />
                  <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product, i) => {
                const mockups = (product.mockupUrls as string[]) || [];
                const imgUrl = mockups[0] || product.artworkUrl;
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * i }}
                  >
                    <Link href={`/shop/${product.slug}`}>
                      <div className="group sketch-border-light p-3 hover:sketch-border transition-all duration-200 cursor-pointer">
                        <div className="aspect-[4/3] overflow-hidden rounded-sm mb-3">
                          <img
                            src={imgUrl}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <h3 className="font-sketch text-lg leading-tight">{product.title}</h3>
                        <p className="font-typewriter text-sm text-[oklch(0.55_0.15_250)] mt-1">
                          ${(product.basePrice / 100).toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* About Preview */}
      <section className="py-12">
        <div className="border-t-2 border-dashed border-border mx-8 mb-12" />
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="sketch-border overflow-hidden">
              <img
                src={ARTIST_IMG}
                alt="Mary Wolford in her studio"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <p className="font-typewriter text-xs tracking-widest uppercase text-muted-foreground mb-2">
                the artist
              </p>
              <h2 className="font-sketch text-3xl md:text-4xl mb-4">Meet Mary Wolford</h2>
              <p className="font-typewriter text-sm text-muted-foreground leading-relaxed mb-4">
                Mary is a folk artist whose bold, expressive paintings capture the warmth and whimsy of everyday life. Her signature style blends thick impasto brushstrokes with vibrant blues, oranges, and creams, creating pieces that feel both familiar and magical.
              </p>
              <p className="font-typewriter text-sm text-muted-foreground leading-relaxed mb-6">
                Now, her original paintings come to life on premium coffee cups, so you can start every morning with a little art in your hands.
              </p>
              <Link href="/about">
                <Button variant="outline" className="sketch-border-light bg-transparent font-typewriter text-sm">
                  Read Her Story <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container text-center">
          <Sparkles className="h-8 w-8 mx-auto mb-4 text-[oklch(0.70_0.15_65)]" />
          <h2 className="font-sketch text-3xl md:text-4xl mb-3">Every Cup Tells a Story</h2>
          <p className="font-typewriter text-sm text-muted-foreground max-w-md mx-auto mb-6">
            Browse the full collection and find the design that speaks to you.
          </p>
          <Link href="/shop">
            <Button className="sketch-border bg-foreground text-background hover:bg-[oklch(0.40_0.02_60)] font-typewriter text-sm px-8 py-5">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
