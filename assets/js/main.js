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
  var emailBtn = document.getElementById('emailBtn');
  if (emailBtn) {
    emailBtn.addEventListener('click', function () {
      var u = 'fysalqayyum';
      var d = 'yahoo.com';
      window.location.href = 'mailto:' + u + '@' + d;
    });
  }

  // ─── 9. FOOTER YEAR ──────────────────────────────
  var yearEl = document.getElementById('footerYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
