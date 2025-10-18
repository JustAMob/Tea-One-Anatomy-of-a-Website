// === CLOCK FUNCTION ===
function updateTime() {

  const options = {
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true
    };

  document.getElementById('currentTime').textContent = new Date().toLocaleTimeString('en-US', options);
}


setInterval(updateTime, 1000);
updateTime();


// === WINDOW CONTROL FUNCTIONS ===

// Open window by ID
function openWindow(id) {
  const win = document.getElementById(id);
  if (win) win.classList.remove("hidden");
}

// Helper function to find the desktop icon link associated with a window ID
function getIconLink(windowId) { 
    
    const iconHref = `#${windowId}`; 
    return document.querySelector(`.desktop a[href="${iconHref}"]`);
}


// Close window
function closeWindow(btn) {
  const win = btn.closest(".window");
  if (!win) return;

  // remove from taskbar
  const id = win.dataset.id;
  const taskBtn = document.querySelector(`.task-button[data-id="${id}"]`);
  if (taskBtn) taskBtn.remove();


  const iconLink = getIconLink(id);
    if (iconLink) {
        iconLink.classList.remove("active");
    }

  win.remove();
}

// Minimize (toggle visibility of window body)
function minimizeWindow(btn) {
  const win = btn.closest(".window");
  if (!win) return;

  // Hide the entire window
  win.style.display = "none";

  // Deactivate the taskbar button
  const id = win.dataset.id;
  const taskBtn = document.querySelector(`.task-button[data-id="${id}"]`);
  if (taskBtn) {
    taskBtn.classList.remove("active");
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
      width: "100.1vw",
      height: "calc(100vh - 50px)",

      transform: "none",
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

  // Bring to front
  win.style.zIndex = ++zCounter;

  document.addEventListener("mousemove", dragMove);
  document.addEventListener("mouseup", dragEnd);
}

function dragMove(e) {
  if (!currentWindow) return;
  e.preventDefault();

  let x = e.clientX - offsetX;
  let y = e.clientY - offsetY;

  const maxX = window.innerWidth - currentWindow.offsetWidth;
  const maxY = window.innerHeight - currentWindow.offsetHeight;

  if (x < 0) x = 0;
  if (y < 0) y = 0;
  if (x > maxX) x = maxX;
  if (y > maxY) y = maxY;

  Object.assign(currentWindow.style, {
    left: `${x}px`,
    top: `${y}px`,
    transform: "none",
  });
}

function dragEnd() {
  document.removeEventListener("mousemove", dragMove);
  document.removeEventListener("mouseup", dragEnd);
  currentWindow = null;
}

// === MULTI-WINDOW + TASKBAR LOGIC ===
const taskbar = document.getElementById("task-buttons");
let zCounter = 100;

// When a folder is clicked on the desktop
document.querySelectorAll(".desktop a").forEach(folder => {
  folder.addEventListener("click", e => {
    e.preventDefault();
    const folderId = folder.getAttribute("href").replace("#", "");
    const folderName = folder.querySelector("span").textContent;
    createWindow(folderId, folderName);
  });
});

// Create a new window from the template
function createWindow(id, title) {
  // Check if the window is already open
  let existingWindow = document.querySelector(`.window[data-id="${id}"]`);
  if (existingWindow) {
    // If it's hidden, show it again
    if (existingWindow.style.display === "none") {
      existingWindow.style.display = "flex";
      const taskBtn = document.querySelector(`.task-button[data-id="${id}"]`);
      if (taskBtn) taskBtn.classList.add("active");
    }
    bringToFront(existingWindow);
    return;
  }

  // Use the permanent hidden template as the clone source
  const template = document.getElementById("windowTemplate");
  if (!template) {
    console.error("Missing #windowTemplate in HTML!");
    return;
  }

  const newWin = template.cloneNode(true);
  newWin.classList.remove("hidden");
  newWin.id = `${id}-window`;
  newWin.dataset.id = id;

  // Update window title
  const titleSpan = newWin.querySelector(".window-title") || newWin.querySelector(".title");
  if (titleSpan) titleSpan.textContent = `${title} - Microsoft Internet Explorer`;

  // Randomized positioning (so they don't overlap exactly)
  newWin.style.top = `${100 + Math.random() * 100}px`;
  newWin.style.left = `${200 + Math.random() * 100}px`;
  newWin.style.zIndex = ++zCounter;
  newWin.style.transform = "none";

  // Inject specific folder content
  const body = newWin.querySelector(".window-body");
  if (body) {
    const content = document.getElementById(id);
    body.innerHTML = content ? content.innerHTML : `<p>No content found for ${title}.</p>`;
  }

  // Add window to page
  document.body.appendChild(newWin);
  

  // Create taskbar button
  const taskBtn = document.createElement("button");
  taskBtn.classList.add("task-button", "active");
  taskBtn.textContent = title;
  taskBtn.dataset.id = id;
  taskbar.appendChild(taskBtn);

  // Clicking taskbar button toggles visibility
  taskBtn.addEventListener("click", () => {
    if (newWin.style.display === "none") {
      newWin.style.display = "flex";
      bringToFront(newWin);
      taskBtn.classList.add("active");
    } else {
      newWin.style.display = "none";
      taskBtn.classList.remove("active");
    }
  });

  // Add close button functionality (so taskbar button also clears)
  const closeBtn = newWin.querySelector(".window-controls button:last-child");
  if (closeBtn) {
    // Now calls the main closeWindow function which handles both the icon and taskbar cleanup
    closeBtn.addEventListener("click", () => {
        closeWindow(closeBtn); 
    });
}

  const iconLink = getIconLink(id);
    if (iconLink) {
        iconLink.classList.add("active"); 
    }

  bringToFront(newWin);
}

// Bring window to front
function bringToFront(win) {
  document.querySelectorAll(".window").forEach(w => w.classList.remove("active"));
  win.classList.add("active");
  win.style.zIndex = ++zCounter;
}

// === INITIALIZE DEFAULT WINDOW TASKBAR BUTTON ===
window.addEventListener("DOMContentLoaded", () => {
  // Open the default Welcome window using the same template logic
  createWindow("welcome", "Welcome");
});





