(function () {
  "use strict";

  const STORAGE_KEY = "memory-palaces.analytics-notice-dismissed";

  function shouldShowNotice() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) !== "true";
    } catch {
      return true;
    }
  }

  function persistDismissal() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // The notice still closes for this visit when storage is unavailable.
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const backdrop = document.getElementById("analyticsNotice");
    const dialog = backdrop && backdrop.querySelector("[role='dialog']");
    const openButton = document.getElementById("analyticsInfoButton");
    const closeButton = document.getElementById("analyticsNoticeClose");
    const doneButton = document.getElementById("analyticsNoticeDone");
    let opener = null;

    if (!backdrop || !dialog || !openButton || !closeButton || !doneButton) return;

    function openNotice(trigger) {
      opener = trigger || document.activeElement;
      backdrop.hidden = false;
      closeButton.focus();
    }

    function closeNotice() {
      persistDismissal();
      backdrop.hidden = true;
      if (opener && opener.isConnected) opener.focus();
    }

    openButton.addEventListener("click", function () { openNotice(openButton); });
    closeButton.addEventListener("click", closeNotice);
    doneButton.addEventListener("click", closeNotice);
    backdrop.addEventListener("mousedown", function (event) {
      if (event.target === backdrop) closeNotice();
    });
    document.addEventListener("keydown", function (event) {
      if (!backdrop.hidden && event.key === "Escape") {
        event.preventDefault();
        closeNotice();
      }
    });

    if (shouldShowNotice()) openNotice(null);
  });
})();
