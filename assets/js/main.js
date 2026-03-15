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
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (mobileMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

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

  var emailBtn = document.getElementById('emailBtn');
  if (emailBtn) {
    emailBtn.addEventListener('click', function () {
      buildMailto();
    });
  }

  // ─── 9. SERVICE CARD CLICK (whole card) ──────────
  document.querySelectorAll('.service-card[data-service]').forEach(function (card) {
    card.addEventListener('click', function () {
      var service = this.getAttribute('data-service');
      var subject = 'I need assistance related to ' + service;
      var body = 'Hello Dr. Qayyum,\n\nI am reaching out regarding your ' + service + ' consulting service.\n\n[Please describe your project or question here]\n\nBest regards,\n[Your Name]';
      buildMailto(subject, body);
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
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

})();
