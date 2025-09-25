function updateTime() {
    document.getElementById('currentTime').textContent = new Date().toLocaleTimeString();
}
setInterval(updateTime, 1000);
updateTime();
/* 
 function openWindow(id) {
      document.getElementById(id).classList.remove("hidden");
    }

    // Close window
    function closeWindow(btn) {
      btn.closest(".window").classList.add("hidden");
    }

    // Minimize (toggle body display)
    function minimizeWindow(btn) {
      let win = btn.closest(".window");
      let body = win.querySelector(".window-body");
      body.style.display = body.style.display === "none" ? "block" : "none";
    }

    // Maximize (toggle fullscreen-ish)
    function maximizeWindow(btn) {
      let win = btn.closest(".window");
      if (!win.classList.contains("maximized")) {
        win.dataset.oldPos = JSON.stringify({
          top: win.style.top,
          left: win.style.left,
          width: win.style.width,
          height: win.style.height
        });
        win.style.top = "0";
        win.style.left = "0";
        win.style.width = "100%";
        win.style.height = "100%";
        win.classList.add("maximized");
      } else {
        let old = JSON.parse(win.dataset.oldPos);
        win.style.top = old.top;
        win.style.left = old.left;
        win.style.width = old.width;
        win.style.height = old.height;
        win.classList.remove("maximized");
      }
    }

    // Drag functionality
    let offsetX, offsetY, currentWindow;

    function dragStart(e, win) {
      currentWindow = win;
      offsetX = e.clientX - win.offsetLeft;
      offsetY = e.clientY - win.offsetTop;
      document.addEventListener("mousemove", dragMove);
      document.addEventListener("mouseup", dragEnd);
    }

    function dragMove(e) {
      if (!currentWindow) return;
      currentWindow.style.left = e.clientX - offsetX + "px";
      currentWindow.style.top = e.clientY - offsetY + "px";
    }

    function dragEnd() {
      document.removeEventListener("mousemove", dragMove);
      document.removeEventListener("mouseup", dragEnd);
      currentWindow = null;
    }
    */