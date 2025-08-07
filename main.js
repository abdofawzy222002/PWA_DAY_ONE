document.addEventListener("DOMContentLoaded", function () {
  const main = document.querySelector("main");
  const msg = document.createElement("p");
  msg.textContent = "Hello from AbdoApp JS!";
  msg.style.marginTop = "20px";
  msg.style.fontWeight = "bold";
  msg.style.color = "yellow"; 
  main.appendChild(msg);
});