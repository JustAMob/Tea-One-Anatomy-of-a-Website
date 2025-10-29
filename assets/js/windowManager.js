
// ===WINDOW MODULE===

const WindowManager = (() => {
  let zCounter = 100;
  let currentWindow = null;
  let offsetX = 0, offsetY = 0;

  function bringToFront(win) {
    document.querySelectorAll(".window").forEach(w => w.classList.remove("active"));
    win.classList.add("active");
    win.style.zIndex = ++zCounter;
  }

  function createWindow(id, title) {
    let existingWindow = document.querySelector(`.window[data-id="${id}"]`);
    if (existingWindow) {
      if (existingWindow.style.display === "none") {
        existingWindow.style.display = "flex";
        TaskbarManager.activateButton(id);
      }
      bringToFront(existingWindow);
      return;
    }

    const template = document.getElementById("windowTemplate");
    if (!template) {
      alert("System error: Missing window template.");
      return;
    }

    const newWin = template.cloneNode(true);
    newWin.classList.remove("hidden");
    newWin.id = `${id}-window`;
    newWin.dataset.id = id;

    const titleSpan = newWin.querySelector(".window-title");
    if (titleSpan) titleSpan.textContent = `${title} - Brewser T1.0.0`;

    // ✅ Explicit placement controlled by JS
    Object.assign(newWin.style, {
      position: "fixed",
      transform: "none",
      top: `${100 + Math.random() * 100}px`,
      left: `${200 + Math.random() * 100}px`,
      zIndex: ++zCounter
    });

    const body = newWin.querySelector(".window-body");
    if (body) {
      const content = document.getElementById(id);
      body.innerHTML = content ? content.innerHTML : `<p>No content found for ${title}.</p>`;
    }

    document.body.appendChild(newWin);

    // ✅ Taskbar button via TaskbarManager
    TaskbarManager.createButton(id, title, () => {
      if (newWin.style.display === "none") {
        newWin.style.display = "flex";
        bringToFront(newWin);
        TaskbarManager.activateButton(id);
      } else {
        minimize(newWin);
      }
    });

    bringToFront(newWin);
  }

  function close(btn) {
    const win = btn.closest(".window");
    if (!win) return;
    const id = win.dataset.id;

    win.style.opacity = '0';
    setTimeout(() => win.remove(), 150);

    TaskbarManager.removeButton(id);
  }

  function minimize(win) {
    win.style.display = "none";
    TaskbarManager.deactivateButton(win.dataset.id);
  }

  function maximize(btn) {
    const win = btn.closest(".window");
    if (!win) return;

    if (!win.classList.contains("maximized")) {
      win.dataset.oldPos = JSON.stringify({
        top: win.style.top,
        left: win.style.left,
        width: win.style.width,
        height: win.style.height
      });
      win.classList.add("maximized");
      Object.assign(win.style, { top: '', left: '', width: '', height: '' });
    } else {
      win.classList.remove("maximized");
      if (win.dataset.oldPos) {
        Object.assign(win.style, JSON.parse(win.dataset.oldPos), {
          position: "fixed",
          transform: "none"
        });
      }
    }
  }

  // === DRAGGING (with getBoundingClientRect) ===
  function dragStart(e, win) {
    if (win.classList.contains("maximized")) return;

    const rect = win.getBoundingClientRect(); // ✅ actual screen position
    currentWindow = win;
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

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
    document.removeEventListener("mousemove", dragMove);
    document.removeEventListener("mouseup", dragEnd);
    currentWindow = null;
  }

  return { createWindow, close, minimize, maximize, bringToFront, dragStart };
})();
