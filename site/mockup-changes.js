/* Mockup-only "What changed" widget. Orange button (bottom-right) toggles a review mode:
   a summary panel + numbered orange tags with dashed outlines on every changed element.
   Turn it off and the site behaves exactly as normal.
   TO ADD A CHANGE: add an entry to CHANGES below (and a row to CHANGES.md). */
(function () {
  'use strict';
  if (window.__mkChanges) return; window.__mkChanges = true;

  var CHANGES = [
    {
      id: 'V1-01',
      title: 'Bordered product cards + hover lift',
      selector: '.card-wrapper.product-card-wrapper, .collection-card-wrapper .card',
      before: 'Plain product cards: no border, image flush to the edge.',
      after: '1px grey border, 16px rounded corners, inner padding. On hover the card lifts up with a shadow (hover a card to see it).',
      where: 'All product grids + category cards'
    },
    {
      id: 'V1-02',
      title: 'Product page: bordered gallery + info card',
      selector: '.product__media-item.is-active .product-media-container, .product__info-container',
      before: 'Image and product details sit directly on the page with no borders.',
      after: 'Main image gets a rounded border with soft shadow; title, price and details sit in one rounded bordered card.',
      where: 'All product pages'
    },
    {
      id: 'V1-03',
      title: 'Product page: tinted trust-badge strip',
      selector: '.usp-section-wrapper',
      before: 'Free Shipping / 2 Year Warranty / Support / Demo / Money Back icons float on white.',
      after: 'Icons sit in a light peach box with a soft red outline.',
      where: 'All product pages'
    },
    {
      id: 'V1-04',
      title: 'Product page: spec table with grid lines',
      selector: '.product-specs',
      before: 'Special Features, Dimensions, Colour, Capacity, Material shown as plain rows.',
      after: 'Rounded bordered table with a divider between label and value and a line between rows.',
      where: 'All product pages'
    },
    {
      id: 'V1-05',
      title: 'Homepage category strip: auto-moves AND scrollable',
      selector: '[id^="concern-marquee-"][id$="__image_slider_Naj8LX"]',
      before: 'Category icons (Vacuum Cleaner, Stand Mixer ...) slide automatically; visitors cannot scroll them.',
      after: 'Still auto-moves, but visitors can also swipe, drag with the mouse, or trackpad-scroll it. Auto-move pauses while hovering or interacting and resumes after about 1.5s.',
      where: 'Homepage, first section'
    },
    {
      id: 'V1-06',
      title: 'Backed by Taurus Spain: boxed tiles, scrollable',
      selector: '[id^="concern-marquee-"][id$="__image_slider_yBHBqj"]',
      before: 'Stat tiles (15M+ homes, 6 R&D centres ...) auto-slide with a very faint outline and cannot be scrolled.',
      after: 'Each tile is a bordered, rounded box that lifts on hover (same as product cards). The strip still auto-moves and can also be swiped, dragged or trackpad-scrolled.',
      where: 'Homepage, near the bottom'
    },
    {
      id: 'V1-07',
      title: 'Shop by Trend: bordered cards, zoom, red CTA',
      selector: '[id$="__image_slider_86VexC"] .shop-by-trend .concern-card',
      before: 'Image on top of a grey-blue label box; "View all" in small black text; no hover feedback.',
      after: 'Each card is one box with a white label area, side and bottom borders only (no top border line), rounded at the bottom. On hover the card lifts, the photo zooms in slightly and "View all" (now brand red, bold) underlines. Whole card stays clickable.',
      where: 'Homepage, Shop by Trend'
    },
    {
      id: 'V1-08',
      title: 'All product cards the same size',
      selector: '.card-wrapper.product-card-wrapper .card__inner',
      before: 'Card image box followed each photo\'s shape, so tall photos (e.g. Zion 3L water heater) made that card much taller than its neighbours.',
      after: 'Every card image box is square with the photo fitted inside; cards in a row are equal height and price + Add to Cart line up at the bottom.',
      where: 'All product grids'
    },
    {
      id: 'V1-09',
      title: 'Pagination: current page in a red circle',
      selector: '.pagination__item--current',
      before: 'Current page shown as a grey number with a thin underline.',
      after: 'Current page is a red filled circle with white bold number; other numbers get a light red circle on hover.',
      where: 'Collection pages with more than one page'
    },
    {
      id: 'V1-10',
      title: 'Phones: compact horizontal product rows',
      mq: '(max-width: 749px)',
      selector: '#product-grid .card-wrapper.product-card-wrapper',
      before: 'On phones each product card is huge: big image on top, one product per screen.',
      after: 'Image on the left, title, price and full-width Add to Cart on the right, so several products fit on one screen.',
      where: 'Phones only (under 750px wide), collection pages. Open the site on a phone or narrow the browser to see it.'
    },
    {
      id: 'V1-11',
      title: 'Phones: no box borders',
      mq: '(max-width: 749px)',
      selector: '.product__info-container, #product-grid .card-wrapper.product-card-wrapper, .usp-section-wrapper',
      before: 'Desktop gets bordered cards, boxes and shadows.',
      after: 'On phones the borders and shadows are removed everywhere (product cards, product page card and image, trust strip, Taurus tiles, Shop by Trend). Layout and backgrounds stay.',
      where: 'Phones only (under 750px wide), all pages'
    }
  ];

  var KEY = 'mockupChangesOn', ORANGE = '#FF7A00';
  var css = [
    '.mk-btn{position:fixed;right:20px;bottom:20px;z-index:2147483000;display:flex;align-items:center;gap:8px;background:' + ORANGE + ';color:#fff;border:0;border-radius:999px;padding:12px 18px;font:700 14px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.25)}',
    '.mk-btn:hover{filter:brightness(1.05)}.mk-btn:focus-visible{outline:3px solid #fff;outline-offset:2px;box-shadow:0 0 0 5px #000}',
    '.mk-btn .mk-dot{background:#fff;color:' + ORANGE + ';border-radius:999px;min-width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;padding:0 5px}',
    '.mk-panel{position:fixed;right:20px;bottom:76px;z-index:2147483000;width:360px;max-height:70vh;overflow:auto;background:#fff;color:#1a1a1a;border:2px solid ' + ORANGE + ';border-radius:14px;box-shadow:0 14px 40px rgba(0,0,0,.28);font:14px/1.45 system-ui,sans-serif}',
    '.mk-panel h2{margin:0;padding:14px 16px 4px;font:700 16px/1.3 system-ui,sans-serif;color:#1a1a1a}',
    '.mk-panel .mk-sub{margin:0;padding:0 16px 10px;color:#555;font-size:12.5px}',
    '.mk-panel h3{margin:0;padding:10px 16px 6px;font:700 11px/1 system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#888;border-top:1px solid #eee}',
    '.mk-item{display:block;width:100%;text-align:left;background:none;border:0;border-top:1px solid #f1f1f1;padding:10px 16px;cursor:pointer;font:inherit;color:inherit}',
    '.mk-item:hover{background:#fff6ee}.mk-item:focus-visible{outline:2px solid ' + ORANGE + ';outline-offset:-2px}',
    '.mk-item .mk-n{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:' + ORANGE + ';color:#fff;font-weight:700;font-size:12px;margin-right:8px;flex:none}',
    '.mk-item .mk-t{font-weight:700}.mk-item .mk-id{color:#888;font-size:12px;margin-left:6px}',
    '.mk-item .mk-row{margin:6px 0 0 30px;font-size:13px}.mk-item .mk-row b{display:inline-block;min-width:48px;color:#888;font-weight:600}',
    '.mk-item.mk-off{cursor:default;opacity:.75}.mk-item.mk-off .mk-n{background:#bbb}',
    '.mk-foot{padding:10px 16px 14px;border-top:1px solid #eee}',
    '.mk-foot button{background:#fff;color:' + ORANGE + ';border:2px solid ' + ORANGE + ';border-radius:999px;padding:8px 14px;font:700 13px/1 system-ui,sans-serif;cursor:pointer}',
    '.mk-layer{position:absolute;left:0;top:0;width:0;height:0;z-index:2147482000;pointer-events:none}',
    '.mk-outline{position:absolute;border:2px dashed ' + ORANGE + ';border-radius:16px;box-sizing:border-box;background:rgba(255,122,0,.05)}',
    '.mk-pin{position:absolute;display:flex;align-items:center;gap:6px;background:' + ORANGE + ';color:#fff;font:700 12.5px/1 system-ui,sans-serif;padding:7px 10px 7px 7px;border-radius:999px;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,.25);max-width:80vw}',
    '.mk-pin .mk-n{background:#fff;color:' + ORANGE + ';border-radius:50%;width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center}',
    '.mk-pin.mk-above::after{content:"";position:absolute;left:22px;bottom:-9px;border:6px solid transparent;border-top:9px solid ' + ORANGE + '}',
    '.mk-pulse{animation:mkp 1s ease 2}@keyframes mkp{50%{outline:4px solid ' + ORANGE + ';outline-offset:3px}}',
    '@media(max-width:600px){.mk-panel{right:10px;left:10px;width:auto;bottom:70px;max-height:60vh}.mk-btn{right:12px;bottom:12px}}',
    '@media print{.mk-btn,.mk-panel,.mk-layer{display:none!important}}'
  ].join('\n');

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function get() { try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function set(v) { try { sessionStorage.setItem(KEY, v ? '1' : '0'); } catch (e) {} }
  function visible(n) { var r = n.getBoundingClientRect(); return r.width > 4 && r.height > 4; }
  function matches(c) { if (c.mq && !(window.matchMedia && matchMedia(c.mq).matches)) return []; try { return Array.prototype.filter.call(document.querySelectorAll(c.selector), visible); } catch (e) { return []; } }

  var on = false, btn, panel, layer, timer;

  function render() {
    if (layer) layer.remove(); if (panel) panel.remove();
    layer = panel = null;
    if (!on) { btn.firstChild.textContent = 'Show changes'; btn.setAttribute('aria-pressed', 'false'); return; }
    btn.firstChild.textContent = 'Hide changes'; btn.setAttribute('aria-pressed', 'true');

    var sx = window.pageXOffset, sy = window.pageYOffset;
    layer = el('div', 'mk-layer'); layer.setAttribute('aria-hidden', 'true');
    var here = [], other = [];
    CHANGES.forEach(function (c) { var m = matches(c); (m.length ? here : other).push({ c: c, m: m }); });

    here.forEach(function (h, i) {
      h.n = i + 1;
      h.m.slice(0, 40).forEach(function (n) {
        var r = n.getBoundingClientRect(), o = el('div', 'mk-outline');
        o.style.cssText = 'left:' + (r.left + sx - 4) + 'px;top:' + (r.top + sy - 4) + 'px;width:' + (r.width + 8) + 'px;height:' + (r.height + 8) + 'px';
        layer.appendChild(o);
      });
      var f = h.m[0].getBoundingClientRect(), pin = el('div', 'mk-pin');
      pin.appendChild(el('span', 'mk-n', String(h.n))); pin.appendChild(el('span', '', h.c.title));
      var top = f.top + sy - 40;
      if (top < sy + 4 && f.top < 44) { top = f.top + sy + 10; } else { pin.className += ' mk-above'; }
      pin.style.cssText = 'left:' + Math.max(4, f.left + sx + 4) + 'px;top:' + top + 'px';
      layer.appendChild(pin);
    });
    document.body.appendChild(layer);

    panel = el('div', 'mk-panel'); panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Changes from the live store');
    panel.appendChild(el('h2', '', 'What changed vs the live store'));
    panel.appendChild(el('p', 'mk-sub', 'Orange tags and dashed outlines mark each change on this page. Click an item to jump to it. Hide changes to browse normally.'));
    if (here.length) {
      panel.appendChild(el('h3', '', 'On this page (' + here.length + ')'));
      here.forEach(function (h) {
        var b = el('button', 'mk-item'); b.type = 'button';
        var t = el('div'); t.appendChild(el('span', 'mk-n', String(h.n))); t.appendChild(el('span', 'mk-t', h.c.title)); t.appendChild(el('span', 'mk-id', h.c.id));
        b.appendChild(t);
        [['Before', h.c.before], ['After', h.c.after], ['Where', h.c.where]].forEach(function (p) {
          if (!p[1]) return; var r = el('div', 'mk-row'); r.appendChild(el('b', '', p[0])); r.appendChild(document.createTextNode(' ' + p[1])); b.appendChild(r);
        });
        b.addEventListener('click', function () {
          var n = h.m[0]; n.scrollIntoView({ behavior: 'smooth', block: 'center' });
          n.classList.add('mk-pulse'); setTimeout(function () { n.classList.remove('mk-pulse'); }, 2200);
        });
        panel.appendChild(b);
      });
    }
    if (other.length) {
      panel.appendChild(el('h3', '', 'Elsewhere on the site (' + other.length + ')'));
      other.forEach(function (h) {
        var b = el('div', 'mk-item mk-off'); var t = el('div');
        t.appendChild(el('span', 'mk-n', '–')); t.appendChild(el('span', 'mk-t', h.c.title)); t.appendChild(el('span', 'mk-id', h.c.id));
        b.appendChild(t); if (h.c.where) { var r = el('div', 'mk-row'); r.appendChild(el('b', '', 'Where')); r.appendChild(document.createTextNode(' ' + h.c.where)); b.appendChild(r); }
        panel.appendChild(b);
      });
    }
    var foot = el('div', 'mk-foot'), off = el('button', '', 'Hide changes'); off.type = 'button';
    off.addEventListener('click', function () { toggle(false); }); foot.appendChild(off); panel.appendChild(foot);
    document.body.appendChild(panel);
    var cnt = btn.querySelector('.mk-dot'); if (cnt) cnt.textContent = String(here.length || CHANGES.length);
  }

  function toggle(v) { on = v; set(v); render(); }
  function later() { clearTimeout(timer); timer = setTimeout(function () { if (on) render(); }, 150); }

  function init() {
    var st = el('style'); st.textContent = css; document.head.appendChild(st);
    btn = el('button', 'mk-btn'); btn.type = 'button'; btn.setAttribute('aria-pressed', 'false');
    btn.appendChild(el('span', '', 'Show changes')); btn.appendChild(el('span', 'mk-dot', String(CHANGES.length)));
    btn.addEventListener('click', function () { toggle(!on); });
    document.body.appendChild(btn);
    window.addEventListener('resize', later);
    window.addEventListener('load', function () { later(); setTimeout(later, 1200); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && on) toggle(false); });
    on = get(); render(); setTimeout(later, 600);
  }
  if (document.body) init(); else document.addEventListener('DOMContentLoaded', init);
})();
