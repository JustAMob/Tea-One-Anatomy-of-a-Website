function updateTime() {
    document.getElementById('currentTime').textContent = new Date().toLocaleTimeString();
}
setInterval(updateTime, 1000);
updateTime();