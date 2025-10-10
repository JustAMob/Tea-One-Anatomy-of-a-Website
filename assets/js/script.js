function updateTime() {
    document.getElementById('currentTime').textContent = new Date().toLocaleTimeString();
}
setInterval(updateTime, 1000);
updateTime();

 // === WINDOW CONTROL FUNCTIONS ===

// Open window by ID
function openWindow(id) {
  const win = document.getElementById(id);
  if (win) win.classList.remove("hidden");
}

// Close window
function closeWindow(btn) {
  const win = btn.closest(".window");
  if (win) win.classList.add("hidden");
}

// Minimize (toggle visibility of window body)
function minimizeWindow(btn) {
  const win = btn.closest(".window");
  const body = win?.querySelector(".window-body");
  if (body) {
    body.style.display = body.style.display === "none" ? "block" : "none";
  }
}

// Maximize (toggle fullscreen-like mode)
function maximizeWindow(btn) {
  const win = btn.closest(".window");
  if (!win) return;

  if (!win.classList.contains("maximized")) {
    // Save previous position and size
    win.dataset.oldPos = JSON.stringify({
      top: win.style.top,
      left: win.style.left,
      width: win.style.width,
      height: win.style.height,
    });
    // Expand to full screen
    Object.assign(win.style, {
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
    });
    win.classList.add("maximized");
  } else {
    // Restore old position and size
    const old = JSON.parse(win.dataset.oldPos);
    Object.assign(win.style, old);
    win.classList.remove("maximized");
  }
}

// === DRAG FUNCTIONALITY ===

let currentWindow = null;
let offsetX = 0, offsetY = 0;

function dragStart(e, win) {
  if (win.classList.contains("maximized")) return; // can't drag when maximized

  currentWindow = win;
  offsetX = e.clientX - win.offsetLeft;
  offsetY = e.clientY - win.offsetTop;

  document.addEventListener("mousemove", dragMove);
  document.addEventListener("mouseup", dragEnd);
}

function dragMove(e) {
  if (!currentWindow) return;
  e.preventDefault();

  // Calculate new position
  let x = e.clientX - offsetX;
  let y = e.clientY - offsetY;

  // Keep window inside viewport
  const maxX = window.innerWidth - currentWindow.offsetWidth;
  const maxY = window.innerHeight - currentWindow.offsetHeight;

  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x > maxX) x = maxX;
  if (y > maxY) y = maxY;

  Object.assign(currentWindow.style, {
    left: `${x}px`,
    top: `${y}px`,
    transform: "none", // remove center transform when dragging
  });
}

function dragEnd() {
  document.removeEventListener("mousemove", dragMove);
  document.removeEventListener("mouseup", dragEnd);
  currentWindow = null;
}