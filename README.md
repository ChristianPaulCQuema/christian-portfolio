# Christian Paul Quema - Portfolio

A responsive, static developer portfolio built with semantic HTML, custom CSS, vanilla JavaScript, and one locally hosted Bootstrap 5.3.8 bundle. It deploys directly to Vercel without a build step.

## Structure

- `index.html` - concise homepage, project cards, and six accessible project modals
- `assets/css/bootstrap.min.css` - local Bootstrap framework stylesheet
- `assets/css/style.css` - portfolio design system, responsive rules, and motion treatment
- `assets/js/bootstrap.bundle.min.js` - local Bootstrap component bundle
- `assets/js/script.js` - navigation state, reveal effects, technology-card tilt, and contact validation
- `assets/icons/technologies/` - local SVG technology logos
- `projects/` - dedicated BookEase, Codexa Cafe, JPCS, and mobile inventory case studies
- `ptcworkwise/` and `lakbaygo/` - screenshot-backed interface galleries
- `AUDIT_REPORT.md` - implementation and verification record
- `robots.txt`, `sitemap.xml`, and `404.html` - search and error support

## Local preview

Open `index.html` directly or serve the repository root with any static server. A static server is preferable when checking form-network behavior.

## Deploy to Vercel

1. Import this repository into Vercel.
2. Select **Other** as the framework preset.
3. Leave the build command empty.
4. Set the output directory to `.`.
5. Deploy and verify `/`, the routes listed in `sitemap.xml`, and the contact form.

## Known limitations

- The public BookEase and Codexa demos use browser storage; they do not connect to the documented complete-system backends.
- PTC WorkWise, LakbayGo, and JPCS are screenshot-backed demonstrations.
- The mobile inventory demo is a browser prototype, not a native Flutter build.
- No resume PDF or LinkedIn URL was supplied.
- The Formspree endpoint still needs an owner-authorized submission after deployment.
- The project screenshots remain PNG files because optimized WebP source variants were not supplied.
