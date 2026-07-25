/* Accessible modal controller + the screenshot gallery built on top of it.
   Used by projects.js (details modal) and by any "View Preview" action. */

(function () {
  "use strict";

  var CQ = window.CQ;
  var FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  /* ---------- Generic modal ---------- */

  function createModal(root) {
    if (!root) return null;

    var dialog = CQ.qs(".modal__dialog", root);
    var lastFocused = null;
    var isOpen = false;

    function focusable() {
      return CQ.qsa(FOCUSABLE, dialog).filter(function (node) {
        return node.offsetParent !== null || node === document.activeElement;
      });
    }

    function onKeydown(event) {
      if (!isOpen) return;

      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab") return;

      var nodes = focusable();
      if (!nodes.length) return;

      var first = nodes[0];
      var last = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function open() {
      if (isOpen) return;
      lastFocused = document.activeElement;
      isOpen = true;
      root.classList.add("is-open");
      root.removeAttribute("aria-hidden");
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", onKeydown);

      var closeButton = CQ.qs(".modal__close", dialog);
      (closeButton || dialog).focus();
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;
      root.classList.remove("is-open");
      root.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeydown);

      if (lastFocused && document.contains(lastFocused)) lastFocused.focus();
      if (typeof root.__onClose === "function") root.__onClose();
    }

    /* Click outside the dialog closes it. */
    root.addEventListener("mousedown", function (event) {
      if (event.target === root) close();
    });

    root.addEventListener("click", function (event) {
      if (event.target.closest("[data-modal-close]")) close();
    });

    root.setAttribute("aria-hidden", "true");

    return {
      root: root,
      dialog: dialog,
      open: open,
      close: close,
      isOpen: function () {
        return isOpen;
      }
    };
  }

  /* ---------- Screenshot gallery ---------- */

  var gallery = null;

  function buildGallery() {
    var root = CQ.qs("[data-gallery-modal]");
    if (!root) return null;

    var modal = createModal(root);
    var titleNode = CQ.qs("[data-gallery-title]", root);
    var kickerNode = CQ.qs("[data-gallery-kicker]", root);
    var stage = CQ.qs("[data-gallery-stage]", root);
    var image = CQ.qs("[data-gallery-image]", root);
    var caption = CQ.qs("[data-gallery-caption]", root);
    var counter = CQ.qs("[data-gallery-counter]", root);
    var thumbs = CQ.qs("[data-gallery-thumbs]", root);
    var prev = CQ.qs("[data-gallery-prev]", root);
    var next = CQ.qs("[data-gallery-next]", root);

    var shots = [];
    var index = 0;

    prev.replaceChildren(CQ.icon("chevronLeft"));
    next.replaceChildren(CQ.icon("chevronRight"));
    CQ.qsa(".modal__close", root).forEach(function (button) {
      button.replaceChildren(CQ.icon("close"));
    });

    function render() {
      var shot = shots[index];
      if (!shot) return;

      image.classList.add("is-swapping");
      var loader = new Image();
      loader.onload = loader.onerror = function () {
        image.src = CQ.url(shot.src);
        image.alt = shot.caption || "Project screenshot";
        if (shot.width) image.width = shot.width;
        if (shot.height) image.height = shot.height;
        image.classList.remove("is-swapping");
      };
      loader.src = CQ.url(shot.src);

      caption.textContent = shot.caption || "";
      counter.textContent = index + 1 + " / " + shots.length;

      CQ.qsa("[data-thumb-index]", thumbs).forEach(function (button) {
        var active = Number(button.dataset.thumbIndex) === index;
        button.setAttribute("aria-current", String(active));
        if (active) {
          button.scrollIntoView({ block: "nearest", inline: "nearest" });
        }
      });

      var single = shots.length < 2;
      prev.hidden = single;
      next.hidden = single;
      thumbs.hidden = single;
    }

    function go(step) {
      if (!shots.length) return;
      index = (index + step + shots.length) % shots.length;
      render();
    }

    prev.addEventListener("click", function () {
      go(-1);
    });
    next.addEventListener("click", function () {
      go(1);
    });

    root.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      }
    });

    /* Mobile swipe */
    var startX = null;
    stage.addEventListener(
      "touchstart",
      function (event) {
        startX = event.changedTouches[0].clientX;
      },
      { passive: true }
    );

    stage.addEventListener(
      "touchend",
      function (event) {
        if (startX === null) return;
        var delta = event.changedTouches[0].clientX - startX;
        if (Math.abs(delta) > 45) go(delta > 0 ? -1 : 1);
        startX = null;
      },
      { passive: true }
    );

    /* Missing-image fallback: never leave a broken image icon on screen. */
    image.addEventListener("error", function () {
      image.alt = "This screenshot could not be loaded.";
      caption.textContent = "Screenshot unavailable";
    });

    return {
      open: function (project, startIndex) {
        shots = (project.screenshots || []).filter(function (shot) {
          return shot && shot.src;
        });
        if (!shots.length) return;

        index = Math.min(Math.max(startIndex || 0, 0), shots.length - 1);
        titleNode.textContent = project.title;
        kickerNode.textContent = shots.length + " screenshot" + (shots.length === 1 ? "" : "s");

        thumbs.replaceChildren.apply(
          thumbs,
          shots.map(function (shot, position) {
            var button = CQ.el("button", {
              type: "button",
              class: "gallery__thumb",
              dataset: { thumbIndex: String(position) },
              "aria-label": "Show screenshot " + (position + 1) + (shot.caption ? ": " + shot.caption : "")
            });
            button.appendChild(
              CQ.el("img", {
                src: CQ.url(shot.src),
                alt: "",
                loading: "lazy",
                decoding: "async",
                width: shot.width || 320,
                height: shot.height || 200
              })
            );
            button.addEventListener("click", function () {
              index = position;
              render();
            });
            return button;
          })
        );

        render();
        modal.open();
      },
      close: modal.close
    };
  }

  window.CQGalleryInit = function () {
    gallery = buildGallery();
  };

  window.CQGallery = {
    open: function (project, startIndex) {
      if (!gallery) gallery = buildGallery();
      if (gallery) gallery.open(project, startIndex);
    }
  };

  window.CQCreateModal = createModal;
})();
