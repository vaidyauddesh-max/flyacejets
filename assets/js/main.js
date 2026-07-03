(function () {
  "use strict";

  var whatsappNumber = "919690765666";
  var maxPassengersPerJet = 18;

  document.addEventListener("DOMContentLoaded", function () {
    document.body.classList.add("is-loaded");
    setCurrentYear();
    setupNavigation();
    setupHeroVideo();
    setupHeroParallax();
    setupReveal();
    setupImageFallbacks();
    setupFaq();
    setupMagneticButtons();
    setupBookingForm();
    setupRoutePrefill();
  });

  function setCurrentYear() {
    var yearNodes = document.querySelectorAll("[data-current-year]");
    yearNodes.forEach(function (node) {
      node.textContent = new Date().getFullYear();
    });
  }

  function setupNavigation() {
    var header = document.querySelector(".site-header");
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");

    function updateHeader() {
      if (!header) return;
      header.classList.toggle("is-scrolled", window.scrollY > 20);
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      links.classList.toggle("is-open", !open);
      document.body.classList.toggle("nav-open", !open);
    });

    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        links.classList.remove("is-open");
        document.body.classList.remove("nav-open");
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        toggle.setAttribute("aria-expanded", "false");
        links.classList.remove("is-open");
        document.body.classList.remove("nav-open");
      }
    });
  }

  function setupHeroVideo() {
    var video = document.querySelector("[data-hero-video]");
    if (!video || !video.dataset.src) return;

    fetch(video.dataset.src, { method: "HEAD" })
      .then(function (response) {
        if (!response.ok) throw new Error("Video not available");
        video.src = video.dataset.src;
        video.load();
        return video.play();
      })
      .then(function () {
        video.classList.add("is-active");
      })
      .catch(function () {
        video.removeAttribute("src");
        video.classList.remove("is-active");
      });
  }

  function setupHeroParallax() {
    var hero = document.querySelector(".hero");
    var stage = document.querySelector(".hero-plane-stage");
    var canHover = window.matchMedia("(hover: hover)").matches;
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hero || !stage || !canHover || reducedMotion) return;

    hero.addEventListener("mousemove", function (event) {
      var rect = hero.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      stage.style.setProperty("--hero-tilt-x", (x * 7).toFixed(2) + "deg");
      stage.style.setProperty("--hero-tilt-y", (y * -5).toFixed(2) + "deg");
    });

    hero.addEventListener("mouseleave", function () {
      stage.style.setProperty("--hero-tilt-x", "0deg");
      stage.style.setProperty("--hero-tilt-y", "0deg");
    });
  }

  function setupReveal() {
    var revealNodes = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      revealNodes.forEach(function (node) {
        node.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
    );

    revealNodes.forEach(function (node) {
      observer.observe(node);
    });
  }

  function setupImageFallbacks() {
    document.querySelectorAll(".media-card img, .feature-image img, .hero-media img, .page-hero-media img").forEach(function (img) {
      var holder = img.closest(".media-card, .feature-image, .hero-media, .page-hero-media");
      img.addEventListener("error", function () {
        if (holder) holder.classList.add("is-missing");
        img.setAttribute("aria-hidden", "true");
      });
    });
  }

  function setupFaq() {
    document.querySelectorAll(".faq-question").forEach(function (button) {
      var answerId = button.getAttribute("aria-controls");
      var answer = answerId ? document.getElementById(answerId) : null;
      if (!answer) return;

      button.addEventListener("click", function () {
        var isOpen = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!isOpen));
        answer.style.maxHeight = !isOpen ? answer.scrollHeight + "px" : "0px";
      });
    });
  }

  function setupMagneticButtons() {
    var buttons = document.querySelectorAll(".btn, .nav-cta, .form-button");
    var canHover = window.matchMedia("(hover: hover)").matches;
    if (!canHover) return;

    buttons.forEach(function (button) {
      button.addEventListener("mousemove", function (event) {
        var rect = button.getBoundingClientRect();
        var x = (event.clientX - rect.left - rect.width / 2) * 0.12;
        var y = (event.clientY - rect.top - rect.height / 2) * 0.18;
        button.style.setProperty("--magnet-x", x.toFixed(2) + "px");
        button.style.setProperty("--magnet-y", y.toFixed(2) + "px");
      });

      button.addEventListener("mouseleave", function () {
        button.style.setProperty("--magnet-x", "0px");
        button.style.setProperty("--magnet-y", "0px");
      });
    });
  }

  function setupBookingForm() {
    var form = document.querySelector("[data-booking-form]");
    if (!form) return;

    var bookingType = form.querySelector("#bookingType");
    var passengerInput = form.querySelector("#passengers");
    var jetOutput = form.querySelector("[data-jet-output]");
    var formPanel = form.closest(".form-panel");
    var successPanel = formPanel ? formPanel.querySelector("[data-success-panel]") : document.querySelector("[data-success-panel]");
    var whatsappLink = formPanel ? formPanel.querySelector("[data-whatsapp-link]") : document.querySelector("[data-whatsapp-link]");

    function visibleFields() {
      return Array.prototype.slice.call(form.querySelectorAll("input, select, textarea")).filter(function (field) {
        return !field.closest("[hidden]") && field.type !== "submit" && field.type !== "button";
      });
    }

    function updateRequiredFields() {
      form.querySelectorAll("[data-required]").forEach(function (field) {
        field.required = !field.closest("[hidden]");
      });
    }

    function updateBookingType() {
      var type = bookingType ? bookingType.value : "Individual";
      form.querySelectorAll("[data-booking-section]").forEach(function (section) {
        var shouldShow = section.dataset.bookingSection === type;
        section.hidden = !shouldShow;
      });
      updateRequiredFields();
    }

    function updateJetCount() {
      var passengers = passengerInput ? parseInt(passengerInput.value, 10) : 0;
      var jets = passengers > 0 ? Math.ceil(passengers / maxPassengersPerJet) : 0;
      if (jetOutput) {
        jetOutput.textContent = jets > 0 ? String(jets) : "-";
      }
    }

    function markError(field, message) {
      var group = field.closest(".form-group");
      if (!group) return;
      var error = group.querySelector(".form-error");
      group.classList.add("has-error");
      if (error) error.textContent = message || "Please complete this field.";
    }

    function clearErrors() {
      form.querySelectorAll(".has-error").forEach(function (group) {
        group.classList.remove("has-error");
      });
    }

    function validateForm() {
      var firstInvalid = null;
      clearErrors();

      visibleFields().forEach(function (field) {
        if (field.required && !field.value.trim()) {
          markError(field, "Please complete this required field.");
          if (!firstInvalid) firstInvalid = field;
        }

        if (field.type === "email" && field.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
          markError(field, "Please enter a valid email address.");
          if (!firstInvalid) firstInvalid = field;
        }

        if (field.id === "passengers") {
          var passengers = parseInt(field.value, 10);
          if (!passengers || passengers < 1) {
            markError(field, "Enter at least 1 passenger.");
            if (!firstInvalid) firstInvalid = field;
          }
        }
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return false;
      }
      return true;
    }

    function getLabel(field) {
      var label = form.querySelector("label[for='" + field.id + "']");
      return label ? label.textContent.replace(/\s+/g, " ").trim() : field.name;
    }

    function buildInquiryText() {
      var inquiryTitle = form.dataset.inquiryTitle || "Fly ACEJETS Charter Inquiry";
      var lines = [inquiryTitle, ""];
      visibleFields().forEach(function (field) {
        if (!field.name || !field.value.trim()) return;
        lines.push(getLabel(field) + ": " + field.value.trim());
      });

      if (passengerInput) {
        var passengers = parseInt(passengerInput.value, 10);
        var jets = passengers > 0 ? Math.ceil(passengers / maxPassengersPerJet) : "-";
        lines.push("Suggested Private Jets Needed: " + jets);
      }
      return lines.join("\n");
    }

    if (bookingType) bookingType.addEventListener("change", updateBookingType);
    if (passengerInput) passengerInput.addEventListener("input", updateJetCount);

    form.addEventListener("input", function (event) {
      var group = event.target.closest ? event.target.closest(".form-group") : null;
      if (group) group.classList.remove("has-error");
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!validateForm()) return;

      if (successPanel) successPanel.classList.add("is-visible");
      if (whatsappLink) {
        whatsappLink.href = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(buildInquiryText());
      }
    });

    updateBookingType();
    updateJetCount();
  }

  function setupRoutePrefill() {
    var form = document.querySelector("[data-booking-form]");
    if (!form) return;

    var params = new URLSearchParams(window.location.search);
    var route = params.get("route");
    var destination = params.get("destination");
    var service = params.get("service");
    var aircraft = params.get("aircraft");
    if (!route && !destination && !service && !aircraft) return;

    var departureField = form.querySelector("#departureCity");
    var destinationField = form.querySelector("#destinationCity");
    var messageField = form.querySelector("#message");
    var aircraftPreference = form.querySelector("#aircraftPreference");

    if (route && route.indexOf(" to ") > -1) {
      var parts = route.split(" to ");
      if (departureField) departureField.value = parts[0] || "";
      if (destinationField) destinationField.value = parts[1] || "";
    } else if (destination && destinationField) {
      destinationField.value = destination;
    }

    if (aircraft && aircraftPreference) {
      aircraftPreference.value = aircraft;
    }

    if (messageField) {
      if (route) {
        messageField.value = "I would like to plan the route: " + route + ".";
      } else if (destination) {
        messageField.value = "I would like to plan private jet travel to " + destination + ".";
      } else if (service) {
        messageField.value = "I would like to inquire about " + service + ".";
      } else if (aircraft) {
        messageField.value = "I would like to inquire about the " + aircraft + ".";
      }
    }
  }
})();
