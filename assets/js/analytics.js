/* ═══════════════════════════════════════════════════
   Dr.-Ing. Faisal Qayyum — analytics.js
   Consent-gated Google Analytics + Microsoft Clarity.
   No tracking script runs until the visitor accepts.
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  var GA_ID = 'G-FFMZMDW2NV';
  var CLARITY_ID = 'wan2qj09um';
  var STORAGE_KEY = 'fq_consent';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  // Deny analytics storage by default until the visitor consents.
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
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

  function loadClarity() {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  function grantConsent() {
    gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied' });
    loadGA();
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
      '<p class="consent-banner__text">This site uses Google Analytics and Microsoft Clarity to understand how visitors use it. No data is collected until you accept.</p>' +
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
