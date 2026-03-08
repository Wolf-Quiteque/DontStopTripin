/* ============================================================
   DON'T STOP TRIPPING — Main JS
   ============================================================ */

'use strict';

/* ---- Loader ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    const l = document.getElementById('loader');
    if (l) { l.classList.add('out'); setTimeout(() => l.remove(), 500); }
  }, 1400);
});

/* ---- Nav scroll ---- */
const nav = document.querySelector('.nav');
if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 50), { passive:true });

/* ---- Mobile nav ---- */
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

/* ---- Scroll Reveal ---- */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold:0.1, rootMargin:'0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(el => revealObs.observe(el));

/* ---- Countdown ---- */
function startCountdown(dateStr) {
  const target = new Date(dateStr).getTime();
  const els = {
    d: document.querySelectorAll('.cd-days'),
    h: document.querySelectorAll('.cd-hours'),
    m: document.querySelectorAll('.cd-mins'),
    s: document.querySelectorAll('.cd-secs'),
  };
  const pad = n => String(n).padStart(2,'0');
  const tick = () => {
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 864e5);
    const h = Math.floor(diff % 864e5 / 36e5);
    const m = Math.floor(diff % 36e5 / 6e4);
    const s = Math.floor(diff % 6e4 / 1e3);
    els.d.forEach(el => el.textContent = pad(d));
    els.h.forEach(el => el.textContent = pad(h));
    els.m.forEach(el => el.textContent = pad(m));
    els.s.forEach(el => el.textContent = pad(s));
  };
  tick(); setInterval(tick, 1000);
}
document.addEventListener('DOMContentLoaded', () => startCountdown('2025-08-15T17:00:00'));

/* ---- Number Counter ---- */
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.target, 10);
    let cur = 0;
    const step = target / (1800 / 16);
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur).toLocaleString();
      if (cur >= target) clearInterval(t);
    }, 16);
    counterObs.unobserve(el);
  });
}, { threshold:0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

/* ---- Progress bars ---- */
const progressObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const fill = e.target.querySelector('.progress-fill');
    if (fill) fill.style.width = fill.dataset.w || '0%';
    progressObs.unobserve(e.target);
  });
}, { threshold:0.3 });
document.querySelectorAll('.progress-wrap').forEach(el => progressObs.observe(el));

/* ---- Accordion ---- */
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.closest('.accordion-item');
    const isOpen = item.classList.contains('open');
    item.closest('[data-accordion]')?.querySelectorAll('.accordion-item.open')
      .forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ---- Tabs ---- */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.dataset.group;
    const tab   = btn.dataset.tab;
    document.querySelectorAll(`[data-group="${group}"].tab-btn`).forEach(b => b.classList.toggle('active', b === btn));
    document.querySelectorAll(`[data-group="${group}"].tab-panel`).forEach(p => p.classList.toggle('active', p.dataset.panel === tab));
  });
});

/* ---- Modal ---- */
document.querySelectorAll('[data-open]').forEach(btn =>
  btn.addEventListener('click', () => document.getElementById(btn.dataset.open)?.classList.add('open'))
);
document.querySelectorAll('[data-close], .modal-close').forEach(btn =>
  btn.addEventListener('click', () => btn.closest('.modal-overlay')?.classList.remove('open'))
);
document.querySelectorAll('.modal-overlay').forEach(overlay =>
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); })
);

/* ---- Toast ---- */
window.toast = (msg, icon = '✓', dur = 3000) => {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), dur);
};

/* ---- Sticky CTA ---- */
const stickyCta = document.querySelector('.sticky-cta');
if (stickyCta) window.addEventListener('scroll', () => stickyCta.classList.toggle('visible', scrollY > 500), { passive:true });

/* ---- Gallery Lightbox ---- */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const src = item.querySelector('img')?.src;
    if (!src) return;
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(5,12,24,.96);z-index:5000;display:flex;align-items:center;justify-content:center;cursor:zoom-out;backdrop-filter:blur(8px)';
    const img = document.createElement('img');
    img.src = src;
    img.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:6px;object-fit:contain';
    overlay.appendChild(img);
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  });
});

/* ---- Smooth anchor ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior:'smooth', block:'start' }); }
  });
});
