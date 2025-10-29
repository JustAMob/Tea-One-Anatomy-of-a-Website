
  // === CLOCK MODULE ===
  
  const ClockModule = (() => {
    function updateTime() {
      try {
        const now = new Date();

        const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
        const dateOptions = { month: '2-digit', day: '2-digit', year: 'numeric' };

        const timeElement = document.getElementById('currentTime');
        const dateElement = document.getElementById('currentDate');

        if (timeElement) timeElement.textContent = now.toLocaleTimeString('en-US', timeOptions);
        if (dateElement) dateElement.textContent = now.toLocaleDateString('en-US', dateOptions);
      } catch (err) {
        console.error("Clock update failed:", err);
      }
    }

    setInterval(updateTime, 1000);
    updateTime();

    return { updateTime };
  })();