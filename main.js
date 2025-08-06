document.addEventListener("DOMContentLoaded", function () {
  console.log("ZaqApp Loaded 🚀");

  const main = document.querySelector("main");

  const msg = document.createElement("p");
  msg.textContent = "Hello from ZaqApp JS!";
  msg.style.marginTop = "20px";
  msg.style.fontWeight = "bold";
  msg.style.color = "#facc15"; // Yellow-400
  main.appendChild(msg);
});