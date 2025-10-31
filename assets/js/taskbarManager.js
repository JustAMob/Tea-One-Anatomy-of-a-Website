const TaskbarManager = (() => {
  const taskbar = document.getElementById("task-buttons");

  function createButton(id, title, onClick) {
    const taskBtn = document.createElement("button");
    taskBtn.classList.add("task-button", "active");

    taskBtn.textContent = title;
    taskBtn.dataset.id = id;

    taskBtn.setAttribute('role', 'button'); 
    taskBtn.setAttribute('aria-pressed', 'false');

    taskBtn.setAttribute('tabindex', '0');

    taskBtn.addEventListener("click", onClick);
    taskbar.appendChild(taskBtn);
    return taskBtn;
  }

  function activateButton(id) {
    try {
      const btn = document.querySelector(`.task-button[data-id="${id}"]`);
      if (btn) btn.classList.add("active");
    } catch (err) {
      console.error(`TaskbarManager.activateButton failed for ${id}:`, err);
    }
  }

  function deactivateButton(id) {
    try {
      const btn = document.querySelector(`.task-button[data-id="${id}"]`);
      if (btn) btn.classList.remove("active");
    } catch (err) {
      console.error(`TaskbarManager.deactivateButton failed for ${id}:`, err);
    }
  }

  function removeButton(id) {
    try {
      const btn = document.querySelector(`.task-button[data-id="${id}"]`);
      if (btn) btn.remove();
    } catch (err) {
      console.error(`TaskbarManager.removeButton failed for ${id}:`, err);
    }
  }

  return { createButton, activateButton, deactivateButton, removeButton };
})();
