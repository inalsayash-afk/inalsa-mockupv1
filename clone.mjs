// clone.mjs — turns the INALSA Shopify storefront into a static mockup site (./site)
// Usage:  npm i playwright-core   then   STORE_PASSWORD=<store password> node clone.mjs
// Windows PowerShell:  $env:STORE_PASSWORD="<store password>"; node clone.mjs
import { request } from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const ORIGIN = 'https://inalsa-appliances.myshopify.com';
const PASSWORD = process.env.STORE_PASSWORD;
const OUT = 'site';
const IMG_MAX_WIDTH = 1400; // images are saved at most this wide (keeps the repo small)
const CONCURRENCY = 8;      // parallel downloads
const SEED = [ // always fetched; every other page is discovered from the store's sitemap
 
  '/', '/collections', '/collections/air-fryer', '/collections/floor-care',
  '/collections/best-seller', '/collections/garment-steamer',
  '/pages/about-us', '/pages/contact-us', '/pages/store-locator', '/pages/book-a-demo',
  '/pages/register-your-product', '/pages/corporate-gifting', '/pages/distributor-form',
  '/pages/recipes', '/blogs/news',
];

if (!PASSWORD) throw new Error('Set STORE_PASSWORD env var first');

// ---- things we strip out (analytics, checkout, apps that cannot work on a static host)
const DROP_SRC = /trekkie|shopifycloud|cdn\.shopify\.com\/(extensions|shopifycloud|storefront)|checkouts\/internal|\/cdn\/wpm\/|judge\.me|shop-js|perf-kit|webmcp|standard-actions/;
const DROP_INLINE = /trekkie|ShopifyAnalytics|shopifyPerfKit|web-pixels-manager|WebPixelsManager|monorail/;

// ---- asset URLs we download and localise (theme files, images, fonts)
const ASSET_RE = /(?:(?:https?:)?\/\/(?:inalsa-appliances\.myshopify\.com\/cdn\/|cdn\.shopify\.com\/|fonts\.shopifycdn\.com\/)|(?<=["'(=\s])\/cdn\/)[^\s"'()<>,\\]+/g;

const ctx = await request.newContext({ extraHTTPHeaders: { 'User-Agent': 'Mozilla/5.0 (mockup-cloner)' } });
let active = 0; const queue = [];
const limited = (fn) => new Promise((res, rej) => {
  const run = async () => { active++; try { res(await fn()); } catch (e) { rej(e); } finally { active--; queue.shift()?.(); } };
  active < CONCURRENCY ? run() : queue.push(run);
});
const cache = new Map(); // absolute url -> local file name

async function replaceAsync(str, re, fn) {
  const parts = [];
  let last = 0, m;
  re.lastIndex = 0;
  while ((m = re.exec(str))) {
    parts.push(str.slice(last, m.index), fn(...m));
    last = m.index + m[0].length;
  }
  parts.push(str.slice(last));
  return (await Promise.all(parts)).join('');
}

function absolute(raw, base = ORIGIN) {
  let u = raw.replace(/&amp;/g, '&');
  if (u.startsWith('//')) u = 'https:' + u;
  else if (u.startsWith('/')) u = ORIGIN + u;
  else if (!/^https?:/.test(u)) u = new URL(u, base).href;
  return u;
}

async function rewriteCss(css, cssUrl) {
  return replaceAsync(css, /url\(\s*(['"]?)([^)'"]+)\1\s*\)/g, async (_m, _q, ref) => {
    if (ref.startsWith('data:') || ref.startsWith('#')) return _m;
    const name = await grab(ref, cssUrl);
    return `url(${name})`; // css sits in /assets next to its images/fonts
  });
}

// Image size variants (?width=…) all map to one full-size file, so each image is downloaded once.
function normalise(u) {
  const x = new URL(u);
  x.hash = ''; // font references like Calibri.svg#Calibri
  if (/\.(jpe?g|png|webp|avif)$/i.test(x.pathname)) {
    for (const k of ['width', 'height', 'crop']) x.searchParams.delete(k);
    if (/\/(files|products)\//.test(x.pathname)) x.searchParams.set('width', String(IMG_MAX_WIDTH));
  } else if (/\.(gif|svg)$/i.test(x.pathname)) {
    for (const k of ['width', 'height', 'crop']) x.searchParams.delete(k);
  }
  return x.href;
}

async function grab(raw, base = ORIGIN) {
  const u = normalise(absolute(raw, base));
  if (cache.has(u)) return cache.get(u);
  const ext = (path.extname(new URL(u).pathname) || '.bin').slice(0, 6);
  const name = crypto.createHash('sha1').update(u).digest('hex').slice(0, 10) + ext;
  cache.set(u, name); // set early so circular refs cannot loop
  try {
    const get = () => limited(async () => { const r = await ctx.get(u); return { ok: r.ok(), status: r.status(), body: r.ok() ? await r.body() : null }; });
    let r = await get();
    if (!r.ok && r.status >= 500) r = await get();
    if (!r.ok) { console.warn('  skip', r.status, u); return name; }
    let body = r.body;
    if (ext === '.css') body = Buffer.from(await rewriteCss(body.toString('utf8'), u));
    await fs.writeFile(path.join(OUT, 'assets', name), body);
  } catch (e) {
    console.warn('  fail', u, e.message);
  }
  return name;
}

const pageFile = (p) => {
  p = p.replace(/[?#].*$/, '').replace(/\/+$/, '');
  // Shorten very long slugs (product / blog) so paths stay under the Windows 260-char limit.
  p = p.replace(/^(\/(?:products|blogs\/[^/]+)\/)([^/]+)$/, (_m, dir, slug) =>
    slug.length > 40 ? dir + slug.slice(0, 40).replace(/-+$/, '') + '-' + crypto.createHash('sha1').update(slug).digest('hex').slice(0, 6) : _m);
  return p ? p.slice(1) + '/index.html' : 'index.html';
};

// ---- 0. log in to the password-protected storefront
await ctx.post(`${ORIGIN}/password`, { form: { form_type: 'storefront_password', utf8: '✓', password: PASSWORD } });
const check = await ctx.get(ORIGIN + '/');
if (check.url().includes('/password')) throw new Error('Store password was rejected');
console.log('Logged in to storefront');

// ---- 1. fetch raw server HTML for every page
const raw = new Map(); // path -> html
async function load(p) {
  const r = await ctx.get(ORIGIN + p);
  if (!r.ok()) { console.warn('page failed', r.status(), p); return; }
  raw.set(p, await r.text());
  console.log('fetched', p);
}
async function discover() {
  const paths = new Set(SEED);
  const keep = (url) => {
    const pth = new URL(url.replace(/&amp;/g, '&')).pathname.replace(/\/+$/, '');
    if (/^\/(products|collections|pages|blogs)\/[^/]+/.test(pth) || pth === '/collections') paths.add(pth);
  };
  const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  try {
    const idx = await (await ctx.get(ORIGIN + '/sitemap.xml')).text();
    for (const loc of locs(idx)) {
      if (/\.xml/.test(loc)) {
        const u = new URL(loc.replace(/&amp;/g, '&'));
        for (const l of locs(await (await ctx.get(ORIGIN + u.pathname + u.search)).text())) keep(l);
      } else keep(loc);
    }
  } catch (e) { console.warn('sitemap failed:', e.message); }
  if (![...paths].some((p) => p.startsWith('/products/'))) { // fallback: public JSON feed
    for (let n = 1; n <= 20; n++) {
      const r = await ctx.get(`${ORIGIN}/products.json?limit=250&page=${n}`);
      const items = r.ok() ? (await r.json()).products ?? [] : [];
      if (!items.length) break;
      items.forEach((it) => paths.add('/products/' + it.handle));
    }
  }
  return [...paths];
}
const all = await discover();
console.log(`Discovered ${all.length} pages (${all.filter((x) => x.startsWith('/products/')).length} products, ${all.filter((x) => x.startsWith('/collections/')).length} collections)`);
await Promise.all(all.map((p) => limited(() => load(p))));

// ---- 2. clean, localise, and write each page
await fs.mkdir(path.join(OUT, 'assets'), { recursive: true });
for (const [p, original] of raw) {
  const file = pageFile(p);
  const prefix = '../'.repeat(file.split('/').length - 1);
  let html = original;

  html = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (m, attrs, body) => {
    const src = attrs.match(/\bsrc=["']([^"']+)/)?.[1];
    if (src) return DROP_SRC.test(src) ? '' : m;
    if (/application\/ld\+json/.test(attrs)) return m;
    return DROP_INLINE.test(body) ? '' : m;
  });
  html = html.replace(/<link\b[^>]*>/gi, (m) => (DROP_SRC.test(m) ? '' : m));

  html = await replaceAsync(html, ASSET_RE, async (m) => `${prefix}assets/${await grab(m)}`);

  html = html.replace(/href=(["'])(.*?)\1/g, (m, q, h) => {
    const dec = h.replace(/&amp;/g, '&');
    if (/^(mailto:|tel:|#|javascript:)/.test(dec)) return m;
    if (dec.startsWith(prefix + 'assets/')) return m;
    let target;
    if (dec.startsWith(ORIGIN) || (dec.startsWith('/') && !dec.startsWith('//'))) target = new URL(dec, ORIGIN).pathname.replace(/\/+$/, '') || '/';
    else return m; // external link, leave as is
    target = target.replace(/^\/collections\/[^/]+(\/products\/.+)$/, '$1'); // /collections/x/products/y -> /products/y
    return raw.has(target) ? `href=${q}${prefix}${pageFile(target)}${q}` : `href=${q}#${q}`;
  });

  html = html
    .replace('</head>', `<meta name="robots" content="noindex,nofollow"><link rel="stylesheet" href="${prefix}overrides.css"></head>`)
    .replace('</body>', `<script src="${prefix}overrides.js"></script></body>`);

  await fs.mkdir(path.dirname(path.join(OUT, file)), { recursive: true });
  await fs.writeFile(path.join(OUT, file), html);
  console.log('wrote', file);
}

// ---- 3. starter override files (only created if missing, never overwritten)
for (const [f, body] of [
  ['overrides.css', '/* Mockup-only CSS changes go here. Loaded last on every page. */\n'],
  ['overrides.js', '// Mockup-only JS tweaks go here. Runs at the end of every page.\n'],
]) {
  try { await fs.access(path.join(OUT, f)); } catch { await fs.writeFile(path.join(OUT, f), body); }
}
console.log(`\nDone. ${raw.size} pages, ${cache.size} assets -> ./${OUT}\nPreview: npx serve ${OUT}`);
await ctx.dispose();
