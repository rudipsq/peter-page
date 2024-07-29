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

  data.slice(3).forEach((item) => {
    if (item[0] != "") {
      // tabelle reihe bauen
      const row = document.createElement("div");
      row.innerHTML = `
      <p>${item[0]}</p>
      <p>${item[3]}</p>
    `;

      let container;

      // element in kategorien sortieren
      switch (item[2]) {
        case "Könige und Kaiser":
          container = document.getElementById("arbeitListe1");
          break;

        case "Papsturkunde":
          container = document.getElementById("arbeitListe2");
          break;

        case "Familiengeschichten?":
          container = document.getElementById("arbeitListe3");
          break;

        case "test4":
          container = document.getElementById("arbeitListe4");
          break;

        case "test5":
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
