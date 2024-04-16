function updateClock() {
    const now = new Date();
      const year = now.getFullYear().toString();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');

      const dateString = `${year}-${month}-${day}`;
      const timeString = `${hours}:${minutes}:${seconds}`;

      const clockElement = document.getElementById('clock');
      clockElement.textContent = `${dateString} ${timeString}`;
  }

  setInterval(updateClock, 1000);

  updateClock();
  
