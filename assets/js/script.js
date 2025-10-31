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

  /*ACCESSIBILITY NAV*/

  document.addEventListener('keydown', handleArrowNavigation);

  function handleArrowNavigation(e) {
    // --- 1. Define All Navigable Selectors ---
    
    // Selects ALL focusable elements in the desktop/taskbar/active window
    const allNavigableSelector = 
        // Desktop Icons
        '.desktop-icon-link, ' +
        // Taskbar Buttons
        '.start-button button, .task-buttons button, ' +
        // Active Window Controls
        '.window.active .window-controls button, ' +
        // Active Window Menu Links (a) and focusable items (tabindex="0")
        '.window.active .window-menu a, ' +
        '.window.active .window-menu [tabindex="0"], ' + 
        // Active Window Body (if focusable, typically done with tabindex="0")
        '.window.active .window-body[tabindex="0"]'; 
    
    // --- 2. Build the Dynamic Target List ---
    const allTargets = Array.from(document.querySelectorAll(allNavigableSelector));
    const focusedElement = document.activeElement;
    
    // Only proceed if a known element is focused
    if (!allTargets.includes(focusedElement)) return; 

    // Only process arrow keys
    if (e.key.startsWith('Arrow')) {
        e.preventDefault(); 

        const totalTargets = allTargets.length;
        const currentIndex = allTargets.indexOf(focusedElement);
        let nextIndex = -1;

        switch (e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                // Move forward (Right/Down)
                nextIndex = currentIndex + 1;
                if (nextIndex >= totalTargets) nextIndex = 0; // Wrap to beginning
                break;

            case 'ArrowUp':
            case 'ArrowLeft':
                // Move backward (Left/Up)
                nextIndex = currentIndex - 1;
                if (nextIndex < 0) nextIndex = totalTargets - 1; // Wrap to end
                break;
        }

        // Apply focus
        if (nextIndex >= 0 && nextIndex < totalTargets) {
            allTargets[nextIndex].focus();
        }
    }
  }

  function handleGlobalShortcuts(e) {
    const focusedElement = document.activeElement;
    const activeWindow = document.querySelector('.window.active');
    const key = e.key.toLowerCase();

    
    // A. PRIORITY INTERCEPTION 
    
    if (e.ctrlKey) {
        // Stop browser default action immediately for W, M, R, T, and Tab
        if (key === 'w' || key === 'm' || key === 'r' || key === 't' || key === 'tab') {
            e.preventDefault(); 
        }

        // --- Ctrl + R (Global Refresh) ---
        if (key === 'r') {
            window.location.reload(); 
            return;
        }

        // --- WINDOW MANAGEMENT SHORTCUTS ---
        if (activeWindow) {
            switch (key) {
                case 'w': // Ctrl + W: Close Active Window
                    
                    WindowManager.close(activeWindow);
                    return;
                
                case 'm': // Ctrl + M: Minimize Active Window
                    
                    WindowManager.minimize(activeWindow);
                    return;
                    
                case 'tab': // Ctrl + Tab (Cycle Windows)
                    cycleWindows(activeWindow);
                    return;
            }
        }
        
        // --- Ctrl + T (Task Manager/Utility) ---
        if (key === 't') {
            WindowManager.createWindow('myComputer', 'Task Manager');
            return;
        }
    }


   
    // B. HANDLE ACTIVATION (Enter / Space)
    
    if (key === 'Enter' || key === ' ') {
        if (focusedElement && focusedElement.closest('.desktop-icon-link, button, a')) {
            e.preventDefault();
            focusedElement.click(); 
            return; 
        }
    }
  }

  function cycleWindows(currentActiveWindow) {
    
    const allWindows = Array.from(document.querySelectorAll('.window:not(.hidden)'));
    
    if (allWindows.length < 2) return; // Nothing to cycle if only one or zero windows

    const currentIndex = allWindows.indexOf(currentActiveWindow);
    // Calculate the next window index, wrapping to the start (0)
    const nextIndex = (currentIndex + 1) % allWindows.length;
    
    const nextWindow = allWindows[nextIndex];
    
    // Bring the next window to the front and make it active
    WindowManager.bringToFront(nextWindow);
    
    // Optional: Focus the window body or title bar for keyboard users
    nextWindow.focus(); 
  }


});
