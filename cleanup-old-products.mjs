import { drizzle } from 'drizzle-orm/mysql2';
import { sql } from 'drizzle-orm';

const db = drizzle(process.env.DATABASE_URL);

// These are the slugs of old placeholder products that should be deactivated
const OLD_PLACEHOLDER_SLUGS = [
  'coffee-dreamer',
  'coffee-swirl',
  'garden-bloom',
  'curious-cat',
  'midnight-brew',
  'sunrise-sip',
];

async function cleanup() {
  console.log('Deactivating old placeholder products...');
  
  for (const slug of OLD_PLACEHOLDER_SLUGS) {
    try {
      const result = await db.execute(
        sql`UPDATE products SET isActive = 0 WHERE slug = ${slug}`
      );
      console.log(`  ✓ Deactivated: ${slug}`);
    } catch (err) {
      console.log(`  ✗ Not found or error: ${slug}`);
    }
  }
  
  // Verify remaining active products
  const active = await db.execute(sql`SELECT slug, title, category FROM products WHERE isActive = 1 ORDER BY sortOrder`);
  console.log(`\nActive products (${active[0].length}):`);
  for (const p of active[0]) {
    console.log(`  - ${p.title} [${p.category}]`);
  }
  
  process.exit(0);
}

cleanup().catch(console.error);
