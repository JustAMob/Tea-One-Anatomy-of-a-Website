
const TaskbarManager = (() => {
  const taskbar = document.getElementById("task-buttons");

  if (!taskbar) {
    console.error("❌ Taskbar element with ID 'task-buttons' not found.");
  } else {
    console.log("✅ TaskbarManager initialized successfully.");
  }

  function createButton(id, title, onClick) {
    if (!taskbar) {
      console.error("⚠️ Cannot create button — taskbar element missing.");
      return null;
    }
    if (!id || !title) {
      console.warn("⚠️ createButton called with missing parameters:", { id, title });
    }

    const existingBtn = document.querySelector(`.task-button[data-id="${id}"]`);
    if (existingBtn) {
      console.warn(`⚠️ Task button with id '${id}' already exists.`);
      return existingBtn;
    }

    const taskBtn = document.createElement("button");
    taskBtn.classList.add("task-button", "active");
    taskBtn.textContent = title;
    taskBtn.dataset.id = id;

    taskBtn.setAttribute("role", "button");
    taskBtn.setAttribute("aria-pressed", "false");
    taskBtn.setAttribute("tabindex", "0");

    if (typeof onClick === "function") {
      taskBtn.addEventListener("click", onClick);
    } else {
      console.warn(`⚠️ onClick is not a function for task button '${id}'.`);
    }

    taskbar.appendChild(taskBtn);
    console.log(`🆕 Created task button: ${title} (id: ${id})`);
    return taskBtn;
  }

  function activateButton(id) {
    const btn = document.querySelector(`.task-button[data-id="${id}"]`);
    if (btn) btn.classList.add("active");
  }

  function deactivateButton(id) {
    const btn = document.querySelector(`.task-button[data-id="${id}"]`);
    if (btn) btn.classList.remove("active");
  }

  function removeButton(id) {
    const btn = document.querySelector(`.task-button[data-id="${id}"]`);
    if (btn) btn.remove();
  }

  return { createButton, activateButton, deactivateButton, removeButton };
})();
