(function () {
  document.documentElement.style.visibility = "hidden";

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) {
        resolve();
        return;
      }
      var script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function locked(message) {
    document.documentElement.style.visibility = "visible";
    document.body.innerHTML = '<main class="game-shell" style="min-height:80vh;display:flex;align-items:center;justify-content:center;text-align:center;"><section class="start-panel" style="max-width:760px;"><img src="logo.png" alt="SCCYBER logo" class="start-logo"><div class="start-badge">PREMIUM ACCESS REQUIRED</div><h1 class="start-title-main">ACCESS LOCKED</h1><p class="start-subtitle">' + message + '</p><p class="start-copy">Please return to the SCCYBER Training Portal and log in with an active premium account.</p><a class="arcade-green-btn" style="display:inline-block;text-decoration:none;margin-top:18px;" href="https://sccyber.github.io/Immersive-Training-Package/">RETURN TO PORTAL</a></section></main>';
  }

  async function checkAccess() {
    try {
      if (!window.supabase) {
        await loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2");
      }

      if (!window.SCCYBER_SUPABASE_URL || !window.SCCYBER_SUPABASE_ANON_KEY) {
        await loadScript("https://sccyber.github.io/Immersive-Training-Package/supabase-config.js");
      }

      if (!window.supabase || !window.SCCYBER_SUPABASE_URL || !window.SCCYBER_SUPABASE_ANON_KEY) {
        locked("Secure access check is not available.");
        return;
      }

      var client = window.supabase.createClient(window.SCCYBER_SUPABASE_URL, window.SCCYBER_SUPABASE_ANON_KEY);
      var sessionResult = await client.auth.getSession();
      var user = sessionResult && sessionResult.data && sessionResult.data.session && sessionResult.data.session.user;

      if (!user || !user.id) {
        locked("No active portal session was found.");
        return;
      }

      var profileResult = await client
        .from("profiles")
        .select("premium_enabled,is_admin")
        .eq("id", user.id)
        .single();

      if (profileResult.error || !profileResult.data) {
        locked("Your account could not be verified.");
        return;
      }

      if (profileResult.data.is_admin === true || profileResult.data.premium_enabled === true) {
        document.documentElement.style.visibility = "visible";
        return;
      }

      locked("Premium access is not active for this account.");
    } catch (e) {
      locked("Secure access check failed.");
    }
  }

  checkAccess();
})();

const SCCYBER_STAGES = [
  { name: "INITIAL ACCESS", lesson: "Most breaches begin with a user, a link, a password or an exposed service." },
  { name: "CREDENTIAL THEFT", lesson: "Once credentials are stolen, MFA and verification become critical." },
  { name: "LATERAL MOVEMENT", lesson: "Attackers try to move from one system to another after the first foothold." },
  { name: "PRIVILEGE ESCALATION", lesson: "Least privilege limits the damage an attacker can cause." },
  { name: "RANSOMWARE", lesson: "Fast isolation, clean backups and escalation reduce ransomware impact." }
];

let sccyberStreak = 0;
let sccyberBestStreak = 0;
let sccyberWrong = 0;
let sccyberAnswered = 0;
let sccyberFinalised = false;

function sccyberInstallV2Styles() {
  const style = document.createElement("style");
  style.textContent = `
    .sccyber-stage-panel,
    .sccyber-stats-panel,
    .sccyber-lesson-panel,
    .sccyber-leaderboard-panel{
      background:rgba(8,2,20,0.95);
      border:1px solid rgba(89,255,157,0.18);
      border-radius:14px;
      padding:12px;
      margin:10px 0;
      color:#b9a8d5;
      font-size:13px;
      line-height:1.55;
      text-align:center;
    }

    .sccyber-stage-title,
    .sccyber-panel-title{
      color:#ffd44d;
      font-family:'Press Start 2P', cursive;
      font-size:10px;
      line-height:1.7;
      margin-bottom:8px;
    }

    .sccyber-stage-track{
      display:grid;
      grid-template-columns:repeat(5,1fr);
      gap:6px;
      margin-top:8px;
    }

    .sccyber-stage-pill{
      background:#1b0640;
      border:1px solid rgba(169,76,255,0.22);
      border-radius:10px;
      padding:8px 5px;
      font-family:'Press Start 2P', cursive;
      font-size:6.5px;
      line-height:1.5;
      color:#b9a8d5;
    }

    .sccyber-stage-pill.active{
      color:#59ff9d;
      border-color:#59ff9d;
      box-shadow:0 0 14px rgba(89,255,157,0.25);
    }

    .sccyber-stats-grid{
      display:grid;
      grid-template-columns:repeat(4,1fr);
      gap:8px;
    }

    .sccyber-stat-pill{
      background:#1b0640;
      border:1px solid rgba(89,255,157,0.16);
      border-radius:10px;
      padding:9px 6px;
      color:#59ff9d;
      font-family:'Press Start 2P', cursive;
      font-size:7px;
      line-height:1.7;
    }

    .sccyber-why{
      display:block;
      margin-top:8px;
      color:#ffd44d;
      font-size:13px;
      line-height:1.5;
    }

    .sccyber-leaderboard-list{
      text-align:left;
      max-width:520px;
      margin:0 auto;
    }

    @media(max-width:900px){
      .sccyber-stage-track,
      .sccyber-stats-grid{grid-template-columns:repeat(2,1fr);}
      .sccyber-stage-pill{font-size:6px;}
    }
  `;
  document.head.appendChild(style);
}

function sccyberCreateV2Panels() {
  const timelineCard = document.querySelector(".timeline-card");
  const questionCard = document.getElementById("questionCard");
  const resultCard = document.getElementById("resultCard");
  if (!timelineCard || !questionCard || document.getElementById("sccyberStagePanel")) return;

  const stagePanel = document.createElement("section");
  stagePanel.className = "sccyber-stage-panel";
  stagePanel.id = "sccyberStagePanel";
  stagePanel.innerHTML = `
    <div class="sccyber-stage-title" id="sccyberStageTitle">STAGE 1: INITIAL ACCESS</div>
    <div id="sccyberStageLesson">Most breaches begin with a user, a link, a password or an exposed service.</div>
    <div class="sccyber-stage-track" id="sccyberStageTrack"></div>
  `;
  timelineCard.parentNode.insertBefore(stagePanel, questionCard);

  const statsPanel = document.createElement("section");
  statsPanel.className = "sccyber-stats-panel";
  statsPanel.id = "sccyberStatsPanel";
  statsPanel.innerHTML = `
    <div class="sccyber-panel-title">PERFORMANCE</div>
    <div class="sccyber-stats-grid">
      <div class="sccyber-stat-pill" id="sccyberArcadeScore">POINTS<br>0</div>
      <div class="sccyber-stat-pill" id="sccyberAccuracy">ACCURACY<br>0%</div>
      <div class="sccyber-stat-pill" id="sccyberStreak">STREAK<br>0</div>
      <div class="sccyber-stat-pill" id="sccyberRank">RANK<br>TRAINEE</div>
    </div>
  `;
  questionCard.parentNode.insertBefore(statsPanel, questionCard.nextSibling);

  const lessonPanel = document.createElement("section");
  lessonPanel.className = "sccyber-lesson-panel";
  lessonPanel.id = "sccyberLessonPanel";
  lessonPanel.innerHTML = `
    <div class="sccyber-panel-title">WHY THIS MATTERS</div>
    <div id="sccyberWhyText">Answer the question, then review the learning point.</div>
  `;
  questionCard.parentNode.insertBefore(lessonPanel, statsPanel.nextSibling);

  const leaderboardPanel = document.createElement("section");
  leaderboardPanel.className = "sccyber-leaderboard-panel";
  leaderboardPanel.id = "sccyberLeaderboardPanel";
  leaderboardPanel.innerHTML = `
    <div class="sccyber-panel-title">LOCAL LEADERBOARD</div>
    <div class="sccyber-leaderboard-list" id="sccyberLeaderboardList">No scores yet.</div>
  `;
  resultCard.parentNode.insertBefore(leaderboardPanel, resultCard.nextSibling);
}

function sccyberStageIndex() {
  return Math.min(SCCYBER_STAGES.length - 1, Math.floor(currentIndex / 2));
}

function sccyberUpdateStagePanel() {
  const idx = sccyberStageIndex();
  const stage = SCCYBER_STAGES[idx];
  const title = document.getElementById("sccyberStageTitle");
  const lesson = document.getElementById("sccyberStageLesson");
  const track = document.getElementById("sccyberStageTrack");
  if (!title || !lesson || !track) return;

  title.textContent = `STAGE ${idx + 1}: ${stage.name}`;
  lesson.textContent = stage.lesson;
  track.innerHTML = SCCYBER_STAGES.map((s, i) => `<div class="sccyber-stage-pill ${i === idx ? "active" : ""}">${s.name}</div>`).join("");
}

function sccyberPoints() {
  return (score * 150) + (sccyberBestStreak * 75) - (sccyberWrong * 50);
}

function sccyberAccuracy() {
  if (!sccyberAnswered) return 0;
  return Math.round((score / sccyberAnswered) * 100);
}

function sccyberRank(points = sccyberPoints(), accuracy = sccyberAccuracy()) {
  if (points >= 1800 && accuracy >= 90) return "CISO";
  if (points >= 1450 && accuracy >= 80) return "SOC LEAD";
  if (points >= 1100 && accuracy >= 70) return "ENGINEER";
  if (points >= 750) return "ANALYST";
  return "TRAINEE";
}

function sccyberUpdateStats() {
  const points = sccyberPoints();
  const accuracy = sccyberAccuracy();
  const pointBox = document.getElementById("sccyberArcadeScore");
  const accuracyBox = document.getElementById("sccyberAccuracy");
  const streakBox = document.getElementById("sccyberStreak");
  const rankBox = document.getElementById("sccyberRank");
  if (!pointBox) return;

  pointBox.innerHTML = `POINTS<br>${points}`;
  accuracyBox.innerHTML = `ACCURACY<br>${accuracy}%`;
  streakBox.innerHTML = `STREAK<br>${sccyberStreak}`;
  rankBox.innerHTML = `RANK<br>${sccyberRank(points, accuracy)}`;
}

function sccyberWhy(text) {
  const why = document.getElementById("sccyberWhyText");
  if (why) why.textContent = text;
}

function sccyberQuestionLesson(q, isCorrect) {
  const base = isCorrect ? q.success : q.fail;
  const stage = SCCYBER_STAGES[sccyberStageIndex()];
  return `${base} ${stage.lesson}`;
}

function sccyberPatchUpdateHud() {
  const originalUpdateHud = updateHud;
  updateHud = function patchedUpdateHud() {
    originalUpdateHud();
    scoreBox.textContent = `SCORE: ${score} / ${TOTAL_QUESTIONS}`;
    sccyberUpdateStagePanel();
    sccyberUpdateStats();
  };
}

function sccyberPatchRenderQuestion() {
  const originalRenderQuestion = renderQuestion;
  renderQuestion = function patchedRenderQuestion() {
    originalRenderQuestion();
    sccyberUpdateStagePanel();
    sccyberUpdateStats();
    sccyberWhy("Choose carefully. The learning point will appear after your answer.");
  };
}

function sccyberPatchHandleAnswer() {
  const originalHandleAnswer = handleAnswer;
  handleAnswer = function patchedHandleAnswer(isCorrect, clickedBtn, q) {
    if (answered) return;

    originalHandleAnswer(isCorrect, clickedBtn, q);

    sccyberAnswered += 1;
    if (isCorrect) {
      sccyberStreak += 1;
      sccyberBestStreak = Math.max(sccyberBestStreak, sccyberStreak);
    } else {
      sccyberWrong += 1;
      sccyberStreak = 0;
    }

    feedbackEl.innerHTML = `${feedbackEl.textContent}<span class="sccyber-why">Why this matters: ${sccyberQuestionLesson(q, isCorrect)}</span>`;
    sccyberWhy(sccyberQuestionLesson(q, isCorrect));
    sccyberUpdateStats();
  };
}

function sccyberFinalSummary() {
  const points = sccyberPoints();
  const accuracy = sccyberAccuracy();
  const rank = sccyberRank(points, accuracy);
  return `${points} POINTS · ${rank} · ${accuracy}% ACCURACY · BEST STREAK ${sccyberBestStreak}`;
}

function sccyberSaveLeaderboard(passed, elapsed) {
  const entry = {
    points: sccyberPoints(),
    rank: sccyberRank(),
    accuracy: sccyberAccuracy(),
    score,
    passed,
    time: formatTime(elapsed),
    date: new Date().toLocaleDateString()
  };

  const key = "sccyberBreachLockdownLeaderboard";
  const board = JSON.parse(localStorage.getItem(key) || "[]");
  board.push(entry);
  board.sort((a, b) => b.points - a.points);
  localStorage.setItem(key, JSON.stringify(board.slice(0, 10)));
  sccyberLoadLeaderboard();
}

function sccyberLoadLeaderboard() {
  const list = document.getElementById("sccyberLeaderboardList");
  if (!list) return;
  const board = JSON.parse(localStorage.getItem("sccyberBreachLockdownLeaderboard") || "[]");
  if (!board.length) {
    list.textContent = "No scores yet.";
    return;
  }
  list.innerHTML = board.slice(0, 5).map((row, i) => `${i + 1}. ${row.points} · ${row.rank} · ${row.accuracy}% · ${row.time}`).join("<br>");
}

function sccyberPatchEndGame() {
  const originalEndGame = endGame;
  endGame = function patchedEndGame() {
    if (sccyberFinalised) return originalEndGame();
    sccyberFinalised = true;

    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const passed = score >= PASS_MARK;
    sccyberSaveLeaderboard(passed, elapsed);
    originalEndGame();

    setTimeout(() => {
      const summary = sccyberFinalSummary();
      if (passed) {
        victoryScore.textContent = summary;
        victoryTime.textContent = `TIME ${formatTime(elapsed)} · SCORE ${score} / ${TOTAL_QUESTIONS}`;
      } else {
        resultScore.textContent = `${summary} · TIME ${formatTime(elapsed)}`;
        resultCopy.textContent = `Breach confirmed. You needed ${PASS_MARK}/10 to stop the virus. Review the weak areas and try again.`;
        breachSubtext.textContent = summary;
      }
    }, 50);
  };
}

function sccyberPatchResetGame() {
  const originalResetGame = resetGame;
  resetGame = function patchedResetGame() {
    sccyberStreak = 0;
    sccyberBestStreak = 0;
    sccyberWrong = 0;
    sccyberAnswered = 0;
    sccyberFinalised = false;
    originalResetGame();
    sccyberUpdateStagePanel();
    sccyberUpdateStats();
    sccyberWhy("Answer the question, then review the learning point.");
    sccyberLoadLeaderboard();
  };
}

function sccyberInstallBreachV2() {
  sccyberInstallV2Styles();
  sccyberCreateV2Panels();
  sccyberPatchUpdateHud();
  sccyberPatchRenderQuestion();
  sccyberPatchHandleAnswer();
  sccyberPatchEndGame();
  sccyberPatchResetGame();
  sccyberUpdateStagePanel();
  sccyberUpdateStats();
  sccyberLoadLeaderboard();
}

sccyberInstallBreachV2();
