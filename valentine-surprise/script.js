const receiverNameText = "Dear You";
const messageBodyText =
  "On this Valentine, someone out there is quietly grateful for your smile, your warmth, and the way you light up ordinary days.";
const senderNameText = "From Someone Special";

const revealButton = document.getElementById("revealButton");
const backButton = document.getElementById("backButton");
const teaserScreen = document.querySelector(".screen-teaser");
const messageScreen = document.querySelector(".screen-message");
const receiverNameEl = document.getElementById("receiverName");
const messageTextEl = document.getElementById("messageText");
const senderNameEl = document.getElementById("senderName");

receiverNameEl.textContent = receiverNameText;
messageTextEl.textContent = messageBodyText;
senderNameEl.textContent = senderNameText;

function showMessageScreen() {
  teaserScreen.classList.remove("screen-active");
  teaserScreen.setAttribute("aria-hidden", "true");

  messageScreen.classList.add("screen-active");
  messageScreen.setAttribute("aria-hidden", "false");

  triggerHeartBurst();
}

function showTeaserScreen() {
  messageScreen.classList.remove("screen-active");
  messageScreen.setAttribute("aria-hidden", "true");

  teaserScreen.classList.add("screen-active");
  teaserScreen.setAttribute("aria-hidden", "false");
}

revealButton.addEventListener("click", showMessageScreen);
backButton.addEventListener("click", showTeaserScreen);

function triggerHeartBurst() {
  const container = document.querySelector(".page");
  const burstCount = 12;

  for (let i = 0; i < burstCount; i++) {
    const heart = document.createElement("span");
    heart.className = "burst-heart";
    const angle = (Math.PI * 2 * i) / burstCount;
    const distance = 90 + Math.random() * 30;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    heart.style.setProperty("--tx", `${x}px`);
    heart.style.setProperty("--ty", `${y}px`);
    heart.style.animationDelay = `${i * 0.03}s`;

    container.appendChild(heart);

    heart.addEventListener(
      "animationend",
      () => {
        heart.remove();
      },
      { once: true }
    );
  }
}

