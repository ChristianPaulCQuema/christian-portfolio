/* Theme switching. Loaded synchronously in <head> so the attribute is set before
   first paint — this avoids a flash without duplicating an inline snippet per page.

   Policy: the portfolio always opens in light mode. The operating system and
   browser colour preference are deliberately never consulted. Dark mode is
   opt-in via the toggle and lives in sessionStorage, so it survives navigation
   between pages but resets when the browser session ends. */

(function () {
  "use strict";

  var SESSION_KEY = "portfolio-theme";
  var MIGRATION_KEY = "portfolio-light-default-v1";
  var META_COLOR = { light: "#f6f7fb", dark: "#070b18" };

  /* Keys previous versions of this site (and common templates) persisted a theme
     under. "cq-theme" is the one this portfolio actually used. */
  var LEGACY_KEYS = ["cq-theme", "theme", "color-theme", "portfolio-theme"];

  var root = document.documentElement;

  /* One-time cleanup so an old stored "dark" can never resurface. Guarded by its
     own key, so this does not run on every page view. Unrelated keys such as
     "cq-inventory-demo" are left untouched. */
  function migrateLegacyStorage() {
    try {
      if (localStorage.getItem(MIGRATION_KEY)) return;

      LEGACY_KEYS.forEach(function (key) {
        localStorage.removeItem(key);
      });

      localStorage.setItem(MIGRATION_KEY, "complete");
    } catch (error) {
      /* Private mode / storage disabled — nothing to migrate. */
    }
  }

  function storedTheme() {
    try {
      return sessionStorage.getItem(SESSION_KEY);
    } catch (error) {
      return null; /* Private mode / storage disabled. */
    }
  }

  function persist(theme) {
    try {
      sessionStorage.setItem(SESSION_KEY, theme);
    } catch (error) {
      /* Nothing to do — the theme still applies for this page view. */
    }
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", META_COLOR[theme] || META_COLOR.light);
  }

  migrateLegacyStorage();

  /* Only an exact "dark" opts in. Anything else — absent, stale, or malformed —
     resolves to light. */
  apply(storedTheme() === "dark" ? "dark" : "light");

  /* Wire the toggle once the header partial exists. */
  window.CQThemeInit = function () {
    var toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle || toggle.dataset.bound === "true") return;
    toggle.dataset.bound = "true";

    function sync() {
      var isDark = root.getAttribute("data-theme") === "dark";
      toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.replaceChildren(window.CQ.icon(isDark ? "sun" : "moon"));
    }

    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      apply(next);
      persist(next);
      sync();
    });

    sync();
  };
})();
