// Page B events. Tags live only in GTM-NSBRS9XN, whose snippet is in b/index.html; this file
// loads nothing. vaTrack() pushes the same event names as page A's trackEvent() in script.js
// into the dataLayer, where GTM can pick them up.
(function () {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.vaTrack = function (name, params) {
    window.gtag('event', name, params || {});
  };
})();
