document.addEventListener("DOMContentLoaded", function () {
  const main = document.querySelector("main");
  const msg = document.createElement("p");
  msg.textContent = "Hello from ZaqApp JS!";
  msg.style.marginTop = "20px";
  msg.style.fontWeight = "bold";
  msg.style.color = "green"; 
  main.appendChild(msg);
});