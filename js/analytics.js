(function () {
  "use strict";

  if (
    window.location.protocol !== "https:" ||
    window.location.hostname.toLowerCase() !== "memorypalaces.markellosecosystem.com" ||
    document.getElementById("memory-palaces-cookieless-analytics")
  ) {
    return;
  }

  const script = document.createElement("script");
  script.id = "memory-palaces-cookieless-analytics";
  script.async = true;
  script.src = "https://analytics.markellosecosystem.com/v1/script.js";
  document.head.appendChild(script);
})();
