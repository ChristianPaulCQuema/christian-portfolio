/* Contact form: front-end validation plus submission to the existing Formspree
   endpoint. This site has no backend of its own — the status messages never claim
   a message was delivered unless Formspree actually confirms it, and a mailto
   fallback is offered whenever the request cannot be completed. */

(function () {
  "use strict";

  var CQ = window.CQ;

  var RULES = {
    name: function (value) {
      if (!value) return "Please enter your name.";
      if (value.length < 2) return "Your name needs at least 2 characters.";
      return "";
    },
    email: function (value) {
      if (!value) return "Please enter your email address.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return "Please enter a valid email address.";
      return "";
    },
    projectType: function (value) {
      if (!value) return "Please choose a project type.";
      return "";
    },
    message: function (value) {
      if (!value) return "Please describe what you need.";
      if (value.length < 20) return "Please add a little more detail (at least 20 characters).";
      return "";
    }
  };

  window.CQFormInit = function () {
    var form = CQ.qs("[data-contact-form]");
    if (!form) return;

    var status = CQ.qs("[data-form-status]", form);
    var submit = CQ.qs('button[type="submit"]', form);
    var fallbackEmail = form.dataset.fallbackEmail || "";

    function fieldOf(name) {
      return form.elements[name];
    }

    function errorNodeOf(name) {
      return CQ.qs('[data-error-for="' + name + '"]', form);
    }

    function validateField(name) {
      var field = fieldOf(name);
      var rule = RULES[name];
      if (!field || !rule) return true;

      var message = rule(String(field.value || "").trim());
      var errorNode = errorNodeOf(name);

      field.setAttribute("aria-invalid", message ? "true" : "false");
      if (errorNode) errorNode.textContent = message;

      return !message;
    }

    /* The status line ships hidden so it never reserves an empty band; it is
       revealed the moment there is something real to announce. */
    function setStatus(text, state) {
      if (!status) return;
      status.replaceChildren(document.createTextNode(text));
      status.dataset.state = state || "";
      status.hidden = false;
    }

    function appendMailtoFallback(subject, body) {
      if (!status || !fallbackEmail) return;
      var href =
        "mailto:" +
        fallbackEmail +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
      status.appendChild(document.createTextNode(" "));
      status.appendChild(CQ.el("a", { href: href, text: "Send it by email instead." }));
    }

    /* Validate on blur, and live-correct once a field has already errored. */
    Object.keys(RULES).forEach(function (name) {
      var field = fieldOf(name);
      if (!field) return;

      field.addEventListener("blur", function () {
        validateField(name);
      });

      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") validateField(name);
      });

      field.addEventListener("change", function () {
        if (field.getAttribute("aria-invalid") === "true") validateField(name);
      });
    });

    /* During direct file opening a cross-origin fetch is blocked outright, so the async path
       could only ever fail. There the form is left alone and the browser
       performs its normal POST to the action URL. Async submission — which
       keeps the visitor on the page — is used only on http/https. */
    var canSubmitAsync = window.location.protocol === "http:" || window.location.protocol === "https:";

    form.addEventListener("submit", function (event) {
      var names = Object.keys(RULES);

      if (!canSubmitAsync) {
        /* Still validate, but let a valid submission navigate natively. */
        var invalid = names.map(validateField).indexOf(false);
        if (invalid !== -1) {
          event.preventDefault();
          setStatus("Please correct the highlighted fields before sending.", "error");
          var badField = fieldOf(names[invalid]);
          if (badField) badField.focus();
        }
        return;
      }

      event.preventDefault();

      var results = names.map(validateField);
      var firstInvalid = names[results.indexOf(false)];

      if (firstInvalid) {
        setStatus("Please correct the highlighted fields before sending.", "error");
        var field = fieldOf(firstInvalid);
        if (field) field.focus();
        return;
      }

      /* Honeypot — a filled hidden field means a bot. Fail quietly. */
      if (form.elements._gotcha && form.elements._gotcha.value) return;

      var endpoint = form.getAttribute("action");
      var payload = new FormData(form);
      var summary =
        "From: " +
        payload.get("name") +
        " <" +
        payload.get("email") +
        ">\nProject type: " +
        payload.get("project_type") +
        "\n\n" +
        payload.get("message");

      if (!endpoint) {
        setStatus("This form has no delivery endpoint configured.", "error");
        appendMailtoFallback("Portfolio enquiry", summary);
        return;
      }

      if (submit) {
        submit.disabled = true;
        submit.textContent = "Sending…";
      }
      setStatus("Sending your message…", "");

      fetch(endpoint, {
        method: "POST",
        body: payload,
        headers: { Accept: "application/json" }
      })
        .then(function (response) {
          if (!response.ok) throw new Error("HTTP " + response.status);
          form.reset();
          Object.keys(RULES).forEach(function (name) {
            var node = errorNodeOf(name);
            if (node) node.textContent = "";
            var input = fieldOf(name);
            if (input) input.setAttribute("aria-invalid", "false");
          });
          setStatus("Message sent. Formspree confirmed delivery — I'll reply by email.", "success");
        })
        .catch(function () {
          setStatus("The message could not be sent right now.", "error");
          appendMailtoFallback("Portfolio enquiry", summary);
        })
        .then(function () {
          if (submit) {
            submit.disabled = false;
            submit.textContent = "Send Message";
          }
        });
    });
  };
})();
