// === MAIN INITIALIZATION ===
// All setup code runs once the DOM is fully loaded.
window.addEventListener("DOMContentLoaded", () => {
    
    // --- Existing Desktop Icon and Window Manager Setup ---
    
    // Attach click handlers to desktop icons
    document.querySelectorAll(".desktop a").forEach(folder => {
        folder.addEventListener("click", e => {
            e.preventDefault();
            const folderId = folder.getAttribute("href").replace("#", "");
            const folderName = folder.querySelector("span").textContent;
            // Assuming WindowManager is defined elsewhere in your project
            WindowManager.createWindow(folderId, folderName);
        });
    });

    // Open the default Welcome window (Assuming WindowManager is defined)
    WindowManager.createWindow("welcome", "Welcome");

    // Start button reloads the page
    const startButton = document.querySelector('.start-button button');
    if (startButton) {
        startButton.addEventListener('click', () => window.location.reload());
    }

    // --- LIGHTMODE TOGGLE INTEGRATION (The Fix) ---

    const themeToggleButton = document.getElementById('theme-toggle-button');

    if (themeToggleButton) {
        // 1. Load preference on startup
        const savedTheme = localStorage.getItem('theme');
        
        // Use system preference if no user preference is saved
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Determine the initial state
        let initialLightMode = false;
        
        if (savedTheme) {
             initialLightMode = savedTheme === 'light';
        } else {
             // If no saved theme, assume dark mode (matching your current system)
             // or you can set initialLightMode = !systemPrefersDark; 
             // We'll stick to a dark default for simplicity.
             initialLightMode = false;
        }

        if (initialLightMode) {
            document.body.classList.add('light-mode');
            themeToggleButton.textContent = '☀️'; // Set icon to Sun
        } else {
            // Default to Dark Mode
            themeToggleButton.textContent = '🌙'; // Set icon to Moon
        }
        
        // 2. Attach the click listener
        // Note: The toggleTheme function is defined below this listener block
        themeToggleButton.addEventListener('click', toggleTheme);
    }
    
    // --- ACCESSIBILITY AND KEYBOARD HANDLERS ---
    
    document.addEventListener('keydown', handleArrowNavigation);
    document.addEventListener('keydown', handleGlobalShortcuts); 
    // Added a separate listener for handleGlobalShortcuts for organization.
});

// === FUNCTION DEFINITIONS ===

// --- Theme Toggle Function ---
function toggleTheme() {
    const themeToggleButton = document.getElementById('theme-toggle-button');
    
    // Toggle the 'light-mode' class on the <body>
    const isLight = document.body.classList.toggle('light-mode');
    
    // 3. Update the icon and save preference
    if (isLight) {
        // Switched to Light Mode
        localStorage.setItem('theme', 'light');
        if (themeToggleButton) themeToggleButton.textContent = '☀️'; 
    } else {
        // Switched to Dark Mode
        localStorage.setItem('theme', 'dark');
        if (themeToggleButton) themeToggleButton.textContent = '🌙'; 
    }
}

// --- Your Existing Accessibility Functions (Cleaned for placement) ---

function handleArrowNavigation(e) {
    // --- 1. Define All Navigable Selectors ---
    const allNavigableSelector = 
        '.desktop-icon-link, ' +
        '.start-button button, .task-buttons button, ' +
        '.window.active .window-controls button, ' +
        '.window.active .window-menu a, ' +
        '.window.active .window-menu [tabindex="0"], ' + 
        '.window.active .window-body[tabindex="0"], ' +
        
        '#theme-toggle-button'; 
    
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
                nextIndex = currentIndex + 1;
                if (nextIndex >= totalTargets) nextIndex = 0; // Wrap to beginning
                break;

            case 'ArrowUp':
            case 'ArrowLeft':
                nextIndex = currentIndex - 1;
                if (nextIndex < 0) nextIndex = totalTargets - 1; // Wrap to end
                break;
        }

        if (nextIndex >= 0 && nextIndex < totalTargets) {
            allTargets[nextIndex].focus();
        }
    }
}

function handleGlobalShortcuts(e) {
    const focusedElement = document.activeElement;
    const activeWindow = document.querySelector('.window.active');
    const key = e.key.toLowerCase();
    
    const activeWindowBody = activeWindow ? activeWindow.querySelector('.window-body') : null;
    const scrollAmount = 100; 

    // A. HANDLE SCROLLING KEYS 
    if (activeWindowBody) {
        let scrollHandled = false;
        
        switch (e.key) {
            case 'PageDown':
                activeWindowBody.scrollTop += activeWindowBody.clientHeight; 
                scrollHandled = true;
                break;
            case 'PageUp':
                activeWindowBody.scrollTop -= activeWindowBody.clientHeight; 
                scrollHandled = true;
                break;
            case 'Home':
                activeWindowBody.scrollTop = 0; 
                scrollHandled = true;
                break;
            case 'End':
                activeWindowBody.scrollTop = activeWindowBody.scrollHeight; 
                scrollHandled = true;
                break;
        }

        if (scrollHandled) {
            e.preventDefault();
            return; 
        }
    }

    // B. PRIORITY INTERCEPTION (Existing Ctrl Logic)
    if (e.ctrlKey) {
        
        if (key === 'w' || key === 'm' || key === 'r' || key === 't' || key === 'tab') {
            e.preventDefault(); 
        }

        if (key === 'r') {
            window.location.reload(); 
            return;
        }

        if (activeWindow) {
            switch (key) {
                case 'w': // Ctrl + W: Close Active Window
                    const closeButton = activeWindow.querySelector('.window-controls button:last-child');
                    if (closeButton) {
                        closeButton.click();
                        return;
                    }
                    break;
                
                case 'm': // Ctrl + M: Minimize Active Window
                    const minimizeButton = activeWindow.querySelector('.window-controls button:first-child');
                    if (minimizeButton) {
                        minimizeButton.click();
                        return;
                    }
                    break;
                    
                case 'tab': // Ctrl + Tab (Cycle Windows)
                    cycleWindows(activeWindow);
                    return;
            }
        }
        
        if (key === 't') {
            // Assuming WindowManager is defined elsewhere
            WindowManager.createWindow('myComputer', 'Task Manager');
            return;
        }
    }

    // C. HANDLE ACTIVATION (Enter / Space)
    if (key === 'Enter' || key === ' ') {
        if (focusedElement && focusedElement.closest('.desktop-icon-link, button, a')) {
            e.preventDefault();
            focusedElement.click(); 
            return; 
        }
    }
}

function cycleWindows(currentActiveWindow) {
    // Assuming this function is called by handleGlobalShortcuts
    const allWindows = Array.from(document.querySelectorAll('.window:not(.hidden)'));
    
    if (allWindows.length < 2) return; 

    const currentIndex = allWindows.indexOf(currentActiveWindow);
    const nextIndex = (currentIndex + 1) % allWindows.length;
    
    const nextWindow = allWindows[nextIndex];
    
    // Assuming WindowManager.bringToFront is defined elsewhere
    WindowManager.bringToFront(nextWindow);
    
    nextWindow.focus(); 
}