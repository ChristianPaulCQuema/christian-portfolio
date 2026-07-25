/* Shared runtime: path resolution, DOM helpers, partial loading, data loading.
   Loaded before every other script. Exposes the global `CQ` namespace. */

window.CQ = (function () {
  "use strict";

  /* Pages inside /pages/ and /projects/ declare data-base=".." on <html> so every
     asset path in the JSON and the partials can stay relative to the site root. */
  var base = document.documentElement.getAttribute("data-base") || "";
  if (base && !base.endsWith("/")) base += "/";

  /** Resolve a site-root-relative path for the current page depth. */
  function url(path) {
    if (!path) return path;
    if (/^(https?:)?\/\//i.test(path) || path.startsWith("mailto:") || path.startsWith("#")) {
      return path;
    }
    return base + path;
  }

  /* ---------- DOM helpers ---------- */

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  /**
   * Create an element. `props.text` is always set via textContent, never innerHTML,
   * so values coming from JSON can never inject markup.
   */
  function el(tag, props, children) {
    var node = document.createElement(tag);
    props = props || {};

    Object.keys(props).forEach(function (key) {
      var value = props[key];
      if (value === null || value === undefined || value === false) return;

      if (key === "text") {
        node.textContent = value;
      } else if (key === "class") {
        node.className = value;
      } else if (key === "dataset") {
        Object.keys(value).forEach(function (dataKey) {
          node.dataset[dataKey] = value[dataKey];
        });
      } else if (key === "html") {
        /* Only ever called with static markup authored in this repo (icons). */
        node.innerHTML = value;
      } else if (key in node && key !== "list") {
        node[key] = value;
      } else {
        node.setAttribute(key, value);
      }
    });

    (children || []).forEach(function (child) {
      if (child === null || child === undefined || child === false) return;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });

    return node;
  }

  /* ---------- Inline icon set (static markup, safe for innerHTML) ---------- */

  var ICONS = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5z"/>',
    arrowUp: '<path d="M12 19V5M5 12l7-7 7 7"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chevronLeft: '<path d="M15 5l-7 7 7 7"/>',
    chevronRight: '<path d="M9 5l7 7-7 7"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    external: '<path d="M14 4h6v6M20 4l-8 8M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M3 16l4.5-4.5L14 18"/>',
    github: '<path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.75c0 .26.18.57.69.48A10 10 0 0 0 12 2z" fill="currentColor" stroke="none"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    pin: '<path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    code: '<path d="M8 6l-5 6 5 6M16 6l5 6-5 6"/>'
  };

  /** Return an inline SVG icon element. */
  function icon(name, size) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    if (size) {
      svg.setAttribute("width", size);
      svg.setAttribute("height", size);
    }
    svg.innerHTML = ICONS[name] || "";
    return svg;
  }

  /* ---------- Link validity ---------- */

  var PLACEHOLDERS = ["", "#", "javascript:void(0)", "javascript:;", "null", "undefined", "tbd", "n/a"];

  /** A link is only rendered when it is a real, non-placeholder destination. */
  function isValidLink(href) {
    if (typeof href !== "string") return false;
    var value = href.trim().toLowerCase();
    if (PLACEHOLDERS.indexOf(value) !== -1) return false;
    return /^https?:\/\/.+\..+/.test(value) || /^[\w./-]+\.html?(\?|#|$)/.test(value);
  }

  function isExternal(href) {
    return /^https?:\/\//i.test(href);
  }

  /* ---------- Fetch helpers ---------- */

  var cache = {};

  function fetchText(path) {
    var full = url(path);
    if (!cache[full]) {
      cache[full] = fetch(full).then(function (response) {
        if (!response.ok) throw new Error(full + " -> HTTP " + response.status);
        return response.text();
      });
    }
    return cache[full];
  }

  function fetchJSON(path) {
    return fetchText(path).then(function (text) {
      return JSON.parse(text);
    });
  }

  /**
   * Load the shared header/footer partials into their placeholders.
   * Resolves even on failure so the rest of the page still boots.
   */
  function loadPartials() {
    var slots = qsa("[data-component]");
    if (!slots.length) return Promise.resolve(true);

    return Promise.all(
      slots.map(function (slot) {
        return fetchText("components/" + slot.dataset.component + ".html")
          .then(function (markup) {
            /* Trusted, repo-authored markup. {{base}} makes the links depth-aware. */
            slot.innerHTML = markup.replace(/\{\{base\}\}/g, base);
            return true;
          })
          .catch(function () {
            return false;
          });
      })
    ).then(function (results) {
      var ok = results.every(Boolean);
      if (!ok) renderPartialFallback();
      return ok;
    });
  }

  /**
   * Safe fallback for file:// (where fetch is blocked by CORS). Renders a plain
   * working navigation from the same link data plus a note explaining the cause,
   * so the portfolio is never a dead page.
   */
  var NAV_ITEMS = [
    { href: "index.html", label: "Home" },
    { href: "pages/about.html", label: "About" },
    { href: "pages/projects.html", label: "Projects" },
    { href: "pages/skills.html", label: "Skills" },
    { href: "pages/experience.html", label: "Experience" },
    { href: "pages/contact.html", label: "Contact" }
  ];

  function renderPartialFallback() {
    var header = qs('[data-component="header"]');
    if (header) {
      header.appendChild(
        el("p", {
          class: "component-fallback-note",
          text:
            "Shared components could not be loaded. Open this portfolio through a local web server (see README) rather than the file:// protocol."
        })
      );
      header.appendChild(
        el("div", { class: "container" }, [
          el(
            "nav",
            { class: "site-nav", "aria-label": "Primary" },
            [
              el("a", { class: "brand", href: url("index.html") }, [
                el("span", { class: "brand__mark", text: "CQ" }),
                el("span", { text: "Christian Quema" })
              ]),
              el(
                "ul",
                { class: "nav-list" },
                NAV_ITEMS.map(function (item) {
                  return el("li", {}, [el("a", { class: "nav-link", href: url(item.href), text: item.label })]);
                })
              )
            ]
          )
        ])
      );
    }

    var footer = qs('[data-component="footer"]');
    if (footer) {
      footer.appendChild(
        el("div", { class: "container" }, [
          el("p", { class: "muted", text: "© " + new Date().getFullYear() + " Christian Paul Quema" })
        ])
      );
    }
  }

  return {
    base: base,
    url: url,
    qs: qs,
    qsa: qsa,
    el: el,
    icon: icon,
    isValidLink: isValidLink,
    isExternal: isExternal,
    fetchText: fetchText,
    fetchJSON: fetchJSON,
    loadPartials: loadPartials,
    navItems: NAV_ITEMS
  };
})();
