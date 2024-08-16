document.addEventListener("DOMContentLoaded", async function () {
  fillBearbeiteteUrkundenListe();
});

async function fillBearbeiteteUrkundenListe() {
  const googleSheetUrl =
    "https://docs.google.com/spreadsheets/d/1ckCi971f0Ws46eTbz1M1wCxIgaOlBZkW-leIFrbdZ5Q/pub?output=csv";
  const data = await fetchGoogleSheet(googleSheetUrl);

  if (!data) {
    // ? does this error work?
    console.error("failed to load arbeit liste");
    return;
  }

  let tabelle = { bezeichnung: 0, kategorie: 1, anzahl: 2, blatt: 3 };

  data.slice(3).forEach((item) => {
    if (item[tabelle.bezeichnung] != "") {
      // tabelle reihe bauen
      const row = document.createElement("div");

      if (item[tabelle.blatt]) {
        row.innerHTML = `
      <p>${item[tabelle.blatt]}</p>
      <p style="margin-left: 12px">Blatt</p>
      <p>${item[tabelle.bezeichnung]}</p>`;
      } else {
        row.innerHTML = `
      <p>${item[tabelle.anzahl]}</p>
      <p>${item[tabelle.bezeichnung]}</p>`;
      }

      let container;

      // element in kategorien sortieren
      switch (item[tabelle.kategorie]) {
        case "Könige und Kaiser":
          container = document.getElementById("arbeitListe1");
          break;

        case "Urkunden Stadtverwaltung":
          container = document.getElementById("arbeitListe2");
          break;

        case "Familiengeschichten":
          container = document.getElementById("arbeitListe3");
          break;

        case "Kirchliche Urkunden und Wappenbriefe":
          container = document.getElementById("arbeitListe4");
          break;

        default:
          break;
      }
      container.appendChild(row);
    }
  });
}

function showArbeitListe(kategorie) {
  if (kategorie == null) return;

  for (let i = 1; i <= 4; i++) {
    document.getElementById("arbeitListe" + i).style.display = "none";
    document.getElementById("arbeitButton" + i).classList.remove("active");
  }

  document.getElementById("arbeitListe" + kategorie).style.display = "block";
  document.getElementById("arbeitButton" + kategorie).classList.add("active");
}
