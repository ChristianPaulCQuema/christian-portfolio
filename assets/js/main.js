/* Entry point. Loads the shared partials, then boots the modules each page needs. */

(function () {
  "use strict";

  var CQ = window.CQ;

  document.documentElement.classList.add("js-enabled");

  function callIfPresent(name, arg) {
    if (typeof window[name] === "function") window[name](arg);
  }

  function bootChrome() {
    callIfPresent("CQThemeInit");
    callIfPresent("CQNavigationInit");
    callIfPresent("CQGalleryInit");
    callIfPresent("CQFormInit");
    callIfPresent("CQAnimationsInit");
  }

  function dataErrorMessage() {
    return window.location.protocol === "file:"
      ? "Project data cannot be read over the file:// protocol. Please run the portfolio through a local web server — see the README for the one-line command."
      : "Project data could not be loaded. Please refresh the page.";
  }

  function showDataError() {
    var message = dataErrorMessage();

    CQ.qsa("[data-data-error]").forEach(function (node) {
      node.textContent = message;
      node.hidden = false;
    });

    var loading = CQ.qs("[data-detail-loading]");
    if (loading) loading.hidden = true;

    var error = CQ.qs("[data-detail-error]");
    if (error) {
      CQ.qs("[data-detail-error-message]").textContent = message;
      error.hidden = false;
    }
  }

  function loadData() {
    var needsProjects = CQ.qs(
      "[data-featured-projects], [data-project-grid], [data-detail-content], [data-experience-timeline]"
    );
    var needsSkills = CQ.qs("[data-skills], [data-skills-summary]");
    var jobs = [];

    if (needsProjects) {
      jobs.push(
        CQ.fetchJSON("assets/data/projects.json").then(function (data) {
          window.CQProjects.init(data);
        })
      );
    }

    if (needsSkills) {
      jobs.push(
        CQ.fetchJSON("assets/data/skills.json").then(function (data) {
          window.CQSkills.init(data);
        })
      );
    }

    if (!jobs.length) return Promise.resolve();

    return Promise.all(jobs).catch(function (error) {
      /* One visible, actionable message beats a silent blank section. */
      console.error("[portfolio] data load failed:", error.message);
      showDataError();
    });
  }

  function start() {
    CQ.loadPartials()
      .then(bootChrome)
      .then(loadData);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
