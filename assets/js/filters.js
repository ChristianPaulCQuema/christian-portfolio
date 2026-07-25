/* Search + category / technology / status filtering for the projects page.
   Filter state is mirrored into the URL query so a filtered view can be shared. */

(function () {
  "use strict";

  var CQ = window.CQ;

  window.CQFilters = {
    init: function (data, grid) {
      var projects = data.projects || [];

      var state = {
        query: "",
        category: "all",
        tech: "all",
        status: "all"
      };

      var searchInput = CQ.qs("[data-filter-search]");
      var clearSearch = CQ.qs("[data-search-clear]");
      var countNode = CQ.qs("[data-result-count]");
      var emptyNode = CQ.qs("[data-empty-state]");
      var resetButtons = CQ.qsa("[data-filter-reset]");

      /* ----- Build the chip rows from the data ----- */

      function buildChips(host, options, key) {
        if (!host) return;
        host.replaceChildren.apply(
          host,
          options.map(function (option) {
            var chip = CQ.el("button", {
              type: "button",
              class: "chip",
              text: option.label,
              "aria-pressed": String(state[key] === option.id),
              dataset: { value: option.id }
            });
            chip.addEventListener("click", function () {
              state[key] = option.id;
              CQ.qsa(".chip", host).forEach(function (other) {
                other.setAttribute("aria-pressed", String(other.dataset.value === option.id));
              });
              apply();
            });
            return CQ.el("li", {}, [chip]);
          })
        );
      }

      var categories = data.categories || [];
      buildChips(CQ.qs("[data-filter-categories]"), categories, "category");

      var statusOptions = [{ id: "all", label: "Any status" }].concat(
        (data.statuses || []).map(function (status) {
          return { id: status.id, label: status.label };
        })
      );
      buildChips(CQ.qs("[data-filter-statuses]"), statusOptions, "status");

      /* Technology list is derived from the projects themselves. */
      var techCounts = {};
      projects.forEach(function (project) {
        (project.tech || []).forEach(function (name) {
          techCounts[name] = (techCounts[name] || 0) + 1;
        });
      });

      var techOptions = [{ id: "all", label: "Any technology" }].concat(
        Object.keys(techCounts)
          .sort(function (a, b) {
            return techCounts[b] - techCounts[a] || a.localeCompare(b);
          })
          .map(function (name) {
            return { id: name.toLowerCase(), label: name };
          })
      );
      buildChips(CQ.qs("[data-filter-tech]"), techOptions, "tech");

      /* ----- Filtering ----- */

      function matches(project) {
        if (state.category !== "all" && project.category !== state.category) return false;
        if (state.status !== "all" && project.status !== state.status) return false;

        if (state.tech !== "all") {
          var hit = (project.tech || []).some(function (name) {
            return name.toLowerCase() === state.tech;
          });
          if (!hit) return false;
        }

        if (state.query) {
          var haystack = [
            project.title,
            project.summary,
            project.overview,
            project.categoryLabel,
            project.statusLabel,
            (project.tech || []).join(" "),
            (project.features || []).join(" ")
          ]
            .join(" ")
            .toLowerCase();
          if (haystack.indexOf(state.query) === -1) return false;
        }

        return true;
      }

      function syncUrl() {
        var params = new URLSearchParams();
        if (state.query) params.set("q", state.query);
        if (state.category !== "all") params.set("category", state.category);
        if (state.tech !== "all") params.set("tech", state.tech);
        if (state.status !== "all") params.set("status", state.status);

        var search = params.toString();
        var next = window.location.pathname + (search ? "?" + search : "");
        window.history.replaceState(null, "", next);
      }

      function apply() {
        var visible = projects.filter(matches);

        window.CQProjects.renderCards(grid, visible);
        if (window.CQObserveReveal) window.CQObserveReveal(CQ.qsa(".project-card", grid));

        if (countNode) {
          countNode.textContent =
            visible.length === projects.length
              ? "Showing all " + projects.length + " projects"
              : "Showing " + visible.length + " of " + projects.length + " projects";
        }

        grid.hidden = visible.length === 0;
        if (emptyNode) emptyNode.hidden = visible.length !== 0;
        if (clearSearch) clearSearch.hidden = !state.query;

        syncUrl();
      }

      /* ----- Search input ----- */

      if (searchInput) {
        var debounce;
        searchInput.addEventListener("input", function () {
          window.clearTimeout(debounce);
          debounce = window.setTimeout(function () {
            state.query = searchInput.value.trim().toLowerCase();
            apply();
          }, 160);
        });

        searchInput.addEventListener("keydown", function (event) {
          if (event.key === "Escape" && searchInput.value) {
            event.preventDefault();
            searchInput.value = "";
            state.query = "";
            apply();
          }
        });
      }

      if (clearSearch) {
        clearSearch.replaceChildren(CQ.icon("close", 16));
        clearSearch.addEventListener("click", function () {
          if (searchInput) searchInput.value = "";
          state.query = "";
          apply();
          if (searchInput) searchInput.focus();
        });
      }

      function reset() {
        state.query = "";
        state.category = "all";
        state.tech = "all";
        state.status = "all";
        if (searchInput) searchInput.value = "";
        CQ.qsa("[data-filter-categories] .chip, [data-filter-tech] .chip, [data-filter-statuses] .chip").forEach(
          function (chip) {
            chip.setAttribute("aria-pressed", String(chip.dataset.value === "all"));
          }
        );
        apply();
      }

      resetButtons.forEach(function (button) {
        button.addEventListener("click", reset);
      });

      /* ----- Restore state from the URL on load ----- */

      var initial = new URLSearchParams(window.location.search);
      state.query = (initial.get("q") || "").toLowerCase();
      state.category = initial.get("category") || "all";
      state.tech = (initial.get("tech") || "all").toLowerCase();
      state.status = initial.get("status") || "all";

      if (searchInput && state.query) searchInput.value = state.query;
      CQ.qsa("[data-filter-categories] .chip").forEach(function (chip) {
        chip.setAttribute("aria-pressed", String(chip.dataset.value === state.category));
      });
      CQ.qsa("[data-filter-tech] .chip").forEach(function (chip) {
        chip.setAttribute("aria-pressed", String(chip.dataset.value === state.tech));
      });
      CQ.qsa("[data-filter-statuses] .chip").forEach(function (chip) {
        chip.setAttribute("aria-pressed", String(chip.dataset.value === state.status));
      });

      apply();
    }
  };
})();
