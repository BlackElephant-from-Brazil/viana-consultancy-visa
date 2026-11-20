// Cookie banner and Google Consent Mode for visa.vianaconsultancy.com (2026-11-20).
//
// Every page sets the Consent Mode default (all denied) and restores a saved choice in an inline
// script in <head>, BEFORE the GTM snippet, so no tag runs ahead of the visitor's choice. This
// file only draws the banner, saves the choice and sends the update. The tags themselves live in
// GTM-NSBRS9XN and must respect consent there (GA4 and Google Ads read Consent Mode by
// themselves; any other tag, such as Clarity, needs its own consent check in the container).
//
// Categories, as the privacy policy names them:
//   analytics  -> analytics_storage
//   marketing  -> ad_storage, ad_user_data, ad_personalization
// Storage: localStorage "va_consent" = { v, t, analytics, marketing }. A choice lasts 12 months,
// then the banner asks again. Any link or button with [data-consent-open] reopens the choices.
// Withdrawing a category also deletes the cookies that category had set on this site.
(function () {
  'use strict';
  var KEY = 'va_consent';
  var VERSION = 1;
  var MAX_AGE = 365 * 24 * 60 * 60 * 1000;
  var PRIVACY_URL = '/privacy.html';

  function gtag() { (window.dataLayer = window.dataLayer || []).push(arguments); }

  function read() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (c && c.v === VERSION && typeof c.t === 'number' && Date.now() - c.t < MAX_AGE) return c;
    } catch (e) { /* storage blocked: treat as no choice */ }
    return null;
  }

  function consentState(c) {
    var ad = c.marketing ? 'granted' : 'denied';
    return {
      analytics_storage: c.analytics ? 'granted' : 'denied',
      ad_storage: ad,
      ad_user_data: ad,
      ad_personalization: ad
    };
  }

  function deleteCookies(pattern) {
    var host = location.hostname;
    var domains = ['', host, '.' + host];
    var parts = host.split('.');
    if (parts.length > 2) domains.push('.' + parts.slice(-2).join('.'));
    document.cookie.split(';').forEach(function (pair) {
      var name = pair.split('=')[0].trim();
      if (!pattern.test(name)) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  function save(analytics, marketing) {
    var before = read();
    var c = { v: VERSION, t: Date.now(), analytics: !!analytics, marketing: !!marketing };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) { /* choice holds for this page only */ }
    gtag('consent', 'update', consentState(c));
    window.dataLayer.push({
      event: 'consent_update',
      consent_analytics: c.analytics ? 'granted' : 'denied',
      consent_marketing: c.marketing ? 'granted' : 'denied'
    });
    if (before && before.analytics && !c.analytics) deleteCookies(/^(_ga|_gid|_gat|_clck|_clsk|_cl)/);
    if (before && before.marketing && !c.marketing) deleteCookies(/^(_gcl|_gac)/);
    close();
  }

  // ---------- UI ----------
  var root = null;
  var lastFocus = null;

  var CSS = [
    '.vc-consent{position:fixed;z-index:2147483000;left:16px;right:16px;bottom:16px;max-width:560px;margin-left:auto;',
    'background:#fff;color:#1B2A4A;border-radius:14px;box-shadow:0 18px 50px rgba(16,32,74,.22),0 0 0 1px rgba(27,42,74,.08);',
    'font:400 15px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;padding:20px 20px 18px}',
    '.vc-consent *{box-sizing:border-box}',
    '.vc-consent h2{margin:0 0 6px;font-family:inherit;font-weight:700;font-size:17px;line-height:1.3;color:#1B2A4A}',
    '.vc-consent p{margin:0 0 14px;color:#3d4659}',
    '.vc-consent a{color:#1B2A4A;text-decoration:underline;text-underline-offset:3px}',
    '.vc-actions{display:flex;flex-wrap:wrap;gap:8px}',
    '.vc-btn{flex:1 1 auto;min-height:44px;padding:10px 16px;border-radius:999px;border:1.5px solid #1B2A4A;',
    'background:#fff;color:#1B2A4A;font-family:inherit;font-weight:600;font-size:14px;line-height:1.2;cursor:pointer}',
    '.vc-btn--solid{background:#1B2A4A;color:#fff}',
    '.vc-btn--link{flex:0 0 auto;border-color:transparent;text-decoration:underline;text-underline-offset:3px;padding-inline:10px}',
    '.vc-btn:focus-visible,.vc-switch input:focus-visible+span{outline:3px solid #C9A227;outline-offset:2px}',
    '.vc-btn:hover{background:#f1f3f7}.vc-btn--solid:hover{background:#26375e}',
    '.vc-prefs{margin:4px 0 14px;display:grid;gap:10px}',
    '.vc-row{display:flex;gap:14px;align-items:flex-start;justify-content:space-between;padding:12px 14px;border:1px solid #e3e6ec;border-radius:10px}',
    '.vc-row strong{display:block;font-size:14px}.vc-row small{display:block;color:#5c6577;font-size:13px;line-height:1.45;margin-top:2px}',
    '.vc-switch{position:relative;flex:none;width:44px;height:26px;margin-top:2px}',
    '.vc-switch input{position:absolute;inset:0;opacity:0;margin:0;cursor:pointer}',
    '.vc-switch span{position:absolute;inset:0;border-radius:999px;background:#c5cad4;transition:background .2s}',
    '.vc-switch span::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:transform .2s}',
    '.vc-switch input:checked+span{background:#1B2A4A}.vc-switch input:checked+span::after{transform:translateX(18px)}',
    '.vc-switch input:disabled+span{opacity:.55}',
    '@media (max-width:520px){.vc-consent{left:8px;right:8px;bottom:8px;padding:16px;font-size:14px}.vc-consent p{margin-bottom:12px}',
    '.vc-actions{flex-wrap:nowrap;gap:6px}.vc-btn{flex:1 1 0;min-width:0;padding:10px 6px;font-size:13px}}',
    '@media (prefers-reduced-motion:reduce){.vc-switch span,.vc-switch span::after{transition:none}}'
  ].join('');

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (html != null) n.innerHTML = html;
    return n;
  }

  function row(id, title, text, checked, locked) {
    return '<div class="vc-row"><div><strong id="' + id + '-t">' + title + '</strong><small>' + text + '</small></div>' +
      '<label class="vc-switch"><input type="checkbox" id="' + id + '" aria-labelledby="' + id + '-t"' +
      (checked ? ' checked' : '') + (locked ? ' disabled' : '') + '><span></span></label></div>';
  }

  function open(showPrefs) {
    if (!document.getElementById('vc-style')) document.head.appendChild(el('style', { id: 'vc-style' }, CSS));
    close();
    lastFocus = document.activeElement;
    var current = read() || { analytics: false, marketing: false };
    root = el('div', { 'class': 'vc-consent', role: 'dialog', 'aria-modal': 'false', 'aria-labelledby': 'vc-title', 'aria-describedby': 'vc-text' });
    var intro =
      '<h2 id="vc-title">Your privacy choices</h2>' +
      '<p id="vc-text">We would like to measure how visitors use this page and which of our ads bring them here. ' +
      'Nothing beyond what the site needs to work is stored until you choose. You can change your choice at any time ' +
      'under "Cookie settings" at the bottom of the page. <a href="' + PRIVACY_URL + '">Privacy Policy</a></p>';
    if (showPrefs) {
      root.innerHTML = intro +
        '<div class="vc-prefs">' +
        row('vc-necessary', 'Strictly necessary', 'Keeps the page and its forms working. Always on.', true, true) +
        row('vc-analytics', 'Analytics', 'Visit and usage statistics that help us improve this page.', current.analytics, false) +
        row('vc-marketing', 'Advertising', 'Measures which Google Ads bring visitors to this page and lets Google show our ads to people who visited it.', current.marketing, false) +
        '</div>' +
        '<div class="vc-actions">' +
        '<button type="button" class="vc-btn" data-vc="reject">Reject all</button>' +
        '<button type="button" class="vc-btn vc-btn--solid" data-vc="save">Save my choices</button>' +
        '</div>';
    } else {
      root.innerHTML = intro +
        '<div class="vc-actions">' +
        '<button type="button" class="vc-btn" data-vc="reject">Reject all</button>' +
        '<button type="button" class="vc-btn" data-vc="choose">Choose</button>' +
        '<button type="button" class="vc-btn vc-btn--solid" data-vc="accept">Accept all</button>' +
        '</div>';
    }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-vc]');
      if (!b) return;
      var what = b.getAttribute('data-vc');
      if (what === 'accept') save(true, true);
      else if (what === 'reject') save(false, false);
      else if (what === 'choose') open(true);
      else if (what === 'save') save(root.querySelector('#vc-analytics').checked, root.querySelector('#vc-marketing').checked);
    });
    root.addEventListener('keydown', function (e) {
      // Escape closes a reopened panel; on a first visit the banner stays until a choice is made.
      if (e.key === 'Escape' && read()) close();
    });
    document.body.appendChild(root);
    var first = root.querySelector(showPrefs ? '#vc-analytics' : '[data-vc]');
    if (first) first.focus({ preventScroll: true });
  }

  function close() {
    if (!root) return;
    root.remove();
    root = null;
    if (lastFocus && lastFocus.focus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-consent-open]');
    if (!t) return;
    e.preventDefault();
    open(true);
  });

  window.vaConsent = { open: function () { open(true); }, read: read };

  function start() { if (!read()) open(false); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
