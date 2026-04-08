const PASS_MARK = 8;
const TOTAL_QUESTIONS = 10;

const baseQuestions = [
  {
    tag: "NETWORK SECURITY",
    question: "Which port does HTTPS use by default?",
    answers: [
      { text: "443", correct: true },
      { text: "3389", correct: false },
      { text: "25", correct: false },
      { text: "110", correct: false }
    ],
    success: "Correct. 443 is the default HTTPS port.",
    fail: "Wrong. HTTPS uses port 443."
  },
  {
    tag: "AUTHENTICATION",
    question: "What does MFA stand for?",
    answers: [
      { text: "Multi Factor Authentication", correct: true },
      { text: "Managed Firewall Access", correct: false },
      { text: "Multiple Firewall Authentication", correct: false },
      { text: "Main Function Authorisation", correct: false }
    ],
    success: "Correct. MFA adds extra identity checks.",
    fail: "Wrong. MFA means Multi Factor Authentication."
  },
  {
    tag: "REMOTE ACCESS",
    question: "Which protocol is the secure replacement for Telnet?",
    answers: [
      { text: "SSH", correct: true },
      { text: "FTP", correct: false },
      { text: "SNMP", correct: false },
      { text: "ARP", correct: false }
    ],
    success: "Correct. SSH encrypts remote sessions.",
    fail: "Wrong. SSH is the secure choice."
  },
  {
    tag: "ATTACK TYPES",
    question: "Which attack floods a service with massive traffic to make it unavailable?",
    answers: [
      { text: "DDoS", correct: true },
      { text: "SQL injection", correct: false },
      { text: "Privilege escalation", correct: false },
      { text: "Cross site scripting", correct: false }
    ],
    success: "Correct. DDoS attacks target availability.",
    fail: "Wrong. The answer is DDoS."
  },
  {
    tag: "VULNERABILITIES",
    question: "Which attack injects malicious database queries into an application?",
    answers: [
      { text: "SQL injection", correct: true },
      { text: "ARP poisoning", correct: false },
      { text: "Brute force", correct: false },
      { text: "Sandbox escape", correct: false }
    ],
    success: "Correct. SQL injection targets the database layer.",
    fail: "Wrong. The answer is SQL injection."
  },
  {
    tag: "ZERO TRUST",
    question: "Which security model assumes no implicit trust, even inside the network?",
    answers: [
      { text: "Zero Trust", correct: true },
      { text: "Castle and moat", correct: false },
      { text: "Open trust", correct: false },
      { text: "Flat network", correct: false }
    ],
    success: "Correct. Zero Trust verifies continuously.",
    fail: "Wrong. The answer is Zero Trust."
  },
  {
    tag: "PASSWORD ATTACKS",
    question: "Which attack tries large volumes of password guesses rapidly?",
    answers: [
      { text: "Brute force", correct: true },
      { text: "Smishing", correct: false },
      { text: "Tailgating", correct: false },
      { text: "Data masking", correct: false }
    ],
    success: "Correct. That is a brute force attack.",
    fail: "Wrong. The answer is brute force."
  },
  {
    tag: "DEFENSIVE TOOLS",
    question: "Which tool is commonly used to scan for open ports on hosts?",
    answers: [
      { text: "Nmap", correct: true },
      { text: "Wireshark", correct: false },
      { text: "John the Ripper", correct: false },
      { text: "Hashcat", correct: false }
    ],
    success: "Correct. Nmap is used for port scanning.",
    fail: "Wrong. The answer is Nmap."
  },
  {
    tag: "TRAFFIC ANALYSIS",
    question: "Which tool is most associated with packet capture and analysis?",
    answers: [
      { text: "Wireshark", correct: true },
      { text: "Nikto", correct: false },
      { text: "Hydra", correct: false },
      { text: "Aircrack-ng", correct: false }
    ],
    success: "Correct. Wireshark analyses packets.",
    fail: "Wrong. The answer is Wireshark."
  },
  {
    tag: "PRIVILEGE CONTROL",
    question: "What does the principle of least privilege mean?",
    answers: [
      { text: "Users get only the access they need", correct: true },
      { text: "Everyone gets admin when requested", correct: false },
      { text: "All staff share one privileged account", correct: false },
      { text: "Only IT can log in", correct: false }
    ],
    success: "Correct. Only required permissions should be granted.",
    fail: "Wrong. Least privilege limits access."
  },
  {
    tag: "RANSOMWARE",
    question: "What is the best immediate response when ransomware is suspected on a workstation?",
    answers: [
      { text: "Isolate the device and escalate", correct: true },
      { text: "Pay quickly to restore access", correct: false },
      { text: "Ignore it and keep working", correct: false },
      { text: "Unplug the monitor only", correct: false }
    ],
    success: "Correct. Isolate fast and escalate immediately.",
    fail: "Wrong. The safest immediate move is isolation and escalation."
  },
  {
    tag: "SUPPLY CHAIN",
    question: "A supplier emails new bank details for invoice payment. What is the safest action?",
    answers: [
      { text: "Verify through a trusted known contact", correct: true },
      { text: "Update the details from the email", correct: false },
      { text: "Reply and ask if it is genuine", correct: false },
      { text: "Wait and pay the next invoice anyway", correct: false }
    ],
    success: "Correct. Supplier payment changes must be independently verified.",
    fail: "Wrong. Bank detail changes should never be trusted from email alone."
  },
  {
    tag: "PHISHING",
    question: "What is the strongest phishing indicator in a login email?",
    answers: [
      { text: "A mismatched or lookalike domain", correct: true },
      { text: "The email uses your company logo", correct: false },
      { text: "The sender signs off politely", correct: false },
      { text: "The message has bullet points", correct: false }
    ],
    success: "Correct. Lookalike domains are a major red flag.",
    fail: "Wrong. The strongest sign is often the fake or mismatched domain."
  },
  {
    tag: "SMISHING",
    question: "A text message claims your corporate password expires today and links to a reset page. What should you do?",
    answers: [
      { text: "Use official internal channels to verify first", correct: true },
      { text: "Tap the link quickly before expiry", correct: false },
      { text: "Reply asking if it is real", correct: false },
      { text: "Forward it to the team WhatsApp and click later", correct: false }
    ],
    success: "Correct. Verify through official channels only.",
    fail: "Wrong. That is classic smishing pressure."
  }
];

let questions = [];
let currentIndex = 0;
let score = 0;
let answered = false;
let startTime = null;
let timerInterval = null;
let gameStarted = false;

const playNowBtn = document.getElementById("playNowBtn");
const startScreen = document.getElementById("startScreen");

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const scoreBox = document.getElementById("scoreBox");
const timerBox = document.getElementById("timerBox");
const counterBox = document.getElementById("counterBox");
const tagEl = document.getElementById("tag");
const virusToken = document.getElementById("virusToken");
const questionCard = document.getElementById("questionCard");
const resultCard = document.getElementById("resultCard");
const resultTitle = document.getElementById("resultTitle");
const resultScore = document.getElementById("resultScore");
const resultCopy = document.getElementById("resultCopy");
const resultActionBtn = document.getElementById("resultActionBtn");
const gameShell = document.getElementById("gameShell");
const breachOverlay = document.getElementById("breachOverlay");
const giantRansomSkull = document.getElementById("giantRansomSkull");
const questionFlicker = document.getElementById("questionFlicker");
const victoryOverlay = document.getElementById("victoryOverlay");
const victoryScore = document.getElementById("victoryScore");
const victoryTime = document.getElementById("victoryTime");
const victoryActionBtn = document.getElementById("victoryActionBtn");
const ransomBtn = document.getElementById("ransomBtn");
const breachSubtext = document.querySelector(".breach-subtext");

const fxCanvas = document.getElementById("fxCanvas");
const ctx = fxCanvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  fxCanvas.width = window.innerWidth;
  fxCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function prepareQuestions() {
  questions = shuffle(baseQuestions).slice(0, TOTAL_QUESTIONS).map(q => ({
    ...q,
    answers: shuffle(q.answers)
  }));
}

function formatTime(totalSeconds) {
  const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const secs = String(totalSeconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!gameStarted || startTime === null) return;
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timerBox.textContent = `TIME: ${formatTime(elapsed)}`;
  }, 1000);
}

function updateHud() {
  scoreBox.textContent = `SCORE: ${score} / ${TOTAL_QUESTIONS}`;
  counterBox.textContent = `QUESTION ${Math.min(currentIndex + 1, TOTAL_QUESTIONS)} / ${TOTAL_QUESTIONS}`;
}

function getVirusPercent() {
  const maxSteps = TOTAL_QUESTIONS;
  const dangerStep = currentIndex - score;
  const clamped = Math.max(0, Math.min(maxSteps - 1, dangerStep));
  return (clamped / (maxSteps - 1)) * 100;
}

function updateVirusPosition() {
  const track = document.getElementById("timelineTrack");
  if (!track) return;

  const trackRect = track.getBoundingClientRect();
  const wrapRect = track.parentElement.getBoundingClientRect();

  const percent = getVirusPercent() / 100;
  const leftPx = (trackRect.left - wrapRect.left) + (trackRect.width * percent) - 30;
  virusToken.style.left = `${leftPx}px`;
}

function triggerQuestionFlicker() {
  questionFlicker.classList.remove("active");
  void questionFlicker.offsetWidth;
  questionFlicker.classList.add("active");
}

function renderQuestion() {
  answered = false;
  const q = questions[currentIndex];

  updateHud();
  tagEl.textContent = q.tag;
  questionEl.textContent = q.question;
  feedbackEl.textContent = "";
  feedbackEl.style.color = "var(--green)";
  nextBtn.style.display = "none";
  answersEl.innerHTML = "";

  q.answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = answer.text;
    btn.onclick = () => handleAnswer(answer.correct, btn, q);
    answersEl.appendChild(btn);
  });

  requestAnimationFrame(updateVirusPosition);
}

function handleAnswer(isCorrect, clickedBtn, q) {
  if (answered) return;
  answered = true;

  const allBtns = [...document.querySelectorAll(".answer-btn")];

  if (isCorrect) {
    score += 1;
    clickedBtn.classList.add("correct");
    feedbackEl.textContent = q.success;
    feedbackEl.style.color = "var(--green)";
    burstMiniConfetti(clickedBtn);
  } else {
    clickedBtn.classList.add("wrong");
    feedbackEl.textContent = q.fail;
    feedbackEl.style.color = "var(--red)";
  }

  allBtns.forEach(btn => {
    const match = q.answers.find(a => a.text === btn.textContent);
    if (match && match.correct) btn.classList.add("correct");
    if (btn !== clickedBtn) btn.classList.add("disabled");
    btn.disabled = true;
  });

  updateHud();
  currentIndex += 1;
  nextBtn.style.display = "block";
  updateVirusPosition();
}

nextBtn.addEventListener("click", () => {
  triggerQuestionFlicker();

  if (currentIndex >= TOTAL_QUESTIONS) {
    setTimeout(() => {
      endGame();
    }, 140);
    return;
  }

  setTimeout(() => {
    renderQuestion();
  }, 140);
});

function endGame() {
  clearInterval(timerInterval);

  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const passed = score >= PASS_MARK;

  if (passed) {
    showVictoryTakeover(score, elapsed);
  } else {
    questionCard.style.display = "none";
    resultCard.style.display = "block";
    resultTitle.textContent = "SYSTEM BREACHED";
    resultTitle.style.color = "var(--red)";
    resultScore.textContent = `${score} / ${TOTAL_QUESTIONS}  |  TIME ${formatTime(elapsed)}`;
    resultScore.style.color = "var(--red)";
    resultCopy.textContent = `Breach confirmed. You needed ${PASS_MARK}/10 to stop the virus.`;
    resultActionBtn.style.display = "none";
    showLoseScene();
  }
}

function showVictoryTakeover(finalScore, elapsed) {
  questionCard.style.display = "none";
  resultCard.style.display = "none";

  victoryScore.textContent = `${finalScore} / ${TOTAL_QUESTIONS}`;
  victoryTime.textContent = `TIME ${formatTime(elapsed)}`;

  gameShell.classList.add("victory-fade");

  setTimeout(() => {
    victoryOverlay.classList.add("active");
    launchVictoryFireworks();
  }, 700);
}

function launchVictoryFireworks() {
  const bursts = [
    [window.innerWidth * 0.1, window.innerHeight * 0.14],
    [window.innerWidth * 0.22, window.innerHeight * 0.22],
    [window.innerWidth * 0.35, window.innerHeight * 0.12],
    [window.innerWidth * 0.5, window.innerHeight * 0.18],
    [window.innerWidth * 0.65, window.innerHeight * 0.12],
    [window.innerWidth * 0.78, window.innerHeight * 0.22],
    [window.innerWidth * 0.9, window.innerHeight * 0.14],
    [window.innerWidth * 0.16, window.innerHeight * 0.36],
    [window.innerWidth * 0.5, window.innerHeight * 0.31],
    [window.innerWidth * 0.84, window.innerHeight * 0.36]
  ];

  bursts.forEach((burst, i) => {
    setTimeout(() => fireworkBurst(burst[0], burst[1], 140), i * 160);
  });

  setTimeout(() => {
    const interval = setInterval(() => {
      fireworkBurst(
        Math.random() * window.innerWidth,
        Math.random() * (window.innerHeight * 0.45),
        110
      );
    }, 260);

    setTimeout(() => clearInterval(interval), 2600);
  }, 900);
}

function showLoseScene() {
  setTimeout(() => {
    gameShell.classList.add("breach-fizzle");
    breachSparkBurst(window.innerWidth * 0.5, window.innerHeight * 0.4);
  }, 700);

  setTimeout(() => {
    breachOverlay.classList.add("active");
    giantRansomSkull.classList.add("active");
    breachSubtext.classList.add("active");
    megaRansomBurst();
  }, 1750);
}

function addParticle(x, y, vx, vy, size, color, life) {
  particles.push({ x, y, vx, vy, size, color, life });
}

function burstMiniConfetti(btn) {
  const rect = btn.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  const colors = ["#59ff9d", "#a94cff", "#ffffff"];
  for (let i = 0; i < 18; i++) {
    addParticle(
      x,
      y,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 5 - 1,
      Math.random() * 4 + 2,
      colors[Math.floor(Math.random() * colors.length)],
      28
    );
  }
}

function fireworkBurst(x, y, count = 72) {
  const colors = ["#59ff9d", "#a94cff", "#ff3b6b", "#ffd44d", "#ffffff"];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = Math.random() * 6.2 + 1.8;
    addParticle(
      x,
      y,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
      Math.random() * 6 + 2,
      colors[Math.floor(Math.random() * colors.length)],
      88
    );
  }
}

function breachSparkBurst(x, y) {
  const colors = ["#ff3b6b", "#ffffff", "#ff8ea9"];
  for (let i = 0; i < 60; i++) {
    addParticle(
      x,
      y,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 8,
      Math.random() * 4 + 2,
      colors[Math.floor(Math.random() * colors.length)],
      40
    );
  }
}

function megaRansomBurst() {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const colors = ["#ff3b6b", "#ffffff", "#a94cff", "#ff8ea9"];

  for (let i = 0; i < 180; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 1;
    addParticle(
      cx,
      cy,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
      Math.random() * 5 + 2,
      colors[Math.floor(Math.random() * colors.length)],
      90
    );
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.08;
    p.life -= 1;

    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });

  particles = particles.filter(p => p.life > 0);
  requestAnimationFrame(animateParticles);
}

function resetGame() {
  clearInterval(timerInterval);

  questions = [];
  currentIndex = 0;
  score = 0;
  answered = false;
  startTime = null;
  gameStarted = false;
  particles = [];

  questionCard.style.display = "block";
  resultCard.style.display = "none";
  feedbackEl.textContent = "";
  answersEl.innerHTML = "";
  nextBtn.style.display = "none";

  resultTitle.textContent = "LOCKDOWN SUCCESSFUL";
  resultTitle.style.color = "var(--text)";
  resultScore.textContent = "";
  resultScore.style.color = "var(--green)";
  resultCopy.textContent = "";
  resultActionBtn.style.display = "block";

  gameShell.classList.remove("victory-fade", "breach-fizzle");
  victoryOverlay.classList.remove("active");
  breachOverlay.classList.remove("active");
  giantRansomSkull.classList.remove("active");
  breachSubtext.classList.remove("active");

  timerBox.textContent = "TIME: 00:00";
  updateHud();
  requestAnimationFrame(updateVirusPosition);

  startScreen.style.display = "flex";
  requestAnimationFrame(() => {
    startScreen.classList.remove("hidden");
  });
}

function startGame() {
  if (gameStarted) return;

  gameStarted = true;
  startTime = Date.now();

  startScreen.classList.add("hidden");

  setTimeout(() => {
    startScreen.style.display = "none";
  }, 350);

  prepareQuestions();
  updateHud();
  renderQuestion();
  startTimer();

  requestAnimationFrame(updateVirusPosition);
}

playNowBtn.addEventListener("click", startGame);
victoryActionBtn.addEventListener("click", resetGame);
ransomBtn.addEventListener("click", resetGame);
resultActionBtn.addEventListener("click", resetGame);

timerBox.textContent = "TIME: 00:00";
updateHud();
animateParticles();
window.addEventListener("load", updateVirusPosition);
window.addEventListener("resize", updateVirusPosition);
