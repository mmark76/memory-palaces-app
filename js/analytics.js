(function () {
  "use strict";

  const MEASUREMENT_ID = "G-DK5WN8TH3Z";
  const CONSENT_KEY = "memory-palaces.analyticsConsent.v1";
  const SCRIPT_ID = "memory-palaces-google-tag";

  const deniedConsent = {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied"
  };

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  function readConsent() {
    try {
      const value = localStorage.getItem(CONSENT_KEY);
      return value === "granted" || value === "denied" ? value : null;
    } catch (error) {
      return null;
    }
  }

  function applyConsent(consent) {
    window.gtag("consent", "update", {
      ...deniedConsent,
      analytics_storage: consent === "granted" ? "granted" : "denied"
    });
  }

  function storeConsent(consent) {
    try {
      localStorage.setItem(CONSENT_KEY, consent);
    } catch (error) {
      // The current-page choice still applies when storage is unavailable.
    }
    applyConsent(consent);
  }

  function loadGoogleTag() {
    window.gtag("consent", "default", deniedConsent);
    applyConsent(readConsent());

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
      document.head.appendChild(script);
    }

    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
  }

  function buildConsentUi() {
    const banner = document.createElement("aside");
    banner.id = "analyticsConsent";
    banner.className = "analytics-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-labelledby", "analyticsConsentTitle");

    const copy = document.createElement("div");
    const title = document.createElement("h2");
    title.id = "analyticsConsentTitle";
    title.textContent = "Analytics choices";

    const description = document.createElement("p");
    description.textContent =
      "Google Analytics helps measure visits and use of Memory Palaces Builder. Analytics storage stays disabled unless you allow it. Advertising features remain disabled.";

    copy.append(title, description);

    const actions = document.createElement("div");
    actions.className = "analytics-consent-actions";

    const necessary = document.createElement("button");
    necessary.type = "button";
    necessary.textContent = "Necessary only";

    const allow = document.createElement("button");
    allow.type = "button";
    allow.className = "analytics-consent-allow";
    allow.textContent = "Allow analytics";

    const close = document.createElement("button");
    close.type = "button";
    close.className = "analytics-consent-close";
    close.textContent = "×";
    close.setAttribute("aria-label", "Close analytics choices");
    close.title = "Close";

    function refreshCloseVisibility() {
      close.hidden = readConsent() === null;
    }

    necessary.addEventListener("click", function () {
      storeConsent("denied");
      banner.hidden = true;
      refreshCloseVisibility();
    });

    allow.addEventListener("click", function () {
      storeConsent("granted");
      banner.hidden = true;
      refreshCloseVisibility();
    });

    close.addEventListener("click", function () {
      banner.hidden = true;
    });

    actions.append(necessary, allow, close);
    banner.append(copy, actions);
    document.body.appendChild(banner);

    const footer = document.querySelector("footer");
    if (footer) {
      const reopen = document.createElement("button");
      reopen.type = "button";
      reopen.className = "analytics-choice-button";
      reopen.textContent = "Analytics choices";
      reopen.addEventListener("click", function () {
        refreshCloseVisibility();
        banner.hidden = false;
        necessary.focus();
      });
      footer.appendChild(reopen);
    }

    refreshCloseVisibility();
    banner.hidden = readConsent() !== null;
  }

  loadGoogleTag();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildConsentUi, { once: true });
  } else {
    buildConsentUi();
  }
})();
