// -
// - - - on load
document.addEventListener("DOMContentLoaded", async function () {
  setTimeout(function () {
    const lightBeam = document.getElementById("light");
    lightBeam.classList.remove("light-off");
  }, 300);
});

// -
// - - - Navigation Background
document.getElementById("menuLine").addEventListener("mouseover", function () {
  document.getElementById("wrapBackground").classList.add("active");
});

document.getElementById("menuLine").addEventListener("mouseout", function () {
  document.getElementById("wrapBackground").classList.remove("active");
});

// -
// - - - Google Sheet
async function fetchGoogleSheet(googleSheetUrl) {
  return await new Promise((resolve, reject) => {
    Papa.parse(googleSheetUrl, {
      download: true,
      header: false,
      complete: function (results) {
        resolve(results.data);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}
