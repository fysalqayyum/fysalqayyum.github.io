/* ═══════════════════════════════════════════════════
   Dr.-Ing. Faisal Qayyum — main.js
   Pure vanilla JS, no dependencies
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── 1. SMOOTH SCROLL ─────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ─── 2. NAV SCROLL BEHAVIOR ───────────────────────
  var nav = document.getElementById('nav');
  function handleNavScroll() {
    if (!nav) return;
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ─── 3. ACTIVE NAV LINK ──────────────────────────
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav__link');

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-30% 0px -70% 0px' });

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  // ─── 4. SCROLL ANIMATIONS ────────────────────────
  var animElements = document.querySelectorAll('.animate-on-scroll');
  var animObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  animElements.forEach(function (el) {
    animObserver.observe(el);
  });

  // ─── 5. COUNTER ANIMATION ────────────────────────
  var counters = document.querySelectorAll('[data-target]');
  var counterAnimated = new Set();

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var duration = 1500;
    var start = 0;
    var startTime = null;

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var current = Math.floor(easeOut(progress) * target);
      el.textContent = current.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(step);
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !counterAnimated.has(entry.target)) {
        counterAnimated.add(entry.target);
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(function (counter) {
    counterObserver.observe(counter);
  });

  // ─── 6. FAQ ACCORDION ────────────────────────────
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq-item__question');
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');

      // Close all others
      faqItems.forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ─── 7. MOBILE MENU ──────────────────────────────
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');

  function toggleMenu() {
    var isOpen = mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', !isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  // Close mobile menu on link click
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (mobileMenu.classList.contains('open')) {
          toggleMenu();
        }
      });
    });
  }

  // Close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      toggleMenu();
    }
  });

  // ─── 8. EMAIL OBFUSCATION ────────────────────────
  function buildMailto(subject, body) {
    var u = 'fysalqayyum';
    var d = 'yahoo.com';
    var href = 'mailto:' + u + '@' + d;
    if (subject) href += '?subject=' + encodeURIComponent(subject);
    if (body) href += (subject ? '&' : '?') + 'body=' + encodeURIComponent(body);
    window.location.href = href;
  }

  function trackSiteEvent(name, label) {
    var eventLabel = label || window.location.pathname;
    if (typeof window.clarity === 'function') {
      window.clarity('event', name);
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, {
        event_category: 'site_engagement',
        event_label: eventLabel
      });
    }
  }

  function bookingFallbackEmail() {
    trackSiteEvent('booking_fallback_message', window.location.pathname);
    buildMailto(
      'Booking link problem / appointment request',
      'Hello Dr. Qayyum,\n\nI tried to book a 15-minute call, but the booking page did not work for me.\n\nMy timezone is: [Your timezone]\nSuitable times for me are:\n1. [Option 1]\n2. [Option 2]\n3. [Option 3]\n\nWhat I would like to discuss:\n[Briefly describe your question]\n\nBest regards,\n[Your Name]'
    );
  }

  function enhanceBookingCtas() {
    document.querySelectorAll('a[href*="cal.eu/fysalqayyum/15min"]').forEach(function (link) {
      link.addEventListener('click', function () {
        trackSiteEvent('booking_click', link.textContent.trim() || window.location.pathname);
      });

      var ctaBox = link.closest('.cta-box');
      if (!ctaBox || ctaBox.querySelector('.booking-fallback-link')) return;

      var fallback = document.createElement('button');
      fallback.type = 'button';
      fallback.className = 'btn btn--outline booking-fallback-link';
      fallback.textContent = 'Booking not working? Send a message';
      fallback.addEventListener('click', bookingFallbackEmail);
      link.insertAdjacentElement('afterend', fallback);
    });
  }

  var emailBtn = document.getElementById('emailBtn');
  var contactModalOverlay = document.getElementById('contactModalOverlay');
  var contactModalClose = document.getElementById('contactModalClose');
  var pendingService = null;

  function openContactModal() {
    if (contactModalOverlay) contactModalOverlay.classList.add('open');
  }
  function closeContactModal() {
    if (contactModalOverlay) contactModalOverlay.classList.remove('open');
    pendingService = null;
  }

  if (emailBtn) {
    emailBtn.addEventListener('click', function () {
      if (contactModalOverlay) {
        openContactModal();
      } else {
        buildMailto();
      }
    });
  }

  if (contactModalOverlay) {
    contactModalOverlay.addEventListener('click', function (e) {
      if (e.target === contactModalOverlay) closeContactModal();
    });
  }
  if (contactModalClose) {
    contactModalClose.addEventListener('click', closeContactModal);
  }

  document.querySelectorAll('.contact-modal__option').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var href = this.getAttribute('data-href');
      if (href) {
        if (href.indexOf('http') === 0) {
          if (href.indexOf('cal.eu/fysalqayyum/15min') !== -1) {
            trackSiteEvent('booking_click', 'contact_modal');
          }
          window.open(href, '_blank', 'noopener');
          closeContactModal();
        } else {
          window.location.href = href;
        }
        return;
      }
      var subject = this.getAttribute('data-subject') || '';
      var body = this.getAttribute('data-body') || '';
      if (pendingService && subject) {
        subject += ' — ' + pendingService;
      }
      trackSiteEvent('contact_us', subject || 'contact_modal');
      closeContactModal();
      var u = 'fysalqayyum', d = 'yahoo.com';
      var mailHref = 'mailto:' + u + '@' + d;
      if (subject) mailHref += '?subject=' + encodeURIComponent(subject);
      if (body) mailHref += (subject ? '&' : '?') + 'body=' + body;
      window.location.href = mailHref;
    });
  });

  // ─── 9. SERVICE CARD CLICK (whole card) ──────────
  // Opens the contact picker modal (mailto alone is a dead click for
  // users without a configured mail client — most mobile in-app browsers).
  document.querySelectorAll('.service-card[data-service]').forEach(function (card) {
    card.addEventListener('click', function (e) {
      // Links inside a card (e.g. "Full service details") navigate on their own
      if (e.target.closest('a')) return;
      var service = this.getAttribute('data-service');
      trackSiteEvent('contact_us', 'service_card_' + service);
      if (contactModalOverlay) {
        pendingService = service;
        openContactModal();
      } else {
        var subject = 'I need assistance related to ' + service;
        var body = 'Hello Dr. Qayyum,\n\nI am reaching out regarding your ' + service + ' consulting service.\n\n[Please describe your project or question here]\n\nBest regards,\n[Your Name]';
        buildMailto(subject, body);
      }
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // ─── 9b. FUNNEL EVENT LABELS ──────────────────────
  enhanceBookingCtas();

  document.addEventListener('click', function (e) {
    var target = e.target.closest('a, button');
    if (!target) return;

    var href = target.getAttribute('href') || target.getAttribute('data-href') || '';

    if (target.id === 'emailBtn' || target.classList.contains('subscribe-box__btn')) {
      trackSiteEvent(target.id === 'emailBtn' ? 'contact_us' : 'subscribe', target.id || 'subscribe_box');
      return;
    }

    if (href.indexOf('wa.me/') !== -1) {
      trackSiteEvent('whatsapp_click', window.location.pathname);
      return;
    }

    if (href.indexOf('/services/') !== -1 || href.indexOf('services/') === 0) {
      trackSiteEvent('service_detail_click', href);
      return;
    }

    if (target.closest('.post-content') && (href.indexOf('/blog/posts/') !== -1 || href.indexOf('2026-') === 0)) {
      trackSiteEvent('internal_related_click', href);
      return;
    }

    if (target.closest('.blog-card')) {
      trackSiteEvent('blog_card_click', href);
    }
  });

  // ─── 11. AWARDS MARQUEE (clone cards for seamless loop) ──
  (function () {
    var track = document.getElementById('awardsTrack');
    if (!track) return;
    var cards = track.querySelectorAll('.award-card');
    cards.forEach(function (card) {
      track.appendChild(card.cloneNode(true));
    });
  })();

  // ─── 11b. COLLABORATOR MARQUEE (clone tiles for seamless loop) ──
  (function () {
    var track = document.getElementById('collabTrack');
    if (!track) return;
    var tiles = track.querySelectorAll('.collab-tile');
    tiles.forEach(function (tile) {
      track.appendChild(tile.cloneNode(true));
    });
  })();

  // ─── 12. TESTIMONIALS SLIDER ────────────────────
  (function () {
    var slider = document.querySelector('.testimonials-slider');
    var track = document.getElementById('testimonialTrack');
    var dotsContainer = document.getElementById('testimonialDots');
    if (!track || !dotsContainer) return;

    var cards = track.querySelectorAll('.testimonial-card');
    var total = cards.length;
    var current = 0;
    var autoInterval;
    var initialized = false;

    // Create dots
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.className = 'testimonials-slider__dot';
      dot.setAttribute('aria-label', 'Testimonial ' + (i + 1));
      dot.setAttribute('data-index', i);
      dotsContainer.appendChild(dot);
    }
    var dots = dotsContainer.querySelectorAll('.testimonials-slider__dot');

    function goTo(index) {
      current = ((index % total) + total) % total;

      // Use percentage-based positioning (works even when hidden)
      var cardPercent = 100 / total;
      var offset = current * cardPercent;
      // Center the active card: shift by half container minus half card
      // Each card is ~62% of container (60% + 2% margin)
      var cardSize = 62; // approximate percentage
      var centerShift = (100 - cardSize) / 2;
      var translatePercent = offset * (cardSize / 100) - (centerShift / 100);

      // Pixel-based approach using actual widths (only when visible)
      var containerWidth = track.parentElement.offsetWidth;
      if (containerWidth > 0) {
        var pixelOffset = 0;
        for (var j = 0; j < current; j++) {
          pixelOffset += cards[j].offsetWidth + parseFloat(getComputedStyle(cards[j]).marginLeft) + parseFloat(getComputedStyle(cards[j]).marginRight);
        }
        var activeWidth = cards[current].offsetWidth;
        var centerOffset = pixelOffset - (containerWidth - activeWidth) / 2;
        track.style.transform = 'translateX(' + (-centerOffset) + 'px)';
      }

      cards.forEach(function (c, i) {
        c.classList.toggle('active', i === current);
      });
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    // Dot click
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goTo(parseInt(this.getAttribute('data-index'), 10));
        resetAuto();
      });
    });

    // Card click — navigate to clicked card
    cards.forEach(function (card, i) {
      card.addEventListener('click', function () {
        if (i !== current) {
          goTo(i);
          resetAuto();
        }
      });
    });

    // Auto-advance
    function startAuto() {
      autoInterval = setInterval(function () {
        goTo(current + 1);
      }, 5000);
    }

    function resetAuto() {
      clearInterval(autoInterval);
      startAuto();
    }

    // Touch/swipe support
    var startX = 0;
    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        goTo(diff > 0 ? current + 1 : current - 1);
        resetAuto();
      }
    });

    // Recalculate on resize
    window.addEventListener('resize', function () {
      goTo(current);
    });

    // Init: wait for element to become visible, then position
    // Set active class immediately (works even when hidden)
    cards[0].classList.add('active');
    dots[0].classList.add('active');

    // Use IntersectionObserver to init when visible
    var initObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !initialized) {
        initialized = true;
        goTo(0);
        startAuto();
        initObserver.disconnect();
      }
    }, { threshold: 0.1 });
    initObserver.observe(slider);
  })();

  // ─── 14. TESTIMONIAL ADAPTIVE TEXT SIZE ─────────────
  (function () {
    var texts = document.querySelectorAll('.testimonial-card__text');
    if (!texts.length) return;
    texts.forEach(function (el) {
      var len = el.textContent.length;
      // Scale: short (<150) = 1.05rem, medium (150-350) = 0.95rem, long (>350) = 0.82rem
      if (len < 150) {
        el.style.fontSize = '1.05rem';
      } else if (len < 250) {
        el.style.fontSize = '0.95rem';
      } else if (len < 400) {
        el.style.fontSize = '0.85rem';
      } else {
        el.style.fontSize = '0.78rem';
      }
    });
  })();

  // ─── 13. FAQ SHOW MORE ──────────────────────────────
  (function () {
    var faqList = document.getElementById('faqList');
    var btn = document.getElementById('faqShowMore');
    if (!faqList || !btn) return;

    btn.addEventListener('click', function () {
      if (faqList.classList.contains('faq-list--collapsed')) {
        faqList.classList.remove('faq-list--collapsed');
        faqList.classList.add('faq-list--expanded');
        btn.textContent = 'Show Fewer Questions';
      } else {
        faqList.classList.remove('faq-list--expanded');
        faqList.classList.add('faq-list--collapsed');
        btn.textContent = 'Show All Questions';
        faqList.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  })();

  // ─── 10. FOOTER YEAR ──────────────────────────────
  var yearEl = document.getElementById('footerYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ─── 15. STICKY MOBILE CTA ───────────────────────
  var stickyCta = document.getElementById('stickyCta');
  if (stickyCta) {
    window.addEventListener('scroll', function () {
      stickyCta.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
  }

  // ─── 16. READING PROGRESS BAR ────────────────────
  var readingProgress = document.getElementById('readingProgress');
  var article = document.querySelector('.post-content');
  if (readingProgress && article) {
    window.addEventListener('scroll', function () {
      var top = article.offsetTop;
      var height = article.offsetHeight - window.innerHeight;
      var scrolled = window.scrollY - top;
      var pct = Math.min(Math.max((scrolled / height) * 100, 0), 100);
      readingProgress.style.width = pct + '%';
    }, { passive: true });
  }

  // ─── 17. SUBSCRIBE BOX ───────────────────────────
  document.querySelectorAll('.subscribe-box__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      buildMailto(
        'Subscribe: new blog posts by email',
        'Hello Dr. Qayyum,\n\nPlease add me to your mailing list for new blog posts.\n\nBest regards,\n[Your Name]'
      );
    });
  });

})();
