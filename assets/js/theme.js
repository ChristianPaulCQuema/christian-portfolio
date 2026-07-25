/* Theme switching. Loaded synchronously in <head> so the stored theme is applied
   before first paint — this avoids a light/dark flash without any inline script. */

(function () {
  "use strict";

  var STORAGE_KEY = "cq-theme";
  var root = document.documentElement;

  function stored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null; /* Private mode / storage disabled. */
    }
  }

  function persist(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      /* Nothing to do — the theme still applies for this page view. */
    }
  }

  function systemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f6f7fb" : "#070b18");
  }

  apply(stored() || systemTheme());

  /* Wire the toggle once the header partial exists. */
  window.CQThemeInit = function () {
    var toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle || toggle.dataset.bound === "true") return;
    toggle.dataset.bound = "true";

    function sync() {
      var isLight = root.getAttribute("data-theme") === "light";
      toggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
      toggle.setAttribute("aria-pressed", String(isLight));
      toggle.replaceChildren(window.CQ.icon(isLight ? "moon" : "sun"));
    }

    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      apply(next);
      persist(next);
      sync();
    });

    sync();
  };
})();
