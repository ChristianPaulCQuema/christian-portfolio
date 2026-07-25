/* Header behaviour: mobile drawer, active-page indicator, scroll state, back-to-top. */

(function () {
  "use strict";

  var CQ = window.CQ;

  function currentPage() {
    var path = window.location.pathname;
    var file = path.substring(path.lastIndexOf("/") + 1);
    if (!file) file = "index.html";
    /* /pages/about.html and about.html both resolve to "about.html". */
    return file.toLowerCase();
  }

  function markActiveLink() {
    var page = currentPage();
    var links = CQ.qsa(".nav-list .nav-link");
    var matched = false;

    links.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      var target = href.substring(href.lastIndexOf("/") + 1).split("#")[0].toLowerCase();
      if (target === page) {
        link.setAttribute("aria-current", "page");
        matched = true;
      } else {
        link.removeAttribute("aria-current");
      }
    });

    /* Project detail pages and the standalone demo belong to "Projects". */
    if (!matched && (page === "project-details.html" || page === "mobile-inventory.html")) {
      links.forEach(function (link) {
        if ((link.getAttribute("href") || "").indexOf("projects.html") !== -1) {
          link.setAttribute("aria-current", "page");
        }
      });
    }
  }

  function initDrawer() {
    var toggle = CQ.qs("[data-nav-toggle]");
    var panel = CQ.qs("[data-nav-panel]");
    if (!toggle || !panel) return;

    var mobileQuery = window.matchMedia("(max-width: 60rem)");

    function setOpen(open) {
      panel.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      toggle.replaceChildren(CQ.icon(open ? "close" : "menu"));
    }

    toggle.replaceChildren(CQ.icon("menu"));
    setOpen(false);

    toggle.addEventListener("click", function () {
      setOpen(!panel.classList.contains("is-open"));
    });

    /* Close on link activation, Escape, outside click, or resize past the breakpoint. */
    panel.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && panel.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (!panel.classList.contains("is-open")) return;
      if (panel.contains(event.target) || toggle.contains(event.target)) return;
      setOpen(false);
    });

    mobileQuery.addEventListener("change", function (event) {
      if (!event.matches) setOpen(false);
    });
  }

  function initScrollState() {
    var header = CQ.qs(".site-header");
    var toTop = CQ.qs("[data-to-top]");
    if (!header && !toTop) return;

    if (toTop) {
      toTop.replaceChildren(CQ.icon("arrowUp"));
      toTop.addEventListener("click", function () {
        var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      });
    }

    var ticking = false;
    function update() {
      var y = window.scrollY;
      if (header) header.classList.toggle("is-scrolled", y > 8);
      if (toTop) toTop.classList.toggle("is-visible", y > 600);
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );

    update();
  }

  function initFooterYear() {
    CQ.qsa("[data-year]").forEach(function (node) {
      node.textContent = String(new Date().getFullYear());
    });
  }

  window.CQNavigationInit = function () {
    markActiveLink();
    initDrawer();
    initScrollState();
    initFooterYear();
  };
})();
