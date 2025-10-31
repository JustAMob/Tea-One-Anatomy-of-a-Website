const WindowManager = (() => {
  let zCounter = 100;
  let currentWindow = null;
  let offsetX = 0, offsetY = 0;
  
  
  const template = document.querySelector(".window.template");
  if (!template) {
      console.error("Window template is missing from the DOM!");
      // Fallback - This should ideally not happen if HTML is correct
      return { createWindow: () => console.error("Template missing") }; 
  }


  console.log("✅ WindowManager initialized.");

  function bringToFront(win) {
    try {
      document.querySelectorAll(".window").forEach(w => w.classList.remove("active"));
      win.classList.add("active");
      win.style.zIndex = ++zCounter;
    } catch (err) {
      console.error("WindowManager.bringToFront failed:", err);
    }
  }

  function activateIcon(id) {
    const iconLink = document.querySelector(`.desktop a[href="#${id}"]`);
    if (iconLink) iconLink.classList.add("active");
  }

  function deactivateIcon(id) {
    try {
      const iconLink = document.querySelector(`.desktop a[href="#${id}"]`);
      if (iconLink) iconLink.classList.remove("active");
    } catch (err) {
      console.error(`WindowManager.deactivateIcon failed for ${id}:`, err);
    }
  }

  function fadeIn(win) {
    win.classList.add("animated");
    win.style.display = "flex";
    win.style.opacity = '0';
    setTimeout(() => {
      win.style.opacity = '1';
      win.classList.remove("animated");
    }, 150);
  }
  
  // Minimize must be defined before createWindow uses it
  function minimize(win) {
    if (!win) return;

    win.classList.add("animated");
    win.style.opacity = '0';
    setTimeout(() => {
      win.style.display = 'none';
      win.style.opacity = '1';
      win.classList.remove("animated");
    }, 150);

    
    TaskbarManager.deactivateButton(win.dataset.id); 
    deactivateIcon(win.dataset.id);
  }

    if (!win) {
      console.warn("⚠️ bringToFront called with invalid window:", win);
      return;
    }
    document.querySelectorAll(".window").forEach(w => w.classList.remove("active"));
    win.classList.add("active");
    win.style.zIndex = ++zCounter;
    console.log(`🧱 Brought window '${win.dataset.id}' to front (z-index: ${zCounter}).`);
  }

  function createWindow(id, title) {
    if (!id || !title) {
      console.error("❌ createWindow called with missing parameters:", { id, title });
      return;
    }

    let existingWindow = document.querySelector(`.window[data-id="${id}"]`);
    if (existingWindow) {
      console.log(`♻️ Reopening existing window: ${id}`);
      if (existingWindow.style.display === "none") {
        fadeIn(existingWindow);
        
        TaskbarManager.activateButton(id); 
        activateIcon(id);
      }
      bringToFront(existingWindow);
      return; 
    }

    const template = document.getElementById("windowTemplate");
    if (!template) {
      console.error("❌ Missing window template element (#windowTemplate).");
      alert("System error: Missing window template.");
      return;
    }

    const newWin = template.cloneNode(true);
    newWin.classList.remove("hidden");
    newWin.id = `${id}-window`;
    newWin.dataset.id = id;

    const titleSpan = newWin.querySelector(".window-title");
    if (titleSpan) {
      titleSpan.textContent = `${title} - Brewser T1.0.0`;
    } else {
      console.warn(`⚠️ No title span found in template for window '${id}'.`);
    }

    Object.assign(newWin.style, {
      position: "fixed",
      transform: "none",
      top: `${100 + Math.random() * 100}px`,
      left: `${200 + Math.random() * 100}px`,
      zIndex: ++zCounter,
      opacity: "0"
    });

    const body = newWin.querySelector(".window-body");
    if (body) {
      body.setAttribute("tabindex", "0");
      const content = document.getElementById(id);
      if (content) {
        body.innerHTML = content.innerHTML;
      } else {
        console.warn(`⚠️ No content element found for window '${id}'.`);
        body.innerHTML = `<p>No content found for ${title}.</p>`;
      }
    } else {
      console.error(`❌ Missing .window-body in window template for '${id}'.`);
    }

    document.body.appendChild(newWin);
    console.log(`🪟 Created new window: ${title} (id: ${id})`);

    setTimeout(() => {
      newWin.style.opacity = "1";
      newWin.classList.remove("animated");
    }, 150);

    // Button events
    newWin.querySelector(".minimize-button")?.addEventListener("click", () => minimize(newWin));
    newWin.querySelector(".window-controls button:last-child")?.addEventListener("click", () => close(newWin));

    // Taskbar button creation
    TaskbarManager.createButton(id, title, () => {
      if (newWin.style.display === "none") {
        fadeIn(newWin);
        TaskbarManager.activateButton(id);
        activateIcon(id);
      } else {
        minimize(newWin);
      }
    });

    activateIcon(id);
    bringToFront(newWin);
  }

  function minimize(win) {
    if (!win) {
      console.warn("⚠️ minimize called with invalid window:", win);
      return;
    }

    console.log(`🟡 Minimizing window: ${win.dataset.id}`);
    win.classList.add("animated");
    win.style.opacity = "0";

    setTimeout(() => {
      win.style.display = "none";
      win.style.opacity = "1";
      win.classList.remove("animated");
    }, 150);

    TaskbarManager.deactivateButton(win.dataset.id);
    deactivateIcon(win.dataset.id);
  }

  function close(win) {
    if (!win) {
      console.warn("⚠️ close called with invalid window:", win);
      return;
    }

    console.log(`🗑️ Closing window: ${win.dataset.id}`);
    win.classList.add("animated");
    win.style.opacity = "0";

    setTimeout(() => {
      win.remove();
      console.log(`✅ Window '${win.dataset.id}' removed from DOM.`);
    }, 150);

    TaskbarManager.removeButton(win.dataset.id);
    deactivateIcon(win.dataset.id);
  }


  function maximize(btn) {
    const win = btn?.closest(".window");
    if (!win) {
      console.warn("⚠️ maximize called but no valid window found.");
      return;
    }

    win.classList.add("animated");

    if (!win.classList.contains("maximized")) {
      console.log(`🧭 Maximizing window: ${win.dataset.id}`);
      win.dataset.oldPos = JSON.stringify({
        top: win.style.top,
        left: win.style.left,
        width: win.style.width,
        height: win.style.height,
        transform: win.style.transform || "translate(-50%, -50%)"
      });
      win.classList.add("maximized");
      Object.assign(win.style, { top: "", left: "", width: "", height: "", transform: "" });
    } else {
      console.log(`↩️ Restoring window: ${win.dataset.id}`);
      win.classList.remove("maximized");
      if (win.dataset.oldPos) {
        Object.assign(win.style, JSON.parse(win.dataset.oldPos));
      }
    } 
   

    setTimeout(() => win.classList.remove("animated"), 300);
  }

  function dragStart(e, win) {
    if (!win) {
      console.warn("⚠️ dragStart called with invalid window.");
      return;
    }

    if (win.classList.contains("maximized")) return;

    const rect = win.getBoundingClientRect();
    currentWindow = win;
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    win.style.zIndex = ++zCounter;

    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", dragEnd);

    console.log(`🖱️ Started dragging window: ${win.dataset.id}`);
  }

  function dragMove(e) {
    if (!currentWindow) return;
    e.preventDefault();

    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    const maxX = window.innerWidth - currentWindow.offsetWidth;
    const maxY = window.innerHeight - currentWindow.offsetHeight;

    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    Object.assign(currentWindow.style, {
      left: `${x}px`,
      top: `${y}px`,
      transform: "none",
      position: "fixed"
    });
  }
  
  function dragEnd() {
    if (!currentWindow) return;
    console.log(`🖱️ Finished dragging window: ${currentWindow.dataset.id}`);
    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("mouseup", dragEnd);
    currentWindow = null;
  }

  function fadeIn(win) {
    if (!win) return;
    win.classList.add("animated");
    win.style.display = "flex";
    win.style.opacity = "0";

    setTimeout(() => {
      win.style.opacity = "1";
      win.classList.remove("animated");
      console.log(`✨ Faded in window: ${win.dataset.id}`);
    }, 150);
  }

  function activateIcon(id) {
    const iconLink = document.querySelector(`.desktop a[href="#${id}"]`);
    if (iconLink) {
      iconLink.classList.add("active");
      console.log(`💡 Activated icon: ${id}`);
    }
  }

  function deactivateIcon(id) {
    const iconLink = document.querySelector(`.desktop a[href="#${id}"]`);
    if (iconLink) {
      iconLink.classList.remove("active");
      console.log(`🔌 Deactivated icon: ${id}`);
    }
  }

  return { createWindow, close, minimize, maximize, bringToFront, dragStart };
})();