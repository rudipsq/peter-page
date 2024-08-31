function showArbeitListe(kategorie) {
  if (kategorie == null) return;

  for (let i = 1; i <= 4; i++) {
    document.getElementById("arbeitListe" + i).style.display = "none";
    document.getElementById("arbeitButton" + i).classList.remove("active");
  }

  document.getElementById("arbeitListe" + kategorie).style.display = "block";
  document.getElementById("arbeitButton" + kategorie).classList.add("active");
}
