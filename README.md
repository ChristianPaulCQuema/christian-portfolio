# Christian Paul Quema — Developer Portfolio

A responsive, multi-page developer portfolio built with **semantic HTML, modular CSS, and dependency-free
(vanilla) JavaScript**. No framework, no build step, no backend. It is designed to be dropped straight onto
any static host — GitHub Pages, Netlify, or Vercel.

The portfolio is data-driven: every project card, filter, gallery, and case study is generated from
`assets/data/projects.json`, and the skills page from `assets/data/skills.json`. Add a project by editing the
JSON — you never touch the markup.

---

## Project structure

```
christian-portfolio-main/
├── index.html                     # Home
├── 404.html                       # Custom not-found page (root-absolute paths)
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
├── components/                    # HTML partials, fetched at runtime
│   ├── header.html
│   ├── footer.html
│   └── project-modal.html         # Shared screenshot-gallery shell
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
    │   ├── theme.js                # Loaded in <head> to avoid a theme flash
    │   ├── components.js           # CQ namespace: paths, DOM helpers, partials
    │   ├── navigation.js           # Drawer, active link, scroll state, back-to-top
    │   ├── animations.js           # Scroll reveal, hero entrance, cursor glow
    │   ├── project-gallery.js      # Accessible modal + screenshot gallery
    │   ├── projects.js             # Cards, featured strip, details, timeline
    │   ├── filters.js              # Search + filtering (state mirrored to URL)
    │   ├── skills.js               # Skills page + home summary
    │   ├── form-validation.js      # Contact form validation + submission
    │   ├── inventory-demo.js       # Mobile inventory demo logic
    │   └── main.js                 # Entry point — boots what each page needs
    ├── data/
    │   ├── projects.json           # Single source of truth for all projects
    │   └── skills.json
    └── images/
        ├── profile/                # Portrait
        ├── projects/<slug>/        # Screenshots, one folder per project
        └── icons/                  # favicon.svg + technologies/*.svg
```

### How the shared header/footer work

`header.html`, `footer.html`, and `project-modal.html` are fetched once and injected into every page, so the
navigation and footer are defined in exactly one place. Pages inside `pages/` and `projects/` declare
`data-base=".."` on `<html>`; the loader rewrites `{{base}}` in the partials and every JSON asset path so the
same components work at any folder depth.

Because this uses `fetch()`, **the site must be opened through a web server, not the `file://` protocol.** If
you do open a file directly, the header falls back to a plain working navigation and shows a note explaining
why — the site never becomes a dead page — but the project data will not load.

---

## Run it locally

From the project root, start any static server, then open the printed URL.

**VS Code (recommended):** install the **Live Server** extension, right-click `index.html` → *Open with Live
Server*.

**Python** (bundled with most systems):

```bash
python -m http.server 5500
# then open http://localhost:5500/
```

**Node:**

```bash
npx serve .
# or: npx http-server -p 5500
```

---

## Editing content

- **Add / change a project:** edit `assets/data/projects.json`. Drop screenshots into
  `assets/images/projects/<slug>/` and reference them in that project's `screenshots` array. The card,
  filters, gallery, case study, and experience timeline all update automatically.
- **Project links & status:** a `Live Demo` / `Open Demo` button only renders when `links.live`/`links.demo`
  is a real URL — placeholders like `#` or an empty string are ignored. A project with screenshots but no link
  shows **View Preview** and an **Under Development** badge; a project with neither shows a plain
  "Preview assets are being prepared." message and no dead button.
- **Add / change a skill:** edit `assets/data/skills.json`. Each skill has a `level` of `core` (used in
  projects), `working` (working knowledge), or `learning` (currently learning). Add an `icon` only if a
  matching SVG exists in `assets/images/icons/technologies/` — otherwise a clean text badge is drawn.

---

## Deployment

The site is static, so any of the following work with no configuration.

### GitHub Pages
1. Push the repository to GitHub.
2. **Settings → Pages → Build and deployment → Deploy from a branch**, select your branch and `/ (root)`.
3. Visit `https://<username>.github.io/<repo>/`.
   *If you use a project subpath, update the root-absolute paths in `404.html` (see the comment at the top of
   that file).* User/organisation sites served from the domain root need no change.

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
- **Résumé / LinkedIn:** no résumé PDF or LinkedIn URL was supplied, so neither is linked. The résumé is
  offered "on request by email".
- **Images:** screenshots remain PNG (no optimised WebP variants were supplied) and are lazy-loaded with
  explicit `width`/`height` to avoid layout shift.
