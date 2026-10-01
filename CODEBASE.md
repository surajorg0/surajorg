# SurajOrg Portfolio — Codebase Documentation

> **Live site:** https://surajorg.in
> **GitHub:** https://github.com/surajorg0/surajorg
> **Deployed on:** Vercel (auto-deploy from `master` branch)
> **Last updated:** October 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Directory Structure](#2-directory-structure)
3. [Technology Stack](#3-technology-stack)
4. [File Reference](#4-file-reference)
5. [Design System](#5-design-system)
6. [CSS Architecture](#6-css-architecture)
7. [JavaScript Architecture](#7-javascript-architecture)
8. [SEO Implementation](#8-seo-implementation)
9. [Sections Reference](#9-sections-reference)
10. [Assets](#10-assets)
11. [Deployment](#11-deployment)
12. [Local Development](#12-local-development)
13. [Editing Guide](#13-editing-guide)
14. [Changelog](#14-changelog)

---

## 1. Project Overview

A premium single-page portfolio for **Suraj Ghanshyam Choudhari** — Business Analyst & Full-Stack Developer.  
Built as a completely static site (HTML + CSS + JS) — no build step, no framework, no dependencies.

Designed for:
- **Maximum SEO** — structured data, sitemap, meta tags, semantic HTML
- **Premium visual design** — glassmorphism, particle canvas, smooth animations
- **Performance** — zero JS framework overhead, lazy-loaded images, passive event listeners
- **Vercel compatibility** — static files, no server-side code needed

---

## 2. Directory Structure

```
surajorg/                          <- Project root
|
+-- index.html                     <- Single-page portfolio (ALL sections)
+-- sitemap.xml                    <- XML sitemap for search engines
+-- robots.txt                     <- Crawler instructions
+-- CODEBASE.md                    <- This file — dev documentation
+-- Suraj_Choudhari_Profile.md     <- Source-of-truth for bio/skills/projects
+-- .gitignore
|
+-- assets/
    +-- css/
    |   +-- main.css               <- All styles (single file, 19 sections)
    |
    +-- js/
    |   +-- main.js                <- All interactivity (single file, 12 modules)
    |
    +-- images/
    |   +-- logo.jpg               <- SurajOrg circuit-S logo (favicon + nav)
    |   +-- suraj.jpeg             <- Profile photo (hero section)
    |   +-- calculator/            <- Calculator APK screenshots (1-4.jpeg)
    |   +-- jira/                  <- Jira Tracker screenshots (2-8.jpeg)
    |   +-- cars/                  <- Car Collection APK screenshots (1-6.jpeg)
    |
    +-- downloads/
        +-- Calculator.apk         <- Downloadable Calculator APK (~5.5 MB)
        +-- Jira.apk               <- Downloadable Jira Tracker APK (~5 MB)
        +-- cars.apk               <- Downloadable Car Collection APK (~6.3 MB)
```

---

## 3. Technology Stack

| Layer | Tech | Notes |
|---|---|---|
| Structure | HTML5 | Semantic: nav, section, article, footer |
| Styles | Vanilla CSS3 | Custom Properties, Grid, Flexbox, backdrop-filter |
| Scripts | Vanilla JS ES2020 | IntersectionObserver, requestAnimationFrame, Canvas API |
| Fonts | Google Fonts | Inter (body), Syne (headings), JetBrains Mono (mono) |
| Icons | Inline SVG | No icon library — all SVGs are inlined in HTML |
| Form | Formspree | External handler — no backend needed |
| Hosting | Vercel | Auto-deploy from GitHub master branch |
| Build step | None | Static files served as-is |

---

## 4. File Reference

### index.html

The entire site in one file. Body structure:

```
body
  +-- .noise-overlay          (decorative grain — aria-hidden)
  +-- #cursor                 (custom cursor — dot + ring)
  +-- nav#nav                 (fixed top nav + hamburger)
  +-- .mobile-menu            (slide-down mobile panel)
  +-- section#hero            (canvas + content + photo)
  +-- section#about           (bio text + info cards)
  +-- section#skills          (6 skill category cards)
  +-- section#projects        (9 project article cards)
  +-- section#experience      (timeline + edu grid + certs)
  +-- section#contact         (contact items + form)
  +-- footer
  +-- .back-to-top
  +-- script[main.js]
```

Key HTML patterns:
- All interactive elements have unique id attributes
- All images have descriptive alt text
- ARIA labels on nav, dialog, sections, icon buttons
- loading="lazy" on all non-critical images
- loading="eager" on hero profile photo (LCP element)

---

### assets/css/main.css

Single stylesheet — 19 clearly numbered sections:

| # | Section | Description |
|---|---|---|
| 1 | Design Tokens | All CSS Custom Properties |
| 2 | Reset & Base | box-sizing, scroll-behavior, smoothing |
| 3 | Noise Overlay | SVG fractal noise via data: URI |
| 4 | Custom Cursor | .cursor-dot + .cursor-ring with lag |
| 5 | Container | max-width 1180px centered |
| 6 | Navigation | Fixed nav, scroll glass blur effect |
| 7 | Buttons | btn, btn-sm, btn-primary, btn-ghost, btn-glow |
| 8 | Reveal Animation | opacity 0->1 + translateY on scroll |
| 9 | Sections | section, section-dark, section-header |
| 10 | Hero | Canvas, content, rings, badges, indicator |
| 11 | About | Two-column grid — text + info cards |
| 12 | Skills | 3-column card grid with hover glow |
| 13 | Projects | 3-column grid + screenshot carousels |
| 14 | Experience | Timeline, edu grid, cert items |
| 15 | Contact | 2-col: items + form |
| 16 | Footer | 3-col: brand, nav, social |
| 17 | Back to Top | Fixed floating button |
| 18 | Responsive | 1024px, 768px, 480px breakpoints |
| 19 | Reduced Motion | prefers-reduced-motion override |

Key CSS Variables:
```
--bg-base:      #070B14      /* Page background */
--bg-surface:   #0D1321      /* Dark section bg */
--cyan:         #00D4FF      /* Primary accent */
--violet:       #8B5CF6      /* Secondary accent */
--mint:         #10B981      /* Available / success */
--grad-primary: linear-gradient(135deg, cyan, violet)
--font-display: 'Syne'
--font-body:    'Inter'
--font-mono:    'JetBrains Mono'
```

---

### assets/js/main.js

Single script — 12 isolated init functions, no dependencies:

| # | Function | Description |
|---|---|---|
| 1 | DOMContentLoaded | Bootstraps all modules |
| 2 | initCursor() | Custom cursor, detects touch, disables on mobile |
| 3 | initNav() | Scroll glass effect, active link via IntersectionObserver |
| 4 | initMobileMenu() | Hamburger toggle with ARIA state management |
| 5 | initParticles() | Canvas particle system, 80 particles, connecting lines |
| 6 | initTypewriter() | Cycles 6 role strings with type/delete animation |
| 7 | initReveal() | IntersectionObserver scroll reveal with data-delay |
| 8 | initCounters() | Animates stats 0->N using ease-out cubic |
| 9 | initScreenshotScroll() | Auto-scrolls carousels, pauses on hover |
| 10 | initForm() | Async Formspree submit with loading + feedback |
| 11 | initBackToTop() | Floating button after 500px scroll |
| 12 | setYear() | Footer copyright year |

Typewriter roles array:
```js
['Business Analyst', 'Full-Stack Developer', 'Angular Developer',
 'AI-Assisted Builder', 'Technical Coordinator', 'Mobile App Creator']
```

Particle system:
- Count: min(80, floor(windowWidth / 20))
- Connection threshold: 120px
- Colors: cyan or violet (random per particle)
- Pauses on document hidden (visibilitychange)

---

### sitemap.xml

Standard XML sitemap. Update lastmod date on significant content changes:
```xml
<lastmod>YYYY-MM-DD</lastmod>
```

### robots.txt

Allows all crawlers, blocks APK downloads from indexing, declares sitemap URL.

---

## 5. Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| --bg-base | #070B14 | Page background |
| --bg-surface | #0D1321 | Dark alternate sections |
| --bg-card | rgba(18,25,38,0.7) | Glassmorphic cards |
| --cyan | #00D4FF | Primary accent, CTAs |
| --violet | #8B5CF6 | Secondary accent, gradient end |
| --mint | #10B981 | Success, available badge |
| --pink | #EC4899 | Error states |
| --text-primary | #F0F6FF | Main text |
| --text-secondary | #94A3B8 | Supporting text |
| --text-muted | #475569 | Labels, metadata |

### Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Hero name | Syne | 900 | clamp(3.5rem, 7vw, 5.5rem) |
| Section titles | Syne | 800 | clamp(2rem, 4vw, 3rem) |
| Card headings | Syne | 700 | 1rem–1.4rem |
| Body text | Inter | 400 | 1rem–1.05rem |
| Tags/labels | JetBrains Mono | 400–500 | 0.68–0.78rem |
| Buttons | Inter | 600 | 0.82–0.9rem |

### Layout

- Container: 1180px max-width
- Section padding: 120px (tablet 80px, mobile 60px)
- Card border-radius: 20px (--radius-lg)
- Standard easing: cubic-bezier(0.4, 0, 0.2, 1)
- Spring easing: cubic-bezier(0.34, 1.56, 0.64, 1)

---

## 6. CSS Architecture

Naming conventions:
- Block: .hero, .skill-card, .project-card, .timeline-item
- Element: .hero-title, .skill-icon, .project-tag, .timeline-dot
- State modifier: .scrolled, .open, .visible, .active, .current
- Variant: .section-dark, .btn-primary, .btn-sm, .project-card.featured

No frameworks or utility classes. All styles component-scoped.

---

## 7. JavaScript Architecture

No framework, no bundler, no npm packages. Pure ES2020 vanilla JS.

Module pattern: Each feature is an isolated init*() function bootstrapped from DOMContentLoaded. No shared mutable global state.

Performance:
- IntersectionObserver replaces scroll event polling
- requestAnimationFrame for all visual animations
- { passive: true } on scroll/resize listeners
- Canvas pauses when tab is not visible

Accessibility:
- aria-hidden on all decorative elements (cursor, canvas, noise)
- aria-expanded / aria-hidden managed on mobile menu
- aria-live="polite" on form status
- aria-label on all icon-only interactive elements

---

## 8. SEO Implementation

All implemented in index.html head:

- Title tag (keyword-rich, <60 chars)
- Meta description (~155 chars)
- Meta keywords
- robots: index, follow, max-image-preview:large
- Canonical URL
- Open Graph (type, url, title, description, image, locale, site_name)
- Twitter Card (summary_large_image)
- Geo meta (geo.region: IN-MH, geo.placename: Jalna Maharashtra)
- JSON-LD Person structured data (schema.org)
- sitemap.xml submitted to search engines
- robots.txt with sitemap reference
- Semantic HTML5 landmark elements
- Descriptive alt text on all images

Google Search Console setup:
1. search.google.com/search-console -> Add property -> URL prefix -> https://surajorg.in
2. Verify via HTML meta tag (add to index.html head) or DNS TXT
3. Submit sitemap: https://surajorg.in/sitemap.xml

---

## 9. Sections Reference

### Hero (#hero)
- #particleCanvas — full-screen animated particle network
- .hero-tag — "Available" status badge with pulsing dot
- .hero-title — Name with gradient accent
- #roleText + .cursor-blink — typewriter effect
- .hero-bio — intro paragraph
- [data-count] — animated stat counters
- .hero-image-wrap — photo with 3 orbit rings + glow
- .ba-badge / .dev-badge — floating role badges

### About (#about)
- .about-text — 3 paragraphs + GitHub/email link chips
- .about-cards — 6 info-card items (location, role, education, languages, interests, open-to)

### Skills (#skills)
- 6 .skill-card items in 3-column grid
- Categories: Business Analysis, Frontend Dev, Mobile/Hybrid, Backend & Automation, AI & Tools, Deployment & DevOps

### Projects (#projects)
- 9 article.project-card elements
- Featured (Tile Contractor): grid-column span 2
- With screenshots: Jira Tracker, Calculator App, Car Collection
- All: .project-tag, .project-title, .project-desc, .project-stack, .project-actions

### Experience (#experience)
- Work: 2 .timeline-item (MSquare BA, Nass Technologies internship)
- Education: 4 .edu-card in 2x2 grid
- Certifications: 7 .cert-item in 2-column grid

### Contact (#contact)
- Left: 4 .contact-item (email, phone, location, GitHub)
- Right: #contactForm async Formspree submission

---

## 10. Assets

### Images

| Path | Approx Size | Usage |
|---|---|---|
| assets/images/logo.jpg | 61KB | Favicon + nav logo |
| assets/images/suraj.jpeg | 90KB | Hero profile photo |
| assets/images/calculator/1-4.jpeg | 4 files | Calculator screenshots |
| assets/images/jira/2-8.jpeg | 7 files | Jira Tracker screenshots |
| assets/images/cars/1-6.jpeg | 6 files | Car Collection screenshots |

### APK Downloads

| File | Size | Linked from |
|---|---|---|
| assets/downloads/Calculator.apk | ~5.5 MB | Calculator project card |
| assets/downloads/Jira.apk | ~5 MB | Jira Tracker project card |
| assets/downloads/cars.apk | ~6.3 MB | Car Collection project card |

---

## 11. Deployment

Platform: Vercel
Domain: surajorg.in (production) | www.surajorg.in -> 307 redirect to surajorg.in
Trigger: Push to GitHub master -> auto-deploy
Build: None (static HTML served as-is)
Vercel config: No vercel.json needed

Deploy workflow:
```bash
git add -A
git commit -m "Description of changes"
git push origin master
# Vercel deploys in ~30 seconds
# Check: https://vercel.com/surajorg0s-projects/surajorg
```

---

## 12. Local Development

### Option A — npx serve (recommended)
```bash
npx serve . --listen 3030
# Open http://localhost:3030
```

### Option B — Python
```bash
python -m http.server 3030
# Open http://localhost:3030
```

### Option C — VS Code Live Server
Install Live Server extension -> right-click index.html -> Open with Live Server

---

## 13. Editing Guide

### Update Personal Info
All content is in index.html. Use Ctrl+F for the section.
Source of truth: Suraj_Choudhari_Profile.md

### Add a New Project
1. Find section#projects in index.html
2. Copy an existing article.project-card block
3. Fill in: .project-tag, .project-title, .project-desc, .project-stack spans, .project-actions links
4. Add screenshots to assets/images/<project-name>/
5. Commit and push

### Change Typewriter Roles
In assets/js/main.js:
```js
const roles = [
  'Business Analyst',
  'Full-Stack Developer',
  // Add or edit roles here
];
```

### Change Theme Colors
In assets/css/main.css Section 1 (Design Tokens):
```css
:root {
  --cyan:   #00D4FF;   /* Primary accent */
  --violet: #8B5CF6;   /* Gradient end */
}
```

### Update Contact Form
Replace Formspree endpoint in index.html:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```
Get your ID from: formspree.io (free account)

### Update Sitemap Date
After major changes, edit sitemap.xml:
```xml
<lastmod>YYYY-MM-DD</lastmod>
```

---

## 14. Changelog

| Date | Version | Changes |
|---|---|---|
| Oct 2026 | 3.0.0 | Full rebuild: glassmorphic design, particles, typewriter, scroll reveal, full SEO, new logo, JSON-LD, single-page |
| Pre-Oct 2026 | 2.x | Universe-themed multi-page portfolio |
| Pre-2025 | 1.x | Initial portfolio |

---

*This document is maintained alongside the codebase. Update Section 14 after significant structural changes.*
