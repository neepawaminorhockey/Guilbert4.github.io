/* =============================================
   BMHA — Main JS
   ============================================= */

(function () {
  'use strict';

  /* ---------- THEME — always light ---------- */
  document.documentElement.setAttribute('data-theme', 'light');

  /* ---------- MOBILE NAV ---------- */
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      // Animate hamburger lines
      const spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  /* ---------- RESOURCES DROPDOWN ---------- */
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    const btn = dropdown.querySelector('.nav-dropdown__btn');
    const menu = dropdown.querySelector('.nav-dropdown__menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = btn.classList.toggle('is-open');
      menu.classList.toggle('is-open', isOpen);
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        btn.classList.remove('is-open');
        menu.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ---------- STICKY HEADER SCROLL EFFECT ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const current = window.scrollY;
      if (current > 80) {
        header.style.boxShadow = '0 4px 24px rgba(0,0,0,0.25)';
      } else {
        header.style.boxShadow = '';
      }
      lastScroll = current;
    }, { passive: true });
  }

  /* ---------- DIVISION TABS (generic) ---------- */
  document.querySelectorAll('.division-tabs').forEach(tabContainer => {
    const tabs = tabContainer.querySelectorAll('.div-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const panelId = tab.getAttribute('data-panel');
        if (!panelId) return;

        // Deactivate all tabs in THIS container
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Hide all panels that are siblings to this tab container or in a nearby parent
        const parent = tabContainer.closest('section') || tabContainer.parentElement;
        parent.querySelectorAll('.schedule-panel').forEach(p => p.classList.remove('active'));

        // Activate target panel
        const panel = document.getElementById(panelId);
        if (panel) panel.classList.add('active');
      });
    });
  });

  /* ---------- NEWS FILTER ---------- */
  const newsFilterBtns = document.querySelectorAll('.news-filter-btn');
  const newsCards = document.querySelectorAll('#news-grid .news-card');

  if (newsFilterBtns.length) {
    newsFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        newsFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        newsCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = '';
            card.style.opacity = '1';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---------- REGISTRATION FORM ---------- */
  const regForm = document.getElementById('reg-form');
  const regSuccess = document.getElementById('reg-success');

  if (regForm && regSuccess) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!regForm.checkValidity()) {
        // Mark invalid fields
        regForm.querySelectorAll('[required]').forEach(field => {
          if (!field.value.trim()) {
            field.style.borderColor = 'var(--color-error)';
          }
        });
        return;
      }
      // Simulate submission
      regForm.style.display = 'none';
      regSuccess.style.display = 'block';
      regSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // Clear error styling on input
    regForm.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => { field.style.borderColor = ''; });
    });
  }

  /* ---------- CONTACT FORM ---------- */
  const contactForm = document.getElementById('contact-form');
  const contactSuccess = document.getElementById('contact-success');

  if (contactForm && contactSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) return;
      contactForm.style.display = 'none';
      contactSuccess.style.display = 'block';
      contactSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- SMOOTH SCROLL ANCHOR LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll(
    '.news-card, .team-card, .team-roster-card, .stat-item, .sponsor-item, .contact-card'
  );

  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s`;
      observer.observe(el);
    });
  }

  /* ---------- ACTIVE NAV LINK ---------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- COUNTER ANIMATION ---------- */
  function animateCounter(el, target, duration) {
    const start = performance.now();
    const isDecimal = String(target).includes('.');
    const update = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * target;
      el.textContent = isDecimal ? value.toFixed(1) : Math.floor(value).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
    };
    requestAnimationFrame(update);
  }

  // Animate stat numbers when visible
  const statNums = document.querySelectorAll('.stat-item__num, .hero-stat__num');
  if ('IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const raw = el.textContent.replace(/[^0-9.]/g, '');
          const num = parseFloat(raw);
          if (!isNaN(num) && num > 10) {
            animateCounter(el, num, 1200);
          }
          statObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => statObserver.observe(el));
  }

})();
