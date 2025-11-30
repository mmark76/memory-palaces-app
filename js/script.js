const STORAGE_KEY = "memoryPalaces_v1";

let palaces = [];
let currentPalace = null;

// Flashcards state
let flashcardOrder = [];
let flashcardIndex = 0;
let flashcardMode = "locusToAssoc";

// Εναλλαγή εμφάνισης / απόκρυψης οδηγών
function toggleHelp() {
  const panel = document.getElementById("helpPanel");
  const overlay = document.getElementById("instructionsOverlay");
  if (!panel || !overlay) return;

  const isHidden = panel.classList.contains("hidden");
  if (isHidden) {
    panel.classList.remove("hidden");
    overlay.style.display = "block";
  } else {
    panel.classList.add("hidden");
    overlay.style.display = "none";
  }
}

// Κλείσιμο οδηγών όταν πατάμε στο σκοτεινό φόντο
document.addEventListener("click", function (event) {
  if (event.target.id === "instructionsOverlay") {
    toggleHelp();
  }
});

// Δημιουργία νέου παλατιού
function createPalace() {
  const nameInput = document.getElementById("palaceName");
  if (!nameInput) return;

  const name = nameInput.value.trim();
  if (!name) return;

  const newPalace = { name: name, loci: [] };
  palaces.push(newPalace);

  nameInput.value = "";
  renderPalaces();

  // Αυτόματη επιλογή του νέου παλατιού
  selectPalace(palaces.length - 1);
}

// Εμφάνιση λίστας παλατιών
function renderPalaces() {
  const list = document.getElementById("palaceList");
  if (!list) return;

  list.innerHTML = "";

  palaces.forEach((p, index) => {
    const btn = document.createElement("button");
    btn.className = "palace-button";
    btn.type = "button";
    btn.textContent = p.name;
    btn.onclick = () => selectPalace(index);
    list.appendChild(btn);
  });
}

// Επιλογή παλατιού
function selectPalace(index) {
  const palace = palaces[index];
  if (!palace) return;

  currentPalace = palace;

  const titleEl = document.getElementById("palaceTitle");
  const selectedBox = document.getElementById("selectedPalace");
  const flashcardsSection = document.getElementById("flashcardsSection");
  const flashcardBox = document.getElementById("flashcardBox");
  const flashcardAnswer = document.getElementById("flashcardAnswer");

  if (titleEl) titleEl.textContent = currentPalace.name;
  if (selectedBox) selectedBox.classList.remove("hidden");

  // Reset flashcards UI when αλλάζουμε παλάτι
  if (flashcardsSection) {
    flashcardsSection.classList.add("hidden");
  }
  if (flashcardBox) {
    flashcardBox.classList.add("hidden");
  }
  if (flashcardAnswer) {
    flashcardAnswer.classList.add("hidden");
    flashcardAnswer.textContent = "";
  }

  renderLoci();
}

// Προσθήκη locus
function addLocus() {
  if (!currentPalace) return;

  const locusInput = document.getElementById("locusInput");
  const associationInput = document.getElementById("associationInput");
  if (!locusInput || !associationInput) return;

  const locusText = locusInput.value.trim();
  const associationText = associationInput.value.trim();

  // Θέλουμε τουλάχιστον περιγραφή locus
  if (!locusText) return;

  currentPalace.loci.push({
    locus: locusText,
    association: associationText
  });

  locusInput.value = "";
  associationInput.value = "";
  renderLoci();
}

// Εμφάνιση loci
function renderLoci() {
  const list = document.getElementById("locusList");
  if (!list || !currentPalace) return;

  list.innerHTML = "";

  const loci = currentPalace.loci || [];

  loci.forEach((item) => {
    const li = document.createElement("li");

    let locusText = "";
    let associationText = "";

    // Υποστήριξη και για παλιό format (απλό string)
    if (typeof item === "string") {
      locusText = item;
    } else {
      locusText = item.locus || "";
      associationText = item.association || "";
    }

    const locusSpan = document.createElement("span");
    locusSpan.className = "locus-text";
    locusSpan.textContent = locusText;

    const assocSpan = document.createElement("span");
    assocSpan.className = "locus-assoc";
    assocSpan.textContent = associationText;

    li.appendChild(locusSpan);
    li.appendChild(assocSpan);

    list.appendChild(li);
  });

  // Ενεργοποίηση / απόκρυψη των flashcards ανάλογα με το αν υπάρχουν loci
  const flashcardsSection = document.getElementById("flashcardsSection");
  if (flashcardsSection) {
    if (loci.length) {
      flashcardsSection.classList.remove("hidden");
    } else {
      flashcardsSection.classList.add("hidden");
    }
  }
}

// ===== Flashcards practice =====

function startFlashcards() {
  if (!currentPalace || !currentPalace.loci || !currentPalace.loci.length) return;

  const modeSelect = document.getElementById("flashcardMode");
  const flashcardBox = document.getElementById("flashcardBox");
  const answerEl = document.getElementById("flashcardAnswer");

  if (!modeSelect || !flashcardBox || !answerEl) return;

  flashcardMode = modeSelect.value || "locusToAssoc";

  flashcardOrder = currentPalace.loci.map((_, idx) => idx);
  for (let i = flashcardOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = flashcardOrder[i];
    flashcardOrder[i] = flashcardOrder[j];
    flashcardOrder[j] = tmp;
  }

  flashcardIndex = 0;

  flashcardBox.classList.remove("hidden");
  answerEl.classList.add("hidden");
  answerEl.textContent = "";

  updateFlashcard();
}

function updateFlashcard() {
  if (!currentPalace || !currentPalace.loci || !currentPalace.loci.length) return;
  if (!flashcardOrder.length) return;

  const promptEl = document.getElementById("flashcardPrompt");
  const answerEl = document.getElementById("flashcardAnswer");
  if (!promptEl || !answerEl) return;

  if (flashcardIndex < 0) flashcardIndex = 0;
  if (flashcardIndex >= flashcardOrder.length) {
    flashcardIndex = flashcardOrder.length - 1;
  }

  const idx = flashcardOrder[flashcardIndex];
  const item = currentPalace.loci[idx];

  let locusText = "";
  let assocText = "";

  if (typeof item === "string") {
    locusText = item;
  } else if (item) {
    locusText = item.locus || "";
    assocText = item.association || "";
  }

  let promptText = "";
  let answerText = "";

  if (flashcardMode === "assocToLocus") {
    promptText = assocText || "(no association saved)";
    answerText = locusText || "(empty locus)";
  } else {
    // locusToAssoc
    promptText = locusText || "(empty locus)";
    answerText = assocText || "(no association saved)";
  }

  promptEl.textContent = promptText;
  answerEl.textContent = answerText;
  answerEl.classList.add("hidden");
}

function revealFlashcard() {
  const answerEl = document.getElementById("flashcardAnswer");
  if (!answerEl) return;
  answerEl.classList.remove("hidden");
}

function nextFlashcard() {
  if (!flashcardOrder.length) return;
  flashcardIndex = (flashcardIndex + 1) % flashcardOrder.length;
  updateFlashcard();
}

function prevFlashcard() {
  if (!flashcardOrder.length) return;
  flashcardIndex = (flashcardIndex - 1 + flashcardOrder.length) % flashcardOrder.length;
  updateFlashcard();
}

// ===== Saving and loading palaces =====

function savePalaces() {
  try {
    const data = {
      palaces: palaces,
      selectedIndex: palaces.indexOf(currentPalace)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    alert("Your memory palaces have been saved in this browser.");
  } catch (err) {
    console.error("Could not save palaces:", err);
  }
}

function loadPalacesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      renderPalaces();
      return;
    }

    const data = JSON.parse(raw);
    if (!data || !Array.isArray(data.palaces)) {
      renderPalaces();
      return;
    }

    palaces = data.palaces;
    renderPalaces();

    const idx = data.selectedIndex;
    if (typeof idx === "number" && idx >= 0 && idx < palaces.length) {
      selectPalace(idx);
    }
  } catch (err) {
    console.error("Could not load palaces:", err);
    renderPalaces();
  }
}

// Upload custom memory palace image for the header
document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("palaceImageUpload");
  const headerImg = document.querySelector(".header-image");

  if (fileInput && headerImg) {
    fileInput.addEventListener("change", function (event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        headerImg.src = e.target.result; // αντικαθιστά την εικόνα στο header
      };
      reader.readAsDataURL(file);
    });
  }

  // Φόρτωση αποθηκευμένων παλατιών μετά το φόρτωμα του DOM
  loadPalacesFromStorage();
});

// =========================
// Example memory palaces (όπως στα αρχικά)
// =========================

const examplePalaces = {
  /* ... ΟΛΟ το block παραμένει ίδιο όπως στο αρχικό αρχείο σου ... */
  shopping: {
    name: "Shopping List",
    loci: [
      {
        place: "Wooden entrance door",
        image: "A big loaf of bread leaning against the door, blocking it slightly.",
        note: "Bread"
      },
      {
        place: "Hallway",
        image: "A long trail of spilled milk running through the hallway.",
        note: "Milk"
      },
      {
        place: "Living room - sofa",
        image: "An open carton of eggs placed casually on the sofa.",
        note: "Eggs"
      },
      {
        place: "Dining room - table",
        image: "A large piece of cheese in the middle of the table like a centerpiece.",
        note: "Cheese"
      },
      {
        place: "Kitchen - sink",
        image: "A pile of red tomatoes filling the sink bowl.",
        note: "Tomatoes"
      },
      {
        place: "Kitchen - oven",
        image: "A baking tray inside the oven full of uncooked pasta.",
        note: "Pasta"
      },
      {
        place: "Balcony",
        image: "A bottle of olive oil standing next to a plant pot.",
        note: "Olive oil"
      },
      {
        place: "Desk / Office",
        image: "A mug of coffee resting on top of some papers.",
        note: "Coffee"
      }
    ]
  },

  recipe: {
    name: "Pasta With Tomato Sauce",
    loci: [
      {
        place: "Wooden entrance door",
        image: "A steaming pot of boiling pasta placed right at the door entrance.",
        note: "Boil pasta in salted water"
      },
      {
        place: "Hallway",
        image: "A small spill of tomato sauce forming a red path along the hallway.",
        note: "Cook tomato sauce with olive oil and herbs"
      },
      {
        place: "Living room - sofa",
        image: "A large spoon mixing pasta and sauce inside a bowl on the sofa.",
        note: "Mix pasta with sauce"
      },
      {
        place: "Dining room - table",
        image: "A plate of pasta on the table with grated cheese falling from above.",
        note: "Serve and add grated cheese"
      }
    ]
  },

  /* ... και τα υπόλοιπα examples όπως στο αρχικό ... */
  rivers: { /* ... */ },
  populousCountries: { /* ... */ },
  largestCountries: { /* ... */ },
  studies: { /* ... */ }
};

// =========================
// Setup for examples UI
// =========================

function initExamplesUI() {
  const infoBtn = document.getElementById("examplesInfoBtn");
  const infoBox = document.getElementById("examplesInfo");
  const buttonsContainer = document.querySelector(".examples-buttons");
  const previewPre = document.getElementById("examplesJsonPreview");

  if (infoBtn && infoBox) {
    infoBtn.addEventListener("click", () => {
      infoBox.classList.toggle("hidden");
    });
  }

  if (buttonsContainer && previewPre) {
    buttonsContainer.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-example]");
      if (!btn) return;

      const key = btn.dataset.example;
      const palace = examplePalaces[key];
      if (!palace) return;

      previewPre.textContent = JSON.stringify(palace, null, 2);
    });
  }
}

document.addEventListener("DOMContentLoaded", initExamplesUI);
