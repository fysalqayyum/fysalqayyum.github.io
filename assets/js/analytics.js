/* ═══════════════════════════════════════════════════
   Dr.-Ing. Faisal Qayyum — analytics.js
   Google Analytics via Consent Mode v2 (advanced) +
   fully consent-gated Microsoft Clarity.

   GA loads immediately with analytics_storage denied:
   it sets no cookies and sends only cookieless pings
   until the visitor accepts, which keeps aggregate
   traffic measurable without storing anything.
   Clarity records sessions, so it never loads before
   an explicit Accept.
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  var GA_ID = 'G-FFMZMDW2NV';
  var CLARITY_ID = 'wan2qj09um';
  var STORAGE_KEY = 'fq_consent';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  // Deny all storage by default. Must be pushed before gtag.js loads.
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  });

  function loadGA() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  // GA starts in denied mode on every page load, consent or not.
  loadGA();

  function loadClarity() {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  // GA is already loaded; only flip storage on and start Clarity.
  function grantConsent() {
    gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    loadClarity();
  }

  // Returns true if a stored decision already exists (and applies it).
  function applyStoredChoice() {
    var choice = null;
    try { choice = localStorage.getItem(STORAGE_KEY); } catch (e) { /* storage blocked */ }
    if (choice === 'granted') { grantConsent(); return true; }
    if (choice === 'denied') { return true; }
    return false;
  }

  function showBanner() {
    var banner = document.createElement('div');
    banner.className = 'consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<p class="consent-banner__text">This site counts anonymous, cookieless page views to know what gets read. Accept to also allow analytics cookies and Microsoft Clarity, which help me see how pages actually get used. Decline and nothing is stored on your device. See the <a href="/privacy.html">privacy policy</a>.</p>' +
      '<div class="consent-banner__actions">' +
      '<button type="button" class="btn btn--outline consent-banner__decline">Decline</button>' +
      '<button type="button" class="btn btn--primary consent-banner__accept">Accept</button>' +
      '</div>';
    document.body.appendChild(banner);

    requestAnimationFrame(function () { banner.classList.add('visible'); });

    function dismiss() {
      banner.classList.remove('visible');
      setTimeout(function () { banner.remove(); }, 300);
    }

    banner.querySelector('.consent-banner__accept').addEventListener('click', function () {
      try { localStorage.setItem(STORAGE_KEY, 'granted'); } catch (e) { /* storage blocked */ }
      grantConsent();
      dismiss();
    });
    banner.querySelector('.consent-banner__decline').addEventListener('click', function () {
      try { localStorage.setItem(STORAGE_KEY, 'denied'); } catch (e) { /* storage blocked */ }
      dismiss();
    });
  }

  if (!applyStoredChoice()) {
    showBanner();
  }
})();
