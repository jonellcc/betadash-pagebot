const startTime = new Date().getTime();

function updateUptime() {
    const now = new Date().getTime();
    const uptime = now - startTime;

    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((uptime % (1000 * 60)) / 1000);

    document.getElementById('uptime').innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

setInterval(updateUptime, 1000);
