/* Technology stack rendering.

   Two pieces:
     1. A two-row infinite marquee of technology pills (icon + name only).
     2. Capability groups describing work performed.

   No levels, percentages, status dots, or years are rendered — the data does not
   carry them. Icons come from assets/icons/tech/ so they resolve
   offline and during direct file opening. */

(function () {
  "use strict";

  var CQ = window.CQ;
  var ICON_DIR = "assets/icons/tech/";

  function monogram(name) {
    var words = name.replace(/[^\w\s.+#]/g, "").split(/[\s.]+/).filter(Boolean);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  /** One technology pill. Falls back to a text monogram if an icon ever 404s. */
  function buildPill(tech) {
    var pill = CQ.el("li", { class: "tech-pill" });
    var iconWrap = CQ.el("span", { class: "tech-pill__icon" });

    if (tech.icon) {
      var image = CQ.el("img", {
        src: CQ.url(ICON_DIR + tech.icon + ".svg"),
        alt: "",
        width: 24,
        height: 24,
        decoding: "async"
      });
      image.addEventListener("error", function () {
        iconWrap.classList.add("tech-pill__icon--text");
        iconWrap.replaceChildren(document.createTextNode(monogram(tech.name)));
      });
      iconWrap.appendChild(image);
    } else {
      iconWrap.classList.add("tech-pill__icon--text");
      iconWrap.textContent = monogram(tech.name);
    }

    pill.appendChild(iconWrap);
    pill.appendChild(CQ.el("span", { class: "tech-pill__name", text: tech.name }));
    return pill;
  }

  /**
   * Build one marquee row. The track holds the pills twice: the first copy is
   * the real content, the second is an aria-hidden clone that makes the loop
   * seamless without announcing every technology to screen readers twice.
   */
  function buildRow(items, direction) {
    var row = CQ.el("div", { class: "marquee", dataset: { direction: direction } });

    var track = CQ.el("ul", { class: "marquee__track" });
    items.forEach(function (tech) {
      track.appendChild(buildPill(tech));
    });

    var clone = track.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    /* Cloned pills must never be reachable by keyboard or screen reader. */
    CQ.qsa("*", clone).forEach(function (node) {
      node.setAttribute("tabindex", "-1");
    });

    row.appendChild(track);
    row.appendChild(clone);
    return row;
  }

  function renderMarquee(host, technologies) {
    var half = Math.ceil(technologies.length / 2);
    var rowOne = technologies.slice(0, half);
    var rowTwo = technologies.slice(half);

    host.replaceChildren(buildRow(rowOne, "left"), buildRow(rowTwo, "right"));

    /* Pause while a visitor hovers or tabs into the strip. */
    CQ.qsa(".marquee", host).forEach(function (row) {
      row.addEventListener("focusin", function () {
        row.dataset.paused = "true";
      });
      row.addEventListener("focusout", function () {
        delete row.dataset.paused;
      });
    });
  }

  function renderGroups(host, groups) {
    host.replaceChildren.apply(
      host,
      groups.map(function (group, index) {
        var card = CQ.el("article", {
          class: "capability-card",
          "data-reveal": "",
          dataset: { revealGroup: "capability", revealIndex: String(index) }
        });

        card.appendChild(CQ.el("h3", { text: group.title }));
        card.appendChild(CQ.el("p", { class: "capability-card__lede", text: group.description }));

        var list = CQ.el("ul", { class: "capability-list" });
        group.items.forEach(function (item) {
          list.appendChild(CQ.el("li", { text: item }));
        });
        card.appendChild(list);

        return card;
      })
    );

    if (window.CQObserveReveal) window.CQObserveReveal(CQ.qsa("[data-reveal]", host));
  }

  window.CQSkills = {
    init: function (data) {
      var technologies = data.technologies || [];
      var groups = data.groups || [];

      var marqueeHost = CQ.qs("[data-skill-marquee]");
      if (marqueeHost && technologies.length) renderMarquee(marqueeHost, technologies);

      var groupHost = CQ.qs("[data-skills]");
      if (groupHost && groups.length) renderGroups(groupHost, groups);
    }
  };
})();
