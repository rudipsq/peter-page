// // DEBUG_LOG_BLOCK_START
// (function () {
//   if (window.DEBUG_LOG_INSTALLED) return;
//   window.DEBUG_LOG_INSTALLED = true;

//   const logs = [];

//   function addRow(el) {
//     if (
//       typeof Element !== "undefined" &&
//       el instanceof Element &&
//       el.tagName === "A"
//     ) {
//       logs.push(el.outerHTML);
//     }
//   }

//   window.DEBUG_LOG = {
//     addRow,
//     download(filename) {
//       const content = logs.join("\n");
//       const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = filename || "debug-rows.txt";
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       URL.revokeObjectURL(url);
//     },
//     clear() {
//       logs.length = 0;
//     },
//     getAll() {
//       return logs.slice();
//     },
//   };

//   // Patch console.log -> wenn A-Tag drin, speichern
//   const origLog = console.log.bind(console);
//   console.log = function (...args) {
//     args.forEach((arg) => addRow(arg));
//     origLog(...args);
//   };

//   // Shortcut Ctrl+Shift+D
//   window.addEventListener("keydown", function (e) {
//     if (e.ctrlKey && e.shiftKey && (e.key === "D" || e.key === "d")) {
//       e.preventDefault();
//       window.DEBUG_LOG.download();
//     }
//   });

//   console.log("[DEBUG_LOG for <a> installed]");
// })();
// // DEBUG_LOG_BLOCK_END

//*
//* - - - - -  flying div
//*
const flyingDiv = document.getElementById("flying-div");
let lastX = 0;
let lastY = 0;
let currentX = 0;
let currentY = 0;
let targetX = 0;
let targetY = 0;
let animationFrameId = null;

let currentArchiveId = null;
let currentArchiveCategory = 1;

// cursor over table body
const tableBody = document.getElementById("tableBody");
let isCursorOver = false;

tableBody.addEventListener("mouseenter", () => {
  isCursorOver = true;
});

tableBody.addEventListener("mouseleave", () => {
  isCursorOver = false;
});

// enable disable element
function disableElement(element) {
  element.classList.add("hide");
}

function enableElement(element) {
  element.classList.remove("hide");
}

// flying div animation
document.addEventListener("mousemove", (e) => {
  targetX = e.clientX;
  targetY = e.clientY;

  if (isCursorOver) {
    updateArchiveId(e.target);

    enableElement(flyingDiv);
  } else {
    disableElement(flyingDiv);
  }

  // Restart the animation if it's not running
  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(updatePosition);
  }
});

function updatePosition() {
  // Easing function for smooth trailing
  currentX += (targetX - currentX) * 0.18;
  currentY += (targetY - currentY) * 0.18;

  // Check if position has changed significantly
  if (Math.abs(lastX - currentX) < 0.1 && Math.abs(lastY - currentY) < 0.1) {
    animationFrameId = null;
    return;
  }

  flyingDiv.style.left = `${currentX}px`;
  flyingDiv.style.top = `${currentY}px`;

  //   console.log("Updating position:", currentX, currentY);

  lastX = currentX;
  lastY = currentY;

  animationFrameId = requestAnimationFrame(updatePosition);
}

document.addEventListener("mouseleave", () => {
  disableElement(flyingDiv);
});

function updateArchiveId(element) {
  // console.log("updated id", element);
  let currentElement;
  if (element.nodeName === "A") {
    currentElement = element;
  } else {
    let parentElement = element.parentElement;
    currentElement = parentElement;
  }

  if (currentElement.getAttribute("data-id") == currentArchiveId) return;

  if (currentElement && currentElement.getAttribute("data-id")) {
    currentArchiveId = currentElement.getAttribute("data-id");
    scrollImg();
  }
}

function scrollImg() {
  // change width of flying div
  const slide = document.querySelectorAll(
    `li[data-id="${currentArchiveId}"]`
  )[0];
  const image = slide.querySelector(":first-child");
  const width = image.clientWidth;

  const div = document.getElementById("flying-div");
  div.style.width = width + "px";

  // scroll to image
  const container = document.getElementById("slides" + currentArchiveCategory);
  let totalWidth = calculateTotalWidth(container, slide);
  container.style.translate = "-" + totalWidth + "px 0";
}

function calculateTotalWidth(parentElement, childElement) {
  const children = parentElement.children;
  let upToChildNumber;

  for (let i = 0; i < children.length; i++) {
    if (children[i] === childElement) {
      upToChildNumber = i;
    }
  }

  let sum = 0;
  let count = 0;

  for (let i = 0; i < children.length && count < upToChildNumber; i++) {
    sum += children[i].offsetWidth;
    count++;
  }

  return sum;
}

//*
//* - - - - - setup table
//*

let categories = [
  "Papsturkunde",
  "Kardinalablass",
  "Bischofablass",
  "Verwaltung-&-Wappenbriefe",
  "weitere-Illuminierte-Urkunden",
];

setupTable();

async function setupTable() {
  const data = await fetchGoogleSheet(
    "../../../data/archiv/archiv_transkribtionen.csv"
  );

  let tabelle = {
    id: 0,
    bezeichnung: 1,
    kategorie: 2,
    ort: 3,
    jahr: 4,
    monat: 5,
    tag: 6,
    originalDatum: 7,
    archiv: 8,
  };

  data.slice(3).forEach((item) => {
    if (
      item[tabelle.id] &&
      !item[tabelle.id].includes("x") &&
      item[tabelle.kategorie]
    ) {
      // buildTableRow(
      //   item[tabelle.id],
      //   item[tabelle.bezeichnung],
      //   item[tabelle.kategorie],
      //   item[tabelle.jahr],
      //   item[tabelle.monat],
      //   item[tabelle.tag],
      //   item[tabelle.ort]
      // );

      addImage(
        item[tabelle.id],
        item[tabelle.bezeichnung],
        item[tabelle.kategorie],
        item[tabelle.jahr],
        item[tabelle.monat],
        item[tabelle.tag],
        item[tabelle.ort]
      );
    }
  });
}

function buildTableRow(archiveId, title, category, year, month, day, place) {
  let table;

  switch (category) {
    case categories[0]:
      table = document.getElementById("tableCategory1");
      break;

    case categories[1]:
      table = document.getElementById("tableCategory2");
      break;

    case categories[2]:
      table = document.getElementById("tableCategory3");
      break;

    case categories[3]:
      table = document.getElementById("tableCategory4");
      break;

    case categories[4]:
      table = document.getElementById("tableCategory5");
      break;

    default:
      return;
  }

  // create elements
  let row = document.createElement("a");

  let col1 = document.createElement("p");
  let col2 = document.createElement("p");
  let col3 = document.createElement("p");
  let col4 = document.createElement("p");
  let col5 = document.createElement("p");

  // fill elements
  // let titleElement = document.createElement("h3");

  col1.innerHTML = title;
  // titleElement.innerHTML = title;
  // col2.innerHTML = category;
  col2.innerHTML = place == "X" ? "" : place;
  col3.innerHTML = year;
  col4.innerHTML = month.substring(0, 3);
  col5.innerHTML = day;

  row.setAttribute("data-id", archiveId);
  // col1.appendChild(titleElement);
  let id = createId(category, title, place, year, month, day);
  row.href = getLinkToPdf(id, category);
  row.target = "_blank";

  // append children
  row.appendChild(col1);
  // rowDiv.appendChild(titleElement);
  row.appendChild(col2);
  row.appendChild(col5);
  row.appendChild(col4);
  row.appendChild(col3);

  table.appendChild(row);

  console.log(row); // HERE
}

function createId(category, title, place, year, month, day) {
  let monthNumber;
  switch (month) {
    case "Januar":
      monthNumber = "01";
      break;

    case "Februar":
      monthNumber = "02";
      break;

    case "März":
      monthNumber = "03";
      break;

    case "April":
      monthNumber = "04";
      break;

    case "Mai":
      monthNumber = "05";
      break;

    case "Juni":
      monthNumber = "06";
      break;

    case "Juli":
      monthNumber = "07";
      break;
    case "August":
      monthNumber = "08";
      break;
    case "September":
      monthNumber = "09";
      break;
    case "Oktober":
      monthNumber = "10";
      break;
    case "November":
      monthNumber = "11";
      break;
    case "Dezember":
      monthNumber = "12";
      break;

    default:
      monthNumber = "00";
      break;
  }

  if (!day || day == "") {
    day = "00";
  } else if (day < 10) {
    day = "0" + day;
  }

  let date = `${year}-${monthNumber}-${day}`;

  // Concatenate parts in custom order
  let id;
  if (!place || place == "") {
    id = `${category}_${date}_${title}`;
  } else {
    id = `${category}_${date}_${place}_${title}`;
  }

  id = id.replace(/ /g, "-");

  return id;
}

function getLinkToPdf(archiveId, category) {
  if (!archiveId || archiveId == "") {
    return "./not_found.html";
  }

  if (!category || category == "") {
    return "./not_found.html";
  }

  if (category == "weitere-Illuminierte-Urkunden") {
    // SONDERFALL FUER NEUE KATEGORIE
    return `./data/archiv/${category}/${archiveId}.doc`;
  }

  return `./data/archiv/${category.toLowerCase()}/${archiveId}.pdf`;
}

function getLinkToImage(archiveId, category) {
  if (!archiveId || archiveId == "") {
    archiveId = "error";
  }

  if (!category || category == "") {
    return;
  }

  if (category == "weitere-Illuminierte-Urkunden") {
    // SONDERFALL FUER NEUE KATEGORIE
    return `./img/archiv/${category}/${archiveId}.webp`;
  }

  return `./img/archiv/${category.toLowerCase()}/${archiveId}.webp`;
}

function addImage(archiveId, title, category, year, month, day, place) {
  switch (category) {
    case categories[0]:
      archiveCategory = 1;
      break;

    case categories[1]:
      archiveCategory = 2;
      break;

    case categories[2]:
      archiveCategory = 3;
      break;

    case categories[3]:
      archiveCategory = 4;
      break;

    case categories[4]:
      archiveCategory = 5;
      break;

    default:
      return;
  }

  const slides = document.getElementById("slides" + archiveCategory);

  // create elements
  let container = document.createElement("li");
  let image = document.createElement("img");

  container.setAttribute("data-id", archiveId);

  let id = createId(category, title, place, year, month, day);
  image.src = getLinkToImage(id, category);
  image.onerror = function () {
    this.style.opacity = "0";
    this.style.width = "100px";
  };

  // todo: first use default image, then load real one
  // image.src =
  //   "https://img.freepik.com/premium-vector/image-placeholder-pictogram_764382-15451.jpg?size=626&ext=jpg";

  // append children
  container.appendChild(image);
  slides.appendChild(container);
}

function showArchiveTable(kategorie) {
  if (kategorie == null) return;

  for (let i = 1; i <= categories.length; i++) {
    document.getElementById("tableCategory" + i).style.display = "none";
    document.getElementById("slides" + i).style.display = "none";
    document.getElementById("tableButton" + i).classList.remove("active");
  }

  document.getElementById("tableCategory" + kategorie).style.display = "block";
  document.getElementById("slides" + kategorie).style.display = "flex";
  document.getElementById("tableButton" + kategorie).classList.add("active");

  currentArchiveCategory = kategorie;
}
