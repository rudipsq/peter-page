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
  if (element.nodeName === "DIV") {
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
setupTable();

async function setupTable() {
  // const googleSheetUrl =
  //   "https://docs.google.com/spreadsheets/d/e/2PACX-1vRVIgmmtpTzJ5Zse_dLA-mp1FHmnkasYJisZrEBKb0Bpu37TO173hqGJiJsM32L8LPQShAWvFVnswl9/pub?output=csv";
  const googleSheetUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQYASdgJMRy6udLuHkgb7XaM4_WIX0ofU8l2W8z8NH_DopOt-KbOnXWCfO8tfs9Sh9pDOM7ApD82gGx/pub?output=csv";

  const data = await fetchGoogleSheet(googleSheetUrl);

  if (!data) {
    // ? does this error work?
    console.error("failed to load archive items");
    return;
  }

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
      buildTableRow(
        item[tabelle.id],
        item[tabelle.bezeichnung],
        item[tabelle.kategorie],
        item[tabelle.jahr],
        item[tabelle.monat],
        item[tabelle.tag],
        item[tabelle.ort]
      );

      addImage(item[tabelle.id], item[tabelle.kategorie]);
    }
  });
}

function buildTableRow(
  archiveId,
  title = "-",
  category = "-",
  year = "-",
  month = "-",
  day = "-",
  place = "-"
) {
  let table;

  switch (category) {
    case "Papsturkunden":
      table = document.getElementById("tableCategory1");
      break;

    case "Kardinalablass":
      table = document.getElementById("tableCategory2");
      break;

    case "Bischofablass":
      table = document.getElementById("tableCategory3");
      break;

    default:
      return;
  }

  // create elements
  let rowDiv = document.createElement("div");

  let col1 = document.createElement("a");
  let col2 = document.createElement("p");
  let col3 = document.createElement("p");
  let col4 = document.createElement("p");
  let col5 = document.createElement("p");

  // fill elements
  let titleElement = document.createElement("h3");

  col1.innerHTML = title;
  // titleElement.innerHTML = title;
  // col2.innerHTML = category;
  col2.innerHTML = place;
  col3.innerHTML = year;
  col4.innerHTML = month.substring(0, 3);
  col5.innerHTML = day;

  rowDiv.setAttribute("data-id", archiveId);
  // col1.appendChild(titleElement);
  col1.href = getLinkToPdf(archiveId, category);
  col1.target = "_blank";

  // append children
  rowDiv.appendChild(col1);
  // rowDiv.appendChild(titleElement);
  rowDiv.appendChild(col2);
  rowDiv.appendChild(col5);
  rowDiv.appendChild(col4);
  rowDiv.appendChild(col3);

  table.appendChild(rowDiv);
}

function getLinkToPdf(archiveId, category) {
  if (!archiveId || archiveId == "") {
    return "./not_found.html";
  }

  if (!category || category == "") {
    return "./not_found.html";
  }

  let type = category.toLowerCase();

  let link = `./data/archiv/${type}/${archiveId}.pdf`;
  return link;
}

function getLinkToImage(archiveId, category) {
  if (!archiveId || archiveId == "") {
    // return;
    archiveId = "error";
  }

  if (!category || category == "") {
    return;
  }

  let type = category.toLowerCase();

  let link = `./img/archiv/${type}/${archiveId}.png`;
  return link;
}

function addImage(archiveId, category) {
  switch (category) {
    case "Papsturkunden":
      archiveCategory = 1;
      break;

    case "Kardinalablass":
      archiveCategory = 2;
      break;

    case "Bischofablass":
      archiveCategory = 3;
      break;

    default:
      return;
  }

  const slides = document.getElementById("slides" + archiveCategory);

  // create elements
  let container = document.createElement("li");
  let image = document.createElement("img");

  container.setAttribute("data-id", archiveId);

  image.src = getLinkToImage(archiveId, category);

  // todo: first use default image, then load real one
  // image.src =
  //   "https://img.freepik.com/premium-vector/image-placeholder-pictogram_764382-15451.jpg?size=626&ext=jpg";

  // append children
  container.appendChild(image);
  slides.appendChild(container);
}

function showArchiveTable(kategorie) {
  if (kategorie == null) return;

  for (let i = 1; i <= 3; i++) {
    document.getElementById("tableCategory" + i).style.display = "none";
    document.getElementById("slides" + i).style.display = "none";
    document.getElementById("tableButton" + i).classList.remove("active");
  }

  document.getElementById("tableCategory" + kategorie).style.display = "block";
  document.getElementById("slides" + kategorie).style.display = "flex";
  document.getElementById("tableButton" + kategorie).classList.add("active");

  currentArchiveCategory = kategorie;
}
