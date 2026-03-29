import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { sql } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL);

const seedProducts = [
  {
    slug: "coffee-dreamer-mug",
    title: "Coffee Dreamer",
    description: "A whimsical folk art painting of a wide-eyed character lost in the bliss of a perfect cup. Bold blue and cream tones with thick, expressive brushstrokes capture that magical first-sip moment. This design celebrates the quiet joy of morning coffee rituals.",
    seoDescription: "Handmade folk art coffee mug featuring Mary Wolford's 'Coffee Dreamer' painting — bold brushstrokes, vibrant blues, and whimsical charm on premium ceramic.",
    artworkUrl: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/coffee_dreamer_mug_40a9e774.webp",
    mockupUrls: JSON.stringify([
      "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/mug_mockup_dreamer_1-9mf8NKnZbLSzEpP4smFagS.webp",
      "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/mug_mockup_dreamer_2-Z4Z6LemBNiLeShCZVK7HJo.webp"
    ]),
    basePrice: 2495,
    category: "Coffee Mugs",
    isActive: 1,
    sortOrder: 1,
  },
  {
    slug: "coffee-swirl-mug",
    title: "Coffee Swirl",
    description: "Warm spirals of golden brown and cream dance across this design, evoking the mesmerizing swirl of freshly poured coffee. Mary's signature impasto technique gives this piece a rich, textured feel that translates beautifully onto ceramic.",
    seoDescription: "Artistic coffee mug with Mary Wolford's 'Coffee Swirl' design — warm golden spirals and folk art charm on premium ceramic, printed on demand.",
    artworkUrl: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/mug_mockup_abstract_1-46g9L9CH5XL5Tooiab6JRS.webp",
    mockupUrls: JSON.stringify([
      "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/mug_mockup_abstract_1-46g9L9CH5XL5Tooiab6JRS.webp"
    ]),
    basePrice: 2495,
    category: "Coffee Mugs",
    isActive: 1,
    sortOrder: 2,
  },
  {
    slug: "garden-bloom-mug",
    title: "Garden Bloom",
    description: "A burst of floral energy painted in Mary's distinctive folk style. Bright petals in orange, blue, and cream spring from bold dark outlines, bringing the joy of a wildflower garden to your morning routine.",
    seoDescription: "Folk art floral coffee mug by Mary Wolford — 'Garden Bloom' features vibrant wildflowers and bold brushwork on premium ceramic.",
    artworkUrl: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/mug_mockup_floral_1-itjeJyoGPREPwCSF9AwYne.webp",
    mockupUrls: JSON.stringify([
      "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/mug_mockup_floral_1-itjeJyoGPREPwCSF9AwYne.webp"
    ]),
    basePrice: 2495,
    category: "Coffee Mugs",
    isActive: 1,
    sortOrder: 3,
  },
  {
    slug: "curious-cat-mug",
    title: "Curious Cat",
    description: "A charming folk art cat with oversized, soulful eyes peers out from this playful design. Painted in Mary's signature palette of deep blues and warm creams, this mug is perfect for cat lovers and art enthusiasts alike.",
    seoDescription: "Whimsical cat art coffee mug by Mary Wolford — 'Curious Cat' folk painting with soulful eyes and bold colors on premium ceramic.",
    artworkUrl: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/mug_mockup_cat_1-YAXFzCDLJTiUMswYMQJNiJ.webp",
    mockupUrls: JSON.stringify([
      "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/mug_mockup_cat_1-YAXFzCDLJTiUMswYMQJNiJ.webp"
    ]),
    basePrice: 2495,
    category: "Coffee Mugs",
    isActive: 1,
    sortOrder: 4,
  },
  {
    slug: "midnight-brew-mug",
    title: "Midnight Brew",
    description: "Deep indigo and midnight blue tones create a moody, atmospheric scene of a late-night coffee moment. Stars and swirling steam blend together in this dreamy nocturnal painting that turns your evening cup into a cosmic experience.",
    seoDescription: "Midnight-themed art coffee mug by Mary Wolford — deep blues and starry atmosphere on premium ceramic, printed on demand.",
    artworkUrl: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/mug_mockup_night_1-ddAzVEoNaGF2qUNukxtvuy.webp",
    mockupUrls: JSON.stringify([
      "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/mug_mockup_night_1-ddAzVEoNaGF2qUNukxtvuy.webp"
    ]),
    basePrice: 2495,
    category: "Coffee Mugs",
    isActive: 1,
    sortOrder: 5,
  },
  {
    slug: "sunrise-sip-mug",
    title: "Sunrise Sip",
    description: "Warm oranges, soft pinks, and golden yellows radiate from this sunrise-inspired design. Mary captures the hopeful energy of dawn breaking over a steaming cup, making this mug the perfect companion for early risers.",
    seoDescription: "Sunrise art coffee mug by Mary Wolford — warm oranges and golden dawn on premium ceramic, handcrafted folk art printed on demand.",
    artworkUrl: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/mug_mockup_sunrise_1-699mekFRWSjsHPcP4SJEJ5.webp",
    mockupUrls: JSON.stringify([
      "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/mug_mockup_sunrise_1-699mekFRWSjsHPcP4SJEJ5.webp"
    ]),
    basePrice: 2495,
    category: "Coffee Mugs",
    isActive: 1,
    sortOrder: 6,
  },
];

async function seed() {
  console.log("Seeding products...");
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
