/* Entry point. Boots the modules each page needs from data that is already in
   memory — assets/js/data/*.js load as classic scripts before this file, so there
   is no network request and nothing to fail during direct file opening. */

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
    callIfPresent("CQExperienceInit");
    callIfPresent("CQAnimationsInit");
  }

  /** Rebuild the shape the renderers expect from the global data scripts. */
  function projectData() {
    if (!Array.isArray(window.PORTFOLIO_PROJECTS)) return null;
    return {
      projects: window.PORTFOLIO_PROJECTS,
      categories: window.PORTFOLIO_PROJECT_CATEGORIES || [],
      statuses: window.PORTFOLIO_PROJECT_STATUSES || []
    };
  }

  function skillData() {
    if (!Array.isArray(window.PORTFOLIO_SKILLS)) return null;
    return {
      technologies: window.PORTFOLIO_SKILLS,
      groups: window.PORTFOLIO_SKILL_GROUPS || []
    };
  }

  /**
   * Hide a section whose data never arrived instead of leaving an empty shell or
   * a loading message on screen. The cause is logged for developers only.
   */
  function hideSection(selector, reason) {
    var node = CQ.qs(selector);
    if (!node) return;
    var section = node.closest("section") || node;
    section.hidden = true;
    console.error("[portfolio] " + reason);
  }

  function renderProjects() {
    var needs = CQ.qs(
      "[data-featured-projects], [data-project-grid], [data-detail-content], [data-experience-timeline], [data-project-stats]"
    );
    if (!needs) return;

    var data = projectData();
    if (!data || !data.projects.length) {
      hideSection("[data-featured-projects]", "project data script did not load");
      hideSection("[data-project-grid]", "project data script did not load");
      hideSection("[data-project-stats]", "project data script did not load");
      return;
    }

    window.CQProjects.init(data);
  }

  function renderSkills() {
    var needs = CQ.qs("[data-skills], [data-skill-marquee]");
    if (!needs) return;

    var data = skillData();
    if (!data || !data.technologies.length) {
      hideSection("[data-skill-marquee]", "skill data script did not load");
      hideSection("[data-skills]", "skill data script did not load");
      return;
    }

    window.CQSkills.init(data);
  }

  function start() {
    bootChrome();
    renderProjects();
    renderSkills();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
