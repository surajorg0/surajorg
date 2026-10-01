/**
 * SURAJORG PORTFOLIO — main.js
 * Multi-Page Interactive Engine
 * Zero-Lag Interactivity · Mobile Navigation · Spotlight Tracking · Category Filters
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initCardSpotlight();
  initProjectFilters();
  initFaqAccordion();
  initContactForm();
  initBackToTop();
  initScrollAnimations();
});

/* ── 1. Sticky Navbar & Active Page Indicator ── */
function initNavbar() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Set active link in desktop and mobile nav based on URL
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('/').pop() || 'index.html';

    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

/* ── 2. Mobile Menu Drawer ── */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  if (!toggleBtn || !drawer) return;

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !drawer.classList.contains('open');
    drawer.classList.toggle('open', isOpen);
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when clicking nav link
  drawer.querySelectorAll('.mobile-nav-link, .btn-hire').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggleMenu(false);
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      toggleMenu(false);
    }
  });
}

/* ── 3. Zero-Lag Card Spotlight Effect (Replaces slow trailing dot cursor) ── */
function initCardSpotlight() {
  // Only apply on non-touch devices
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cards = document.querySelectorAll('.interactive-card, .project-card, .timeline-card, .hero-card-frame');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        card.style.backgroundImage = `radial-gradient(350px circle at ${x}px ${y}px, rgba(56, 189, 248, 0.1), transparent 80%)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.backgroundImage = '';
      });
    });
  }
}

/* ── 4. Project Category Filtering ── */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');
  if (!filterButtons.length || !projectItems.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter') || 'all';

      projectItems.forEach(item => {
        const category = item.getAttribute('data-category') || '';
        const shouldShow = filterVal === 'all' || category.split(' ').includes(filterVal);

        if (shouldShow) {
          item.style.display = 'flex';
          item.style.opacity = '0';
          setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 30);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ── 5. FAQ Accordion ── */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const wasActive = item.classList.contains('active');

      // Close all
      faqItems.forEach(i => i.classList.remove('active'));

      // If wasn't active, open it
      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ── 6. Contact Form: Mobile vs Desktop Detection & Email Redirection ── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const alertBox = document.getElementById('formAlert');
  if (!form || !alertBox) return;

  function isMobileDevice() {
    const ua = navigator.userAgent || navigator.vendor || window.opera || '';
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTouchScreen = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const isSmallScreen = window.innerWidth <= 820;
    return isMobileUA || (isTouchScreen && isSmallScreen);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#name')?.value.trim();
    const email = form.querySelector('#email')?.value.trim();
    const serviceSelect = form.querySelector('#serviceType');
    const serviceLabel = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex].text : 'General Discussion';
    const message = form.querySelector('#message')?.value.trim();

    if (!name || !email || !message) {
      showAlert('Please fill in all required fields (Name, Email, Message).', 'error');
      return;
    }

    // Structured subject & body
    const emailSubject = `[Portfolio Enquiry: ${serviceLabel}] from ${name}`;
    
    const emailBody = 
`Hi Suraj,

I would like to discuss a project / requirement with you. Here are my details:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SENDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Full Name: ${name}
• Email Address: ${email}
• Area of Discussion: ${serviceLabel}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MESSAGE / PROJECT REQUIREMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sent via SurajOrg Portfolio (https://surajorg.in/contact.html)`;

    // Encode parameters
    const encodedSubject = encodeURIComponent(emailSubject);
    const encodedBody = encodeURIComponent(emailBody);

    // Desktop Webmail URLs (Opens inside browser without blank tabs)
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=Surajorg47@gmail.com&su=${encodedSubject}&body=${encodedBody}`;
    const outlookWebUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=Surajorg47@gmail.com&subject=${encodedSubject}&body=${encodedBody}`;
    const mailtoUrl = `mailto:Surajorg47@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;

    const isMobile = isMobileDevice();

    if (isMobile) {
      // ── MOBILE FLOW: Trigger native app selector (Gmail app / system mail apps) ──
      alertBox.innerHTML = `
        <div style="line-height: 1.6;">
          <strong style="color: #FFFFFF; font-size: 1rem;">Opening in your email app...</strong><br>
          <span style="font-size: 0.9rem; color: #CBD5E1;">Select Gmail or your preferred email application from the prompt.</span>
          <div style="margin-top: 14px; display: flex; flex-direction: column; gap: 10px;">
            <a href="${mailtoUrl}" class="btn-primary" style="justify-content: center; padding: 10px 18px; font-size: 0.9rem;">
              Open in Gmail / Mail App
            </a>
            <a href="${gmailWebUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="justify-content: center; padding: 10px 18px; font-size: 0.9rem;">
              Open in Web Browser Gmail
            </a>
          </div>
        </div>
      `;
      alertBox.className = 'form-alert success';
      alertBox.style.display = 'block';
      alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Trigger native system app chooser
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 250);

    } else {
      // ── DESKTOP PC FLOW: Open Gmail compose directly inside browser ──
      alertBox.innerHTML = `
        <div style="line-height: 1.6;">
          <strong style="color: #FFFFFF; font-size: 1rem;">Opening Gmail in your browser...</strong><br>
          <span style="font-size: 0.9rem; color: #CBD5E1;">Your inquiry details have been formatted and loaded into Gmail compose.</span>
          <div style="margin-top: 14px; display: flex; flex-wrap: wrap; gap: 10px;">
            <a href="${gmailWebUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="padding: 8px 18px; font-size: 0.88rem; display: inline-flex;">
              Open in Gmail Web
            </a>
            <a href="${outlookWebUrl}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="padding: 8px 18px; font-size: 0.88rem; display: inline-flex;">
              Open in Outlook Web
            </a>
            <a href="${mailtoUrl}" class="btn-secondary" style="padding: 8px 18px; font-size: 0.88rem; display: inline-flex;">
              Default Desktop App
            </a>
          </div>
        </div>
      `;
      alertBox.className = 'form-alert success';
      alertBox.style.display = 'block';
      alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Open Gmail directly in browser
      window.open(gmailWebUrl, '_blank');
    }
  });

  function showAlert(msg, type) {
    alertBox.innerHTML = msg;
    alertBox.className = `form-alert ${type}`;
    alertBox.style.display = 'block';
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* ── 7. Back to Top Button ── */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── 8. Scroll Reveal Animations (CSS Transitions) ── */
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const elements = document.querySelectorAll('.animate-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}
