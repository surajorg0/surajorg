# SurajOrg Portfolio — Codebase Documentation

> **Live site:** [https://surajorg.in](https://surajorg.in)  
> **GitHub Repository:** [https://github.com/surajorg0/surajorg](https://github.com/surajorg0/surajorg)  
> **Platform & Deployment:** Vercel (Continuous deployment from `master` branch)  
> **Local Server:** `http://localhost:3030` (`npx serve . --listen 3030`)  
> **Architecture:** Multi-Page Static Architecture (Semantic HTML5, CSS3 Tokens, Vanilla JS)  
> **Author:** Suraj Choudhari (Business Analyst & Full-Stack Developer)  
> **Last Updated:** October 2026  

---

## Table of Contents

1. [Project Overview & Philosophy](#1-project-overview--philosophy)
2. [Complete Directory Structure](#2-complete-directory-structure)
3. [Multi-Page Architecture](#3-multi-page-architecture)
4. [Design System & Palette](#4-design-system--palette)
5. [Typography Engineering (Choudhari Visibility)](#5-typography-engineering-choudhari-visibility)
6. [Interactive Engine & Zero-Lag Cursor](#6-interactive-engine--zero-lag-cursor)
7. [SEO & Social Metadata Implementation](#7-seo--social-metadata-implementation)
8. [Assets & Media Catalog](#8-assets--media-catalog)
9. [Local Development & Testing](#9-local-development--testing)
10. [Deployment & Vercel Integration](#10-deployment--vercel-integration)
11. [Maintenance & Content Editing Guide](#11-maintenance--content-editing-guide)

---

## 1. Project Overview & Philosophy

The SurajOrg web application is the official personal and professional portfolio of **Suraj Ghanshyam Choudhari**, an M.Sc. IT professional working as a **Business Analyst at MSquare Software Systems Pvt. Ltd.** in Jalna, Maharashtra.

### Core Objectives:
- **Dual Competency Representation:** Position Suraj at the unique intersection of **Business Analysis** (BRD, CR, Signoffs, Wireframing, Stakeholder Alignment) and **Full-Stack Engineering** (Angular, Ionic Android APKs, Python scripting, n8n automation).
- **Multi-Page Separation:** Dedicated, focused pages for Home (`index.html`), Biography & Academics (`about.html`), Project Catalog with filtering (`projects.html`), Enterprise Experience (`experience.html`), and Consultation/Contact (`contact.html`).
- **High-Contrast Modern Aesthetic:** A refined Slate & Aurora palette (`#0B1120` base with `#1E293B` cards, high-contrast borders, and radiant jewel-tone gradients) avoiding dark muddiness.
- **Flawless Mobile Responsiveness:** Clean sliding drawer navigation, accessible touch targets, responsive CSS grid layouts, and zero horizontal overflow.
- **Zero-Lag Interactivity:** Native cursor precision supplemented by 60fps card spotlight beam physics, active route indicators, category filtering, and FAQ accordions.

---

## 2. Complete Directory Structure

```
surajorg/
├── CODEBASE.md                     # Comprehensive technical documentation (this file)
├── Suraj_Choudhari_Profile.md      # Ground truth profile, career history & raw details
├── index.html                      # Home / Executive landing page
├── about.html                      # About Suraj, education table, certifications, hobbies
├── projects.html                   # Interactive project catalog with category filters
├── experience.html                 # Professional experience, MSquare products & BA methodology
├── contact.html                    # Inquiry form, direct phone/email, location & FAQ
├── robots.txt                      # Crawler directives and sitemap reference
├── sitemap.xml                     # Search engine XML index for all 5 routes
└── assets/
    ├── css/
    │   └── main.css                # Central design system, tokens, layouts, responsive rules
    ├── js/
    │   └── main.js                 # Multi-page interactive engine (spotlight, filters, drawer)
    ├── downloads/
    │   └── (Resume and document assets)
    └── images/
        ├── logo.svg                # Brand SVG logo with geometric monogram & typography
        ├── favicon.svg             # Brand SVG favicon squircle
        ├── calculator/             # 4 APK application screenshots (1.jpeg - 4.jpeg)
        ├── cars/                   # 6 APK application screenshots (1.jpeg - 6.jpeg)
        └── jira/                   # 5 Jira Tracker APK screenshots (2.jpeg - 6.jpeg)
```

---

## 3. Multi-Page Architecture

Each page in the application is self-contained and semantically structured:

### 1. `index.html` (Home)
- **Role:** High-impact executive summary.
- **Key Components:**
  - Hero Section with glowing status pill ("Available for BA & Tech Opportunities").
  - Large-format display heading with fixed high-contrast gradient: `Hi, I'm Suraj Choudhari`.
  - Four key metric counters: 4+ MSquare Products, 9+ Deployed Apps, M.Sc. IT Degree, 100% Delivery Focus.
  - Interactive tech architecture console card (privacy-safe profile spec) and floating badges.
  - Dual Competency pillars: Requirement Engineering (BRD), Wireframing & Rapid Architecture, Full-Stack & Mobile Deployment.
  - Featured work teaser cards with live demo links.
  - Call-to-Action consultation banner.

### 2. `about.html` (About Me)
- **Role:** Detailed career narrative, academic credentials, and personal interests.
- **Key Components:**
  - Personal narrative detailing the transition from M.Sc. IT to Business Analyst.
  - Structured Quick Snapshot card (Role, Education, Location, Languages, Availability).
  - Formal Education Table: M.Sc. IT (64.5%), B.Sc. (70.86%), 12th Science (53.23%), 10th General (52.6%).
  - Certifications Table: TATA Strive Cybersecurity, Microsoft Cybersuraksha, SQL Injection Attack, TCS YEP, Eon Vertex, Soft Skills, MS-CIT.
  - Personal Interests: Chess & Game Theory, Hardware Customization & KVM sandboxing, Drawing & Visual Design.

### 3. `projects.html` (Projects Catalog)
- **Role:** Interactive showcase of all 10+ software projects, tools, and Android APKs.
- **Key Components:**
  - Interactive category filter tabs: `All Projects`, `Full-Stack & Web`, `Mobile & APKs`, `Client & Commercial`, `Python & Security`.
  - Filterable project grid with dynamic smooth fade transitions.
  - Detailed project cards containing tech stack pills, direct demo URLs, GitHub repository links, and screenshot thumbnails:
    1. Basic Jira Tracker (APK + Backend on Render)
    2. Professional Tile Contractor Website (`ghanshyamchaudhary.in`)
    3. Interactive Resume Builder (`resume-builder-4h7k.vercel.app`)
    4. SustainEats Food Platform (Angular)
    5. Calculator Mobile App (Ionic Android APK)
    6. Car Collection App (Ionic Android APK)
    7. Scammer Hunter (Python Desktop Tool)
    8. Open Port Scanner (Python CLI Security Tool)
    9. Sentiment Analyzer (Python NLP Engine)
    10. HappeningAt Platform (Nass Technologies Internship)

### 4. `experience.html` (Professional Experience)
- **Role:** Deep dive into career trajectory, client deliverables, and methodology.
- **Key Components:**
  - Interactive vertical timeline:
    - **MSquare Software Systems Pvt. Ltd.** (Sep 2024 – Present): Business Analyst. Details on BRD authoring, Change Requests (CRs), user stories, wireframing, and products managed (**GloriousChess Academy**, **MySocietySuite**, **PawPlanet**, **AccountantMilega**).
    - **Nass Technologies** (Jan 2024 – Mar 2024): Jr. Software Developer Intern working on **HappeningAt** (Angular).
  - 5-Step Execution Methodology: Discovery & Elicitation → BRD & User Stories → Wireframing → Sprint Guidance → UAT & Production Signoff.

### 5. `contact.html` (Contact & Consultation)
- **Role:** Direct channel for client inquiries, recruiter outreach, and consultations.
- **Key Components:**
  - Direct contact cards: Email (`Surajorg47@gmail.com`), GitHub (`github.com/surajorg0`), Location (Jalna, Maharashtra), Availability (Mon–Sat, response <24h).
  - Validated interactive inquiry form (Name, Email, Area of Discussion, Message).
  - Live feedback banner (Success / Error alerts).
  - Expandable FAQ Accordion addressing common business analysis and technical inquiries.

---

## 4. Design System & Palette

The design system uses modern CSS custom properties in `assets/css/main.css`:

```css
:root {
  /* Surfaces & Canvas */
  --bg-base:        #0B1120;                       /* Rich modern navy/slate */
  --bg-surface:     #111C33;                       /* Elevated surface */
  --bg-card:        rgba(23, 37, 65, 0.7);         /* Translucent frosted glass card */
  --bg-card-hover:  rgba(30, 48, 84, 0.85);        /* High-contrast hover card */
  --bg-elevated:    #1E293B;                       /* Solid elevated slate */
  --bg-glass:       rgba(15, 23, 42, 0.85);        /* Header blur background */

  /* High-Luminance Accents */
  --sky:            #38BDF8;                       /* Vibrant electric sky */
  --blue:           #3B82F6;                       /* Royal cobalt */
  --indigo:         #6366F1;                       /* Tech indigo */
  --emerald:        #10B981;                       /* Verified emerald */
  --mint:           #34D399;                       /* Bright mint */
  --amber:          #F59E0B;                       /* Warm warning amber */

  /* Radiant Gradients */
  --grad-primary:   linear-gradient(90deg, #38BDF8 0%, #60A5FA 45%, #93C5FD 75%, #34D399 100%);
  --grad-brand:     linear-gradient(135deg, #2563EB 0%, #06B6D4 100%);

  /* High-Contrast Typography */
  --text-primary:   #FFFFFF;                       /* Crisp pure white */
  --text-secondary: #E2E8F0;                       /* Crisp light slate */
  --text-body:      #CBD5E1;                       /* High-legibility body */
  --text-muted:     #94A3B8;                       /* Subtle labels */

  /* Borders & Shadows */
  --border-subtle:  rgba(148, 163, 184, 0.14);    /* 1px glass border */
  --border-focus:   rgba(56, 189, 248, 0.4);      /* Active border glow */
  --shadow-lg:      0 16px 40px rgba(0, 0, 0, 0.45);
}
```

---

## 5. Typography Engineering (Choudhari Visibility)

### The Issue Solved:
In earlier iterations, the suffix **"ari"** in **"Choudhari"** was vanishing due to:
1. Low-contrast gradient endpoints (dark violet fading into a dark background).
2. Sub-pixel text masking clips where `-webkit-background-clip: text` clipped italics and character bounding boxes.

### The Solution Implemented:
```css
.hero-name-accent {
  background: var(--grad-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: #38BDF8;                                  /* Strong fallback if gradient fails */
  display: inline-block;
  padding-right: 0.15em;                           /* Guarantees glyph box never clips "ari" */
  overflow: visible;
  filter: drop-shadow(0 2px 16px rgba(56, 189, 248, 0.35));
}
```
All color stops in `--grad-primary` (`#38BDF8`, `#60A5FA`, `#93C5FD`, `#34D399`) maintain >75% perceived luminosity, ensuring the complete word **Choudhari** is 100% visible and radiant on all monitors and mobile devices.

### Font Hierarchy:
- **Display / Headings:** `'Plus Jakarta Sans'`, sans-serif (weights 600, 700, 800, 900)
- **Body / Content:** `'Inter'`, sans-serif (weights 300, 400, 500, 600)
- **Monospace / Tags:** `'JetBrains Mono'`, monospace (weights 400, 500, 700)

---

## 6. Interactive Engine & Zero-Lag Cursor

All interactivity is managed in `assets/js/main.js`:

1. **Snappy Zero-Lag Cursor:**
   - Sluggish canvas particles and dragging lag dots have been removed.
   - On desktop, cards feature an instantaneous **60fps mouse spotlight**:
     ```javascript
     card.style.backgroundImage = `radial-gradient(350px circle at ${x}px ${y}px, rgba(56, 189, 248, 0.1), transparent 80%)`;
     ```
   - Touch devices naturally bypass this, preserving native mobile touch response.

2. **Mobile Navigation Drawer:**
   - Smooth toggle via `.mobile-toggle` button.
   - Accessible keyboard support (Escape key triggers close).
   - Click-outside detection and automatic body scroll locking when opened.

3. **Active Page Detection:**
   - Compares `window.location.pathname` with navigation `href` values and sets `.active` and `aria-current="page"` automatically.

4. **Category Filtering Engine:**
   - Reads `data-category` attributes on `.project-item` cards.
   - Filters between `all`, `web`, `mobile`, `client`, and `python` with smooth CSS opacity cascades.

5. **FAQ Accordion:**
   - Smooth max-height expansion with rotating indicator icon.

6. **Smart Device-Aware Email Dispatch (PC vs Mobile):**
   - Automatically detects whether the visitor is on **Desktop PC Web** or a **Mobile Device** (via User Agent, Touch Points, and Viewport heuristics).
   - **On Desktop PC Web:** Directly opens **Gmail Web Compose** inside the browser (`https://mail.google.com/mail/?view=cm&fs=1&to=Surajorg47@gmail.com&su=...&body=...`) with recipient, subject, and formatted body populated—eliminating blank Chrome tabs or missing desktop client errors. Also provides buttons for Outlook Web and system default.
   - **On Mobile Devices (Android / iOS):** Automatically triggers native system protocol (`mailto:Surajorg47@gmail.com?...`) which pops up the OS app selector (Gmail App, Samsung Mail, Apple Mail), with touch-optimized fallback options.
   - Validates all input fields (Name, Email, Area of Discussion, Message) and formats a structured summary with headers and line dividers.

7. **Back-to-Top Button:**
   - Appears when `window.scrollY > 350px` with smooth scroll behavior.

---

## 7. SEO & Social Metadata Implementation

- **Search Console Readiness:**
  - Canonical links set on all pages: `<link rel="canonical" href="https://surajorg.in/...">`.
  - Comprehensive `sitemap.xml` listing all 5 routes with priorities and lastmod timestamps.
  - `robots.txt` allowing all search engines and referencing the sitemap.
- **OpenGraph & Twitter Cards:**
  - Configured with title, description, URL, and brand SVG graphic.
- **Schema.org JSON-LD Structured Data:**
  - Embedded `Person` entity markup identifying Suraj Choudhari, his role as Business Analyst at MSquare Software Systems, alma mater (Dr. Babasaheb Ambedkar Marathwada University), skills, contact channels, and official URLs.

---

## 8. Assets & Media Catalog

- `assets/images/logo.svg`: High-resolution vector logo featuring the cute & professional interlocking 'SC' monogram with modern typography.
- `assets/images/favicon.svg`: Matching cute & professional 64x64 vector 'SC' monogram favicon.
- `assets/images/jira/`: Screenshots of the Jira Tracker mobile app (`2.jpeg` through `6.jpeg`).
- `assets/images/calculator/`: Screenshots of the Calculator APK (`1.jpeg` through `4.jpeg`).
- `assets/images/cars/`: Screenshots of the Car Collection APK (`1.jpeg` through `6.jpeg`).

---

## 9. Local Development & Testing

### Running Locally:
To run the project on your local machine using Node.js:
```bash
npx serve . --listen 3030
```
Open your browser to:
```
http://localhost:3030
```

Alternative with Python:
```bash
python -m http.server 3030
```

### Pages to Test:
- `http://localhost:3030/index.html` — Home page
- `http://localhost:3030/about.html` — About & Education
- `http://localhost:3030/projects.html` — Projects & Filter tabs
- `http://localhost:3030/experience.html` — Career & Methodology
- `http://localhost:3030/contact.html` — Inquiry Form & FAQ

---

## 10. Deployment & Vercel Integration

The repository is hosted on GitHub:
- **Repository:** `https://github.com/surajorg0/surajorg`
- **Branch:** `master`
- **Vercel Project:** Connected to GitHub repository `surajorg0/surajorg`.
- **Domain:** Configured to `surajorg.in` with automatic SSL certificate management.

### Deployment Workflow:
Any commit pushed to `origin/master` immediately triggers an automated zero-downtime deployment on Vercel:
```bash
git add -A
git commit -m "Your descriptive commit message"
git push origin master
```

---

## 11. Maintenance & Content Editing Guide

### Adding a New Project:
1. Open `projects.html`.
2. Duplicate an existing `<div class="interactive-card project-card project-item" data-category="...">`.
3. Set the appropriate categories in `data-category` (e.g. `web`, `mobile`, `python`, `client`).
4. Update the thumbnail image, title, description, tags, and link URLs.
5. If featuring on the home page, add a condensed card into `index.html`.

### Updating Work Experience:
1. Open `experience.html`.
2. Locate the `.timeline-container`.
3. Add a new `.timeline-item` block following the existing structure.

### Changing the Contact Form Endpoint:
1. Open `contact.html`.
2. Locate `<form id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">`.
3. Replace the `action` attribute with your custom Formspree or serverless endpoint.
