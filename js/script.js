const STORAGE_KEY = "memoryPalaces_v1";

let palaces = [];
let currentPalace = null;

// Flashcards state
let flashcardOrder = [];
let flashcardIndex = 0;
let flashcardMode = "locusToAssoc";

// Εναλλαγή εμφάνισης / απόκρυψης οδηγιών
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

  // Αποθήκευση σε localStorage
  savePalacesToStorage();
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

  // Reset flashcards UI όταν αλλάζουμε παλάτι
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

  // Αποθήκευση σε localStorage
  savePalacesToStorage();
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

// =========================
// Saving, loading & export
// =========================

// Αποθήκευση στο localStorage
function savePalacesToStorage() {
  try {
    const data = {
      palaces: palaces,
      selectedIndex: palaces.indexOf(currentPalace)
    };
    const json = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, json);
  } catch (err) {
    console.error("Error saving palaces to localStorage:", err);
  }
}

// Φόρτωση από localStorage
function loadPalacesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    // Τίποτα αποθηκευμένο ακόμη
    if (!raw) {
      palaces = [];
      currentPalace = null;
      renderPalaces();
      return;
    }

    const data = JSON.parse(raw);

    // Νέα μορφή: { palaces: [...], selectedIndex }
    if (data && Array.isArray(data.palaces)) {
      palaces = data.palaces;
      renderPalaces();

      const idx = data.selectedIndex;
      if (typeof idx === "number" && idx >= 0 && idx < palaces.length) {
        selectPalace(idx);
      }
    }
    // Παλιά μορφή: απλά array
    else if (Array.isArray(data)) {
      palaces = data;
      renderPalaces();
      if (palaces.length > 0) {
        selectPalace(0);
      }
    }
  } catch (err) {
    console.error("Error loading palaces from localStorage:", err);
    palaces = [];
    currentPalace = null;
    renderPalaces();
  }
}

// Εξαγωγή σε JSON αρχείο (download)
function savePalaces() {
  try {
    const data = {
      palaces: palaces,
      selectedIndex: palaces.indexOf(currentPalace)
    };

    const json = JSON.stringify(data, null, 2);

    // Create a downloadable JSON file
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "memory-palaces.json"; // file name for download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Could not export palaces:", err);
    alert("An error occurred while saving to file.");
  }
}

// =========================
// Example memory palaces
// (always the same house with 10 loci)
// =========================

const examplePalaces = {
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

  rivers: {
    name: "World's 10 Longest Rivers (Beginner-Friendly)",
    loci: [
      {
        place: "Wooden entrance door",
        image: "A blue ribbon shaped like a river taped on the door with a pyramid photo next to it.",
        note: "Nile – Africa"
      },
      {
        place: "Hallway",
        image: "A tall plant like a mini-jungle, with a wide blue paper river placed under it.",
        note: "Amazon – South America"
      },
      {
        place: "Living room - sofa",
        image: "A red Chinese lantern resting on a blue cloth shaped like a river.",
        note: "Yangtze – China"
      },
      {
        place: "Dining room - table",
        image: "A brown ribbon across the table with a tiny cowboy hat on it.",
        note: "Mississippi–Missouri – USA"
      },
      {
        place: "Kitchen - sink",
        image: "Cold running water with a small snowflake magnet near the faucet.",
        note: "Yenisei – Russia"
      },
      {
        place: "Kitchen - oven",
        image: "A bowl filled with warm yellow-colored water inside the oven.",
        note: "Yellow River – China"
      },
      {
        place: "Balcony",
        image: "A line on the floor dividing a 'cold' snowy side and a 'warm' grassy side.",
        note: "Ob–Irtysh – Russia/Kazakhstan"
      },
      {
        place: "Bedroom",
        image: "Blue wavy bed sheet with a waterfall picture attached at the end.",
        note: "Paraná – South America"
      },
      {
        place: "Bathroom",
        image: "Dark-colored water in the bathtub with a green jungle leaf floating.",
        note: "Congo – Africa"
      },
      {
        place: "Desk / Office",
        image: "A small drawing of a river placed between a Chinese and a Russian mini-flag.",
        note: "Amur–Argun – Russia/China"
      }
    ]
  },

  populousCountries: {
    name: "10 Most Populous Countries (2025)",
    loci: [
      {
        place: "Wooden entrance door",
        image: "A photo of the Taj Mahal taped to the door with small people stickers around it.",
        note: "India"
      },
      {
        place: "Hallway",
        image: "A simple red dragon decoration hanging on the hallway wall.",
        note: "China"
      },
      {
        place: "Living room - sofa",
        image: "A small USA flag resting on the sofa cushion.",
        note: "United States"
      },
      {
        place: "Dining room - table",
        image: "A printed picture of tropical islands with a volcano placed on the table.",
        note: "Indonesia"
      },
      {
        place: "Kitchen - sink",
        image: "A green sports shirt placed next to the sink.",
        note: "Pakistan"
      },
      {
        place: "Kitchen - oven",
        image: "A strip of green-white-green paper taped on the oven door.",
        note: "Nigeria"
      },
      {
        place: "Balcony",
        image: "A yellow-and-green football placed on the balcony floor.",
        note: "Brazil"
      },
      {
        place: "Bedroom",
        image: "A green flag with a red circle pinned above the bed.",
        note: "Bangladesh"
      },
      {
        place: "Bathroom",
        image: "Cotton-like snow inside the tub with a small picture of the Kremlin nearby.",
        note: "Russia"
      },
      {
        place: "Desk / Office",
        image: "A photo of a long-distance runner next to a coffee mug.",
        note: "Ethiopia"
      }
    ]
  },

  largestCountries: {
    name: "10 Largest Countries by Area",
    loci: [
      {
        place: "Wooden entrance door",
        image: "A large printed map of Russia covering most of the door surface.",
        note: "Russia"
      },
      {
        place: "Hallway",
        image: "A maple leaf sticker on the wall symbolizing Canada.",
        note: "Canada"
      },
      {
        place: "Living room - sofa",
        image: "A simple map of China placed on the sofa cushion.",
        note: "China"
      },
      {
        place: "Dining room - table",
        image: "A USA map used as a tablecloth.",
        note: "United States"
      },
      {
        place: "Kitchen - sink",
        image: "A football and a samba-style mask next to the sink.",
        note: "Brazil"
      },
      {
        place: "Kitchen - oven",
        image: "A kangaroo photo taped on the oven door.",
        note: "Australia"
      },
      {
        place: "Balcony",
        image: "A small Indian flag attached to the balcony railing.",
        note: "India"
      },
      {
        place: "Bedroom",
        image: "An Argentina flag printed on a pillowcase.",
        note: "Argentina"
      },
      {
        place: "Bathroom",
        image: "A picture of horses placed on the bathroom mirror.",
        note: "Kazakhstan"
      },
      {
        place: "Desk / Office",
        image: "A desert photo with the word 'Algeria' written, placed on the desk.",
        note: "Algeria"
      }
    ]
  },

  studies: {
    name: "Medicine – Simplified Memory Images",
    loci: [
      {
        place: "Wooden entrance door",
        image: "A clear picture of a liver taped at eye level on the door, with two colored arrows next to it.",
        note: "Liver basics"
      },
      {
        place: "Hallway",
        image: "A drawing of a pink pancreas shape placed on the floor like a floor-mat.",
        note: "Pancreas basics"
      },
      {
        place: "Living room - sofa",
        image: "Two lung-shaped balloons resting on the sofa.",
        note: "Lung volumes"
      },
      {
        place: "Dining room - table",
        image: "A simple kidney drawing placed in the center of the table.",
        note: "Kidney filtration"
      },
      {
        place: "Kitchen - sink",
        image: "Running water with a small note saying 'Urea' stuck beside the faucet.",
        note: "Urea cycle"
      },
      {
        place: "Kitchen - oven",
        image: "A round printed diagram placed inside the oven.",
        note: "Krebs cycle"
      },
      {
        place: "Balcony",
        image: "Two pieces of paper hanging with clothespins: one purple, one pink.",
        note: "Gram+ vs Gram–"
      },
      {
        place: "Bedroom",
        image: "Three pillows of different shapes lined neatly on the bed.",
        note: "Types of epithelial cells"
      },
      {
        place: "Bathroom",
        image: "Three colored sponges (blue, red, yellow) placed on the bathtub edge.",
        note: "Embryonic layers"
      },
      {
        place: "Desk / Office",
        image: "A paper with three bottle drawings placed on the desk.",
        note: "Basic anesthetic drugs"
      }
    ]
  }
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

      // Show the selected example JSON (pretty-printed)
      previewPre.textContent = JSON.stringify(palace, null, 2);
    });
  }
}

// =========================
// Global DOMContentLoaded setup
// =========================

document.addEventListener("DOMContentLoaded", function () {
  // 1. Load palaces from localStorage
  loadPalacesFromStorage();

  // 2. Setup examples UI
  initExamplesUI();

  // 3. Setup JSON import for full app data
  const importInput = document.getElementById("palaceImport");

  if (!importInput) return;

  importInput.addEventListener("change", function (event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    // Έλεγχος επέκτασης
    if (!file.name.endsWith(".json")) {
      alert("Το αρχείο πρέπει να είναι .json");
      importInput.value = "";
      return;
    }

    // Προαιρετικός έλεγχος MIME (σε κάποιους browsers είναι κενό)
    if (file.type && file.type !== "application/json") {
      console.warn("MIME type δεν είναι 'application/json', συνεχίζω έλεγχο περιεχομένου.");
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const text = e.target.result;
        const data = JSON.parse(text);

        // ===== Έλεγχος ρίζας: { palaces: [...], selectedIndex } =====
        if (typeof data !== "object" || data === null) {
          throw new Error("Η ρίζα του JSON πρέπει να είναι αντικείμενο.");
        }

        if (!Array.isArray(data.palaces)) {
          throw new Error("Το πεδίο 'palaces' πρέπει να είναι πίνακας.");
        }

        const selectedIndex = data.selectedIndex;

        // ===== Έλεγχος παλατιών =====
        data.palaces.forEach((p, palaceIndex) => {
          if (typeof p !== "object" || p === null) {
            throw new Error(`Παλάτι #${palaceIndex}: δεν είναι έγκυρο αντικείμενο.`);
          }

          if (typeof p.name !== "string" || !p.name.trim()) {
            throw new Error(`Παλάτι #${palaceIndex}: λείπει ή είναι άδειο το 'name'.`);
          }

          if (!Array.isArray(p.loci)) {
            throw new Error(`Παλάτι '${p.name}': το 'loci' πρέπει να είναι πίνακας.`);
          }

          p.loci.forEach((loc, locIndex) => {
            if (typeof loc !== "object" || loc === null) {
              throw new Error(`Παλάτι '${p.name}', locus #${locIndex}: δεν είναι αντικείμενο.`);
            }

            if (typeof loc.locus !== "string") {
              throw new Error(
                `Παλάτι '${p.name}', locus #${locIndex}: λείπει ή δεν είναι string το 'locus'.`
              );
            }

            if (typeof loc.association !== "string") {
              throw new Error(
                `Παλάτι '${p.name}', locus #${locIndex}: λείπει ή δεν είναι string το 'association'.`
              );
            }
          });
        });

        // ===== Αν όλα είναι ΟΚ → αντικαθιστούμε τα τρέχοντα palaces =====
        palaces = data.palaces;
        renderPalaces();

        if (
          typeof selectedIndex === "number" &&
          selectedIndex >= 0 &&
          selectedIndex < palaces.length
        ) {
          selectPalace(selectedIndex);
        } else if (palaces.length > 0) {
          selectPalace(0);
        }

        // Αποθήκευση και στο localStorage
        savePalacesToStorage();

        alert("Τα Memory Palaces φορτώθηκαν επιτυχώς από το JSON αρχείο.");

      } catch (err) {
        alert(
          "Το αρχείο JSON δεν είναι στη μορφή που χρησιμοποιεί η εφαρμογή.\n\nΛεπτομέρεια: " +
            err.message
        );
      } finally {
        // Καθάρισμα για να μπορείς να ξαναδιαλέξεις το ίδιο αρχείο
        importInput.value = "";
      }
    };

    reader.readAsText(file);
  });
});
