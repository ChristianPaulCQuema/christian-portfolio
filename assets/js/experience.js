/* Experience page sections, rendered from window.PORTFOLIO_EXPERIENCE.
   Project delivery cards come from the shared project dataset via projects.js,
   so nothing about a project is duplicated here. */

(function () {
  "use strict";

  var CQ = window.CQ;

  function buildSection(entry) {
    var section = CQ.el("section", { class: "section--tight", id: entry.id });
    var container = CQ.el("div", { class: "container" });

    var headingId = entry.id + "-title";
    section.setAttribute("aria-labelledby", headingId);

    container.appendChild(
      CQ.el("div", { class: "section-head", "data-reveal": "" }, [
        CQ.el("p", { class: "eyebrow", text: entry.eyebrow }),
        CQ.el("h2", { id: headingId, text: entry.title })
      ])
    );

    var grid = CQ.el("div", { class: "capability-groups" });
    entry.groups.forEach(function (group, index) {
      var card = CQ.el("article", {
        class: "capability-card",
        "data-reveal": "",
        dataset: { revealGroup: entry.id, revealIndex: String(index) }
      });
      card.appendChild(CQ.el("h3", { text: group.title }));

      var list = CQ.el("ul", { class: "capability-list" });
      group.items.forEach(function (item) {
        list.appendChild(CQ.el("li", { text: item }));
      });
      card.appendChild(list);
      grid.appendChild(card);
    });

    container.appendChild(grid);
    section.appendChild(container);
    return section;
  }

  window.CQExperienceInit = function () {
    var host = CQ.qs("[data-experience-sections]");
    if (!host) return;

    var entries = window.PORTFOLIO_EXPERIENCE;
    if (!Array.isArray(entries) || !entries.length) {
      /* Nothing to show — collapse the region rather than leave blank space. */
      host.hidden = true;
      console.error("[portfolio] experience data script did not load");
      return;
    }

    host.replaceChildren.apply(host, entries.map(buildSection));

    if (window.CQObserveReveal) window.CQObserveReveal(CQ.qsa("[data-reveal]", host));
  };
})();
