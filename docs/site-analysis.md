# INALSA storefront structure (analysed 14 Oct 2026, from the live front end)

## Platform / theme
- Shopify, INR, locale en. Custom theme on Dawn: `inalsa-appliances/main` (id 148964180033, live).
  Name pattern suggests GitHub-connected: check Themes -> connected repo before code edits.
- Fonts: Nunito Sans (body), Libre Baskerville (headings). Button colour #DA251C.
- Libraries: jQuery 3.7.1 (Google CDN), Swiper 11 (jsDelivr).
- Apps: Judge.me reviews, Shopify Forms (4 form pages), Sign in with Shop.
- Footer credit: "Powered by LSNetX of LIBSYS Ltd."

## Global layout
- Announcement bar (free shipping above Rs 2000)
- Header: logo, mega menu (Kitchen Appliances, Floor Care, Cooktop & Chimney, Others + service cards:
  Register Product, Service Center, Contact 1800-103-4325, Demo, Distributor Form), predictive search, account, cart drawer
- Newsletter strip above footer
- Footer: brand line + socials, columns Important Links / Our Products / Customer Care / Get in Touch
  (+91-9167001818, customercare@inalsa.co.in, Mon-Sat 11-7), (c) Tuareg Marketing Pvt Ltd
- Mobile-only bottom bar: Home, Categories, Find Inalsa, User

## Homepage sections (in order)
1. image_slider_Naj8LX  category icon marquee (12+ links)
2. image_slider_j9iK78  hero swiper "Designed for what matters. Everyday." -> /collections/all
3. featured_collection  Bestsellers (best-seller collection, 4 products)
4. image_slider_zLzxbe  New Arrivals swiper (images not clickable)
5. image_slider_86VexC  Shop by Trend: Working Professionals / New Families / Pet Owners / Home Chefs
6. video_yQbC8T         video section
7. brand_buzz_yXhyCE    press swiper (Moneycontrol, BW Retailworld, Fonearena, The Mobile Indian)
8. image_slider_yBHBqj  Taurus trust-logo marquee
`image_slider` is one custom section reused across the site; document it first for the agency.

## Other templates
- Collection: slider, breadcrumb, banner, product grid; filters availability, price, metafield custom.output_wattage
- Product: breadcrumb, main, related products, recently viewed, metafield banner, structured details
  (specs / box contents / dimensions / FAQ accordions), one unnamed custom block; Product JSON-LD
- Cart: items + footer, cart drawer active
- Pages: about-us (7 sections), contact-us, store-locator, recipes, book-a-demo, corporate-gifting,
  distributor-form, register-your-product (invoice upload). Blog: /blogs/news
- All 5 forms POST to Shopify /contact with custom form types.
- Policies (privacy, terms, returns, DOA, market circulation) are normal /pages/..., not Shopify policies.

## Catalog
- ~250 products (API returned exactly 250; verify in admin), all single-variant
- Vendors: Inalsa, Inalsa Appliances, Taurus, FITTYFY
- 46 collections; empty but linked in menu: bagged-vacuums, bagless-vacuums, robotic-vacuum-cleaner, refurbished

## Issues to fix in the mockup (default change backlog)
1. Duplicate collections: food-processor / food-processors, garment-steamer / garment-steamers; menu typo "Garment Seamer"
2. Mobile "Home" links to /collections/frontpage instead of /
3. Footer: "Tumblr" label links to LinkedIn; typos "linkdin", "CUSOMER CARE"
4. Homepage stats: "Subsidery", "spanish"; says 120 countries vs footer 70+
5. New Arrivals images not clickable
6. Store-locator H1 reads "Inalsa Jalandhar Store"
7. DuoSlim sells at 12,999 vs press coverage 13,999
8. Two phone numbers shown (+91-9167001818 and 1800-103-4325): confirm intentional
