// === MAIN INITIALIZATION ===
window.addEventListener("DOMContentLoaded", () => {
  // Attach click handlers to desktop icons
  document.querySelectorAll(".desktop a").forEach(folder => {
    folder.addEventListener("click", e => {
      e.preventDefault();
      const folderId = folder.getAttribute("href").replace("#", "");
      const folderName = folder.querySelector("span").textContent;
      WindowManager.createWindow(folderId, folderName);
    });
  });

  // Open the default Welcome window
  WindowManager.createWindow("welcome", "Welcome");

  // Start button reloads the page
  const startButton = document.querySelector('.start-button button');
  if (startButton) {
    startButton.addEventListener('click', () => window.location.reload());
  }
});
