/**
 * SURAJORG PORTFOLIO — main.js
 * Premium interactive features, animations, particles
 */

'use strict';

/* ═══════════════════════════════════════════
   1. DOM READY
═══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNav();
  initParticles();
  initTypewriter();
  initReveal();
  initCounters();
  initScreenshotScroll();
  initForm();
  initBackToTop();
  initMobileMenu();
  setYear();
});

/* ═══════════════════════════════════════════
   2. CURSOR
═══════════════════════════════════════════ */
function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor || window.matchMedia('(pointer: coarse)').matches) {
    if (cursor) cursor.style.display = 'none';
    document.body.style.cursor = 'auto';
    document.querySelectorAll('button').forEach(b => b.style.cursor = 'pointer');
    return;
  }

  const dot  = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');
  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  // Lag ring for smooth follow
  function animateRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state on interactive elements
  const hoverables = 'a, button, .skill-card, .project-card, .info-card, .edu-card, .cert-item, .contact-item, input, textarea, .btn';
  document.querySelectorAll(hoverables).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ═══════════════════════════════════════════
   3. NAV (scroll & active link)
═══════════════════════════════════════════ */
function initNav() {
  const nav  = document.getElementById('nav');
  const links = document.querySelectorAll('[data-nav]');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  sections.forEach(s => obs.observe(s));

  // Smooth close of mobile menu on anchor click
  links.forEach(l => {
    l.addEventListener('click', () => closeMobileMenu());
  });
}

/* ═══════════════════════════════════════════
   4. MOBILE MENU
═══════════════════════════════════════════ */
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.mobile-link').forEach(l => {
    l.addEventListener('click', closeMobileMenu);
  });
}

function closeMobileMenu() {
  document.getElementById('hamburger')?.classList.remove('open');
  document.getElementById('mobileMenu')?.classList.remove('open');
  document.getElementById('mobileMenu')?.setAttribute('aria-hidden', 'true');
  document.getElementById('hamburger')?.setAttribute('aria-expanded', 'false');
}

/* ═══════════════════════════════════════════
   5. PARTICLE CANVAS
═══════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.size  = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.color = Math.random() > 0.5 ? '0,212,255' : '139,92,246';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  // Create particles
  const COUNT = Math.min(80, Math.floor(W / 20));
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  // Draw connecting lines
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    animId = requestAnimationFrame(animate);
  }
  animate();

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else animate();
  });
}

/* ═══════════════════════════════════════════
   6. TYPEWRITER
═══════════════════════════════════════════ */
function initTypewriter() {
  const el = document.getElementById('roleText');
  if (!el) return;

  const roles = [
    'Business Analyst',
    'Full-Stack Developer',
    'Angular Developer',
    'AI-Assisted Builder',
    'Technical Coordinator',
    'Mobile App Creator',
  ];

  let ri = 0, ci = 0, deleting = false;

  function type() {
    const current = roles[ri];
    if (deleting) {
      ci--;
      el.textContent = current.substring(0, ci);
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 40);
    } else {
      ci++;
      el.textContent = current.substring(0, ci);
      if (ci === current.length) {
        setTimeout(() => { deleting = true; type(); }, 2200);
        return;
      }
      setTimeout(type, 70);
    }
  }
  setTimeout(type, 800);
}

/* ═══════════════════════════════════════════
   7. SCROLL REVEAL
═══════════════════════════════════════════ */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.delay || 0);
        setTimeout(() => e.target.classList.add('visible'), delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

  items.forEach(el => obs.observe(el));
}

/* ═══════════════════════════════════════════
   8. COUNTER ANIMATION
═══════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseInt(el.dataset.count);
      const dur = 1200;
      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(ease * end);
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
}

/* ═══════════════════════════════════════════
   9. AUTO SCROLL SCREENSHOTS
═══════════════════════════════════════════ */
function initScreenshotScroll() {
  document.querySelectorAll('.screenshots-scroll').forEach(container => {
    let scrolling = false;
    let dir = 1;
    let lastTime = 0;
    let intervalId;

    function autoScroll() {
      if (scrolling) return;
      const max = container.scrollWidth - container.clientWidth;
      if (max <= 0) return;

      intervalId = setInterval(() => {
        container.scrollLeft += dir * 1.2;
        if (container.scrollLeft >= max) dir = -1;
        if (container.scrollLeft <= 0) dir = 1;
      }, 16);
    }

    container.addEventListener('mouseenter', () => {
      scrolling = true;
      clearInterval(intervalId);
    });
    container.addEventListener('mouseleave', () => {
      scrolling = false;
      autoScroll();
    });

    autoScroll();
  });
}

/* ═══════════════════════════════════════════
   10. CONTACT FORM
═══════════════════════════════════════════ */
function initForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  const btn  = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const label = btn.querySelector('.btn-label');
    btn.disabled = true;
    if (label) label.textContent = 'Sending…';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        note.textContent = '✓ Message sent! I\'ll get back to you soon.';
        note.style.color = 'var(--mint)';
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch {
      note.textContent = '✗ Something went wrong. Please email me directly.';
      note.style.color = 'var(--pink)';
    } finally {
      btn.disabled = false;
      if (label) label.textContent = 'Send Message';
      setTimeout(() => { note.textContent = ''; }, 6000);
    }
  });
}

/* ═══════════════════════════════════════════
   11. BACK TO TOP
═══════════════════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ═══════════════════════════════════════════
   12. YEAR
═══════════════════════════════════════════ */
function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
