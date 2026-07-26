/* Project rendering: cards, featured strip, statistics, and the details page.
   All values come from assets/js/data/projects-data.js and are written with
   textContent, never innerHTML, so nothing in the data file can inject markup. */

(function () {
  "use strict";

  var CQ = window.CQ;
  var DETAILS_PAGE = "pages/project-details.html";
  var projectModal = null;

  /* ---------- Action resolution (the four project cases) ---------- */

  /**
   * Decide which actions a project may show.
   *  1. valid live/demo link  -> open it
   *  2. no link but screenshots -> preview gallery + under-development badge
   *  3. no link, no screenshots -> under-development badge, no preview action
   *  4. valid repository link  -> view source
   */
  function resolveActions(project) {
    var links = project.links || {};
    var shots = (project.screenshots || []).filter(function (shot) {
      return shot && shot.src;
    });

    return {
      live: CQ.isValidLink(links.live) ? links.live : null,
      demo: CQ.isValidLink(links.demo) ? links.demo : null,
      source: CQ.isValidLink(links.source) ? links.source : null,
      screenshots: shots,
      hasPreview: shots.length > 0
    };
  }

  function externalLink(href, label, variant, ariaLabel) {
    var anchor = CQ.el("a", {
      class: "btn " + variant,
      href: href,
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": ariaLabel
    });
    anchor.appendChild(document.createTextNode(label));
    anchor.appendChild(CQ.el("span", { class: "arrow", "aria-hidden": "true" }, [CQ.icon("external", 14)]));
    return anchor;
  }

  function detailsHref(project) {
    return CQ.url(DETAILS_PAGE) + "?project=" + encodeURIComponent(project.id);
  }

  /* ---------- Card ---------- */

  function buildMedia(project, actions) {
    var media = CQ.el("div", { class: "project-card__media" });

    if (project.cover && project.cover.src) {
      media.appendChild(
        CQ.el("img", {
          src: CQ.url(project.cover.src),
          alt: project.cover.alt || project.title + " interface preview",
          width: project.cover.width || 1440,
          height: project.cover.height || 900,
          loading: "lazy",
          decoding: "async"
        })
      );
    } else {
      /* No cover art at all — show a labelled placeholder, never a broken image. */
      var placeholder = CQ.el("div", { class: "project-card__placeholder" });
      placeholder.appendChild(CQ.icon(actions.demo ? "code" : "image"));
      placeholder.appendChild(
        CQ.el("span", { text: actions.demo ? "Interactive demo" : "Preview assets in preparation" })
      );
      media.appendChild(placeholder);
    }

    media.appendChild(
      CQ.el("span", {
        class: "badge badge--" + project.status + " project-card__status",
        text: project.statusLabel
      })
    );

    return media;
  }

  function buildTechChips(tech, limit) {
    var list = CQ.el("ul", { class: "tech-list" });
    var shown = tech.slice(0, limit);

    shown.forEach(function (name) {
      list.appendChild(CQ.el("li", { class: "tech-chip", text: name }));
    });

    if (tech.length > limit) {
      list.appendChild(
        CQ.el("li", { class: "tech-chip tech-chip--more", text: "+" + (tech.length - limit) })
      );
    }

    return list;
  }

  function openProjectModal(project) {
    if (!projectModal) projectModal = buildProjectModal();
    if (!projectModal) return false;
    projectModal.open(project);
    return true;
  }

  function buildCard(project) {
    var actions = resolveActions(project);

    var card = CQ.el("article", {
      class: "project-card",
      dataset: {
        projectId: project.id,
        category: project.category,
        status: project.status,
        tech: (project.tech || []).join("|").toLowerCase(),
        search: [project.title, project.summary, project.categoryLabel, (project.tech || []).join(" ")]
          .join(" ")
          .toLowerCase()
      }
    });

    card.appendChild(buildMedia(project, actions));

    var body = CQ.el("div", { class: "project-card__body" });
    body.appendChild(CQ.el("p", { class: "project-card__category", text: project.categoryLabel }));
    body.appendChild(
      CQ.el("h3", { class: "project-card__title" }, [
        CQ.el("a", { href: detailsHref(project), text: project.title })
      ])
    );
    body.appendChild(CQ.el("p", { class: "project-card__summary", text: project.summary }));
    body.appendChild(buildTechChips(project.tech || [], 4));

    var row = CQ.el("div", { class: "project-card__actions" });

    if (actions.live) {
      row.appendChild(
        externalLink(
          actions.live,
          "Live Demo",
          "btn--primary btn--sm",
          "Open the " + project.title + " live demo in a new tab"
        )
      );
    } else if (actions.demo) {
      row.appendChild(
        CQ.el("a", {
          class: "btn btn--primary btn--sm",
          href: CQ.url(actions.demo),
          text: "Open Demo",
          "aria-label": "Open the " + project.title + " demo"
        })
      );
    }

    if (actions.hasPreview) {
      var preview = CQ.el("button", {
        type: "button",
        class: "btn btn--secondary btn--sm",
        text: "View Preview",
        "aria-label": "View " + actions.screenshots.length + " screenshots of " + project.title
      });
      preview.addEventListener("click", function () {
        window.CQGallery.open(project, 0);
      });
      row.appendChild(preview);
    }

    if (actions.source) {
      row.appendChild(
        externalLink(
          actions.source,
          "View Source",
          "btn--ghost btn--sm",
          "Open the " + project.title + " source repository in a new tab"
        )
      );
    }

    if (CQ.qs("[data-project-modal]") && window.CQCreateModal) {
      var details = CQ.el("button", {
        type: "button",
        class: "btn btn--ghost btn--sm",
        text: "Details",
        "aria-label": "Open project details for " + project.title
      });
      details.addEventListener("click", function () {
        openProjectModal(project);
      });
      row.appendChild(details);
    } else {
      row.appendChild(
        CQ.el("a", {
          class: "btn btn--ghost btn--sm",
          href: detailsHref(project),
          text: "Details",
          "aria-label": "Read the full case study for " + project.title
        })
      );
    }

    body.appendChild(row);

    /* Case 3: nothing to open and nothing to show. */
    if (!actions.live && !actions.demo && !actions.hasPreview) {
      body.appendChild(CQ.el("p", { class: "project-card__note", text: "Preview assets are being prepared." }));
    }

    card.appendChild(body);
    return card;
  }

  /* ---------- Grid rendering ---------- */

  function renderCards(container, projects) {
    container.replaceChildren.apply(
      container,
      projects.map(function (project, index) {
        var card = buildCard(project);
        card.style.setProperty("--card-delay", Math.min(index, 8) * 55 + "ms");
        return card;
      })
    );
  }

  /* ---------- Home page statistics ---------- */

  /**
   * Every figure is derived from the project data itself, so the strip can never
   * claim more than the portfolio actually contains.
   */
  function computeStats(projects) {
    var openable = projects.filter(function (project) {
      var actions = resolveActions(project);
      return Boolean(actions.live || actions.demo);
    });

    var screenshots = projects.reduce(function (total, project) {
      return total + (project.screenshots || []).length;
    }, 0);

    var technologies = {};
    projects.forEach(function (project) {
      (project.tech || []).forEach(function (name) {
        technologies[name] = true;
      });
    });

    return [
      { value: projects.length, label: projects.length === 1 ? "System documented" : "Systems documented" },
      { value: openable.length, label: "Working demos available" },
      { value: screenshots, label: "Interface screenshots" },
      { value: Object.keys(technologies).length, label: "Technologies applied" }
    ];
  }

  function renderStats(host, projects) {
    host.replaceChildren.apply(
      host,
      computeStats(projects).map(function (stat) {
        return CQ.el("div", { class: "stat" }, [
          CQ.el("p", { class: "stat__value", text: String(stat.value) }),
          CQ.el("p", { class: "stat__label", text: stat.label })
        ]);
      })
    );
  }

  /* ---------- Details page ---------- */

  function detailBlock(title, builder) {
    var block = CQ.el("section", { class: "detail-block" });
    block.appendChild(CQ.el("h3", { text: title }));
    builder(block);
    return block;
  }

  function bulletList(items) {
    var list = CQ.el("ul");
    items.forEach(function (item) {
      list.appendChild(CQ.el("li", { text: item }));
    });
    return list;
  }

  function buildProjectModal() {
    var root = CQ.qs("[data-project-modal]");
    if (!root || !window.CQCreateModal) return null;

    var modal = window.CQCreateModal(root);
    var kicker = CQ.qs("[data-project-modal-kicker]", root);
    var title = CQ.qs("[data-project-modal-title]", root);
    var meta = CQ.qs("[data-project-modal-meta]", root);
    var body = CQ.qs("[data-project-modal-body]", root);
    var actionsHost = CQ.qs("[data-project-modal-actions]", root);

    function actionButtons(project, actions) {
      var buttons = [];
      if (actions.live) {
        buttons.push(
          externalLink(
            actions.live,
            "Open Live Demo",
            "btn--primary btn--sm",
            "Open the " + project.title + " live demo in a new tab"
          )
        );
      }
      if (actions.demo) {
        buttons.push(CQ.el("a", { class: "btn btn--primary btn--sm", href: CQ.url(actions.demo), text: "Open Demo" }));
      }
      if (actions.source) {
        buttons.push(
          externalLink(
            actions.source,
            "View Source",
            "btn--secondary btn--sm",
            "Open the " + project.title + " source repository in a new tab"
          )
        );
      }
      if (actions.hasPreview) {
        var preview = CQ.el("button", {
          type: "button",
          class: "btn btn--secondary btn--sm",
          text: "View Preview"
        });
        preview.addEventListener("click", function () {
          modal.close();
          window.setTimeout(function () {
            window.CQGallery.open(project, 0);
          }, 0);
        });
        buttons.push(preview);
      }
      buttons.push(
        CQ.el("a", {
          class: "btn btn--ghost btn--sm",
          href: detailsHref(project),
          text: "Open Full Page",
          "aria-label": "Open the full case study page for " + project.title
        })
      );
      return buttons;
    }

    function screenshotBlock(project, actions) {
      if (!actions.hasPreview) return null;
      return detailBlock("Screenshots", function (block) {
        var grid = CQ.el("div", { class: "screenshot-grid screenshot-grid--compact" });
        actions.screenshots.slice(0, 6).forEach(function (shot, index) {
          var tile = CQ.el("button", {
            type: "button",
            class: "screenshot-tile",
            "aria-label": "Open screenshot: " + (shot.caption || project.title)
          });
          tile.appendChild(
            CQ.el("img", {
              src: CQ.url(shot.src),
              alt: shot.caption || project.title + " screenshot",
              width: shot.width || 1440,
              height: shot.height || 900,
              loading: "lazy",
              decoding: "async"
            })
          );
          tile.appendChild(CQ.el("figcaption", { text: shot.caption || "Interface preview" }));
          tile.addEventListener("click", function () {
            modal.close();
            window.setTimeout(function () {
              window.CQGallery.open(project, index);
            }, 0);
          });
          grid.appendChild(tile);
        });
        block.appendChild(grid);
      });
    }

    return {
      open: function (project) {
        var actions = resolveActions(project);
        kicker.textContent = project.kicker || project.categoryLabel;
        title.textContent = project.title;
        meta.replaceChildren(
          CQ.el("span", { class: "badge badge--" + project.status, text: project.statusLabel }),
          CQ.el("span", { class: "tech-chip", text: project.categoryLabel })
        );

        var blocks = [
          CQ.el("p", { class: "project-modal__summary", text: project.overview || project.summary }),
          CQ.el("div", { class: "detail-grid detail-grid--2" }, [
            detailBlock("Problem addressed", function (block) {
              block.appendChild(CQ.el("p", { text: project.problem }));
            }),
            detailBlock("Intended users", function (block) {
              block.appendChild(CQ.el("p", { text: project.users }));
            }),
            detailBlock("Project status", function (block) {
              block.appendChild(CQ.el("p", { text: project.statusLabel }));
            }),
            detailBlock("My role", function (block) {
              block.appendChild(CQ.el("p", { text: project.role }));
            })
          ]),
          detailBlock("Main features", function (block) {
            block.appendChild(bulletList(project.features || []));
          }),
          detailBlock("Technologies", function (block) {
            block.appendChild(buildTechChips(project.tech || [], 99));
          })
        ];

        if (project.workflow) {
          blocks.push(
            detailBlock("System workflow", function (block) {
              block.appendChild(CQ.el("p", { text: project.workflow }));
            })
          );
        }

        var screenshots = screenshotBlock(project, actions);
        if (screenshots) blocks.push(screenshots);

        body.replaceChildren.apply(body, blocks);
        actionsHost.replaceChildren.apply(actionsHost, actionButtons(project, actions));
        modal.open();
      }
    };
  }

  function renderDetails(project) {
    var actions = resolveActions(project);

    /* Head */
    document.title = project.title + " | Christian Paul Quema";
    var description = CQ.qs('meta[name="description"]');
    if (description) description.setAttribute("content", project.summary);

    CQ.qs("[data-detail-kicker]").textContent = project.kicker;
    CQ.qs("[data-detail-title]").textContent = project.title;
    CQ.qs("[data-detail-summary]").textContent = project.overview;
    CQ.qs("[data-detail-crumb]").textContent = project.title;

    var meta = CQ.qs("[data-detail-meta]");
    meta.replaceChildren(
      CQ.el("span", { class: "badge badge--" + project.status, text: project.statusLabel }),
      CQ.el("span", { class: "tech-chip", text: project.categoryLabel })
    );

    /* Hero preview */
    var hero = CQ.qs("[data-detail-hero]");
    if (project.cover && project.cover.src) {
      var figure = CQ.el("figure", { class: "gallery__stage" });
      var heroImage = CQ.el("img", {
        src: CQ.url(project.cover.src),
        alt: project.cover.alt || project.title + " interface preview",
        width: project.cover.width,
        height: project.cover.height,
        decoding: "async"
      });
      figure.appendChild(heroImage);

      if (actions.hasPreview) {
        var openGallery = CQ.el("button", {
          type: "button",
          class: "btn btn--secondary btn--sm",
          text: "Open full gallery (" + actions.screenshots.length + ")"
        });
        openGallery.addEventListener("click", function () {
          window.CQGallery.open(project, 0);
        });
        hero.replaceChildren(figure, CQ.el("div", { class: "btn-row" }, [openGallery]));
      } else {
        hero.replaceChildren(figure);
      }
    } else {
      hero.replaceChildren(
        CQ.el("p", { class: "notice" }, [
          CQ.el("strong", { text: "Preview assets are being prepared. " }),
          document.createTextNode(
            actions.demo
              ? "The interactive demo below is fully working in the meantime."
              : "Screenshots for this project have not been published yet."
          )
        ])
      );
    }

    /* Action row */
    var actionRow = CQ.qs("[data-detail-actions]");
    var buttons = [];

    if (actions.live) {
      buttons.push(
        externalLink(
          actions.live,
          "Open Live Demo",
          "btn--primary",
          "Open the " + project.title + " live demo in a new tab"
        )
      );
    }
    if (actions.demo) {
      buttons.push(
        CQ.el("a", { class: "btn btn--primary", href: CQ.url(actions.demo), text: "Open Demo" })
      );
    }
    if (actions.source) {
      buttons.push(
        externalLink(
          actions.source,
          "View Source",
          "btn--secondary",
          "Open the " + project.title + " repository in a new tab"
        )
      );
    }
    if (actions.hasPreview) {
      var galleryButton = CQ.el("button", {
        type: "button",
        class: "btn btn--secondary",
        text: "View Preview"
      });
      galleryButton.addEventListener("click", function () {
        window.CQGallery.open(project, 0);
      });
      buttons.push(galleryButton);
    }
    buttons.push(
      CQ.el("a", { class: "btn btn--ghost", href: CQ.url("pages/projects.html"), text: "All projects" })
    );
    actionRow.replaceChildren.apply(actionRow, buttons);

    /* Main content blocks */
    var main = CQ.qs("[data-detail-main]");
    var blocks = [];

    blocks.push(
      CQ.el("div", { class: "detail-grid detail-grid--2" }, [
        detailBlock("Problem addressed", function (block) {
          block.appendChild(CQ.el("p", { text: project.problem }));
        }),
        detailBlock("Intended users", function (block) {
          block.appendChild(CQ.el("p", { text: project.users }));
        }),
        detailBlock("My role", function (block) {
          block.appendChild(CQ.el("p", { text: project.role }));
        }),
        detailBlock("System workflow", function (block) {
          block.appendChild(CQ.el("p", { text: project.workflow }));
        })
      ])
    );

    blocks.push(
      detailBlock("Main features", function (block) {
        block.appendChild(bulletList(project.features || []));
      })
    );

    /* Screenshot gallery grid */
    if (actions.hasPreview) {
      var section = CQ.el("section", {});
      section.appendChild(CQ.el("h3", { text: "Screenshots", style: "margin-bottom:1rem" }));

      var groups = {};
      var order = [];
      actions.screenshots.forEach(function (shot, position) {
        var name = shot.group || "Screens";
        if (!groups[name]) {
          groups[name] = [];
          order.push(name);
        }
        groups[name].push({ shot: shot, position: position });
      });

      order.forEach(function (name) {
        var group = CQ.el("div", { class: "screenshot-group" });
        if (order.length > 1) group.appendChild(CQ.el("h3", { text: name }));

        var grid = CQ.el("div", { class: "screenshot-grid" });
        groups[name].forEach(function (entry) {
          var tile = CQ.el("button", {
            type: "button",
            class: "screenshot-tile",
            "aria-label": "Open screenshot: " + (entry.shot.caption || "Untitled")
          });
          tile.appendChild(
            CQ.el("img", {
              src: CQ.url(entry.shot.src),
              alt: entry.shot.caption || project.title + " screenshot",
              width: entry.shot.width || 1440,
              height: entry.shot.height || 900,
              loading: "lazy",
              decoding: "async"
            })
          );
          tile.appendChild(CQ.el("figcaption", { text: entry.shot.caption || "" }));
          tile.addEventListener("click", function () {
            window.CQGallery.open(project, entry.position);
          });
          grid.appendChild(tile);
        });

        group.appendChild(grid);
        section.appendChild(group);
      });

      blocks.push(section);
    }

    main.replaceChildren.apply(main, blocks);

    /* Sidebar */
    var side = CQ.qs("[data-detail-side]");
    var sideBlocks = [];

    sideBlocks.push(
      detailBlock("Technology stack", function (block) {
        Object.keys(project.stack || {}).forEach(function (groupName) {
          var group = CQ.el("div", { class: "stack-group" });
          group.appendChild(CQ.el("h4", { text: groupName }));
          group.appendChild(buildTechChips(project.stack[groupName], 99));
          block.appendChild(group);
        });
      })
    );

    if ((project.credentials || []).length) {
      sideBlocks.push(
        detailBlock("Public demo account", function (block) {
          var list = CQ.el("dl");
          project.credentials.forEach(function (entry) {
            list.appendChild(CQ.el("dt", { text: entry.label }));
            list.appendChild(CQ.el("dd", { text: entry.value }));
          });
          block.appendChild(list);
        })
      );
    }

    sideBlocks.push(
      detailBlock("Current limitations", function (block) {
        block.appendChild(CQ.el("p", { text: project.limitations }));
      })
    );

    side.replaceChildren.apply(side, sideBlocks);

    CQ.qs("[data-detail-loading]").hidden = true;
    CQ.qs("[data-detail-content]").hidden = false;
  }

  function showDetailError(message) {
    CQ.qs("[data-detail-loading]").hidden = true;
    var error = CQ.qs("[data-detail-error]");
    if (!error) return;
    CQ.qs("[data-detail-error-message]").textContent = message;
    error.hidden = false;
  }

  /* ---------- Public init ---------- */

  window.CQProjects = {
    renderCards: renderCards,
    resolveActions: resolveActions,

    init: function (data) {
      var projects = data.projects || [];

      /* Home page statistics, derived from the data above */
      var statsHost = CQ.qs("[data-project-stats]");
      if (statsHost) renderStats(statsHost, projects);

      /* Home page featured strip */
      var featuredHost = CQ.qs("[data-featured-projects]");
      if (featuredHost) {
        var featured = projects.filter(function (project) {
          return project.featured;
        });
        renderCards(featuredHost, featured.slice(0, 3));
      }

      /* Projects page grid (filters.js takes over from here) */
      var gridHost = CQ.qs("[data-project-grid]");
      if (gridHost && window.CQFilters) {
        window.CQFilters.init(data, gridHost);
      }

      /* Experience page — a delivery timeline built from the same project data,
         so titles and summaries are never duplicated by hand. */
      var timelineHost = CQ.qs("[data-experience-timeline]");
      if (timelineHost) {
        timelineHost.replaceChildren.apply(
          timelineHost,
          projects.map(function (project, index) {
            var card = CQ.el("div", { class: "timeline__card" });

            card.appendChild(
              CQ.el("div", { class: "timeline__meta" }, [
                CQ.el("span", { class: "timeline__role", text: project.kicker }),
                CQ.el("span", { class: "badge badge--" + project.status, text: project.statusLabel })
              ])
            );
            card.appendChild(
              CQ.el("h3", {}, [CQ.el("a", { href: detailsHref(project), text: project.title })])
            );
            card.appendChild(CQ.el("p", { text: project.role }));

            var tech = buildTechChips(project.tech || [], 6);
            tech.classList.add("timeline__tech");
            card.appendChild(tech);

            var item = CQ.el("li", {
              class: "timeline__item",
              "data-reveal": "",
              dataset: { revealGroup: "timeline", revealIndex: String(index) }
            });
            item.appendChild(card);
            return item;
          })
        );

        if (window.CQObserveReveal) window.CQObserveReveal(CQ.qsa("[data-reveal]", timelineHost));
      }

      /* Details page */
      var detailHost = CQ.qs("[data-detail-content]");
      if (detailHost) {
        var params = new URLSearchParams(window.location.search);
        var id = params.get("project");
        var project = projects.filter(function (item) {
          return item.id === id;
        })[0];

        if (!id) {
          showDetailError("No project was specified in the address.");
        } else if (!project) {
          showDetailError('No project matches "' + id + '".');
        } else {
          renderDetails(project);
        }
      }
    }
  };
})();
