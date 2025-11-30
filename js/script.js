let palaces = [];
let currentPalace = null;

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

  if (titleEl) titleEl.textContent = currentPalace.name;
  if (selectedBox) selectedBox.classList.remove("hidden");

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

  currentPalace.loci.forEach((item) => {
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
}
