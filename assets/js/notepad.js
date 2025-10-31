// === NOTEPAD MODULE ===

// Ensure this module is accessible in the global scope
const NotepadModule = (() => {
  function saveFile() {
    try {
      const text = document.getElementById("notepadTextArea").value;
      let fileName = prompt("Enter a file name:", "New Text Document");

      if (fileName === null) return;
      if (!fileName.endsWith(".txt")) fileName += ".txt";

      const blob = new Blob([text], { type: "text/plain" });
      const downloadLink = document.createElement("a");
      
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = fileName;
      
      // Temporarily attach link to the DOM before clicking
      document.body.appendChild(downloadLink);
      
      // Trigger the download
      downloadLink.click();
      
      // Clean up the DOM and the object URL
      document.body.removeChild(downloadLink);
      setTimeout(() => URL.revokeObjectURL(downloadLink.href), 100);

    } catch (err) {
      console.error("Notepad save failed:", err);
      alert("Could not save file. Please try again.");
    }
  }

  return { saveFile };
})();