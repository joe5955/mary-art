import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { sql } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL);

const seedProducts = [
  {
    slug: "three-mugs-collection",
    title: "Three Mugs Collection",
    description: "A vibrant celebration of coffee culture painted in Mary's signature pop art style. Three colorful ceramic mugs with bold outlines and steaming wisps dance across a warm cream background. This design captures the essence of coffee companionship with rich blues, warm yellows, and playful energy. Perfect for coffee lovers who appreciate authentic, hand-painted artistry.",
    seoDescription: "Pop art coffee mug by Mary Wolford — 'Three Mugs Collection' features vibrant ceramic paintings with bold outlines and warm colors on premium ceramic.",
    artworkUrl: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/coffee_mate_three_mugs_32987a33.webp",
    mockupUrls: JSON.stringify([
      "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/mockup_three_mugs-2NdzdYxxvMPu38XynpMyjS.webp"
    ]),
    basePrice: 2495,
    category: "Coffee Mugs",
    isActive: 1,
    sortOrder: 1,
  },
  {
    slug: "brunette-beauty",
    title: "Brunette Beauty",
    description: "A striking portrait of a stylish woman with flowing auburn hair, bold red lips, and an air of sophistication. She holds a steaming coffee cup with the same confidence and flair she carries. Mary's expressive brushwork and rich color palette bring this modern pop art portrait to life, celebrating the ritual and elegance of the coffee moment.",
    seoDescription: "Portrait art coffee mug by Mary Wolford — 'Brunette Beauty' features a stylish woman with coffee in pop art style on premium ceramic.",
    artworkUrl: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/coffee_mate_brunette_449e7d32.webp",
    mockupUrls: JSON.stringify([
      "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/mockup_brunette-Q5TmtWmdWFSb5BhpxhWuKt.webp"
    ]),
    basePrice: 2495,
    category: "Coffee Mugs",
    isActive: 1,
    sortOrder: 2,
  },
  {
    slug: "blue-eyes-swirl",
    title: "Blue Eyes Swirl",
    description: "Mesmerizing blue eyes peer over a coffee cup filled with hypnotic golden-brown swirls. This design captures the trance-like state of coffee contemplation with Mary's bold, expressive style. The contrast between the serene face and the dynamic swirling coffee creates a captivating visual narrative about the transformative power of that perfect cup.",
    seoDescription: "Artistic coffee mug by Mary Wolford — 'Blue Eyes Swirl' features striking eyes and mesmerizing coffee swirls in pop art style on premium ceramic.",
    artworkUrl: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/coffee_mate_blue_eyes_6971dd31.webp",
    mockupUrls: JSON.stringify([
      "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/mockup_blue_eyes-YHtTghaQndkKxAs9Lgfqai.webp"
    ]),
    basePrice: 2495,
    category: "Coffee Mugs",
    isActive: 1,
    sortOrder: 3,
  },
  {
    slug: "blue-woman-premium",
    title: "Blue Woman Premium",
    description: "A bold, imaginative portrait of a woman with striking blue skin, expressive eyes, and vibrant red lips. This premium 15oz design showcases Mary's fearless approach to color and form, celebrating individuality and artistic expression. The larger canvas allows the details of her brushwork to shine, making this a statement piece for collectors of contemporary pop art.",
    seoDescription: "Premium art coffee mug by Mary Wolford — 'Blue Woman' features bold blue portrait and expressive pop art on 15oz ceramic.",
    artworkUrl: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/coffee_mate_blue_woman_afb9fc0a.webp",
    mockupUrls: JSON.stringify([
      "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/mockup_blue_woman-JwuGeNwzMMZZfeqpLoBunV.webp"
    ]),
    basePrice: 2795,
    category: "Coffee Mugs",
    isActive: 1,
    sortOrder: 4,
  },
  {
    slug: "blonde-profile-with-bloom",
    title: "Blonde Profile with Bloom",
    description: "An elegant profile of a blonde woman gazes thoughtfully to the side, accompanied by a delicate green coffee mug adorned with a small red flower. This intimate composition captures a quiet moment of reflection and grace. Mary's attention to detail and subtle color work create a sophisticated, contemplative mood perfect for those who appreciate understated elegance.",
    seoDescription: "Elegant portrait coffee mug by Mary Wolford — 'Blonde Profile' features thoughtful portraiture and pop art charm on premium ceramic.",
    artworkUrl: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/coffee_mate_blonde_6c2758de.webp",
    mockupUrls: JSON.stringify([
      "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/mockup_blonde-JzzRc4qCZ3tRiqSdk3o95p.webp"
    ]),
    basePrice: 2495,
    category: "Coffee Mugs",
    isActive: 1,
    sortOrder: 5,
  },
];

async function seed() {
  console.log("Seeding products with Mary Wolford's Coffee Mate Girls collection (3D mockups)...");
  for (const product of seedProducts) {
    try {
      await db.execute(sql`
        INSERT INTO products (slug, title, description, seoDescription, artworkUrl, mockupUrls, basePrice, category, isActive, sortOrder)
        VALUES (${product.slug}, ${product.title}, ${product.description}, ${product.seoDescription}, ${product.artworkUrl}, ${product.mockupUrls}, ${product.basePrice}, ${product.category}, ${product.isActive}, ${product.sortOrder})
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          description = VALUES(description),
          seoDescription = VALUES(seoDescription),
          artworkUrl = VALUES(artworkUrl),
          mockupUrls = VALUES(mockupUrls),
          basePrice = VALUES(basePrice),
          category = VALUES(category),
          sortOrder = VALUES(sortOrder)
      `);
      console.log(`  ✓ ${product.title}`);
    } catch (err) {
      console.error(`  ✗ ${product.title}:`, err.message);
    }
  }
  console.log("Done seeding!");
  process.exit(0);
}

seed();
