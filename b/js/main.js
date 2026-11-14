// Page B. No libraries: one WebGL shader for the wall, a little scroll work, the enquiry form.
import { startWall } from '/b/js/wall.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (sel, root = document) => root.querySelector(sel);

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- scroll: header state, portrait parallax (one rAF-throttled handler) ---------- */
const head = $('.head');
const frame = $('.team__frame');
const img = $('.team__img');
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    head.classList.toggle('is-stuck', scrollY > 24);
    if (!reduced && frame) {
      const r = frame.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) {
        const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; // -1..1 through the viewport
        img.style.setProperty('--py', Math.max(-1, Math.min(1, p)).toFixed(3));
      }
    }
  });
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- azulejos: lay the hero wall tile by tile, glaze follows the pointer ---------- */
const tiles = document.getElementById('tiles');
const wallBox = $('.hero__wall');
function layTiles() {
  const t = parseFloat(getComputedStyle(tiles).getPropertyValue('--t')) || 104;
  const cols = Math.max(1, Math.floor(wallBox.clientWidth / t) + 1);
  const rows = Math.ceil(wallBox.clientHeight / t);
  tiles.style.gridTemplateColumns = 'repeat(' + cols + ',' + t + 'px)';
  const frag = document.createDocumentFragment();
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const el = document.createElement('i');
    el.className = 'tile';
    // the delay runs as a diagonal wave from the foot of the wall; brightness varies like fired glaze
    el.style.setProperty('--d', reduced ? 0 : 120 + ((rows - y) + x) * 55);
    el.style.setProperty('--b', (0.955 + ((x * 7 + y * 13) % 9) / 100).toFixed(3));
    frag.appendChild(el);
  }
  tiles.replaceChildren(frag);
}
layTiles();
let lastW = innerWidth;
addEventListener('resize', () => { if (innerWidth !== lastW) { lastW = innerWidth; layTiles(); } }, { passive: true });
if (!reduced && matchMedia('(pointer: fine)').matches) {
  const sheen = $('.tiles__sheen');
  wallBox.addEventListener('pointermove', (e) => {
    const r = wallBox.getBoundingClientRect();
    sheen.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    sheen.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  }, { passive: true });
}

/* ---------- the wall ---------- */
startWall({
  canvas: document.getElementById('wall'),
  holder: $('.wall'),
  daySections: [],
  duskSection: $('.contact'),
  reduced,
});

/* ---------- enquiry form ----------
   Same n8n workflow and Cloudflare Turnstile widget as page A's "Speak with a lawyer" form.
   The page never redirects: a URL with "thank-you" would count as an eBook download in GTM. */
const WEBHOOK = 'https://black-elephant.app.n8n.cloud/webhook/visa-contact-form';
const SITE_KEY = '0x4AAAAAAFIy-WPSxHbaLcXE';
const MIN_MS = 2500;      // a form sent sooner than this after load is a bot
const TOKEN_WAIT_MS = 8000;
const EMAIL_RE = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]{2,}$/;

const form = document.getElementById('enquiry-form');
const sent = document.getElementById('enquiry-sent');
const errorBox = document.getElementById('enquiry-error');
const checkBox = document.getElementById('enquiry-check');
const btn = $('.form__submit', form);
const fields = {
  name: { el: form.elements.name, err: document.getElementById('e-name'), ok: (v) => v.length > 0 },
  email: { el: form.elements.email, err: document.getElementById('e-email'), ok: (v) => EMAIL_RE.test(v) },
  message: { el: form.elements.message, err: document.getElementById('e-message'), ok: (v) => v.length > 0 },
};
const loadedAt = Date.now();

// Turnstile is loaded only when the visitor gets near the form.
let turnstileP = null;
let widgetId = null;
let token = '';
let waiters = [];
const settle = (v) => { token = v; if (v) waiters.splice(0).forEach((r) => r(v)); };
function loadTurnstile() {
  if (turnstileP) return turnstileP;
  turnstileP = new Promise((resolve, reject) => {
    window.onTurnstileLoad = resolve;
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileLoad';
    s.async = true; s.defer = true; s.onerror = reject;
    document.head.appendChild(s);
  }).then(() => {
    widgetId = window.turnstile.render(checkBox, {
      sitekey: SITE_KEY,
      action: form.dataset.source || 'page-b',
      appearance: 'interaction-only',
      size: checkBox.clientWidth >= 300 ? 'flexible' : 'compact',
      theme: 'light',
      callback: settle,
      'expired-callback': () => settle(''),
      'error-callback': () => settle(''),
    });
  }).catch(() => { turnstileP = null; });
  return turnstileP;
}
const waitForToken = () => (token ? Promise.resolve(token) : new Promise((resolve) => {
  waiters.push(resolve);
  setTimeout(() => resolve(''), TOKEN_WAIT_MS);
}));
const resetWidget = () => { token = ''; if (widgetId !== null && window.turnstile) window.turnstile.reset(widgetId); };

new IntersectionObserver((entries, io) => {
  if (entries.some((e) => e.isIntersecting)) { loadTurnstile(); io.disconnect(); }
}, { rootMargin: '600px 0px' }).observe(form);
form.addEventListener('focusin', loadTurnstile, { once: true });

function setInvalid(f, bad) {
  f.err.hidden = !bad;
  if (bad) f.el.setAttribute('aria-invalid', 'true'); else f.el.removeAttribute('aria-invalid');
}
Object.values(fields).forEach((f) => f.el.addEventListener('input', () => { if (!f.err.hidden) setInvalid(f, false); errorBox.hidden = true; }));

function busy(on) {
  btn.disabled = on;
  btn.textContent = on ? btn.dataset.busy : btn.dataset.label;
}
function showSent() {
  form.hidden = true;
  sent.hidden = false;
  sent.focus({ preventScroll: true });
  sent.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
}
function fail() {
  resetWidget();
  busy(false);
  errorBox.hidden = false;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (btn.disabled) return;
  const values = {
    name: fields.name.el.value.trim().replace(/\s+/g, ' '),
    email: fields.email.el.value.trim(),
    message: fields.message.el.value.trim(),
  };
  let first = null;
  for (const key of Object.keys(fields)) {
    const bad = !fields[key].ok(values[key]);
    setInvalid(fields[key], bad);
    if (bad && !first) first = fields[key].el;
  }
  if (first) { first.focus(); return; }
  errorBox.hidden = true;

  // Honeypot filled, or sent too fast: looks sent, nothing leaves the page.
  if (form.elements.company.value || Date.now() - loadedAt < MIN_MS) return showSent();

  busy(true);
  await loadTurnstile();
  const verified = await waitForToken();
  if (!verified) return fail();

  try {
    const res = await fetch(WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        message: values.message,
        source: form.dataset.source || 'page-b',
        page: location.origin + location.pathname,
        turnstile: verified,
      }),
    });
    if (!res.ok) throw new Error(String(res.status));
    showSent();
    if (window.vaTrack) window.vaTrack('contact_form_submission', { form_source: form.dataset.source || 'page-b' });
  } catch (err) {
    fail();
  }
});
