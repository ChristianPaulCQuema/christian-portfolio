/* Multi-row technology marquee with category labels and local icon fallbacks. */
(function () {
  "use strict";
  var CQ = window.CQ;
  var ICON_DIR = "assets/icons/tech/";
  function monogram(name) {
    var words = name.replace(/[^\w\s.+#]/g, "").split(/[\s.]+/).filter(Boolean);
    return (words.length >= 2 ? words[0][0] + words[1][0] : name.substring(0, 2)).toUpperCase();
  }
  function buildPill(tech) {
    var pill = CQ.el("li", { class: "tech-pill", title: tech.name });
    var iconWrap = CQ.el("span", { class: "tech-pill__icon" });
    var image = CQ.el("img", { src: CQ.url(ICON_DIR + tech.icon + ".svg"), alt: "", width: 30, height: 30, loading: "lazy", decoding: "async" });
    image.addEventListener("error", function () { iconWrap.classList.add("tech-pill__icon--text"); iconWrap.replaceChildren(document.createTextNode(monogram(tech.name))); });
    iconWrap.appendChild(image);
    pill.appendChild(iconWrap);
    pill.appendChild(CQ.el("span", { class: "tech-pill__name", text: tech.name }));
    return pill;
  }
  function buildTrack(items) {
    var track = CQ.el("ul", { class: "marquee__track" });
    items.forEach(function (tech) { track.appendChild(buildPill(tech)); });
    return track;
  }
  function buildRow(label, items, index) {
    var block = CQ.el("section", { class: "skill-lane", "aria-label": label });
    var heading = CQ.el("div", { class: "skill-lane__label" });
    heading.appendChild(CQ.el("span", { text: String(index + 1).padStart(2, "0") }));
    heading.appendChild(CQ.el("h3", { text: label }));
    heading.appendChild(CQ.el("small", { text: items.length + " tools" }));
    var row = CQ.el("div", { class: "marquee", dataset: { direction: index % 2 ? "right" : "left", speed: String(34 + (index % 4) * 5) } });
    var track = buildTrack(items);
    track.style.setProperty("--marquee-speed", row.dataset.speed + "s");
    var clone = track.cloneNode(true); clone.setAttribute("aria-hidden", "true");
    row.appendChild(track); row.appendChild(clone);
    block.appendChild(heading); block.appendChild(row);
    row.addEventListener("focusin", function () { row.dataset.paused = "true"; });
    row.addEventListener("focusout", function () { delete row.dataset.paused; });
    return block;
  }
  function renderMarquee(host, technologies) {
    var order = [];
    technologies.forEach(function (tech) {
      var entry = order.find(function (x) { return x.label === tech.category; });
      if (!entry) { entry = { label: tech.category, items: [] }; order.push(entry); }
      entry.items.push(tech);
    });
    host.replaceChildren.apply(host, order.map(function (entry, index) { return buildRow(entry.label, entry.items, index); }));
  }
  function renderGroups(host, groups) {
    host.replaceChildren.apply(host, groups.map(function (group, index) {
      var card = CQ.el("article", { class: "capability-card", "data-reveal": "", dataset: { revealGroup: "capability", revealIndex: String(index) } });
      card.appendChild(CQ.el("h3", { text: group.title }));
      card.appendChild(CQ.el("p", { class: "capability-card__lede", text: group.description }));
      var list = CQ.el("ul", { class: "capability-list" }); group.items.forEach(function (item) { list.appendChild(CQ.el("li", { text: item })); });
      card.appendChild(list); return card;
    }));
    if (window.CQObserveReveal) window.CQObserveReveal(CQ.qsa("[data-reveal]", host));
  }
  window.CQSkills = { init: function (data) {
    var technologies = data.technologies || [], groups = data.groups || [];
    var marqueeHost = CQ.qs("[data-skill-marquee]"); if (marqueeHost && technologies.length) renderMarquee(marqueeHost, technologies);
    var groupHost = CQ.qs("[data-skills]"); if (groupHost && groups.length) renderGroups(groupHost, groups);
  }};
})();
