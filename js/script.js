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

  "rivers": {
    "name": "World's 10 Longest Rivers (Beginner-Friendly)",
    "loci": [
      {
        "place": "Wooden entrance door",
        "image": "A simple blue river drawn like a long snake, with one big pyramid next to it.",
        "note": "Nile – Africa (easy clue: pyramids = Egypt = Nile)."
      },
      {
        "place": "Hallway",
        "image": "A huge rainforest tree standing in the hallway with a very wide river flowing slowly under it.",
        "note": "Amazon – South America (easy clue: rainforest = Amazon)."
      },
      {
        "place": "Living room - sofa",
        "image": "A calm river on the sofa with a red Chinese lantern floating on it.",
        "note": "Yangtze – China (easy clue: lanterns = China)."
      },
      {
        "place": "Dining room - table",
        "image": "A long brown river crossing the table with a tiny cowboy hat floating on it.",
        "note": "Mississippi–Missouri – North America (easy clue: cowboys = USA)."
      },
      {
        "place": "Kitchen - sink",
        "image": "Cold icy water from the tap and a simple snowflake symbol next to it.",
        "note": "Yenisei – Russia (easy clue: Russia = cold)."
      },
      {
        "place": "Kitchen - oven",
        "image": "The oven filled with yellow-colored water, like warm tea.",
        "note": "Yellow River – China (easy clue: yellow color = Yellow River)."
      },
      {
        "place": "Balcony",
        "image": "A balcony split into two areas: one snowy, one grassy, with a river line between them.",
        "note": "Ob–Irtysh – Russia/Kazakhstan (easy clue: snowy Russia vs grasslands)."
      },
      {
        "place": "Bedroom",
        "image": "The bed floating on gentle river waves with a big waterfall at the end.",
        "note": "Paraná – South America (easy clue: river + waterfall = Iguazu)."
      },
      {
        "place": "Bathroom",
        "image": "The bathtub full of dark water with a simple jungle leaf floating on it.",
        "note": "Congo – Africa (easy clue: African jungle = Congo)."
      },
      {
        "place": "Desk / Office",
        "image": "A simple river line on the desk with one Chinese flag on one side and one Russian flag on the other.",
        "note": "Amur–Argun – Russia/China (easy clue: river between the two flags)."
      }
    ]
  }

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

{
  "studies": {
    "name": "Medicine – Anatomy, Physiology, Biochemistry, Microbiology, Histology",
    "loci": [
      {
        "place": "Wooden entrance door",
        "image": "The entrance door is a giant anatomical liver that opens into two lobes with the portal triad as colored cables.",
        "note": "Anatomy: Liver lobes & portal triad (portal vein, hepatic artery, bile duct)."
      },
      {
        "place": "Hallway",
        "image": "The hallway floor has turned into a huge pancreas in cross-section with the pancreatic duct spiraling along the corridor.",
        "note": "Anatomy: Pancreas regions (head, neck, body, tail) & Wirsung duct."
      },
      {
        "place": "Living room - sofa",
        "image": "Two giant lungs sit on the sofa blowing balloons labeled FEV1, FVC, and Tidal Volume.",
        "note": "Physiology: Lung volumes and capacities."
      },
      {
        "place": "Dining room - table",
        "image": "The dining table is a giant nephron filtering food through a glowing glomerulus sieve.",
        "note": "Physiology: Nephron filtration & GFR mechanisms."
      },
      {
        "place": "Kitchen - sink",
        "image": "The sink faucet pours ammonia water that flows through pipes labeled Ornithine, Citrulline, and Arginine before producing solid white 'urea soap'.",
        "note": "Biochemistry: Urea cycle steps."
      },
      {
        "place": "Kitchen - oven",
        "image": "Opening the oven reveals the Krebs cycle spinning like a glowing wheel with each intermediate appearing sequentially.",
        "note": "Biochemistry: Krebs cycle intermediates & energy output."
      },
      {
        "place": "Balcony",
        "image": "Clothes hang from a rope, some purple (Gram+) and some pink (Gram−), each with bacteria names like Staph, Strep, E.coli, Klebsiella.",
        "note": "Microbiology: Gram-positive and Gram-negative classification."
      },
      {
        "place": "Bedroom",
        "image": "The bed has transformed into a layered epithelium made of pillows shaped as squamous, cuboidal, and columnar cells.",
        "note": "Histology: Epithelial tissue types."
      },
      {
        "place": "Bathroom",
        "image": "The bathtub is filled with water divided into three colors representing endoderm (blue), mesoderm (red), and ectoderm (yellow).",
        "note": "Embryology: Gastrulation & the three germ layers."
      },
      {
        "place": "Desk / Office",
        "image": "There are three anesthesia bottles on the desk: Propofol (white), Ketamine (colorful), and Isoflurane (vapor candle).",
        "note": "Pharmacology: Basic anesthetic agents and their actions."
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


