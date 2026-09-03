/**
 * Clínica Vida Plena — site interactions
 */

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const config = window.SITE_CONFIG || {};

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ── MoneyText ─────────────────────────────────────────────── */
  function initMoneyText() {
    $$("[data-money-cents]").forEach((el) => {
      const cents = parseInt(el.dataset.moneyCents, 10);
      const currency = el.dataset.currency || "BRL";
      el.textContent = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency,
      }).format(cents / 100);
    });
  }

  /* ── Theme toggle ──────────────────────────────────────────── */
  function initThemeToggle() {
    const toggle = $("#theme-toggle");
    if (!toggle) return;

    const root = document.documentElement;

    function applyTheme(theme) {
      if (theme === "dark") {
        root.setAttribute("data-scheme", "dark");
      } else {
        root.removeAttribute("data-scheme");
      }
      localStorage.setItem("theme", theme);
      toggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
      );
      toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    }

    const current = root.getAttribute("data-scheme") === "dark" ? "dark" : "light";
    applyTheme(current);

    toggle.addEventListener("click", () => {
      const next =
        root.getAttribute("data-scheme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  /* ── Mobile menu ───────────────────────────────────────────── */
  function initMobileMenu() {
    const toggle = $(".header__menu-toggle");
    const nav = $(".header__links");
    if (!toggle || !nav) return;

    const focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function openMenu() {
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      const firstLink = nav.querySelector(focusableSelector);
      if (firstLink) firstLink.focus();
    }

    function closeMenu() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.contains("is-open");
      isOpen ? closeMenu() : openMenu();
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        closeMenu();
        toggle.focus();
      }

      if (e.key === "Tab" && nav.classList.contains("is-open")) {
        const focusable = [...nav.querySelectorAll(focusableSelector)];
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ── FAQ ───────────────────────────────────────────────────── */
  function initFaq() {
    $$(".faq-item__trigger").forEach((trigger) => {
      const panelId = trigger.getAttribute("aria-controls");
      const panel = document.getElementById(panelId);
      if (!panel) return;

      trigger.addEventListener("click", () => {
        const isExpanded = trigger.getAttribute("aria-expanded") === "true";

        $$(".faq-item__trigger").forEach((t) => {
          t.setAttribute("aria-expanded", "false");
          const p = document.getElementById(t.getAttribute("aria-controls"));
          if (p) p.classList.remove("is-open");
        });

        if (!isExpanded) {
          trigger.setAttribute("aria-expanded", "true");
          panel.classList.add("is-open");
        }
      });
    });
  }

  /* ── Toast ─────────────────────────────────────────────────── */
  function showToast(message, variant) {
    const container = $(".toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast--${variant || "success"}`;
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.textContent = message;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("is-visible");
    });

    setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => toast.remove(), prefersReducedMotion ? 0 : 200);
    }, 4000);
  }

  /* ── WhatsApp link ─────────────────────────────────────────── */
  function initWhatsAppLinks() {
    const number = (config.WHATSAPP_NUMBER || "").replace(/\D/g, "");
    const message = encodeURIComponent(config.WHATSAPP_MESSAGE || "");
    const href = number
      ? `https://wa.me/${number}?text=${message}`
      : "#contato";

    $$("[data-whatsapp]").forEach((el) => {
      el.setAttribute("href", href);
      if (number) {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
      }
    });
  }

  /* ── Developer logo link ───────────────────────────────────── */
  function initDeveloperLink() {
    const url = config.DEVELOPER_URL;
    if (!url) return;
    $$("[data-developer-link]").forEach((el) => {
      el.setAttribute("href", url);
    });
  }

  /* ── Contact form → Web3Forms ──────────────────────────────── */
  function initContactForm() {
    const form = $("#contact-form");
    if (!form) return;

    const fields = {
      name: {
        el: $("#field-name"),
        error: $("#error-name"),
        validate: (v) => v.trim().length >= 2,
      },
      email: {
        el: $("#field-email"),
        error: $("#error-email"),
        validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      },
      message: {
        el: $("#field-message"),
        error: $("#error-message"),
        validate: (v) => v.trim().length >= 10,
      },
    };

    function setFieldError(key, hasError) {
      const { el, error } = fields[key];
      if (hasError) {
        el.classList.add("input--error");
        if (el.tagName === "TEXTAREA") el.classList.add("textarea--error");
        el.setAttribute("aria-invalid", "true");
        error.hidden = false;
      } else {
        el.classList.remove("input--error", "textarea--error");
        el.removeAttribute("aria-invalid");
        error.hidden = true;
      }
    }

    Object.keys(fields).forEach((key) => {
      const { el } = fields[key];
      el.addEventListener("blur", () => {
        setFieldError(key, !fields[key].validate(el.value));
      });
      el.addEventListener("input", () => {
        if (el.getAttribute("aria-invalid") === "true") {
          if (fields[key].validate(el.value)) setFieldError(key, false);
        }
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      let isValid = true;
      Object.keys(fields).forEach((key) => {
        const valid = fields[key].validate(fields[key].el.value);
        setFieldError(key, !valid);
        if (!valid) isValid = false;
      });

      if (!isValid) return;

      const key = config.WEB3FORMS_KEY;
      if (!key || key === "YOUR_WEB3FORMS_ACCESS_KEY") {
        showToast(
          "Configure a chave Web3Forms em js/config.js para ativar o envio.",
          "error"
        );
        return;
      }

      const submitBtn = $("#submit-contact");
      submitBtn.setAttribute("aria-busy", "true");
      submitBtn.disabled = true;

      const payload = {
        access_key: key,
        subject: "Contato — Clínica Vida Plena",
        from_name: fields.name.el.value.trim(),
        name: fields.name.el.value.trim(),
        email: fields.email.el.value.trim(),
        phone: ($("#field-phone") && $("#field-phone").value.trim()) || "",
        message: fields.message.el.value.trim(),
      };

      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (res.ok && data.success) {
          form.reset();
          showToast("Mensagem enviada! Retornaremos em breve.", "success");
        } else {
          showToast(
            data.message || "Não foi possível enviar. Tente de novo.",
            "error"
          );
        }
      } catch {
        showToast("Erro de conexão. Tente novamente ou use o WhatsApp.", "error");
      } finally {
        submitBtn.removeAttribute("aria-busy");
        submitBtn.disabled = false;
      }
    });
  }

  /* ── Reveal ────────────────────────────────────────────────── */
  function initReveal() {
    if (prefersReducedMotion) {
      $$(".reveal").forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    $$(".reveal").forEach((el) => observer.observe(el));
  }

  /* ── Avatar fallback ───────────────────────────────────────── */
  function initAvatars() {
    $$(".avatar img").forEach((img) => {
      img.addEventListener("error", () => {
        const avatar = img.closest(".avatar");
        const initials = avatar.dataset.initials || "?";
        img.remove();
        const span = document.createElement("span");
        span.className = "avatar__initials";
        span.textContent = initials;
        avatar.appendChild(span);
      });
    });
  }

  function init() {
    initMoneyText();
    initThemeToggle();
    initMobileMenu();
    initFaq();
    initWhatsAppLinks();
    initDeveloperLink();
    initContactForm();
    initReveal();
    initAvatars();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
