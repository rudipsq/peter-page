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
  let currentElement;
  if (element.nodeName === "DIV") {
    currentElement = element;
  } else {
    let parentElement = element.parentElement;
    currentElement = parentElement;
  }

  if (currentElement.getAttribute("data-id") == currentArchiveId) return;

  if (
    currentElement &&
    currentElement.parentElement &&
    currentElement.parentElement.id == "tableBody"
  ) {
    const currentId = currentElement.getAttribute("data-id");

    currentArchiveId = currentId;
    // console.log(currentId);
  }
}

//*
//* - - - - - fill table
//*
fillTable();

async function getJson() {
  try {
    let response = await fetch("data/arbeit.json");
    let jsonData = await response.json();
    const result = jsonData;

    return result;
  } catch (error) {
    console.error("Error fetching or parsing JSON:", error);
    return null;
  }
}

async function fillTable() {
  const json = await getJson();
  // console.log(json);

  Object.keys(json).forEach((key) => {
    const element = json[key];
    buildTableRow(key, element.name, element.category, element.year);
  });
}

function buildTableRow(archiveId, title = "-", category = "-", year = "-") {
  const table = document.getElementById("tableBody");

  // create elements
  let rowDiv = document.createElement("div");

  let col1 = document.createElement("h3");
  let col2 = document.createElement("p");
  let col3 = document.createElement("p");

  // fill elements
  col1.innerHTML = title;
  col2.innerHTML = category;
  col3.innerHTML = year;

  rowDiv.setAttribute("data-id", archiveId);

  // append children
  rowDiv.appendChild(col1);
  rowDiv.appendChild(col2);
  rowDiv.appendChild(col3);

  table.appendChild(rowDiv);
}
