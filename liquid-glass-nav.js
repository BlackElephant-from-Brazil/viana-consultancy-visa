/* ============================================================
   Liquid Glass nav, plain JavaScript.

   A port of the React component liquid-glass-nav (LiquidGlassNav.tsx,
   stores.ts and GlassLens.tsx, extracted from guyshore.com). The markup is
   static in index.html; this file only drives the attributes the CSS in
   liquid-glass-nav.css reads on .lgn-shell:

     data-detached  the page has scrolled away from the top: the full-width
                    bar becomes the floating glass island
     data-tone      light | mixed | dark, what sits under the island
     data-open      the phone menu is open
     data-ready     the first real state has painted (transitions on)
     data-lens      the refracting rim is running (desktop Chromium only)

   The dropdown of the original is left out: this page has no sub-links.
   One nav per page: the lens filter id is fixed.
   ============================================================ */
(function () {
  'use strict';

  var header = document.querySelector('.lgn');
  var shell = header && header.querySelector('.lgn-shell');
  if (!shell) return;
  var toggle = shell.querySelector('.lgn-toggle');
  var mobile = shell.querySelector('.lgn-mobile');

  /* The width at which the desktop links replace the phone menu. Keep it in
     step with the four `@media (min-width: 60rem)` blocks in the CSS. */
  var wide = window.matchMedia('(min-width: 60rem)');

  var detached = false;
  var open = false;
  var tone = 'light';
  var lens = null;

  function menuOpen() {
    return open && !wide.matches;
  }

  /* The tone only applies to the island: the attached bar is nearly opaque
     paper, so its labels stay ink. With the phone menu open the island is a
     tall panel of links, so it stays light too. */
  function render() {
    var isOpen = menuOpen();
    shell.setAttribute('data-detached', String(detached));
    shell.setAttribute('data-open', String(isOpen));
    shell.setAttribute('data-tone', isOpen || !detached ? 'light' : tone);
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.textContent = isOpen ? toggle.getAttribute('data-close') : toggle.getAttribute('data-menu');
    }
    if (mobile) mobile.hidden = !isOpen;
  }

  /* ------------------------------------------------------------ detached */

  // Two thresholds rather than one: iOS rubber-bands the page a few pixels
  // past the top, and a single threshold would flicker the bar on every bounce.
  var DETACH_AT = 16;
  var ATTACH_AT = 4;

  function updateDetached() {
    var y = window.scrollY;
    var next = detached ? y > ATTACH_AT : y > DETACH_AT;
    if (next === detached) return;
    detached = next;
    render();
    if (lens) {
      if (detached) lens.enter();
      else lens.leave();
    }
  }

  /* ------------------------------------------------------------ geometry */

  function remPx() {
    return parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  }

  /* Reads a length custom property (px or rem only) from the shell. The CSS
     resolves each public variable into a private alias with its default, so
     the alias always holds the value in use. */
  function lengthVar(name, rem, fallback) {
    var raw = getComputedStyle(shell).getPropertyValue(name).trim();
    var n = parseFloat(raw);
    if (isNaN(n)) return fallback;
    return /rem$/.test(raw) ? n * rem : n;
  }

  /* Where the island settles, computed from the CSS custom properties rather
     than measured: the scroll event arrives on the first frame of the morph,
     when the live box is still the full-width bar. */
  function islandGeometry() {
    var rem = remPx();
    var box = header.clientWidth || window.innerWidth;
    var max = lengthVar('--_lgn-island-max', rem, 74 * rem);
    var inset = lengthVar('--_lgn-island-inset', rem, 0.75 * rem);
    return {
      left: Math.max(inset, (box - max) / 2),
      width: Math.min(box - 2 * inset, max),
      top: lengthVar('--_lgn-island-top', rem, 0.625 * rem),
      height: lengthVar('--_lgn-island-h', rem, 3.5 * rem),
      barHeight: lengthVar('--_lgn-bar-h', rem, 4.5 * rem)
    };
  }

  /* ---------------------------------------------------------------- tone

     light: paper or light surfaces all the way across. Clear glass, ink labels.
     dark:  a dark surface across the whole island. Smoky glass, paper labels.
     mixed: something dark, an image or a large heading under part of it. The
            glass tints up so ink labels stay legible whatever is underneath.

     A full-bleed dark section opts in with data-nav-tone="dark" on its
     outermost element. Otherwise six points along the island's center line
     are hit-tested: the first element under each with an opaque background
     gives its luminance, an image counts as unknown unless it carries
     data-nav-luma="light", and text of 36px or more counts as unknown. */

  var SAMPLES = 6;
  var DARK_BELOW = 0.4;
  var BUSY_TEXT_PX = 36;
  var frame = 0;
  var settleTimer = 0;

  function luminance(rgb) {
    var m = rgb.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
    if (!m) return null;
    if (m[4] !== undefined && parseFloat(m[4]) < 0.5) return null; // see-through
    var f = function (v) {
      var c = parseFloat(v) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(m[1]) + 0.7152 * f(m[2]) + 0.0722 * f(m[3]);
  }

  function sample(x, y) {
    var els = document.elementsFromPoint(x, y);
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (header.contains(el) || el.tagName === 'CANVAS') continue;
      if (el.tagName === 'IMG' || el.tagName === 'VIDEO' || el.tagName === 'PICTURE') {
        return el.getAttribute('data-nav-luma') === 'light' ? 'light' : 'unknown';
      }
      if (el.closest('[data-nav-tone="dark"]')) return 'dark';
      var style = getComputedStyle(el);
      if (parseFloat(style.fontSize) >= BUSY_TEXT_PX) return 'unknown';
      var l = luminance(style.backgroundColor);
      if (l === null) continue;
      return l < DARK_BELOW ? 'dark' : 'light';
    }
    return 'light';
  }

  function measureTone() {
    var g = islandGeometry();
    var left = detached ? g.left : 0;
    var width = detached ? g.width : header.clientWidth;
    var right = left + width;
    var y = detached ? g.top + g.height / 2 : g.barHeight / 2;

    var darkSections = document.querySelectorAll('[data-nav-tone="dark"]');
    for (var i = 0; i < darkSections.length; i++) {
      var r = darkSections[i].getBoundingClientRect();
      if (r.top <= y && r.bottom >= y && r.left <= left + 1 && r.right >= right - 1) return 'dark';
    }

    var dark = 0;
    var unknown = 0;
    for (var s = 0; s < SAMPLES; s++) {
      var x = left + 24 + ((width - 48) * s) / (SAMPLES - 1);
      var kind = sample(x, y);
      if (kind === 'dark') dark++;
      else if (kind === 'unknown') unknown++;
    }
    if (dark === SAMPLES) return 'dark';
    // One small image under the island is not a reason to tint up; two, or
    // any dark surface, is.
    if (dark > 0 || unknown > 1) return 'mixed';
    return 'light';
  }

  function updateTone() {
    frame = 0;
    var next = measureTone();
    if (next === tone) return;
    tone = next;
    render();
  }

  /* Coalesces scroll and resize bursts into one measurement per frame, plus
     one more once the morph and any layout under the island have settled. */
  function scheduleToneUpdate() {
    clearTimeout(settleTimer);
    settleTimer = setTimeout(updateTone, 600);
    if (frame) return;
    frame = requestAnimationFrame(updateTone);
  }

  /* ---------------------------------------------------------------- lens

     The refracting rim. Chromium runs an SVG filter inside backdrop-filter,
     so `backdrop-filter: url(#lgn-lens)` displaces the page through a map
     drawn to the island's exact shape: a band along the whole perimeter that
     folds the backdrop toward the rim, stronger on the caps than on the
     straight edges.

     Only Chromium runs SVG filters inside backdrop-filter. Safari and Firefox
     parse url() as valid and then paint no backdrop at all, so the gate is
     the Chromium brand in navigator.userAgentData, plus a fine pointer, so
     phones keep the cheaper material. Never set data-lens by hand.

     The swap from blur() to url() cannot interpolate, so it is made
     invisible: on the frame the island detaches the filter is parked at the
     exact look of the attached bar's blur (displacement 0, total blur 12px),
     then its parameters ramp on the same spring the CSS uses. On the way back
     the ramp runs first and the attribute goes only when the filter is back
     at that look. */

  var LENS_ID = 'lgn-lens';
  var BAND = 18;
  var BAND_EDGE = 12;
  var STRENGTH = 22;
  var EDGE_MIN = 0.7;
  var DIRECTION = -1;
  var BLUR_ATTACHED = 12;
  var DURATION = 500;
  var DPR = 2;
  var SCALE = 2 * STRENGTH;

  function settleFor(blur) { return Math.min(3, 0.75 * blur); }
  function frostFor(total, settle) { return Math.sqrt(Math.max(0, total * total - settle * settle)); }
  // The critically damped spring the CSS carries as linear().
  function spring(t) { return 1 - (1 + 7.6 * t) * Math.exp(-7.6 * t); }

  var mapCache = new Map();

  function pillMap(w, h) {
    var key = w + 'x' + h;
    if (mapCache.has(key)) return mapCache.get(key);
    var W = Math.round(w * DPR);
    var H = Math.round(h * DPR);
    var canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext('2d');
    if (!ctx) return '';
    var img = ctx.createImageData(W, H);
    var r = h / 2;
    var ax = r;
    var bx = w - r;
    var cy = h / 2;
    for (var py = 0; py < H; py++) {
      for (var px = 0; px < W; px++) {
        var x = (px + 0.5) / DPR;
        var y = (py + 0.5) / DPR;
        // Closest point on the pill's medial segment gives the outward normal.
        var qx = Math.min(Math.max(x, ax), bx);
        var vx = x - qx;
        var vy = y - cy;
        var dist = Math.hypot(vx, vy) || 1e-6;
        var nx = vx / dist;
        var ny = vy / dist;
        var sd = r - dist; // signed distance to the edge, positive inside
        // 1 at the outermost point of a cap, 0 on the straight edges.
        var k = Math.abs(nx);
        var band = BAND_EDGE + (BAND - BAND_EDGE) * k;
        var amp = STRENGTH * (EDGE_MIN + (1 - EDGE_MIN) * k);
        var dx = 0;
        var dy = 0;
        if (sd < band && sd > -1) {
          var t = Math.min(1, Math.max(0, 1 - sd / band));
          // A bump: nothing at the rim, peak a third of the way in, nothing
          // at the band's inner edge.
          var m = Math.pow(4 * t * (1 - t), 1.2) * amp * DIRECTION;
          dx = nx * m;
          dy = ny * m;
        }
        var i = (py * W + px) * 4;
        img.data[i] = Math.round((0.5 + dx / SCALE) * 255);
        img.data[i + 1] = Math.round((0.5 + dy / SCALE) * 255);
        img.data[i + 2] = 128;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    var url = canvas.toDataURL('image/png');
    mapCache.set(key, url);
    // A drag-resize settles at many widths; keep the last few.
    if (mapCache.size > 4) mapCache.delete(mapCache.keys().next().value);
    return url;
  }

  function lensSupported() {
    if (typeof CSS === 'undefined') return false;
    var uad = navigator.userAgentData;
    var brands = (uad && uad.brands) || [];
    if (!brands.some(function (b) { return /chromium/i.test(b.brand); })) return false;
    if (navigator.vendor === 'Apple Computer, Inc.') return false;
    if (matchMedia('(prefers-reduced-transparency: reduce)').matches) return false;
    if (matchMedia('(prefers-contrast: more)').matches) return false;
    if (matchMedia('(forced-colors: active)').matches) return false;
    // The displacement and two blurs re-run on every scroll frame. Desktops
    // carry that; a mid-range phone may not.
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return false;
    return CSS.supports('backdrop-filter', 'url(#' + LENS_ID + ')');
  }

  function createLens(blur) {
    if (!lensSupported()) return null;
    var filter = document.getElementById(LENS_ID);
    var displace = filter && filter.querySelector('feDisplacementMap');
    var soft = filter && filter.querySelector('feGaussianBlur[result="soft0"]');
    var frost = filter && filter.querySelector('feGaussianBlur[result="frost"]');
    var image = document.getElementById(LENS_ID + '-map');
    if (!displace || !soft || !frost || !image) return null;
    var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    function size() {
      var g = islandGeometry();
      return { w: Math.round(g.width), h: Math.round(g.height) };
    }
    var lastWidth = 0;
    function drawMap() {
      if (shell.getAttribute('data-open') === 'true') return; // the map only fits a capsule
      var s = size();
      lastWidth = s.w;
      image.setAttribute('href', pillMap(s.w, s.h));
    }

    var cur = { s: 0, b: BLUR_ATTACHED };
    function setFilter(s, b) {
      cur = { s: s, b: b };
      var settle = settleFor(blur);
      displace.setAttribute('scale', String(s));
      soft.setAttribute('stdDeviation', String(settle));
      frost.setAttribute('stdDeviation', String(frostFor(b, settle)));
    }
    var raf = 0;
    // The first entry is instant: a page that loads already scrolled starts
    // with the lens in place instead of ramping into it.
    var mounting = true;
    function ramp(s1, b1, done) {
      cancelAnimationFrame(raf);
      var s0 = cur.s;
      var b0 = cur.b;
      if (reduced || mounting || (s0 === s1 && b0 === b1)) {
        setFilter(s1, b1);
        if (done) done();
        return;
      }
      var t0 = performance.now();
      function step(now) {
        var p = spring(Math.min(1, (now - t0) / DURATION));
        setFilter(s0 + (s1 - s0) * p, b0 + (b1 - b0) * p);
        if (now - t0 < DURATION) {
          raf = requestAnimationFrame(step);
        } else {
          setFilter(s1, b1);
          if (done) done();
        }
      }
      raf = requestAnimationFrame(step);
    }

    function enter() {
      if (shell.getAttribute('data-open') === 'true') return;
      if (shell.getAttribute('data-lens') !== 'on') {
        drawMap();
        setFilter(0, BLUR_ATTACHED);
        shell.setAttribute('data-lens', 'on');
      }
      ramp(SCALE, blur);
    }
    function leave() {
      ramp(0, BLUR_ATTACHED, function () {
        shell.removeAttribute('data-lens');
      });
    }

    // The first map is drawn while the page is idle, so the first detach
    // does not pay for it in the middle of the morph.
    var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 0); };
    idle(function () {
      var s = size();
      pillMap(s.w, s.h);
    });

    // The island's width follows the header's, which also changes when a
    // scrollbar appears or the browser zooms; only a settled, changed width
    // redraws.
    var timer = 0;
    new ResizeObserver(function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        if (shell.getAttribute('data-lens') === 'on' && size().w !== lastWidth) drawMap();
      }, 120);
    }).observe(header);

    return {
      enter: enter,
      leave: leave,
      mounted: function () { mounting = false; }
    };
  }

  /* ---------------------------------------------------------------- menu */

  function setOpen(value) {
    open = value;
    render();
    // Closing the phone menu while the page sits detached re-enters the lens,
    // which the scroll alone would not know to do.
    if (!menuOpen() && detached && lens) lens.enter();
  }

  if (toggle) {
    toggle.addEventListener('click', function () { setOpen(!menuOpen()); });
  }
  // Any link in the nav closes the menu (they are all anchors on this page).
  header.addEventListener('click', function (event) {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape' || !menuOpen()) return;
    setOpen(false);
    if (toggle) toggle.focus();
  });
  // Crossing the breakpoint with the menu open (a tablet rotating, a window
  // widening) must not leave the island in its menu look with no toggle.
  wide.addEventListener('change', function () {
    if (wide.matches) setOpen(false);
  });

  /* ---------------------------------------------------------------- start */

  var blurPx = parseFloat(getComputedStyle(header).getPropertyValue('--lgn-blur')) || 2;

  render();
  updateDetached(); // a page can load already scrolled (a reload mid-page, a hash link)
  updateTone();
  lens = createLens(blurPx);
  if (lens) {
    if (detached) lens.enter();
    lens.mounted();
  }

  window.addEventListener('scroll', function () {
    updateDetached();
    scheduleToneUpdate();
  }, { passive: true });
  window.addEventListener('resize', scheduleToneUpdate);
  // Layout can change without a scroll: content arriving, images settling.
  new ResizeObserver(scheduleToneUpdate).observe(document.documentElement);

  // Transitions switch on only once the first real state has painted, so a
  // page that loads already scrolled starts as the island.
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { shell.setAttribute('data-ready', ''); });
  });
})();
