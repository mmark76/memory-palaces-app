let palaces = [];
let currentPalace = null;

// Εναλλαγή εμφάνισης / απόκρυψης οδηγών
function toggleHelp() {
  const panel = document.getElementById("helpPanel");
  panel.classList.toggle("hidden");
}

// Δημιουργία νέου παλατιού
function createPalace() {
  const nameInput = document.getElementById("palaceName");
  const name = nameInput.value.trim();
  if (!name) return;

  palaces.push({ name: name, loci: [] });
  nameInput.value = "";
  renderPalaces();
}

// Εμφάνιση λίστας παλατιών
function renderPalaces() {
  const list = document.getElementById("palaceList");
  list.innerHTML = "";

  palaces.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "palace-button";
    div.textContent = p.name;
    div.onclick = () => selectPalace(index);
    list.appendChild(div);
  });
}

// Επιλογή παλατιού
function selectPalace(index) {
  currentPalace = palaces[index];

  document.getElementById("palaceTitle").textContent = currentPalace.name;
  document.getElementById("selectedPalace").classList.remove("hidden");
  renderLoci();
}

// Προσθήκη locus
// Προσθήκη locus
function addLocus() {
  if (!currentPalace) return;

  const locusInput = document.getElementById("locusInput");
  const associationInput = document.getElementById("associationInput");

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
  list.innerHTML = "";

  if (!currentPalace) return;

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

document.getElementById("instructionsModal").style.display = "block";
document.getElementById("instructionsOverlay").style.display = "block";
document.getElementById("instructionsModal").style.display = "none";
document.getElementById("instructionsOverlay").style.display = "none";

