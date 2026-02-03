const lines = [
  "[ OK ] Initializing system kernel...",
  "[ OK ] Loading cryptographic modules...",
  "[ OK ] Kekek responded to kitcheny sounds...",
  "[WARN] I AM NOT A TOFU",
  "[ OK ] This is Aru",
  "[INFO] User override in progress...",
  "[ OK ] Firewall bypassed",
  "[WARN] Unauthorized access attempt detected",
  "[ OK ] Girlfriend's birthday",
  "[ OK ] Identity confirmed: Capers",
  ""
];

const accessLines = [
  "ACCESS GRANTED ✔",
  "",
  "Welcome, Capers.",
  "",
  "System: pol-2026",
  "Status: Secure",
  "Encryption: Active",
  "",
  "Message:",
  "My baby,",
  "My IT sekyu,",
  "My jeepney driver,",
  "Hot water flask haver,",
  "It's your birthday.",
  "With the internet's help,",
  "This is my gift to you.",
  "I love you. Have a nice day!",
  "",
  " - Aru",
  "",
  "           i i i i i",
  "          |~~~~~~~~~|",
  "          |  HAPPY  |",
  "          | BIRTHDAY|",
  "          | CAPERS  |",
  "          '~~~~~~~~~'"
];

const terminal = document.getElementById("terminal");
const cursor = document.getElementById("cursor");
const loader = document.getElementById("loader");
const loginSection = document.getElementById("login-section");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const error = document.getElementById("error");
const enterBtn = document.getElementById("enter-btn");

const gameBox = document.getElementById("game");
const gameScreen = document.getElementById("game-screen");
const gameStatus = document.getElementById("game-status");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");

const bgMusic = document.getElementById("bg-music");
const finalPanel = document.getElementById("final-panel");
const zoomOverlay = document.getElementById("photo-zoom");
const zoomImg = document.getElementById("photo-zoom-img");

const glitchOverlay = document.getElementById("glitch-overlay");
const videoPage = document.getElementById("video-page");
const finalVideo = document.getElementById("final-video");
const patchPage = document.getElementById("patch-page");
const safePage = document.getElementById("safe-page");
const patchTrigger = document.getElementById("patch-trigger");
const patchCompleteWrap = document.getElementById("patch-complete-wrap");
const patchCompleteBtn = document.getElementById("patch-complete-btn");

let bootDone = false;
let authenticated = false;
let waitingForFinalEnter = false;
let patchTimerId = null;

const PATCH_DELAY_MS = 10000;

const isTouchDevice =
  window.matchMedia &&
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

const viewArchivesActionLabel = isTouchDevice ? "TAP" : "PRESS ENTER";

finalPanel.classList.add("hidden");
zoomOverlay.classList.add("hidden");

function cinematicTypeLine(text, speed = 18) {
  return new Promise((resolve) => {
    let i = 0;

    function step() {
      if (i >= text.length) {
        cursor.remove();
        terminal.textContent += "\n";
        terminal.appendChild(cursor);
        resolve();
        return;
      }

      cursor.remove();
      const char = text[i++];
      terminal.textContent += char;
      terminal.appendChild(cursor);
      setTimeout(step, speed);
    }

    step();
  });
}

async function runBootSequence() {
  for (const line of lines) {
    await cinematicTypeLine(line, 12);
    await new Promise((r) => setTimeout(r, 40));
  }
  bootDone = true;
  enterBtn.classList.remove("hidden");
}

function fakeCodeBurst() {
  const fake = [
    "ssh_connect --force",
    "decrypting handshake...",
    "access_matrix override",
    "root privileges granted"
  ];

  fake.forEach((line, i) => {
    setTimeout(() => {
      cursor.remove();
      terminal.textContent += line + "\n";
      terminal.appendChild(cursor);
    }, i * 150);
  });
}

function proceedAfterEnter() {
  if (!bootDone || authenticated) return;

  enterBtn.classList.add("hidden");
  loader.classList.remove("hidden");
  fakeCodeBurst();

  setTimeout(() => {
    loader.classList.add("hidden");
    loginSection.classList.remove("hidden");
    usernameInput.focus();
  }, 2500);
}

function handleLogin() {
  const user = usernameInput.value.trim().toLowerCase();
  const pass = passwordInput.value.trim();

  if (user === "capers" && pass === "021097") {
    authenticated = true;
    error.textContent = "";
    loginSection.classList.add("hidden");

    if (bgMusic) {
      bgMusic.currentTime = 0;
      bgMusic.play().catch(() => {});
    }

    showWinGate();
  } else {
    error.textContent = "Access denied. Hint: birth date format: mdy 🙂";
  }
}

async function showWinGate() {
  cursor.remove();
  terminal.textContent = "";
  terminal.appendChild(cursor);

  const gateText = [
    "AUTHENTICATION COMPLETE ✔",
    "",
    "SECONDARY VERIFICATION REQUIRED",
    "",
    ">>> HELP KEKEK CATCH FISHES TO PROCEED <<<"
  ];

  for (const line of gateText) {
    await cinematicTypeLine(line, 14);
    await new Promise((r) => setTimeout(r, 50));
  }

  startMiniGame();
}

let catX = 4;
let fishX = 0;
let fishY = 0;
let score = 0;
let misses = 0;
let gameLoop = null;

const width = 9;
const height = 5;

function startMiniGame() {
  gameBox.classList.remove("hidden");
  gameStatus.textContent = "HELP KEKEK";

  score = 0;
  misses = 0;
  catX = 4;
  resetFish();
  renderGame();

  if (gameLoop) clearInterval(gameLoop);
  gameLoop = setInterval(tickGame, 450);
}

function resetFish() {
  fishY = 0;
  fishX = Math.floor(Math.random() * width);
}

function renderGame() {
  let output = `Score: ${score}/5  Misses: ${misses}/5\n\n`;

  for (let y = 0; y < height; y++) {
    let row = "";
    for (let x = 0; x < width; x++) {
      if (x === fishX && y === fishY) row += "🐟";
      else if (x === catX && y === height - 1) row += "🐱";
      else row += "·";
    }
    output += row + "\n";
  }

  gameScreen.textContent = output;
}

function tickGame() {
  fishY++;

  if (fishY === height - 1) {
    if (fishX === catX) score++;
    else misses++;
    resetFish();
  }

  if (score >= 5) {
    endGame(true);
    return;
  }
  if (misses >= 5) {
    endGame(false);
    return;
  }

  renderGame();
}

function endGame(win) {
  clearInterval(gameLoop);
  gameBox.classList.add("hidden");

  if (win) {
    showAccessGranted();
  } else {
    showWinGate();
  }
}

function moveLeft() {
  catX = Math.max(0, catX - 1);
  renderGame();
}

function moveRight() {
  catX = Math.min(width - 1, catX + 1);
  renderGame();
}

async function showAccessGranted() {
  cursor.remove();
  terminal.textContent = "";
  terminal.appendChild(cursor);

  for (const line of accessLines) {
    await cinematicTypeLine(line, 16);
    await new Promise((r) => setTimeout(r, 30));
  }

  await cinematicTypeLine("", 10);
  await cinematicTypeLine(
    `>>> ${viewArchivesActionLabel} TO VIEW ARCHIVES <<<`,
    14
  );
  waitingForFinalEnter = true;
}

function showFinalPanel() {
  waitingForFinalEnter = false;

  terminal.classList.add("hidden");
  enterBtn.classList.add("hidden");
  loader.classList.add("hidden");
  loginSection.classList.add("hidden");
  gameBox.classList.add("hidden");

  finalPanel.classList.remove("hidden");
}

function setupPhotoZoom() {
  const thumbs = document.querySelectorAll(".final-gallery img");

  thumbs.forEach((img) => {
    img.addEventListener("click", () => {
      zoomImg.src = img.src;
      zoomOverlay.classList.remove("hidden");
    });
  });

  zoomOverlay.addEventListener("click", () => {
    zoomOverlay.classList.add("hidden");
    zoomImg.src = "";
  });
}

function glitchSwitch(fromEl, toEl) {
  if (!fromEl || !toEl || !glitchOverlay) return;
  glitchOverlay.classList.remove("hidden");
  glitchOverlay.classList.add("glitch-show");
  setTimeout(function () {
    glitchOverlay.classList.remove("glitch-show");
    glitchOverlay.classList.add("hidden");
  }, 450);
  setTimeout(function () {
    fromEl.classList.add("hidden");
    toEl.classList.remove("hidden");
  }, 160);
}

function startPatchSequence() {
  if (!patchPage || !videoPage) return;

  glitchSwitch(videoPage, patchPage);

  if (patchCompleteWrap) {
    patchCompleteWrap.classList.add("hidden");
  }

  if (patchTimerId) {
    clearTimeout(patchTimerId);
    patchTimerId = null;
  }

  patchTimerId = setTimeout(() => {
    if (patchCompleteWrap) {
      patchCompleteWrap.classList.remove("hidden");
    }
  }, PATCH_DELAY_MS);
}

if (finalVideo && videoPage && patchPage) {
  finalVideo.addEventListener("ended", function () {
    startPatchSequence();
  });
}

if (patchTrigger && videoPage && patchPage) {
  patchTrigger.addEventListener("click", function (e) {
    e.stopPropagation();
    if (finalVideo) {
      finalVideo.pause();
    }
    startPatchSequence();
  });
}

if (patchCompleteBtn && patchPage && safePage) {
  patchCompleteBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    glitchSwitch(patchPage, safePage);
  });
}

runBootSequence();
setupPhotoZoom();

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (waitingForFinalEnter) {
      showFinalPanel();
    } else {
      proceedAfterEnter();
    }
  }

  if (e.key === "ArrowLeft") moveLeft();
  if (e.key === "ArrowRight") moveRight();
});

document.addEventListener("click", () => {
  if (waitingForFinalEnter) {
    showFinalPanel();
  }
});

enterBtn.addEventListener("click", proceedAfterEnter);
loginBtn.addEventListener("click", handleLogin);
leftBtn.addEventListener("click", moveLeft);
rightBtn.addEventListener("click", moveRight);

if (finalPanel) {
  const moreButton = finalPanel.querySelector(".final-sub");
  if (moreButton) {
    moreButton.classList.add("clickable");
    moreButton.addEventListener("click", function () {
      glitchSwitch(finalPanel, videoPage);
      if (finalVideo) {
        finalVideo.currentTime = 0;
        finalVideo.play().catch(function () {});
      }
    });
  }
}

window.addEventListener("load", () => {
  document.body.classList.add("fade-in");
});
