const STORAGE_KEY = "memoryPalaces_v1";

let palaces = [];
let currentPalace = null;

let flashcardOrder = [];
let flashcardIndex = 0;
let flashcardMode = "locusToAssoc";

// Toggle help overlay
function toggleHelp() {
  const panel = document.getElementById("helpPanel");
  const overlay = document.getElementById("instructionsOverlay");
  if (!panel || !overlay) return;

  const isHidden = panel.classList.contains("hidden");
  if (isHidden) {
    panel.classList.remove("hidden");
    overlay.classList.remove("hidden");
  } else {
    panel.classList.add("hidden");
    overlay.classList.add("hidden");
  }
}

// Create a new palace
function createPalace() {
  const input = document.getElementById("palaceName");
  if (!input) return;

  let name = (input.value || "").trim();
  if (!name) {
    name = "Untitled palace " + (palaces.length + 1);
  }

  const palace = {
    id: Date.now().toString() + "_" + Math.random().toString(16).slice(2),
    name: name,
    loci: []
  };

  palaces.push(palace);
  input.value = "";
  renderPalaces();
  selectPalace(palaces.length - 1);
}

// Render the list of palaces
function renderPalaces() {
  const list = document.getElementById("palaceList");
  if (!list) return;

  list.innerHTML = "";

  if (!palaces.length) {
    const empty = document.createElement("li");
    empty.className = "palace-item empty";
    empty.textContent = "No memory palaces yet. Create one above.";
    list.appendChild(empty);
    return;
  }

  palaces.forEach((palace, index) => {
    const li = document.createElement("li");
    li.className = "palace-item";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = palace.name || ("Palace " + (index + 1));
    btn.onclick = function () {
      selectPalace(index);
    };

    li.appendChild(btn);
    list.appendChild(li);
  });
}

// Select a palace and show its loci
function selectPalace(index) {
  const palace = palaces[index];
  if (!palace) return;

  currentPalace = palace;

  const titleEl = document.getElementById("palaceTitle");
  const selectedBox = document.getElementById("selectedPalace");
  const flashcardsSection = document.getElementById("flashcardsSection");
  const flashcardBox = document.getElementById("flashcardBox");
  const flashcardAnswer = document.getElementById("flashcardAnswer");

  if (titleEl) {
    titleEl.textContent = currentPalace.name || "Your Memory Palace";
  }
  if (selectedBox) {
    selectedBox.classList.remove("hidden");
  }

  // reset flashcards UI
  if (flashcardsSection) {
    if (currentPalace.loci && currentPalace.loci.length) {
      flashcardsSection.classList.remove("hidden");
    } else {
      flashcardsSection.classList.add("hidden");
    }
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

// Render loci for current palace
function renderLoci() {
  const list = document.getElementById("locusList");
  if (!list) return;

  list.innerHTML = "";

  if (!currentPalace) return;

  const loci = currentPalace.loci || [];

  if (!loci.length) {
    const empty = document.createElement("li");
    empty.className = "locus-item empty";
    empty.textContent = "No loci yet. Add a locus below.";
    list.appendChild(empty);
    return;
  }

  loci.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "locus-item";

    const locusInput = document.createElement("input");
    locusInput.className = "locus-text";
    locusInput.type = "text";
    locusInput.placeholder = "Locus description";
    locusInput.value = item.locus || "";
    locusInput.oninput = function (e) {
      updateLocus(index, "locus", e.target.value);
    };

    const assocInput = document.createElement("input");
    assocInput.className = "association-text";
    assocInput.type = "text";
    assocInput.placeholder = "Association (image, story, keyword...)";
    assocInput.value = item.association || "";
    assocInput.oninput = function (e) {
      updateLocus(index, "association", e.target.value);
    };

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "delete-locus-btn";
    delBtn.textContent = "×";
    delBtn.title = "Delete locus";
    delBtn.onclick = function () {
      deleteLocus(index);
    };

    li.appendChild(locusInput);
    li.appendChild(assocInput);
    li.appendChild(delBtn);

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

// Add new locus to current palace
function addLocus() {
  if (!currentPalace) return;

  const locusInput = document.getElementById("newLocusName");
  const assocInput = document.getElementById("newLocusAssociation");
  if (!locusInput || !assocInput) return;

  const locus = (locusInput.value || "").trim();
  const association = (assocInput.value || "").trim();

  if (!locus && !association) {
    return;
  }

  currentPalace.loci.push({ locus, association });
  locusInput.value = "";
  assocInput.value = "";

  renderLoci();
}

// Update locus field
function updateLocus(index, field, value) {
  if (!currentPalace || !currentPalace.loci) return;
  if (index < 0 || index >= currentPalace.loci.length) return;

  const item = currentPalace.loci[index];
  if (!item) return;

  if (field === "locus") {
    item.locus = value;
  } else if (field === "association") {
    item.association = value;
  }
}

// Delete a locus
function deleteLocus(index) {
  if (!currentPalace || !currentPalace.loci) return;
  if (index < 0 || index >= currentPalace.loci.length) return;

  currentPalace.loci.splice(index, 1);
  renderLoci();
}

// ===== Flashcards practice for current palace =====

function startFlashcards() {
  if (!currentPalace || !currentPalace.loci || !currentPalace.loci.length) return;

  const modeSelect = document.getElementById("flashcardMode");
  const flashcardBox = document.getElementById("flashcardBox");
  const answerEl = document.getElementById("flashcardAnswer");

  if (!modeSelect || !flashcardBox || !answerEl) return;

  flashcardMode = modeSelect.value || "locusToAssoc";

  // random order
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

  if (flashcardIndex < 0) {
    flashcardIndex = 0;
  }
  if (flashcardIndex >= flashcardOrder.length) {
    flashcardIndex = flashcardOrder.length - 1;
  }

  const idx = flashcardOrder[flashcardIndex];
  const item = currentPalace.loci[idx] || {};
  const locusText = item.locus || "";
  const assocText = item.association || "";

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
      selectedId: currentPalace ? currentPalace.id : null
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

    const selectedId = data.selectedId;
    if (selectedId) {
      const idx = palaces.findIndex((p) => p.id === selectedId);
      if (idx >= 0) {
        selectPalace(idx);
      }
    }
  } catch (err) {
    console.error("Could not load palaces:", err);
    renderPalaces();
  }
}

// ===== Initialisation =====

document.addEventListener("DOMContentLoaded", function () {
  // header image upload
  const fileInput = document.getElementById("palaceImageUpload");
  const headerImg = document.querySelector(".header-image");

  if (fileInput && headerImg) {
    fileInput.addEventListener("change", function (event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      if (!file.type || !file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        headerImg.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  loadPalacesFromStorage();
});
