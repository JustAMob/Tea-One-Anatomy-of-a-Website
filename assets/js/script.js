// === CLOCK FUNCTION ===
function updateTime() {
    const now = new Date();

    // 1. Time options 
    const timeOptions = {
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true
    };
    const currentTimeString = now.toLocaleTimeString('en-US', timeOptions);

    // 2. Date options 
    const dateOptions = {
        month: '2-digit', // e.g., 10
        day: '2-digit',   // e.g., 19
        year: 'numeric'   // e.g., 2025
    };
    const currentDateString = now.toLocaleDateString('en-US', dateOptions);

    // 3. Update the HTML elements )
    const timeElement = document.getElementById('currentTime');
    const dateElement = document.getElementById('currentDate');

    if (timeElement) timeElement.textContent = currentTimeString;
    if (dateElement) dateElement.textContent = currentDateString;
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

  // 1. Start the fade-out animation
    win.style.opacity = '0';
    
    // 2. Wait for the fade (150ms) before removing the element
    setTimeout(() => {
        win.remove(); 
    }, 150);

  // remove from taskbar
  const id = win.dataset.id;
  const taskBtn = document.querySelector(`.task-button[data-id="${id}"]`);
  if (taskBtn) taskBtn.remove();


  const iconLink = getIconLink(id);
    if (iconLink) {
        iconLink.classList.remove("active");
    }
}

// Minimize (toggle visibility of window body)
function minimizeWindow(btn) {
    const win = btn.closest(".window") || btn; 
    if (!win || !win.classList || !win.style || win.dataset.id === undefined) return; 

    //  Start the animation process
    win.classList.add('animated'); 
    win.style.opacity = '0';
    
    // Wait for the fade (150ms) before hiding display
    setTimeout(() => {
        win.style.display = 'none';
        
        // Cleanup and reset for restore
        win.style.opacity = '1'; 
        win.classList.remove('animated'); 
    }, 150);
    
    // Deactivate the taskbar button immediately
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
        // --- MAXIMIZE LOGIC ---
        
        // 1. Save previous position/size
        win.dataset.oldPos = JSON.stringify({
            top: win.style.top,
            left: win.style.left,
            width: win.style.width,
            height: win.style.height,
            transform: win.style.transform || 'translate(-50%, -50%)', 
        });
        
        // 2. Add the animation class BEFORE changing styles
        win.classList.add("animated");
        
        // 3. Add the maximized class (applies the full-screen CSS)
        win.classList.add("maximized");

        // 4. Remove inline positioning to let the CSS class take over
        win.style.top = '';
        win.style.left = '';
        win.style.width = '';
        win.style.height = '';
        win.style.transform = '';

        // 5. Remove the animation class after the transition finishes
        setTimeout(() => {
            win.classList.remove("animated");
        }, 300); // 300ms matches the CSS transition duration

    } else {
        // --- RESTORE LOGIC ---
        
        // 1. Add the animation class BEFORE restoring styles
        win.classList.add("animated");

        // 2. Restore old position and size
        win.classList.remove("maximized");
        if (win.dataset.oldPos) {
            const old = JSON.parse(win.dataset.oldPos);
            Object.assign(win.style, old); 
        }

        // 3. Remove the animation class after the transition finishes
        setTimeout(() => {
            win.classList.remove("animated");
        }, 300); // 300ms matches the CSS transition duration
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


  // --- NEW FADE-IN LOGIC START ---

  // 1. Prepare for transition / add class
  newWin.classList.add("animated");
    
  // 2. Start state: Set opacity to 0
  newWin.style.opacity = '0'; 

  // 3. (Rest of setup)
    


  // Update window title
  const titleSpan = newWin.querySelector(".window-title") || newWin.querySelector(".title");
  if (titleSpan) titleSpan.textContent = `${title} - Brewser T1.0.0`;

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

  // (4.) Add window to page
  document.body.appendChild(newWin);
    
  // 5. Final state -- Set opacity to 1 immediately after adding to DOM

  setTimeout(() => {
        newWin.style.opacity = '1'; 
        
        // 6. Clean up, Remove the animated class after the fade is complete (150ms)
       
        setTimeout(() => {
            newWin.classList.remove("animated");
        }, 150);

  }, 10);

  // Create taskbar button
  const taskBtn = document.createElement("button");
  taskBtn.classList.add("task-button", "active");
  taskBtn.textContent = title;
  taskBtn.dataset.id = id;
  taskbar.appendChild(taskBtn);

  // Clicking taskbar button toggles visibility
  taskBtn.addEventListener("click", () => {
    if (newWin.style.display === "none") {
      
      // --- FADE-IN LOGIC ---
        
        newWin.classList.add("animated");
        newWin.style.display = "flex";
        newWin.style.opacity = '0';
        
        setTimeout(() => {
           
            newWin.style.opacity = '1'; 
            
            setTimeout(() => {
                newWin.classList.remove("animated");
            }, 150);
        }, 15
      ); 
        
        // --- END FADE-IN LOGIC ---


      bringToFront(newWin);
      taskBtn.classList.add("active");

    } else {
      minimizeWindow(newWin);
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

// === START BUTTON REFRESH LOGIC ===
window.addEventListener("DOMContentLoaded", () => {
    
    const startButton = document.querySelector('.start-button button'); 

    if (startButton) {
        startButton.addEventListener('click', () => {
            
            window.location.reload(); 
        });
    }
});

function saveNotepadFile() {
  const text = document.getElementById("notepadTextArea").value;
  let fileName = prompt("Enter a file name:", "New Text Document");

  if (fileName === null) return; // Cancel saving

  if (!fileName.endsWith(".txt")) {
    fileName += ".txt"; // Automatically add .txt
  }

  const blob = new Blob([text], { type: "text/plain" });
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = fileName;
  downloadLink.click();
}






