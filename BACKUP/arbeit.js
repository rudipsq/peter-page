document.addEventListener("DOMContentLoaded", async function () {
  fillBearbeiteteUrkundenListe();
});

async function fillBearbeiteteUrkundenListe() {
  const googleSheetUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTR7_U11hWSBljO_jorXV_2uHM8_tkI46TDPmOufA-0TWfE8ngnHjBEAEMMjYM2KC_D6o8aRQfGAIAh/pub?output=csv";
  const data = await fetchGoogleSheet(googleSheetUrl);

  if (!data) {
    // ? does this error work?
    console.error("failed to load arbeit liste");
    return;
  }

  let tabelle = { bezeichnung: 0, kategorie: 1, anzahl: 2 };

  data.slice(3).forEach((item) => {
    if (item[tabelle.bezeichnung] != "") {
      // tabelle reihe bauen
      const row = document.createElement("div");
      row.innerHTML = `
      <p>${item[tabelle.bezeichnung]}</p>
      <p>${item[tabelle.anzahl]}</p>
    `;

      let container;

      // element in kategorien sortieren
      switch (item[tabelle.kategorie]) {
        case "Könige und Kaiser":
          container = document.getElementById("arbeitListe1");
          break;

        case "Papsturkunden":
          container = document.getElementById("arbeitListe2");
          break;

        case "Familiengeschichten":
          container = document.getElementById("arbeitListe3");
          break;

        case "Ablassbriefe und Wappenverleihungen":
          container = document.getElementById("arbeitListe4");
          break;

        case "?":
          container = document.getElementById("arbeitListe5");
          break;

        default:
          break;
      }

      console.log(container);

      container.appendChild(row);
    }
  });
}

function showArbeitListe(kategorie) {
  if (kategorie == null) return;

  for (let i = 1; i <= 5; i++) {
    document.getElementById("arbeitListe" + i).style.display = "none";
    document.getElementById("arbeitButton" + i).classList.remove("active");
  }

  document.getElementById("arbeitListe" + kategorie).style.display = "block";
  document.getElementById("arbeitButton" + kategorie).classList.add("active");
}