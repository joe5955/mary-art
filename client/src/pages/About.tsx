import Layout from "@/components/Layout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const ARTIST_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/artist_portrait-4LWq9LdafoHpvh5ggP8B2v.webp";

export default function About() {
  return (
    <Layout>
      <div className="container py-10 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <p className="font-typewriter text-xs tracking-widest uppercase text-muted-foreground mb-2">
            the artist behind the art
          </p>
          <h1 className="font-sketch text-4xl md:text-5xl mb-8">About Mary Wolford</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="sketch-border overflow-hidden">
              <img
                src={ARTIST_IMG}
                alt="Mary Wolford in her studio"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="space-y-4">
              <p className="font-typewriter text-sm text-muted-foreground leading-relaxed">
                Mary Wolford is a folk artist whose bold, expressive paintings have been capturing hearts for over two decades. Working from her sun-filled studio, she creates vibrant pieces that blend thick impasto brushstrokes with a palette of deep blues, warm oranges, and soft creams.
              </p>
              <p className="font-typewriter text-sm text-muted-foreground leading-relaxed">
                Her work draws inspiration from everyday life — the warmth of a morning coffee, the expression on a friend's face, the play of light through a kitchen window. Each painting tells a small story, inviting the viewer to slow down and notice the beauty in ordinary moments.
              </p>
              <p className="font-typewriter text-sm text-muted-foreground leading-relaxed">
                Mary's signature style is immediately recognizable: characters with oversized, soulful eyes, swirling coffee cups, and compositions that feel both playful and deeply personal. Her work has been described as "folk art with a modern soul."
              </p>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-border pt-8 mb-8">
            <h2 className="font-sketch text-3xl mb-4">From Canvas to Cup</h2>
            <p className="font-typewriter text-sm text-muted-foreground leading-relaxed mb-4">
              The idea for art-on-cups came naturally. Mary noticed that her paintings of coffee scenes were among her most beloved works. "People kept telling me they wanted to drink their morning coffee while looking at my coffee paintings," she laughs. "So I thought — why not put the painting right on the cup?"
            </p>
            <p className="font-typewriter text-sm text-muted-foreground leading-relaxed mb-4">
              Each design in the collection starts as an original acrylic painting in Mary's studio. The artwork is then carefully adapted for print-on-demand production, ensuring that every brushstroke, every color nuance, and every bit of texture translates faithfully onto premium ceramic.
            </p>
            <p className="font-typewriter text-sm text-muted-foreground leading-relaxed">
              The result is a functional piece of art — a mug that makes your morning ritual a little more beautiful, a little more intentional. And because each cup is printed on demand, you're getting a piece that's made just for you.
            </p>
          </div>

          <div className="text-center py-8">
            <h2 className="font-sketch text-3xl mb-3">Ready to Sip Some Art?</h2>
            <p className="font-typewriter text-sm text-muted-foreground mb-6">
              Browse the collection and find the design that speaks to you.
            </p>
            <Link href="/shop">
              <Button className="sketch-border bg-foreground text-background hover:bg-[oklch(0.40_0.02_60)] font-typewriter text-sm px-8 py-5">
                Shop the Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
