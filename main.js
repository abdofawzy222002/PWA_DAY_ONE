document.addEventListener("DOMContentLoaded", function () {
  const main = document.querySelector("main");
  const msg = document.createElement("p");
  msg.textContent = "Hello from AbdoApp JS!";
  msg.style.marginTop = "20px";
  msg.style.fontWeight = "bold";
  msg.style.color = "yellow"; 
  main.appendChild(msg);
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('Service Worker registered', reg))
    .catch(err => console.error('Service Worker registration failed:', err));
}
