/* Responsive technology ticker for static hosting (GitHub Pages and Vercel). */
(function () {
  "use strict";

  var CQ = window.CQ;
  var ICON_DIR = "assets/icons/tech/";
  var resizeTimer;

  var PREVIEW_GROUPS = [
    { label: "Frontend & UI", categories: ["Frontend & UI"] },
    { label: "Backend & APIs", categories: ["Backend & Runtime", "API & Security"] },
    { label: "Data, Cloud & DevOps", categories: ["Database & Data", "Cloud & DevOps"] },
    { label: "Mobile, Testing & Tools", categories: ["Mobile Development", "Testing & Quality", "Development Tools"] }
  ];

  function monogram(name) {
    var words = name.replace(/[^\w\s.+#]/g, "").split(/[\s.]+/).filter(Boolean);
    return (words.length >= 2 ? words[0][0] + words[1][0] : name.substring(0, 2)).toUpperCase();
  }

  function buildPill(tech) {
    var pill = CQ.el("li", { class: "tech-pill", title: tech.name });
    var iconWrap = CQ.el("span", { class: "tech-pill__icon", "aria-hidden": "true" });
    var image = CQ.el("img", {
      src: CQ.url(ICON_DIR + tech.icon + ".svg"),
      alt: "",
      width: 30,
      height: 30,
      loading: "eager",
      decoding: "async"
    });

    image.addEventListener("error", function () {
      iconWrap.classList.add("tech-pill__icon--text");
      iconWrap.replaceChildren(document.createTextNode(monogram(tech.name)));
    });

    iconWrap.appendChild(image);
    pill.appendChild(iconWrap);
    pill.appendChild(CQ.el("span", { class: "tech-pill__name", text: tech.name }));
    return pill;
  }

  function makeGroup(items) {
    var group = CQ.el("ul", { class: "marquee__group" });
    items.forEach(function (tech) { group.appendChild(buildPill(tech)); });
    return group;
  }

  function fillRow(row, items, index) {
    var track = row.querySelector(".marquee__track");
    if (!track || !items.length) return;

    track.replaceChildren();
    var first = makeGroup(items);
    track.appendChild(first);

    /* A short category such as Mobile is repeated inside each half until one
       half is wider than the visible lane. This prevents desktop blank spaces. */
    var safety = 0;
    while (first.scrollWidth < row.clientWidth + 180 && safety < 10) {
      items.forEach(function (tech) { first.appendChild(buildPill(tech)); });
      safety += 1;
    }

    var second = first.cloneNode(true);
    second.setAttribute("aria-hidden", "true");
    track.appendChild(second);

    var width = Math.max(first.scrollWidth, row.clientWidth);
    var pixelsPerSecond = index % 2 ? 44 : 48;
    var duration = Math.max(24, Math.min(68, width / pixelsPerSecond));

    row.dataset.direction = index % 2 ? "right" : "left";
    track.style.setProperty("--marquee-speed", duration.toFixed(1) + "s");
    row.classList.add("is-ready");
  }

  function buildRow(label, items, index) {
    var block = CQ.el("section", { class: "skill-lane", "aria-label": label });
    var heading = CQ.el("div", { class: "skill-lane__label" });
    heading.appendChild(CQ.el("span", { text: String(index + 1).padStart(2, "0") }));
    heading.appendChild(CQ.el("h3", { text: label }));

    var row = CQ.el("div", { class: "marquee", dataset: { laneIndex: String(index) } });
    row.appendChild(CQ.el("div", { class: "marquee__track" }));
    block.appendChild(heading);
    block.appendChild(row);

    requestAnimationFrame(function () { fillRow(row, items, index); });
    return block;
  }

  function normalGroups(technologies) {
    var order = [];
    technologies.forEach(function (tech) {
      var entry = order.find(function (item) { return item.label === tech.category; });
      if (!entry) {
        entry = { label: tech.category, items: [] };
        order.push(entry);
      }
      entry.items.push(tech);
    });
    return order;
  }

  function previewGroups(technologies) {
    return PREVIEW_GROUPS.map(function (group) {
      return {
        label: group.label,
        items: technologies.filter(function (tech) { return group.categories.indexOf(tech.category) !== -1; })
      };
    });
  }

  function renderMarquee(host, technologies) {
    var groups = host.dataset.skillPreview === "true" ? previewGroups(technologies) : normalGroups(technologies);
    host.replaceChildren.apply(host, groups.map(function (entry, index) {
      return buildRow(entry.label, entry.items, index);
    }));
    host.dataset.rendered = "true";
    host._cqTechnologies = technologies;
  }

  function renderGroups(host, groups) {
    host.replaceChildren.apply(host, groups.map(function (group, index) {
      var card = CQ.el("article", {
        class: "capability-card",
        "data-reveal": "",
        dataset: { revealGroup: "capability", revealIndex: String(index) }
      });
      card.appendChild(CQ.el("h3", { text: group.title }));
      card.appendChild(CQ.el("p", { class: "capability-card__lede", text: group.description }));
      var list = CQ.el("ul", { class: "capability-list" });
      group.items.forEach(function (item) { list.appendChild(CQ.el("li", { text: item })); });
      card.appendChild(list);
      return card;
    }));
    if (window.CQObserveReveal) window.CQObserveReveal(CQ.qsa("[data-reveal]", host));
  }

  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      CQ.qsa("[data-skill-marquee]").forEach(function (host) {
        if (host._cqTechnologies) renderMarquee(host, host._cqTechnologies);
      });
    }, 240);
  });

  window.CQSkills = {
    init: function (data) {
      var technologies = data.technologies || [];
      var groups = data.groups || [];
      CQ.qsa("[data-skill-marquee]").forEach(function (host) {
        if (technologies.length) renderMarquee(host, technologies);
      });
      var groupHost = CQ.qs("[data-skills]");
      if (groupHost && groups.length) renderGroups(groupHost, groups);
    }
  };
})();
