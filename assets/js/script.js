function updateTime() {
    document.getElementById('currentTime').textContent = new Date().toLocaleTimeString();
}
setInterval(updateTime, 1000);
updateTime();

// let offsetX, offsetY, currentWindow;

// function dragStart(e, win) {
//   currentWindow = win;
//   offsetX = e.clientX - win.offsetLeft;
//   offsetY = e.clientY - win.offsetTop;

//   document.addEventListener("mousemove", dragMove);
//   document.addEventListener("mouseup", dragEnd);
// }

// function dragMove(e) {
//   if (!currentWindow) return;

//   currentWindow.style.left = e.clientX - offsetX + "px";
//   currentWindow.style.top = e.clientY - offsetY + "px";
// }

// function dragEnd() {
//   document.removeEventListener("mousemove", dragMove);
//   document.removeEventListener("mouseup", dragEnd);
//   currentWindow = null;
// }