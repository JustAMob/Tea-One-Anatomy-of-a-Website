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
        fadeIn(existingWindow);
        TaskbarManager.activateButton(id);
        activateIcon(id);
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

    Object.assign(newWin.style, {
      position: "fixed",
      transform: "none",
      top: `${100 + Math.random() * 100}px`,
      left: `${200 + Math.random() * 100}px`,
      zIndex: ++zCounter,
      opacity: '0'
    });

    const body = newWin.querySelector(".window-body");
    if (body) {
    
      body.setAttribute('tabindex', '0');
    
      const content = document.getElementById(id);
      body.innerHTML = content ? content.innerHTML : `<p>No content found for ${title}.</p>`;
    }

    document.body.appendChild(newWin);
    setTimeout(() => {
      newWin.style.opacity = '1';
      newWin.classList.remove("animated");
    }, 150);

    newWin.querySelector(".minimize-button")?.addEventListener("click", () => minimize(newWin));
    newWin.querySelector(".window-controls button:last-child")?.addEventListener("click", () => close(newWin));


    newWin.querySelectorAll(".window-menu-link").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        const targetId = link.getAttribute("href").replace("#", "");
        const targetTitle = link.textContent;
        
        WindowManager.createWindow(targetId, targetTitle);
    });
    });

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

function minimize(btn) {
  const win = btn.closest(".window");
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

  function close(win) {
    win.classList.add("animated");
    win.style.opacity = '0';
    setTimeout(() => win.remove(), 150);
    TaskbarManager.removeButton(win.dataset.id);
    deactivateIcon(win.dataset.id);
  }

  function maximize(btn) {
    const win = btn.closest(".window");
    if (!win) return;

    win.classList.add("animated");

    if (!win.classList.contains("maximized")) {
      win.dataset.oldPos = JSON.stringify({
        top: win.style.top,
        left: win.style.left,
        width: win.style.width,
        height: win.style.height,
        transform: win.style.transform || 'translate(-50%, -50%)'
      });
      win.classList.add("maximized");
      Object.assign(win.style, { top: '', left: '', width: '', height: '', transform: '' });
    } else {
      win.classList.remove("maximized");
      if (win.dataset.oldPos) {
        Object.assign(win.style, JSON.parse(win.dataset.oldPos));
      }
    }

    setTimeout(() => win.classList.remove("animated"), 300);
  }

  function dragStart(e, win) {
    if (win.classList.contains("maximized")) return;
    const rect = win.getBoundingClientRect();
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

  function fadeIn(win) {
    win.classList.add("animated");
    win.style.display = "flex";
    win.style.opacity = '0';
    setTimeout(() => {
      win.style.opacity = '1';
      win.classList.remove("animated");
    }, 150);
  }

  function activateIcon(id) {
    const iconLink = document.querySelector(`.desktop a[href="#${id}"]`);
    if (iconLink) iconLink.classList.add("active");
  }

  function deactivateIcon(id) {
    const iconLink = document.querySelector(`.desktop a[href="#${id}"]`);
    if (iconLink) iconLink.classList.remove("active");
  }

  return { createWindow, close, minimize, maximize, bringToFront, dragStart };
})();
