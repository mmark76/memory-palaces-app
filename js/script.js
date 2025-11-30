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

// Upload custom memory palace image for the header
document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("palaceImageUpload");
  const headerImg = document.querySelector(".header-image");
  if (!fileInput || !headerImg) return;

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
});

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
        image: "Huge loaf of bread stuck in the door",
        note: "Bread"
      },
      {
        place: "Hallway",
        image: "River of milk flooding the floor",
        note: "Milk"
      },
      {
        place: "Living room - sofa",
        image: "Eggs cracking all over the sofa",
        note: "Eggs"
      },
      {
        place: "Dining room - table",
        image: "The table is a giant slice of cheese",
        note: "Cheese"
      },
      {
        place: "Kitchen - sink",
        image: "Sink full of tomatoes",
        note: "Tomatoes"
      },
      {
        place: "Kitchen - oven",
        image: "The oven is made of pasta",
        note: "Pasta"
      },
      {
        place: "Balcony",
        image: "Giant bottle of olive oil instead of a plant pot",
        note: "Olive oil"
      },
      {
        place: "Desk / Office",
        image: "A cup of coffee spilling over documents",
        note: "Coffee"
      }
    ]
  },

  recipe: {
    name: "Pasta With Tomato Sauce",
    loci: [
      {
        place: "Wooden entrance door",
        image: "Pot of boiling pasta stuck in the door, water everywhere",
        note: "Boil pasta in salted water"
      },
      {
        place: "Hallway",
        image: "River of tomato sauce flowing along the hallway",
        note: "Cook tomato sauce with olive oil and herbs"
      },
      {
        place: "Living room - sofa",
        image: "Someone mixing pasta and sauce with a huge spoon on the sofa",
        note: "Mix pasta with the sauce"
      },
      {
        place: "Dining room - table",
        image: "Cheese snow falling from the ceiling onto pasta on the table",
        note: "Serve and add grated cheese on top"
      }
    ]
  },

  rivers: {
    name: "World's 10 Longest Rivers",
    loci: [
      {
        place: "Wooden entrance door",
        image: "Blue ribbon river with pyramids and pharaohs around the door",
        note: "Nile – Africa"
      },
      {
        place: "Hallway",
        image: "Hallway turned into a jungle with a huge wide river",
        note: "Amazon – South America"
      },
      {
        place: "Living room - sofa",
        image: "River with a Chinese dragon flying above it on the sofa",
        note: "Yangtze – China"
      },
      {
        place: "Dining room - table",
        image: "Table turned into a river with cowboy boats and jazz band",
        note: "Mississippi–Missouri – North America"
      },
      {
        place: "Kitchen - sink",
        image: "Frozen water pouring from the tap, icy fishermen around",
        note: "Yenisei – Mongolia/Russia"
      },
      {
        place: "Kitchen - oven",
        image: "Oven overflowing with yellow muddy water",
        note: "Yellow River – China"
      },
      {
        place: "Balcony",
        image: "River splitting a frozen Russian town and endless steppe",
        note: "Ob–Irtysh – Russia/Kazakhstan"
      },
      {
        place: "Bedroom",
        image: "Bed floating on a river ending in giant waterfalls",
        note: "Paraná – South America"
      },
      {
        place: "Bathroom",
        image: "Bathtub filled with dark jungle river water and a gorilla",
        note: "Congo – Africa"
      },
      {
        place: "Desk / Office",
        image: "On the desk, a river separating Russian and Chinese landscapes with a tiger on a bridge",
        note: "Amur–Argun – Russia/China/Mongolia"
      }
    ]
  },

  populousCountries: {
    name: "10 Most Populous Countries (2025)",
    loci: [
      {
        place: "Wooden entrance door",
        image: "Huge crowd in colorful Indian clothes, Taj Mahal in the back",
        note: "India"
      },
      {
        place: "Hallway",
        image: "Red carpet with Chinese dragons and the Great Wall at the end",
        note: "China"
      },
      {
        place: "Living room - sofa",
        image: "Statue of Liberty sitting on the sofa holding a burger and a US flag",
        note: "United States"
      },
      {
        place: "Dining room - table",
        image: "Table full of small islands around a smoking volcano",
        note: "Indonesia"
      },
      {
        place: "Kitchen - sink",
        image: "Cricket player in green uniform hitting a ball beside the sink",
        note: "Pakistan"
      },
      {
        place: "Kitchen - oven",
        image: "African drummers coming out of the oven with a green-white-green banner",
        note: "Nigeria"
      },
      {
        place: "Balcony",
        image: "Brazilian footballer in yellow jersey dribbling in front of Christ the Redeemer",
        note: "Brazil"
      },
      {
        place: "Bedroom",
        image: "Green flag with a red circle hanging above the bed",
        note: "Bangladesh"
      },
      {
        place: "Bathroom",
        image: "Bathtub full of snow, a bear with a hat and the Kremlin behind",
        note: "Russia"
      },
      {
        place: "Desk / Office",
        image: "Ethiopian runner and a cup of coffee on the desk",
        note: "Ethiopia"
      }
    ]
  },

  largestCountries: {
    name: "10 Largest Countries by Area",
    loci: [
      {
        place: "Wooden entrance door",
        image: "Giant Russian bear rolling out a huge map covering the house",
        note: "Russia"
      },
      {
        place: "Hallway",
        image: "Hallway full of snow, a man with a maple leaf flag",
        note: "Canada"
      },
      {
        place: "Living room - sofa",
        image: "Chinese dragon sitting on a giant map of China on the sofa",
        note: "China"
      },
      {
        place: "Dining room - table",
        image: "Dining table painted as a full map of the USA",
        note: "United States"
      },
      {
        place: "Kitchen - sink",
        image: "Football field and samba dancers popping out of the sink",
        note: "Brazil"
      },
      {
        place: "Kitchen - oven",
        image: "Oven interior is an endless red-orange outback with a kangaroo",
        note: "Australia"
      },
      {
        place: "Balcony",
        image: "Yogi sitting on a huge India map hanging from the balcony",
        note: "India"
      },
      {
        place: "Bedroom",
        image: "Bed turned into the windy plains of Patagonia with Argentina flag",
        note: "Argentina"
      },
      {
        place: "Bathroom",
        image: "Bathtub is a giant steppe with horses and nomads",
        note: "Kazakhstan"
      },
      {
        place: "Desk / Office",
        image: "On the desk a map of a hot desert with a sign 'Algeria'",
        note: "Algeria"
      }
    ]
  },

  worldHistory: {
    name: "World History – Key Events",
    loci: [
      {
        place: "Wooden entrance door",
        image: "Cave paintings and a stone spear on the door",
        note: "Prehistory – Paleolithic/Neolithic"
      },
      {
        place: "Hallway",
        image: "Hallway looks like Mesopotamia with Tigris and Euphrates at your feet",
        note: "Early Civilizations – Mesopotamia/Egypt/China"
      },
      {
        place: "Living room - sofa",
        image: "Pericles sitting on the sofa holding the Acropolis",
        note: "Ancient Greece – Classical Era"
      },
      {
        place: "Dining room - table",
        image: "Roman Forum built on top of the table",
        note: "Roman Empire"
      },
      {
        place: "Kitchen - sink",
        image: "Byzantine golden mosaics appearing around the sink",
        note: "Byzantine Empire"
      },
      {
        place: "Kitchen - oven",
        image: "Crusaders stepping out of the oven with shields and crosses",
        note: "Middle Ages & Crusades"
      },
      {
        place: "Balcony",
        image: "Ship of Columbus sailing from the balcony toward the horizon",
        note: "Age of Discovery – 1492"
      },
      {
        place: "Bedroom",
        image: "Bedroom turned into a factory full of steam machines",
        note: "Industrial Revolution"
      },
      {
        place: "Bathroom",
        image: "Bathtub transformed into trenches with soldiers and barbed wire",
        note: "World War I & World War II"
      },
      {
        place: "Desk / Office",
        image: "Globe on the desk split into East and West",
        note: "Cold War – Fall of USSR"
      }
    ]
  },

  geography: {
    name: "Geography – Countries, Capitals, Rivers, Mountains",
    loci: [
      {
        place: "Wooden entrance door",
        image: "Big spinning globe stuck on the door",
        note: "Country 1: France – Capital: Paris"
      },
      {
        place: "Hallway",
        image: "Japanese flag waving in the hallway with a samurai walking",
        note: "Country 2: Japan – Capital: Tokyo"
      },
      {
        place: "Living room - sofa",
        image: "Small blue ribbon river flowing across the sofa",
        note: "River: Nile – Africa"
      },
      {
        place: "Dining room - table",
        image: "Table turned into a wide river inside a rainforest",
        note: "River: Amazon – South America"
      },
      {
        place: "Kitchen - sink",
        image: "Snowy mountain peak rising out of the sink",
        note: "Mountain: Everest – Himalayas"
      },
      {
        place: "Kitchen - oven",
        image: "Opening the oven reveals Kilimanjaro with a zebra nearby",
        note: "Mountain: Kilimanjaro – Tanzania"
      },
      {
        place: "Balcony",
        image: "Small square with Eiffel Tower built on your balcony",
        note: "Capital: Paris – Country: France"
      },
      {
        place: "Bedroom",
        image: "Large card above the bed showing Asia, Europe, Africa",
        note: "Continents: Asia, Europe, Africa"
      },
      {
        place: "Bathroom",
        image: "Bathtub transformed into a big lake with ducks",
        note: "Lake: Baikal – Russia"
      },
      {
        place: "Desk / Office",
        image: "Open map on the desk with mountains, rivers and countries marked",
        note: "Summary of geography: countries, capitals, rivers, mountains"
      }
    ]
  },

  studies: {
    name: "Studies & Exams – Definitions, Formulas, Theories, Chapters",
    loci: [
      {
        place: "Wooden entrance door",
        image: "Huge definition page blocking the entrance",
        note: "Definition 1: Main concept of the subject"
      },
      {
        place: "Hallway",
        image: "Flashcards with definitions spinning around you in the hallway",
        note: "Definition 2: Second fundamental concept"
      },
      {
        place: "Living room - sofa",
        image: "Giant numbers and symbols sitting on the sofa like formulas",
        note: "Formula 1: Key formula to remember"
      },
      {
        place: "Dining room - table",
        image: "Table covered with glowing equations connecting with lines",
        note: "Formula 2: Second important equation"
      },
      {
        place: "Kitchen - sink",
        image: "Small scene of professors discussing above the sink",
        note: "Theory 1: First core theoretical principle"
      },
      {
        place: "Kitchen - oven",
        image: "Opening the oven reveals a mini TED-style lecture",
        note: "Theory 2: Second theoretical idea"
      },
      {
        place: "Balcony",
        image: "Pages of chapters hanging on a rope on the balcony",
        note: "Chapter 1: First chapter to study"
      },
      {
        place: "Bedroom",
        image: "Bed turned into an open book full of highlights",
        note: "Chapter 2: Next major chapter"
      },
      {
        place: "Bathroom",
        image: "Bathtub turned into a flowchart of topics",
        note: "Chapter 3: Additional chapter/section"
      },
      {
        place: "Desk / Office",
        image: "Stack of notes and a paper titled 'Revision' on the desk",
        note: "Revision: Summary of all key points"
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

document.addEventListener("DOMContentLoaded", initExamplesUI);
