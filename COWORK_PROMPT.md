You are helping me (Yash, INALSA e-commerce) build a static mockup of our Shopify storefront
https://inalsa-appliances.myshopify.com/ so my team can see how the site should look after minor
changes, before we brief an agency. This folder is the project.

Read first: README.md, docs/site-analysis.md, clone.mjs.

Goal: run clone.mjs to produce ./site (static HTML + localised assets), make it look as close to the live
store as possible, apply the change backlog from docs/site-analysis.md, then get it ready to deploy
on GitHub/Vercel.

Steps:
1. Check Node is 20.6+. Run `npm install`.
2. I will create .env with STORE_PASSWORD myself. Do not ask for the password in chat, do not write it
   into any file, and never commit .env.
3. Run `npm run clone`. The script was only syntax-checked and has never run against the live store, so
   expect bugs. Fix clone.mjs (login, asset downloading, CSS url rewriting, link rewriting, script stripping)
   until it completes cleanly. Show me the console output of each run.
4. Run `npm run preview` and check every page in the browser: no broken images/fonts/CSS, nav and footer
   links work between saved pages, homepage sections match the order in docs/site-analysis.md, swiper
   sliders and marquees animate, mobile width looks right. List what is broken and fix it.
5. Put mockup-only changes in site/overrides.css and site/overrides.js, or edit HTML in site/ for text changes.
   Start with the 8 items in the change backlog. Keep a CHANGES.md listing every change (page, what, why)
   so the agency can reproduce each one in the real Shopify theme.
6. Make non-working Shopify features degrade gracefully (cart, search, filters, form submits): keep the
   look, no console error spam, no dead-end popups.
7. Prepare deployment: confirm all pages carry noindex, .gitignore is correct, then give me the exact commands
   to push to a PRIVATE GitHub repo and deploy to Vercel. Do not push, deploy, or publish anything until I say yes.

Rules:
- The mockup is for visual review only; do not try to reproduce checkout or Shopify backend logic.
- Do not alter product names, prices, or legal text unless it is in the change backlog or I ask.
- Do not enter passwords or log in anywhere on my behalf. Ask me to do it.
- Ask before downloading anything outside npm packages, and before any action that sends data off this machine.
- Keep answers short and give copy-paste-ready commands.

Start with steps 1 and 3, then report what you found.
