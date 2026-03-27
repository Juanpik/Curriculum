/* ══════════════════════════════════════════════════════
   JUAN PABLO CRUZ FIMBRES — Portfolio Script
   Features: Dark mode, Navbar scroll, Mobile menu,
             Scroll reveal, Form handler, Typing effect
══════════════════════════════════════════════════════ */

'use strict';

/* ─── HERO IMMEDIATE REVEAL ────────────────────────── */
// Hero elements are visible on load — show them right away
// without waiting for scroll, using staggered CSS delays
document.querySelectorAll('.hero .reveal, .hero-visual .reveal').forEach(el => {
  // Small timeout so CSS transition plays on load
  setTimeout(() => el.classList.add('visible'), 80);
});


/* ─── DARK MODE TOGGLE ─────────────────────────────── */
const darkToggle  = document.getElementById('darkToggle');
const themeIcon   = document.getElementById('themeIcon');
const body        = document.body;

/** Apply a theme and persist it. */
function applyTheme(isDark) {
  if (isDark) {
    body.classList.replace('light-mode', 'dark-mode');
    themeIcon.className = 'ri-moon-line';
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.replace('dark-mode', 'light-mode');
    themeIcon.className = 'ri-sun-line';
    localStorage.setItem('theme', 'light');
  }
}

// Load saved preference on page load
(function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved ? saved === 'dark' : prefersDark);
})();

darkToggle.addEventListener('click', () => {
  applyTheme(body.classList.contains('light-mode'));
});

/* ─── NAVBAR SCROLL BEHAVIOR ───────────────────────── */
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });

/* ─── MOBILE MENU ───────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

// Create overlay element
const overlay = document.createElement('div');
overlay.className = 'nav-overlay';
document.body.appendChild(overlay);

function openMenu() {
  navLinks.classList.add('open');
  hamburger.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  navLinks.classList.contains('open') ? closeMenu() : openMenu();
});

overlay.addEventListener('click', closeMenu);

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* ─── SMOOTH SCROLL FOR ALL ANCHOR LINKS ───────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    const targetY = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  });
});

/* ─── SCROLL REVEAL ANIMATION ───────────────────────── */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after reveal (one-shot animation)
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  }
);

revealElements.forEach(el => revealObserver.observe(el));

/* ─── ACTIVE NAV LINK ON SCROLL ─────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

function setActiveNavLink() {
  const scrollY = window.scrollY;
  sections.forEach(section => {
    const top    = section.offsetTop - navbar.offsetHeight - 60;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.style.color = (scrollY >= top && scrollY < bottom)
        ? 'var(--accent)'
        : '';
    }
  });
}

window.addEventListener('scroll', setActiveNavLink, { passive: true });

/* ─── CONTACT FORM ──────────────────────────────────── */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre  = document.getElementById('nombre').value.trim();
    const email   = document.getElementById('email').value.trim();
    const asunto  = document.getElementById('asunto').value;
    const mensaje = document.getElementById('mensaje').value.trim();

    if (!nombre || !email || !mensaje) {
      showFormMessage('Por favor completa los campos requeridos.', 'error');
      return;
    }

    // Build mailto link
    const subject = encodeURIComponent(`[Portfolio] ${asunto || 'Consulta'} — ${nombre}`);
    const body = encodeURIComponent(
      `Hola Juan Pablo,\n\nMi nombre es ${nombre}.\n\n${mensaje}\n\n---\nCorreo de contacto: ${email}`
    );
    window.location.href = `mailto:juanpik@gmail.com?subject=${subject}&body=${body}`;

    showFormMessage('¡Gracias! Tu cliente de correo se abrirá en un momento.', 'success');
  });
}

function showFormMessage(msg, type) {
  // Remove existing message if any
  const existing = contactForm.querySelector('.form-msg');
  if (existing) existing.remove();

  const el = document.createElement('p');
  el.className = 'form-msg';
  el.textContent = msg;
  el.style.cssText = `
    text-align: center;
    font-size: 0.85rem;
    padding: 0.7rem 1rem;
    border-radius: 6px;
    margin-top: 1rem;
    background: ${type === 'success' ? 'rgba(126,190,126,0.15)' : 'rgba(196,98,45,0.15)'};
    color: ${type === 'success' ? '#5A9A5A' : 'var(--accent)'};
    border: 1px solid ${type === 'success' ? 'rgba(126,190,126,0.3)' : 'rgba(196,98,45,0.3)'};
  `;
  contactForm.appendChild(el);

  setTimeout(() => el.remove(), 5000);
}

/* ─── GLYPH CARD TYPING ANIMATION ──────────────────── */
const words = ['ra·rá·mu·ri', 'wa·ri·jó', 'ya·qui', 'pi·ma ba·jo', 'gua·ri·jío', 'ta·ra·ca·hi·ta'];
let wordIdx  = 0;
let charIdx  = 0;
let deleting = false;

const glyphLang = document.querySelector('.glyph-lang');

function typeEffect() {
  if (!glyphLang) return;
  const current = words[wordIdx];

  if (deleting) {
    glyphLang.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      wordIdx  = (wordIdx + 1) % words.length;
      setTimeout(typeEffect, 400);
      return;
    }
  } else {
    glyphLang.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeEffect, 1800);
      return;
    }
  }

  setTimeout(typeEffect, deleting ? 55 : 90);
}

// Start typing effect after a short delay
setTimeout(typeEffect, 1200);

/* ─── STAT NUMBER COUNTER ANIMATION ────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  if (!target) return;
  let current = 0;
  const step  = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + '+';
      clearInterval(timer);
    } else {
      el.textContent = current + '+';
    }
  }, 30);
}

// Attach counter animation when stats come into view
const statNums = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const text = entry.target.textContent.replace('+', '');
        entry.target.dataset.target = parseInt(text, 10);
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
statNums.forEach(el => counterObserver.observe(el));

/* ─── KEYBOARD ACCESSIBILITY: ESC closes menu ───────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    closeMenu();
  }
});

/* ─── REDUCE MOTION SUPPORT ─────────────────────────── */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Instantly show all reveal elements
  revealElements.forEach(el => el.classList.add('visible'));

  // Add a style block to disable transitions
  const style = document.createElement('style');
  style.textContent = `
    *, *::before, *::after {
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
    }
  `;
  document.head.appendChild(style);
}

/* ─── CONSOLE SIGNATURE ─────────────────────────────── */
console.log(
  '%c JPC Portfolio 2026 ',
  'background: #C4622D; color: #fff; font-size: 14px; padding: 4px 10px; border-radius: 4px; font-family: monospace;'
);
console.log('%c Juan Pablo Cruz Fimbres — Lingüista Computacional', 'color: #C4622D; font-family: monospace;');
