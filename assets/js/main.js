/* ============================================
   DON'T STOP TRIPPING — Main JavaScript
   ============================================ */

'use strict';

// ---- Loading Screen ----
window.addEventListener('load', () => {
  setTimeout(() => {
    const screen = document.getElementById('loading-screen');
    if (screen) {
      screen.classList.add('hidden');
      setTimeout(() => screen.remove(), 600);
    }
  }, 1600);
});

// ---- Cursor Glow ----
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow) {
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });
}

// ---- Navbar Scroll Effect ----
const nav = document.querySelector('.nav');
if (nav) {
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ---- Mobile Nav ----
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const mobileNavClose = document.querySelector('.mobile-nav-close');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
}

if (mobileNavClose && mobileNav) {
  mobileNavClose.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
}

if (mobileNav) {
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ---- Scroll Reveal ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ---- Countdown Timer ----
function initCountdown(targetDateStr, prefix = '') {
  const elements = {
    days: document.querySelector(`${prefix}.countdown-days`),
    hours: document.querySelector(`${prefix}.countdown-hours`),
    minutes: document.querySelector(`${prefix}.countdown-minutes`),
    seconds: document.querySelector(`${prefix}.countdown-seconds`),
  };

  if (!elements.days) return;

  const target = new Date(targetDateStr).getTime();

  const tick = () => {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      Object.values(elements).forEach(el => { if (el) el.textContent = '00'; });
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = n => String(n).padStart(2, '0');

    if (elements.days) elements.days.textContent = pad(days);
    if (elements.hours) elements.hours.textContent = pad(hours);
    if (elements.minutes) elements.minutes.textContent = pad(minutes);
    if (elements.seconds) elements.seconds.textContent = pad(seconds);
  };

  tick();
  setInterval(tick, 1000);
}

// Initialize all countdowns on page
document.addEventListener('DOMContentLoaded', () => {
  initCountdown('2025-08-15T20:00:00');
});

// ---- Number Counter Animation ----
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString();
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter-number[data-target]').forEach(el => {
  counterObserver.observe(el);
});

// ---- Progress Bar Animation ----
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.progress-bar-fill');
      if (fill) {
        fill.style.width = fill.dataset.width || '0%';
      }
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.progress-bar-wrap').forEach(el => {
  progressObserver.observe(el);
});

// ---- Accordion ----
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.closest('.accordion-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.accordion-item.open').forEach(openItem => {
      openItem.classList.remove('open');
    });

    // Open clicked if it was closed
    if (!isOpen) item.classList.add('open');
  });
});

// ---- Tabs ----
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('[data-tabs]') || btn.parentElement;
    const target = btn.dataset.tab;

    group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const panelContainer = document.querySelector(`[data-tab-panels="${btn.closest('.tabs').dataset.tabGroup}"]`)
      || btn.closest('section, .card-body, [data-tab-group]');

    if (panelContainer) {
      panelContainer.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
      const targetPanel = panelContainer.querySelector(`[data-panel="${target}"]`);
      if (targetPanel) targetPanel.classList.add('active');
    }
  });
});

// ---- Parallax Effect ----
const parallaxElements = document.querySelectorAll('.parallax-bg');
if (parallaxElements.length) {
  const onParallaxScroll = () => {
    parallaxElements.forEach(el => {
      const section = el.closest('.parallax-section');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      if (rect.bottom < 0 || rect.top > viewH) return;
      const progress = (viewH - rect.top) / (viewH + rect.height);
      const offset = (progress - 0.5) * 80;
      el.style.transform = `translateY(${offset}px)`;
    });
  };
  window.addEventListener('scroll', onParallaxScroll, { passive: true });
}

// ---- Sticky CTA ----
const stickyCta = document.querySelector('.sticky-cta');
if (stickyCta) {
  window.addEventListener('scroll', () => {
    stickyCta.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
}

// ---- Toast Notification ----
window.showToast = function(message, icon = '✅', duration = 3000) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-msg">${message}</span>`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
};

// ---- Modal ----
document.querySelectorAll('[data-modal-open]').forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = document.querySelector(`#${btn.dataset.modalOpen}`);
    if (modal) modal.classList.add('open');
  });
});

document.querySelectorAll('.modal-close, [data-modal-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    const overlay = btn.closest('.modal-overlay');
    if (overlay) overlay.classList.remove('open');
  });
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

// ---- Smooth anchor scroll ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- Active nav link based on scroll ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[href*="#"]');

if (sections.length && navLinks.length) {
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 100) {
        current = section.id;
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href').includes(current));
    });
  }, { passive: true });
}

// ---- Gallery Lightbox ----
const galleryItems = document.querySelectorAll('.gallery-item');
if (galleryItems.length) {
  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:5000;display:flex;align-items:center;justify-content:center;cursor:zoom-out;backdrop-filter:blur(10px)';
      const image = document.createElement('img');
      image.src = img.src;
      image.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:12px;object-fit:contain';
      overlay.appendChild(image);
      overlay.addEventListener('click', () => overlay.remove());
      document.body.appendChild(overlay);
    });
  });
}

// ---- Image lazy loading ----
if ('IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          imgObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
}

// ---- Hero video fallback ----
const heroVideo = document.querySelector('.hero-video-bg video');
if (heroVideo) {
  heroVideo.addEventListener('error', () => {
    heroVideo.style.display = 'none';
  });
}
