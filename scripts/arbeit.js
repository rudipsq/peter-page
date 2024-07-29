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

  const container = document.getElementById("arbeitListe");
  data.slice(3).forEach((item) => {
    if (item[0] != "") {
      const row = document.createElement("div");
      row.innerHTML = `
      <p>${item[0]}</p>
      <p>${item[3]}</p>
    `;
      container.appendChild(row);
    }
  });
}
