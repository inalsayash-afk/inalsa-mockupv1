// Mockup-only JS tweaks go here. Runs at the end of every page.

// "What changed" review widget (orange button, bottom-right). Edit site/mockup-changes.js to add entries.
(function () {
  var cur = document.currentScript;
  if (!cur || !cur.src) return;
  var s = document.createElement('script');
  s.src = cur.src.replace(/overrides\.js(\?.*)?$/, 'mockup-changes.js');
  s.defer = true;
  document.body.appendChild(s);
})();

// V1-05: category-icon + Taurus-stats marquees auto-scroll AND can be scrolled / swiped / dragged.
// Autoplay pauses while hovering or interacting, then resumes ~1.5s later. Loops seamlessly.
(function () {
  function setup(el) {
    var track = el.querySelector('.concern-marquee-track');
    var group = track && track.querySelector('.concern-marquee-group');
    if (!group) return;
    if (track.querySelectorAll('.concern-marquee-group').length < 2) { // need a duplicate for the seamless loop
      var clone = group.cloneNode(true); clone.setAttribute('aria-hidden', 'true'); track.appendChild(clone);
    }
    var dur = parseFloat((el.getAttribute('style') || '').replace(/.*--marquee-duration:\s*([\d.]+)s.*/, '$1')) || 25;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var pos = 0, selfSet = false, hold = 0, hovering = false, dragging = false, moved = 0, last = 0;
    function half() { return group.offsetWidth; }
    function wrap(v) { var h = half(); if (!h) return v; if (v >= h) v -= h; else if (v < 0) v += h; return v; }
    function pause(ms) { hold = Math.max(hold, performance.now() + (ms || 1500)); }
    function frame(t) {
      var dt = Math.min(64, t - (last || t)); last = t;
      if (!reduce && !hovering && !dragging && t > hold && half()) {
        pos = wrap(pos + (half() / dur) * (dt / 1000));
        selfSet = true; el.scrollLeft = pos;
      }
      requestAnimationFrame(frame);
    }
    el.addEventListener('scroll', function () {
      if (selfSet) { selfSet = false; return; }
      var w = wrap(el.scrollLeft); if (w !== el.scrollLeft) { selfSet = true; el.scrollLeft = w; }
      pos = w; pause(1500);
    }, { passive: true });
    el.addEventListener('mouseenter', function () { hovering = true; });
    el.addEventListener('mouseleave', function () { hovering = false; pause(600); });
    ['touchstart', 'wheel', 'keydown'].forEach(function (ev) { el.addEventListener(ev, function () { pause(2000); }, { passive: true }); });
    // mouse drag
    var sx = 0, sl = 0;
    el.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragging = true; moved = 0; sx = e.clientX; sl = el.scrollLeft; el.classList.add('is-dragging');
      try { el.setPointerCapture(e.pointerId); } catch (x) {}
    });
    el.addEventListener('pointermove', function (e) {
      if (!dragging) return; var d = e.clientX - sx; moved = Math.max(moved, Math.abs(d)); el.scrollLeft = sl - d;
    });
    function end() { if (!dragging) return; dragging = false; el.classList.remove('is-dragging'); pos = el.scrollLeft; pause(1200); }
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
    el.addEventListener('click', function (e) { if (moved > 5) { e.preventDefault(); e.stopPropagation(); moved = 0; } }, true);
    requestAnimationFrame(frame);
  }
  function init() { document.querySelectorAll('[id^="concern-marquee-"][id$="__image_slider_Naj8LX"], [id^="concern-marquee-"][id$="__image_slider_yBHBqj"]').forEach(setup); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
