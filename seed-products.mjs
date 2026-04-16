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
  {
    slug: "golden-gaze",
    title: "Golden Gaze",
    description: "A striking pop art portrait of a woman with emerald green eyes and flowing golden blonde hair, rendered in Mary's signature hand-drawn style. She holds a steaming coffee cup with graceful confidence. The design features warm yellows, deep teals, and burnt orange accents against a cream background with charcoal dashed details. Bold black outlines and organic shapes capture the essence of artistic coffee appreciation.",
    seoDescription: "Pop art coffee mug by Mary Wolford — 'Golden Gaze' features emerald eyes and flowing blonde hair in vibrant pop art style on premium ceramic.",
    artworkUrl: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/pop_art_cup_style1_no_text-nwjxoHRwvvGGVzk8FFVnJY.png",
    mockupUrls: JSON.stringify([
      "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/pop_art_cup_style1_no_text-9yc6qPAKY45pCc3XMks7m8.webp"
    ]),
    basePrice: 2495,
    category: "Coffee Mugs",
    isActive: 1,
    sortOrder: 6,
  },
  {
    slug: "midnight-mystique",
    title: "Midnight Mystique",
    description: "A bold and expressive pop art portrait featuring a woman with striking deep purple-blue skin, dramatic red lips, and captivating eyes accented with gold. This design showcases Mary's fearless approach to color and form, celebrating individuality through vibrant jewel tones—deep plum, crimson, and gold—against a cream background. Hand-drawn with thick charcoal outlines and organic shapes.",
    seoDescription: "Pop art coffee mug by Mary Wolford — 'Midnight Mystique' features bold purple portrait with dramatic red lips in expressive pop art style on premium ceramic.",
    artworkUrl: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/pop_art_cup_style2_no_text-EoMRcWC7cxXXgZT8iihR26.png",
    mockupUrls: JSON.stringify([
      "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/pop_art_cup_style2_no_text-epLCT4dPcroaPCECE63DWj.webp"
    ]),
    basePrice: 2495,
    category: "Coffee Mugs",
    isActive: 1,
    sortOrder: 7,
  },
  {
    slug: "coffee-bloom",
    title: "Coffee Bloom",
    description: "An elegant pop art composition featuring a woman's profile in soft rose and coral tones, with flowing hair that gracefully transforms into organic coffee swirls in warm browns and golds. Mary's hand-drawn aesthetic shines through bold black outlines, charcoal details, and imperfect shapes. The cream background with dashed decorative elements completes this sophisticated, contemplative design.",
    seoDescription: "Pop art coffee mug by Mary Wolford — 'Coffee Bloom' features flowing profile with coffee swirls in rose, coral, and gold pop art style on premium ceramic.",
    artworkUrl: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/pop_art_cup_style3_no_text-gSy83BAsAs9LqUkGXKJWBY.png",
    mockupUrls: JSON.stringify([
      "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/pop_art_cup_style3_no_text-fAmDLBMRPCAfFZSJdDfi8U.webp"
    ]),
    basePrice: 2495,
    category: "Coffee Mugs",
    isActive: 1,
    sortOrder: 8,
  },
  {
    slug: "golden-gaze-tote",
    title: "Golden Gaze Tote Bag",
    description: "Carry your coffee culture in style with this premium canvas tote bag featuring Mary Wolford's 'Golden Gaze' pop art design. The striking portrait of a woman with emerald green eyes and flowing golden hair brings artistic flair to everyday use. Perfect for coffee lovers, art enthusiasts, and anyone who appreciates bold, hand-drawn pop art aesthetics.",
    seoDescription: "Pop art tote bag by Mary Wolford — 'Golden Gaze' canvas tote with emerald eyes and golden hair design.",
    artworkUrl: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/pop_art_cup_style1_no_text-nwjxoHRwvvGGVzk8FFVnJY.png",
    mockupUrls: JSON.stringify([
      "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/golden_gaze_tote_bag-QsTTzQMRJmo63ToSVZZYhK.webp"
    ]),
    basePrice: 1995,
    category: "Tote Bags",
    isActive: 1,
    sortOrder: 9,
  },
  {
    slug: "golden-gaze-print",
    title: "Golden Gaze Art Print",
    description: "Bring gallery-quality pop art into your home with this premium art print of Mary Wolford's 'Golden Gaze' design. Printed on high-quality cream paper with vibrant colors that capture the hand-drawn aesthetic and bold personality of the original artwork. Perfect for framing and displaying in any space.",
    seoDescription: "Pop art print by Mary Wolford — 'Golden Gaze' premium art print on cream paper.",
    artworkUrl: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/pop_art_cup_style1_no_text-nwjxoHRwvvGGVzk8FFVnJY.png",
    mockupUrls: JSON.stringify([
      "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/golden_gaze_art_print-T4xCvVhz7tbTQzLXLg5e3f.webp"
    ]),
    basePrice: 1495,
    category: "Art Prints",
    isActive: 1,
    sortOrder: 10,
  },
  {
    slug: "midnight-mystique-tote",
    title: "Midnight Mystique Tote Bag",
    description: "Make a bold statement with this stunning canvas tote bag featuring Mary Wolford's 'Midnight Mystique' pop art design. The striking portrait with deep purple-blue tones and dramatic red lips showcases Mary's fearless approach to color and form. An eye-catching accessory for art lovers and coffee enthusiasts alike.",
    seoDescription: "Pop art tote bag by Mary Wolford — 'Midnight Mystique' canvas tote with purple portrait and gold accents.",
    artworkUrl: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/pop_art_cup_style2_no_text-EoMRcWC7cxXXgZT8iihR26.png",
    mockupUrls: JSON.stringify([
      "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/midnight_mystique_tote_bag-dMYQdx6GgJS8WAnbjfexaL.webp"
    ]),
    basePrice: 1995,
    category: "Tote Bags",
    isActive: 1,
    sortOrder: 11,
  },
  {
    slug: "midnight-mystique-print",
    title: "Midnight Mystique Art Print",
    description: "Elevate your space with this captivating art print of Mary Wolford's 'Midnight Mystique' design. The bold pop art portrait with jewel tones and expressive features is printed on premium cream paper, capturing every detail of Mary's hand-drawn artistry. A stunning focal point for any room.",
    seoDescription: "Pop art print by Mary Wolford — 'Midnight Mystique' premium art print with purple portrait.",
    artworkUrl: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/pop_art_cup_style2_no_text-EoMRcWC7cxXXgZT8iihR26.png",
    mockupUrls: JSON.stringify([
      "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/midnight_mystique_art_print-HrX4fKk6u2ud4imR435rUF.webp"
    ]),
    basePrice: 1495,
    category: "Art Prints",
    isActive: 1,
    sortOrder: 12,
  },
  {
    slug: "coffee-bloom-tote",
    title: "Coffee Bloom Tote Bag",
    description: "Embrace elegance with this beautiful canvas tote bag featuring Mary Wolford's 'Coffee Bloom' pop art design. The graceful profile with flowing hair transforming into coffee swirls creates a sophisticated, contemplative mood. Perfect for carrying your daily essentials with artistic style.",
    seoDescription: "Pop art tote bag by Mary Wolford — 'Coffee Bloom' canvas tote with flowing profile and coffee swirls.",
    artworkUrl: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/pop_art_cup_style3_no_text-gSy83BAsAs9LqUkGXKJWBY.png",
    mockupUrls: JSON.stringify([
      "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/coffee_bloom_tote_bag-QY362L59dPPLz5JxAeJRTe.webp"
    ]),
    basePrice: 1995,
    category: "Tote Bags",
    isActive: 1,
    sortOrder: 13,
  },
  {
    slug: "coffee-bloom-print",
    title: "Coffee Bloom Art Print",
    description: "Add a touch of artistic sophistication with this elegant art print of Mary Wolford's 'Coffee Bloom' design. The composition with rose and coral tones, flowing hair, and coffee swirls is printed on premium cream paper, creating a gallery-quality piece perfect for any art lover's collection.",
    seoDescription: "Pop art print by Mary Wolford — 'Coffee Bloom' premium art print with flowing profile and coffee swirls.",
    artworkUrl: "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/pop_art_cup_style3_no_text-gSy83BAsAs9LqUkGXKJWBY.png",
    mockupUrls: JSON.stringify([
      "https://d2xsxph8kpxj0f.cloudfront.net/113311765/5RLxZuwJqkKErXc6UsymQC/coffee_bloom_art_print-m6cvdiVWYNRi2cie6Q5Jjq.webp"
    ]),
    basePrice: 1495,
    category: "Art Prints",
    isActive: 1,
    sortOrder: 14,
  },
];

async function seed() {
  console.log("Seeding products: Coffee Mugs, Tote Bags, and Art Prints from Mary Wolford's collection...");
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
