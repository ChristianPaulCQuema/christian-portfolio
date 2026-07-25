# Christian Paul Quema — Developer Portfolio

A responsive, multi-page developer portfolio built with **semantic HTML, modular CSS, and dependency-free
(vanilla) JavaScript**. No framework, no build step, no backend. It is designed to be dropped straight onto
any static host — GitHub Pages, Netlify, or Vercel.

The portfolio is data-driven: every project card, filter, gallery, and case study is generated from
`assets/js/data/projects-data.js`, and the technology stack from `assets/js/data/skills-data.js`. Add a
project by editing that data file — you never touch the markup.

Data files are plain classic scripts, not JSON fetched at runtime, so the whole site renders by
double-clicking `index.html`. No server, no build step.

---

## Project structure

```
christian-portfolio-main/
├── index.html                     # Home
├── 404.html                       # Standalone not-found page
├── robots.txt
├── sitemap.xml
├── README.md
│
├── pages/                         # Multi-page content
│   ├── about.html
│   ├── projects.html              # Search + category/tech/status filters
│   ├── project-details.html       # Case study, driven by ?project=<id>
│   ├── skills.html
│   ├── experience.html
│   └── contact.html               # Front-end validation + Formspree
│
├── projects/
│   └── mobile-inventory.html      # Standalone working LocalStorage demo
│
└── assets/
    ├── css/
    │   ├── reset.css               # Load order matters: reset → variables →
    │   ├── variables.css           #   global → components → animations →
    │   ├── global.css              #   pages/* → responsive (last)
    │   ├── components.css
    │   ├── animations.css
    │   ├── responsive.css
    │   └── pages/                  # One stylesheet per page type
    │       ├── home.css  about.css  projects.css
    │       ├── skills.css  experience.css  contact.css
    │       └── inventory-demo.css
    ├── js/
    │   ├── data/                   # Classic scripts — no fetch, no JSON
    │   │   ├── projects-data.js    #   window.PORTFOLIO_PROJECTS (+ categories,
    │   │   │                       #   statuses) — one source of truth
    │   │   ├── skills-data.js      #   window.PORTFOLIO_SKILLS / _SKILL_GROUPS
    │   │   └── experience-data.js  #   window.PORTFOLIO_EXPERIENCE
    │   ├── theme.js                # Loaded in <head> to avoid a theme flash
    │   ├── components.js           # CQ namespace: path resolution, DOM helpers
    │   ├── navigation.js           # Drawer, active link, scroll state, back-to-top
    │   ├── animations.js           # Scroll reveal, hero entrance, cursor glow
    │   ├── project-gallery.js      # Accessible modal + screenshot gallery
    │   ├── projects.js             # Cards, featured strip, stats, details, timeline
    │   ├── filters.js              # Search + filtering (state mirrored to URL)
    │   ├── skills.js               # Technology marquee + capability groups
    │   ├── experience.js           # Experience page responsibility sections
    │   ├── form-validation.js      # Contact form validation + submission
    │   ├── inventory-demo.js       # Mobile inventory demo logic
    │   └── main.js                 # Entry point — boots what each page needs
    ├── icons/
    │   ├── favicon.svg
    │   └── tech/                   # Local technology SVGs (23)
    └── images/
        ├── profile/                # Portrait
        └── projects/<slug>/        # Screenshots, one folder per project
```

Shared styles rule: any class used on more than one page (`.capability-card`, `.service-card`,
`.marquee`, `.page-hero`, …) belongs in `components.css` or `global.css` — **never** in a
`pages/*.css` file, or it will render unstyled on the pages that do not load that stylesheet.

### How the shared header/footer work

The header, footer, and gallery modal markup is written directly into every page. Pages inside `pages/` and
`projects/` declare `data-base=".."` on `<html>`, which `assets/js/components.js` uses to resolve data-driven
asset paths at any folder depth.

Project, skill, and experience data load as classic scripts from `assets/js/data/`, so the portfolio renders
identically whether it is opened by double-clicking `index.html`, served from a static development server, or
deployed to Vercel. No build step and no server are required. The only runtime `fetch()` is the optional
Formspree contact-form submission, and it runs only on `http://` or `https://`.

---

## Run it locally

Double-click `index.html`. That is the whole procedure — no server, no build step, no commands.

Every page, the shared header/footer, and all project, skill, and experience data render straight from the
`file://` protocol because nothing is fetched at runtime.

---

## Editing content

- **Add / change a project:** edit `assets/js/data/projects-data.js` (`window.PORTFOLIO_PROJECTS`). Drop
  screenshots into `assets/images/projects/<slug>/` and reference them in that project's `screenshots` array.
  The card, filters, gallery, case study, home statistics, and experience timeline all update automatically.
- **Project links & status:** a `Live Demo` / `Open Demo` button only renders when `links.live`/`links.demo`
  is a real URL — placeholders like `#` or an empty string are ignored. A project with screenshots but no link
  shows **View Preview** and an **Under Development** badge; a project with neither shows a plain
  "Preview assets are being prepared." message and no dead button.
- **Add / change a technology:** edit `assets/js/data/skills-data.js`. `window.PORTFOLIO_SKILLS` drives the
  stack marquee (each entry is just a `name`, an `icon`, and a grouping `category` — no levels or
  percentages). `window.PORTFOLIO_SKILL_GROUPS` drives the capability lists. Add an `icon` only if a matching
  SVG exists in `assets/icons/tech/` — otherwise a clean text badge is drawn.

---

## Deployment

The site is static, so any of the following work with no configuration.

### GitHub Pages
1. Push the repository to GitHub.
2. **Settings → Pages → Build and deployment → Deploy from a branch**, select your branch and `/ (root)`.
3. Visit `https://<username>.github.io/<repo>/`.

### Netlify
1. **Add new site → Import an existing project**, or drag-and-drop the folder onto the dashboard.
2. Leave the build command empty; set the publish directory to the project root (`.`).
3. Deploy. Netlify serves `404.html` automatically.

### Vercel
1. **Import** the repository.
2. Framework preset **Other**, build command empty, output directory `.`.
3. Deploy.

---

## Notes & known limitations

- **Demos:** BookEase PH, Codexa Cafe Kiosk, and the Mobile IT Inventory Scanner are browser demos backed by
  LocalStorage — they do not connect to the fuller PHP/Laravel architectures documented in each case study.
- **Screenshot-only projects:** PTC WorkWise, LakbayGo, and the JPCS PTC website are presented through their
  captured interfaces and documented architecture; their source is private or not publicly deployed.
- **Contact form:** posts to the existing Formspree endpoint (`/f/mwvyllpl`). The endpoint owner must confirm
  the first submission in Formspree before delivery is active. A "message sent" state only appears after
  Formspree confirms; otherwise a direct email fallback is offered.
- **Images:** screenshots remain PNG (no optimised WebP variants were supplied) and are lazy-loaded with
  explicit `width`/`height` to avoid layout shift.
- **SEO metadata:** canonical links and the sitemap are intentionally omitted until a verified production domain
  is available.
