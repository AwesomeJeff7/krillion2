const playButton = document.querySelector("#playButton");
const gameDialog = document.querySelector("#gameDialog");
const gameFrame = document.querySelector("#gameFrame");
const closeButton = document.querySelector("#closeButton");

const krillionUrl = "https://krillion.io/?scrlybrkr=2565b684";

playButton.addEventListener("click", () => {
  gameFrame.src = krillionUrl;
  if (typeof gameDialog.showModal === "function") {
    gameDialog.showModal();
  } else {
    window.open(krillionUrl, "_blank", "noopener,noreferrer");
  }
});

closeButton.addEventListener("click", () => {
  gameDialog.close();
  gameFrame.src = "about:blank";
});

gameDialog.addEventListener("close", () => {
  gameFrame.src = "about:blank";
});

document.querySelectorAll(".secondary").forEach(link => {
  link.addEventListener("click", () => {
    // Use the link exactly as provided; some sites choose not to allow embedding.
  });
});
