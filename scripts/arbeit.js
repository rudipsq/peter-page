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
  const container = document.getElementById("slides");
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

async function setupTable() {
  const json = await getJson();
  // console.log(json);

  Object.keys(json).forEach((key) => {
    const element = json[key];
    buildTableRow(key, element.name, element.category, element.year);
    addImage(key);
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

function addImage(archiveId) {
  const slides = document.getElementById("slides");

  // create elements
  let container = document.createElement("li");
  let image = document.createElement("img");

  container.setAttribute("data-id", archiveId);
  image.src = "./img/pic/archiv/" + archiveId + ".jpg";
  // image.src =
  //   "https://img.freepik.com/premium-vector/image-placeholder-pictogram_764382-15451.jpg?size=626&ext=jpg";

  // append children
  container.appendChild(image);
  slides.appendChild(container);
}
