/* Scroll reveal, hero entrance and the desktop cursor glow.
   Everything here is opt-out under prefers-reduced-motion and skipped entirely
   when the browser lacks IntersectionObserver, so content is never left hidden. */

(function () {
  "use strict";

  var CQ = window.CQ;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function initReveal() {
    if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

    document.documentElement.classList.add("motion-ready");

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    CQ.qsa("[data-reveal]").forEach(function (node, index) {
      /* Stagger siblings without letting the delay grow unbounded. */
      var group = node.dataset.revealGroup;
      if (group) {
        var position = Number(node.dataset.revealIndex || index);
        node.style.setProperty("--reveal-delay", Math.min(position, 8) * 70 + "ms");
      }
      observer.observe(node);
    });

    /* Newly rendered nodes (filtered project cards) opt in through this hook. */
    window.CQObserveReveal = function (nodes) {
      nodes.forEach(function (node) {
        observer.observe(node);
      });
    };
  }

  function initHeroLines() {
    if (reducedMotion.matches) return;
    CQ.qsa(".hero__line").forEach(function (node, index) {
      node.style.setProperty("--line-delay", index * 90 + "ms");
    });
  }

  function initCursorGlow() {
    if (reducedMotion.matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 64rem)").matches) return;

    var glow = CQ.el("div", { class: "cursor-glow", "aria-hidden": "true" });
    document.body.appendChild(glow);

    var pending = false;
    var x = 0;
    var y = 0;

    document.addEventListener(
      "pointermove",
      function (event) {
        x = event.clientX;
        y = event.clientY;
        if (pending) return;
        pending = true;
        window.requestAnimationFrame(function () {
          glow.style.setProperty("--x", x + "px");
          glow.style.setProperty("--y", y + "px");
          glow.classList.add("is-active");
          pending = false;
        });
      },
      { passive: true }
    );

    document.addEventListener("pointerleave", function () {
      glow.classList.remove("is-active");
    });
  }

  window.CQAnimationsInit = function () {
    initReveal();
    initHeroLines();
    initCursorGlow();
  };
})();
