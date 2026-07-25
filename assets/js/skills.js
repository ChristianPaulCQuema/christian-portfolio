/* Skills rendering from assets/data/skills.json.
   Icons are used only when a real SVG exists in assets/images/icons/technologies/;
   otherwise a clean text monogram is drawn so no broken image can appear. */

(function () {
  "use strict";

  var CQ = window.CQ;

  function monogram(name) {
    var words = name.replace(/[^\w\s.+#]/g, "").split(/[\s.]+/).filter(Boolean);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  function buildIcon(skill) {
    if (skill.icon) {
      var wrap = CQ.el("span", { class: "skill-card__icon" });
      var image = CQ.el("img", {
        src: CQ.url("assets/images/icons/technologies/" + skill.icon + ".svg"),
        alt: "",
        width: 24,
        height: 24,
        loading: "lazy",
        decoding: "async"
      });
      /* If the SVG is ever missing, swap in the text badge instead of a broken icon. */
      image.addEventListener("error", function () {
        wrap.classList.add("skill-card__icon--text");
        wrap.replaceChildren(document.createTextNode(monogram(skill.name)));
      });
      wrap.appendChild(image);
      return wrap;
    }

    return CQ.el("span", {
      class: "skill-card__icon skill-card__icon--text",
      "aria-hidden": "true",
      text: monogram(skill.name)
    });
  }

  function buildCard(skill, levelLabels) {
    var card = CQ.el("article", { class: "skill-card" });
    card.appendChild(buildIcon(skill));

    card.appendChild(
      CQ.el("div", { class: "skill-card__body" }, [
        CQ.el("p", { class: "skill-card__name", text: skill.name }),
        CQ.el("p", { class: "skill-card__level" }, [
          CQ.el("span", { class: "level-dot", dataset: { level: skill.level }, "aria-hidden": "true" }),
          document.createTextNode(levelLabels[skill.level] || skill.level)
        ])
      ])
    );

    return card;
  }

  window.CQSkills = {
    init: function (data) {
      var host = CQ.qs("[data-skills]");

      var levelLabels = {};
      (data.levels || []).forEach(function (level) {
        levelLabels[level.id] = level.label;
      });

      /* Legend */
      var legend = CQ.qs("[data-skills-legend]");
      if (legend) {
        legend.replaceChildren.apply(
          legend,
          (data.levels || []).map(function (level) {
            return CQ.el("li", { class: "legend__item" }, [
              CQ.el("span", { class: "level-dot", dataset: { level: level.id }, "aria-hidden": "true" }),
              CQ.el("span", {}, [
                CQ.el("strong", { text: level.label }),
                document.createTextNode(" — " + level.description)
              ])
            ]);
          })
        );
      }

      /* Full skills grid — only on the skills page. */
      if (host) {
      host.replaceChildren.apply(
        host,
        (data.categories || []).map(function (category) {
          var section = CQ.el("section", { class: "skill-category", id: category.id });

          section.appendChild(
            CQ.el("div", { class: "skill-category__head" }, [
              CQ.el("h2", { text: category.title }),
              CQ.el("p", { text: category.description })
            ])
          );

          var grid = CQ.el("div", { class: "skill-grid" });
          category.skills.forEach(function (skill, index) {
            var card = buildCard(skill, levelLabels);
            card.setAttribute("data-reveal", "");
            card.dataset.revealGroup = category.id;
            card.dataset.revealIndex = String(index);
            grid.appendChild(card);
          });

          section.appendChild(grid);
          return section;
        })
      );

      if (window.CQObserveReveal) window.CQObserveReveal(CQ.qsa("[data-reveal]", host));
      }

      /* Home page summary strip, if present. */
      var summary = CQ.qs("[data-skills-summary]");
      if (summary) {
        summary.replaceChildren.apply(
          summary,
          (data.categories || []).slice(0, 4).map(function (category) {
            var top = category.skills
              .filter(function (skill) {
                return skill.level === "core";
              })
              .slice(0, 5);
            var names = (top.length ? top : category.skills.slice(0, 5)).map(function (skill) {
              return skill.name;
            });

            var card = CQ.el("article", { class: "skill-summary__card", "data-reveal": "" });
            card.appendChild(CQ.el("h3", { text: category.title }));
            var list = CQ.el("ul", { class: "tech-list" });
            names.forEach(function (name) {
              list.appendChild(CQ.el("li", { class: "tech-chip", text: name }));
            });
            card.appendChild(list);
            return card;
          })
        );
        if (window.CQObserveReveal) window.CQObserveReveal(CQ.qsa("[data-reveal]", summary));
      }
    }
  };
})();
