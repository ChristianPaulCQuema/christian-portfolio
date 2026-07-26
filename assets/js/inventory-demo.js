/* Mobile IT Inventory Scanner — working browser demo.
   Records live in LocalStorage on this device only; nothing is sent anywhere. */

(function () {
  "use strict";

  var CQ = window.CQ;
  var STORAGE_KEY = "cq-inventory-demo";

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function save(assets) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
      return true;
    } catch (error) {
      return false;
    }
  }

  function init() {
    var tabs = CQ.qsa('[role="tab"]');
    var panels = CQ.qsa('[role="tabpanel"]');
    var message = CQ.qs("#demoMessage");
    var form = CQ.qs("#assetForm");
    var list = CQ.qs("#assetList");
    var search = CQ.qs("#assetSearch");
    if (!tabs.length || !form || !list) return;

    var assets = load();

    function render(query) {
      var needle = (query || "").trim().toLowerCase();
      var visible = assets.filter(function (asset) {
        if (!needle) return true;
        return [asset.code, asset.name, asset.location].join(" ").toLowerCase().indexOf(needle) !== -1;
      });

      if (!visible.length) {
        list.replaceChildren(
          CQ.el("li", { text: assets.length ? "No matching records." : "No equipment registered yet." })
        );
        return;
      }

      /* Built with textContent so a stored asset name can never inject markup. */
      list.replaceChildren.apply(
        list,
        visible.map(function (asset) {
          return CQ.el("li", {}, [
            CQ.el("strong", { text: asset.name }),
            CQ.el("span", { text: asset.code + " · " + asset.location })
          ]);
        })
      );
    }

    function selectTab(tab) {
      tabs.forEach(function (item) {
        item.setAttribute("aria-selected", String(item === tab));
        item.tabIndex = item === tab ? 0 : -1;
      });
      panels.forEach(function (panel) {
        panel.hidden = panel.id !== tab.getAttribute("aria-controls");
      });
      tab.focus();
      if (tab.id === "listTab") render(search ? search.value : "");
    }

    tabs.forEach(function (tab, index) {
      tab.tabIndex = tab.getAttribute("aria-selected") === "true" ? 0 : -1;

      tab.addEventListener("click", function () {
        selectTab(tab);
      });

      tab.addEventListener("keydown", function (event) {
        var step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
        if (!step) return;
        event.preventDefault();
        selectTab(tabs[(index + step + tabs.length) % tabs.length]);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var entry = {
        code: CQ.qs("#assetCode").value.trim(),
        name: CQ.qs("#assetName").value.trim(),
        location: CQ.qs("#assetLocation").value.trim()
      };

      if (!entry.code || !entry.name || !entry.location) {
        message.textContent = "Please complete every field.";
        return;
      }

      var duplicate = assets.some(function (asset) {
        return asset.code.toLowerCase() === entry.code.toLowerCase();
      });

      if (duplicate) {
        message.textContent = "That asset code already exists.";
        return;
      }

      assets.push(entry);
      message.textContent = save(assets)
        ? "Equipment saved in this browser."
        : "Saved for this session only — browser storage is unavailable.";
      form.reset();
      selectTab(CQ.qs("#listTab"));
    });

    CQ.qs("#scanButton").addEventListener("click", function () {
      var value = CQ.qs("#scanCode").value.trim();
      if (!value) {
        message.textContent = "Enter an asset code to look up.";
        return;
      }
      var found = assets.filter(function (asset) {
        return asset.code.toLowerCase() === value.toLowerCase();
      })[0];
      message.textContent = found
        ? found.name + " — " + found.location
        : "No record found. Use Register to add this equipment.";
    });

    if (search) {
      search.addEventListener("input", function () {
        render(search.value);
      });
    }

    render("");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
