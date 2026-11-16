// Page B tracking. Same tags as page A (GTM-5DHSWHDP, GA4 G-5PR16BJBR1, Clarity yuf8wg05wt),
// loaded only on the production host so local work and deploy previews never reach the reports.
// Every GA4 event carries ab_variant "b" so the two pages can be told apart.
(function () {
  var VARIANT = 'b';
  var LIVE = location.hostname === 'visa.vianaconsultancy.com';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  // script.js of page A calls this "trackEvent"; same event names here.
  window.vaTrack = function (name, params) {
    var p = params || {};
    p.ab_variant = VARIANT;
    if (LIVE) window.gtag('event', name, p);
    else if (window.console) console.info('[track, not sent off production]', name, p);
  };

  if (!LIVE) return;

  function load(src) {
    var s = document.createElement('script');
    s.async = true; s.src = src;
    document.head.appendChild(s);
  }

  // Google Tag Manager
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js', ab_variant: VARIANT });

  // Google Analytics 4
  window.gtag('js', new Date());
  window.gtag('set', { ab_variant: VARIANT });
  window.gtag('set', 'user_properties', { ab_variant: VARIANT });
  window.gtag('config', 'G-5PR16BJBR1', { ab_variant: VARIANT });

  // Microsoft Clarity
  window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
  window.clarity('set', 'ab_variant', VARIANT);

  // The queues above take events at once; the libraries (about 500 KB) are fetched after the
  // page load event so they never compete with the page itself on a slow connection.
  function start() {
    load('https://www.googletagmanager.com/gtm.js?id=GTM-5DHSWHDP');
    load('https://www.googletagmanager.com/gtag/js?id=G-5PR16BJBR1');
    load('https://www.clarity.ms/tag/yuf8wg05wt');
  }
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
})();
