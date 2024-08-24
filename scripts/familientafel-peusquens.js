const imageContainer = document.getElementById("imageContainer");

// Load images (unchanged)
for (let i = 1; i <= 5; i++) {
  for (let j = 1; j <= 6; j++) {
    let image = document.createElement("img");
    image.src =
      "../img/familiengeschichte/familientafel-peusquens/" +
      j +
      "-" +
      i +
      ".webp";

    image.classList.add("tafelImage");
    imageContainer.appendChild(image);
  }
}

let scale = 1;
const maxScale = 10;
const minScale = 0.2;
const zoomIntensity = 0.1; // Adjust this to control zoom sensitivity

let translateX = 0,
  translateY = 0;
let isDragging = false;

function updateTransform() {
  imageContainer.style.transform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${scale})`;
}

function updateZoom(e) {
  e.preventDefault();
  const delta = Math.sign(e.deltaY) * -1;

  // Non-linear zooming
  const zoomFactor = Math.exp(delta * zoomIntensity);
  scale *= zoomFactor;

  // Clamp the scale within min and max bounds
  scale = Math.max(minScale, Math.min(maxScale, scale));

  updateTransform();
}

// The rest of the functions remain unchanged
function startDrag(e) {
  isDragging = true;
  startX = e.clientX - translateX;
  startY = e.clientY - translateY;
  imageContainer.classList.add("dragging");
}

function drag(e) {
  if (isDragging) {
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;
    updateTransform();
  }
}

function endDrag() {
  isDragging = false;
  imageContainer.classList.remove("dragging");
}

// Event listeners
document.addEventListener("wheel", updateZoom, { passive: false });

imageContainer.addEventListener("mousedown", startDrag);
document.addEventListener("mousemove", drag);
document.addEventListener("mouseup", endDrag);
document.addEventListener("mouseleave", endDrag);

// Double-click to reset zoom and position
document.addEventListener("dblclick", (e) => {
  e.preventDefault();
  scale = 1;
  translateX = 0;
  translateY = 0;
  updateTransform();
});
