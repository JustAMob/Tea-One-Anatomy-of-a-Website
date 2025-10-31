# Tea-One-Anatomy-of-a-Website

https://docs.google.com/document/d/1xnYCpO7v4ILDnnMXc347BcunOSVGzQtVNufqHU_76tw/edit?usp=sharing

Project Plan Link:
https://docs.google.com/spreadsheets/d/1Pn_7R2CawjDPLB7WtN4AvJ9YMLsZwl6kXgulI6tbXQY/edit?usp=sharing

Anatomy of a Website Documentation:
https://docs.google.com/document/d/1F7rcCOyk7vuXymBs59z6Iy0kchBA2RffyzjcnU9Uhco/edit?usp=sharing

MO-IT161 WST | Milestone 1
HTML & CSS Template

C.J. Encillo, J.C. Cruz, K.I. Lu, M.Y. Samaniego, Q. Igdanes



File Structure Outline


/anatomy-of-a-website/
|-- index.html                 // The main desktop page, containing the full layout and all content.

|-- styles/                    // CSS files.
|   |-- bootstrap-custom.css   // Bootstrap customizations should be here.
|   |-- desktop-layout.css     // Styles for the main desktop, taskbar, and icons.
|   |-- window-styles.css      // Styles for the pop-up windows and their elements.
|   |-- content-styles.css     // Styles for the content inside the windows (text, lists, etc.).

|-- images/                    // All visual assets.
|   |-- icons/                 // The folder, trash bin, and My Computer icons.
|   |-- background.jpg         // The desktop wallpaper.
|   |-- diagrams/              // Image assets for the main anatomy diagram.

|-- scripts/                   // JavaScript files (for interactivity).
|   |-- main.js                // The core script to handle clicks, window states, and data.

|-- data/                      // A folder for JSON data.
|   |-- content.json           // "Database" of all text content and descriptions.




HTML File - Foundation

File: index.html

Purpose: This file will contain the complete structure of the website. It includes the main "desktop" container, the taskbar, and all the icons and folders designed in the wireframe.

It will also contain the HTML structure for all the pop-up "windows" that will hold content. These windows will be hidden by default using CSS and made visible with JavaScript later.

Division of Labor: Person/s assigned will be responsible for setting up the semantic HTML, adding comments to mark sections, and integrating the Bootstrap framework.


CSS Files


File: bootstrap-custom.css

Purpose: This file is for all the customizations to Bootstrap's default styles.

For example, if you want to change the font or color of a standard Bootstrap component, you would make that change here to override the default settings.

Division of Labor: This is a shared file. All team members can add their customizations here, but it should be managed carefully (especially when merging) to avoid overwriting each other's work.

File: desktop-layout.css

Purpose: This file will handle the overarching desktop aesthetic; it will style the background and position the taskbar and all the icons on the screen. It also includes hover effects for these elements.

Division of Labor: One or two team members can be assigned this file. This task focuses on positioning and layout rather than the content within the windows.

File: window-styles.css

Purpose: This file will control the appearance of the pop-up windows. It will style the window frames, title bars, and control buttons (minimize, maximize, close) to match your Windows XP-inspired design.


Division of Labor: One or two different team members can focus on this, working in parallel with the desktop-layout.css developers.

File: content-styles.css


Purpose: This file is for styling the content that appears inside the pop-up windows. This includes the text, headings, and the visual elements for HTML, CSS, and JavaScript as seen in the wireframe.

Division of Labor: This task is likely for the designer, to ensure a cohesive, aesthetic and readable look.



