# Mary Wolford Art - E-Commerce TODO

- [x] Database schema: products, orders, order_items, cart tables
- [x] Stripe integration setup (add feature + secrets)
- [x] Product catalog page with grid display of coffee cup designs
- [x] Product detail page with pricing, size options, and mockup images
- [x] Shopping cart with add/remove/quantity management
- [x] Stripe checkout flow for secure payment
- [x] Printful API integration complete (reads variant IDs from DB, auto-submits orders after payment when PRINTFUL_API_KEY is configured)
- [x] Order management system tracking customer orders and fulfillment status
- [x] Admin dashboard for managing products, viewing orders, tracking sales
- [x] Customer order history and tracking for authenticated users
- [x] Automated order confirmation emails to customers
- [x] Fulfillment notifications to owner when new orders placed
- [x] LLM-generated SEO-optimized product descriptions
- [x] Hand-drawn sketch aesthetic design (cream paper bg, charcoal lines, imperfect shapes)
- [x] Playful typography: bold marker-style headers + monospaced typewriter body
- [x] Responsive design optimized for mobile and desktop
- [x] Upload Mary's artwork images and generate product mockups
- [x] Seed initial product catalog with Mary's coffee cup designs
- [x] Vitest tests for core backend flows (40 tests passing: unit + integration)
- [x] Fix size-based pricing: 15oz surcharge must be reflected in cart totals and checkout
- [x] Add LLM-generated SEO product description endpoint (admin feature)
- [x] Verify responsive design across mobile/desktop
- [x] Full purchase flow end-to-end verification (visual QA + 40 tests passing)
- [x] Fix Stripe webhook endpoint: return valid JSON with verified:true, register with express.raw before express.json
- [x] Add printfulOrderId column to orders table for tracking fulfillment
- [x] Store Printful order ID in database when fulfillment is submitted
- [x] Add Printful integration tests (configured + unconfigured paths + variant resolution) — 53 tests passing
- [x] Research print-on-demand vendors, costs, margins, and full setup process for actual cup sales
- [x] Push website code to new private GitHub repo joe5955/mary-wolford-art
- [x] Create Google Sheets expense tracker with Website Production, Bookkeeping, Sales, and Summary tabs
- [x] Update product catalog with Mary's actual "Coffee Mate Girls" artwork paintings (5 real designs)
- [x] Replace AI-generated mockups with real artwork images
- [x] Update product names and descriptions to match the collection
- [x] Generate new hero banner mockup showing all 5 Coffee Mate Girls cups
- [x] Update website hero image with the new mockup
- [x] Change hero tagline to 'Your Morning Deserves Original Art'
- [x] Add 'Free shipping on orders over $50' near the CTA button
- [x] Generate realistic 3D mug mockups for all 5 Coffee Mate Girls designs
- [x] Update product catalog database with new mockup image URLs
- [x] Update Shop, Home, and ProductDetail pages for square mockup display
- [x] Replace AI-generated artist portrait with real photo of Mary Wolford
- [x] Rename art style from 'folk art' to 'pop art' across entire site
- [x] Create three new pop art coffee cup designs (Golden Gaze, Midnight Mystique, Coffee Bloom)
- [x] Generate matching tote bag mockups for all three new cup designs
- [x] Generate matching art print mockups for all three new cup designs
- [x] Add tote bags and art prints to product catalog (6 new merchandise products)
- [x] Verify all product images are loading correctly on the live site
- [x] Verify pricing is visible on product listings and detail pages
- [x] Test full checkout flow end-to-end (add to cart → checkout → payment) — cart + add-to-cart + Stripe session creation verified; final Stripe payment page requires user login to test with card 4242 4242 4242 4242
- [x] Advise on custom domain setup (replace manus.space subdomain)

### Custom Domain Setup Notes
Current domain: maryartshop-5rlxzuwj.manus.space
To set up a custom domain (e.g., maryartshop.com):
1. Go to Management UI → Settings → Domains
2. You can either:
   a. Purchase a domain directly within Manus (easiest)
   b. Bind an existing domain you already own
3. If using an existing domain, point your DNS A record or CNAME to the Manus-provided address
4. SSL certificate is automatically provisioned
5. The manus.space subdomain prefix can also be customized in Settings → Domains
- [x] Fix product detail page: tote bags/art prints show mug-specific details (ceramic mug, dishwasher safe, oz sizes)
- [x] Remove 6 old placeholder products from database (Coffee Dreamer, Coffee Swirl, Garden Bloom, Curious Cat, Midnight Brew, Sunrise Sip)
- [x] Fix cart order summary price display mismatch
- [x] Brighten and perk up Mary's photo on the About page (and Home page)
- [x] Create mug mockups for 9 new paintings (Suave, Hidden Blonde, Elevate, Love Me Do, Strawberry Fields, Lucy in the Sky, Metamorphosis, The Rhododendron Bush, Seascape)
- [x] Create tote bag mockups for 9 new paintings
- [x] Create art print mockups for 9 new paintings
- [x] Add all 27 new products to seed script and database
- [x] Verify all new products display correctly on the shop page — 41 total products seeded, 53 tests passing
- [x] Verify the live shop page displays all 41 products correctly across mugs, tote bags, and art prints
- [x] Update shop page collection copy to reflect multi-category catalog (not just mugs)
- [x] Standardize all art print prices to $24.95 (was $14.95 for 3 older prints)
- [x] Increase contrast on Mary's photo — looks milky/washed out, needs more punch
- [x] Add storage proxy for /manus-storage/ paths (required for uploaded images to load)
- [x] Generate lifestyle vignette images (person enjoying coffee mug, carrying tote, print on wall)
- [x] Add vignette sections between product categories on the shop page to break up the grid
