// =========================================================
// YOU CAN'T WIN - A WOPR EXPERIENCE
// FINAL PROJECT — COMMENTED VERSION
//
// BY GABRIEL MENGHISTEAB & ARSEMA DAWIT
//
// COMMENT KEY:
//   [MINE]        — Original work by me and my partner
//   [AI-ASSISTED] — Logic brainstormed/drafted with AI help,
//                   then studied, adapted, and rewritten by me
// =========================================================

// ── Global State ──────────────────────────────────────────
// [MINE] — Full screen-state map and all state variable
//          declarations designed and named by me and my partner.
let screenState = 0;
// screenState key:
//   0      = intro (name + greeting + password)
//   0.5    = dashboard (authorized)
//   0.6    = dashboard GLITCHED (unauthorized)
//   2      = missile briefing
//   2.6    = missile briefing GLITCHED
//   3      = missile command (direction select)
//   3.6    = missile command GLITCHED
//   3.5    = missile launch animation
//   3.65   = missile launch animation GLITCHED
//   4      = missile retaliation (game)
//   4.6    = missile retaliation GLITCHED
//   5      = missile game over
//   5.6    = missile game over GLITCHED
//   6      = globalRadarSweep instructions
//   6.6    = globalRadarSweep instructions GLITCHED
//   6.5    = globalRadarSweep game
//   6.55   = globalRadarSweep game GLITCHED
//   7      = cryptoBreaker
//   7.6    = cryptoBreaker GLITCHED
//   8      = circuitOverload
//   8.6    = circuitOverload GLITCHED
//   9      = settings screen
//   9.6    = settings screen GLITCHED

// ── Intro / Auth ──────────────────────────────────────────
// [MINE] — The "Daniel Phelps" login narrative, password
//          system, and panic/lockdown sequence were all
//          designed by me and my partner.
let typedText        = "";
let playerName       = "";
let introPhase       = "name"; // "name" | "greeting" | "password"
let greetingStart    = 0;
let passwordInput    = "";
let passwordAttempts = 0;
let passwordMessage  = "";
let passwordMsgTime  = 0;
let panicTriggered   = false;
let panicStart       = 0;
let accessGranted    = false; // true = authorized, false = unauthorized

// ── Dashboard ─────────────────────────────────────────────
// [MINE] — Dashboard layout, item labels, and the four
//          game titles were chosen entirely by me and my partner.
let dashHover = null;

// ── Missile Game ──────────────────────────────────────────
// [MINE] — Variable declarations and game-state design.
// [AI-ASSISTED] — The concept of a 45-second timer with an
//                 accelerating difficulty curve was brainstormed
//                 with AI, then rewritten and integrated by me.
let hoverOption          = null;
let hoverOK              = false;
let selectedOption       = null;
let launchReady          = false;
let launchTarget         = null;
let missles              = [];
let launchMissles        = [];
let interceptedCount     = 0;
let groundHits           = 0;
let retaliationStartTime = 0;
let retaliationTimerEnd  = 0;
let missileGameResult    = null;
let missileGameOverTime  = 0;
const MAX_HITS           = 10;

// ── Missile Game GLITCHED extras ──────────────────────────
// [MINE] — The crash-sequence narrative and self-destruct
//          storytelling were designed by me and my partner.
// [AI-ASSISTED] — General glitch-effect descriptions were
//                 brainstormed with AI, then adapted to fit
//                 our specific screen-shaking implementation.
let glitchMalfunctionShown = false;
let glitchCrashPhase       = "none"; // "none" | "crashing" | "done"
let glitchCrashStart       = 0;
let glitchShakeAmt         = 0;
let glitchFreezeFrame      = null;
let glitchFreezeStart      = 0;

// ── Global Radar Sweep ────────────────────────────────────
// [MINE] — Game title and DEFCON narrative concept.
// [AI-ASSISTED] — The array-based threat-level and mistake
//                 tracking structure was brainstormed with AI,
//                 then rewritten to fit our DEFCON theme.
let radarLevel           = 5;
let radarAlerts          = [];
let radarCurrent         = null;
let radarScore           = 0;
let radarMistakes        = 0;
let radarPhase           = "playing";
let radarStartTime       = 0;
let radarLastSpawn       = 0;
let radarFeedback        = null;
let radarGameOverTime    = 0;
const RADAR_MAX_MISTAKES = 4;
const RADAR_WIN_TARGET   = 12;

// ── Radar GLITCHED extras ─────────────────────────────────
// [MINE] — Self-destruct countdown narrative when the
//          unauthorized user "wins" — designed by me and partner.
// [AI-ASSISTED] — Gibberish popup technique was brainstormed
//                 with AI, then adapted to our visual system.
let radarGlitchGibberish     = "";
let radarGlitchGibberishTime = 0;
let radarSelfDestructCount   = 5;
let radarSelfDestructStart   = 0;
let radarSelfDestructPhase   = "none"; // "none" | "counting" | "explode"

// ── Crypto Breaker ────────────────────────────────────────
// [MINE] — Game title, Cold War / Soviet theme, and all
//          word/hint pairs selected by me and my partner.
let cryptoWords = [
  { word:"BUNKER",  hint:"Underground shelter" },
  { word:"STRIKE",  hint:"An offensive attack" },
  { word:"VECTOR",  hint:"A direction or course" },
  { word:"RADAR",   hint:"Detection system" },
  { word:"LAUNCH",  hint:"To fire or send off" },
  { word:"TARGET",  hint:"Aim of an attack" },
  { word:"SECTOR",  hint:"A division of a map" },
  { word:"PATROL",  hint:"To guard an area" },
  { word:"ENGAGE",  hint:"To enter into conflict" },
  { word:"SORTIE",  hint:"A single combat mission" },
  { word:"WARHEAD", hint:"Explosive tip of a missile" },
  { word:"DEFCON",  hint:"Defense readiness level" },
  { word:"SHIELD",  hint:"Defensive protection" },
  { word:"RECON",   hint:"Reconnaissance mission" },
  { word:"STEALTH", hint:"Moving without detection" },
];

// [MINE] — Glitch word list concept (nonsense/corrupted keys)
//          designed by me and my partner to reinforce the
//          "unauthorized user" narrative.
let cryptoGlitchWords = [
  { word:"XQZRFM",  hint:"ERROR: DATA CORRUPTED" },
  { word:"KYPTLV",  hint:"UNKNOWN CLASSIFICATION" },
  { word:"WRZBNQ",  hint:"SIGNAL INTERFERENCE" },
  { word:"JVMPXK",  hint:"UNAUTHORIZED ACCESS" },
  { word:"QZNWBP",  hint:"SYSTEM FAULT 0x4F2" },
  { word:"FXVLQT",  hint:"DECRYPTION FAILED" },
  { word:"BZKRMW",  hint:"NULL REFERENCE ERROR" },
  { word:"PLYXZN",  hint:"MEMORY OVERFLOW" },
];

let cryptoAnswer   = "";
let cryptoHint     = "";
let cryptoGuesses  = [];
let cryptoInput    = "";
let cryptoPhase    = "playing";
let cryptoMessage  = "";
let cryptoMsgTime  = 0;
let cryptoGameOverTime = 0;
const CRYPTO_MAX_GUESSES = 6;

// [MINE] — "WHY WOULD YOU DO THIS :(" sad phase — original
//          narrative moment designed by me and my partner.
let cryptoSelfDestruct     = 5;
let cryptoSadPhase         = false;
let cryptoSadStart         = 0;

// ── Circuit Overload ──────────────────────────────────────
// [MINE] — Game title and WOPR mainframe narrative.
let circuitPhase        = "playing";
let circuitTemp         = 0;
let circuitNodes        = [];
let circuitCooldowns    = [];
let circuitScore        = 0;
let circuitStartTime    = 0;
let circuitLastSpawn    = 0;
let circuitWinTarget    = 30;
let circuitHoverNode    = null;
let circuitGameOverTime = 0;

// [AI-ASSISTED] — The concept of floating error messages as a
//                 visual feedback system was brainstormed with AI.
//                 The specific messages, placement logic, and
//                 integration with our glitch aesthetic were
//                 rewritten by me to match our terminal style.
let circuitGlitchErrors  = []; // {msg, x, y, born, lifespan}
let circuitGlitchMsgs    = [
  "THERMAL RUNAWAY",  "CORE TEMP CRITICAL", "MEMORY FAULT 0x3B",
  "BUFFER OVERFLOW",  "NULL POINTER",       "STACK CORRUPT",
  "SECTOR FAIL",      "BUS ERROR",          "KERNEL PANIC",
  "WATCHDOG TIMEOUT", "VOLTAGE SPIKE",      "CLOCK SKEW",
  "PARITY ERROR",     "CACHE MISS: FATAL",  "SYSTEM UNSTABLE",
];
let circuitGlitchLastError = 0;

// ── Misc ──────────────────────────────────────────────────
// [MINE] — All misc state variables.
let phaseStartTime   = 0;
let blinkTimer       = 0;
let retaliationPhase = null;
let retaliationStart = 0;
let cities           = [];
let systemMessage    = "";
let loadStartTime    = 0;
let loadDuration     = 0;
let attempts         = 0;
let isLoading        = false;
let blinkOn          = true;
let gridHoverCell    = null;

// [MINE] — Sound integration.
let sound;

// =========================================================
// SETUP
// [MINE] — Canvas size, font choice, and preload are
//          original decisions made by me and my partner.
// =========================================================
function setup() {
  createCanvas(700, 600);
  textFont('VT323');
}

function preload() {
  sound = loadSound('sounds/audio1.mp3');
}

// =========================================================
// DRAW
// [MINE] — The full screen-routing structure and all
//          screenState values were designed by me and partner.
// =========================================================
function draw() {
  background(0);

  if      (screenState === 0)    introScreen();
  else if (screenState === 0.5)  dashboardScreen();
  else if (screenState === 0.6)  dashboardScreenGlitched();
  else if (screenState === 1)    { screenState = 2; }
  else if (screenState === 2)    instructionsScreen();
  else if (screenState === 2.6)  instructionsScreenGlitched();
  else if (screenState === 3)    commandScreen();
  else if (screenState === 3.6)  commandScreenGlitched();
  else if (screenState === 3.5)  launchAnimation();
  else if (screenState === 3.65) launchAnimationGlitched();
  else if (screenState === 4)    retaliationScreen();
  else if (screenState === 4.6)  retaliationScreenGlitched();
  else if (screenState === 5)    missileGameOver();
  else if (screenState === 5.6)  missileGameOverGlitched();
  else if (screenState === 6)    instructionsScreen2();
  else if (screenState === 6.6)  instructionsScreen2Glitched();
  else if (screenState === 6.5)  radarScreen();
  else if (screenState === 6.55) radarScreenGlitched();
  else if (screenState === 7)    cryptoScreen();
  else if (screenState === 7.6)  cryptoScreenGlitched();
  else if (screenState === 8)    circuitScreen();
  else if (screenState === 8.6)  circuitScreenGlitched();
  else if (screenState === 9)    settingsScreen();
  else if (screenState === 9.6)  settingsScreenGlitched();
}

// =========================================================
// KEY PRESSED
// [MINE] — All key-handling logic and input routing.
// =========================================================
function keyPressed() {

  // ── INTRO ──────────────────────────────────────────────
  // [MINE] — Name entry, password gate, and "phelps" secret
  //          were all chosen by me and my partner.
  if (screenState === 0) {
    if (introPhase === "name") {
      if (keyCode === ENTER && typedText.trim().length > 0) {
        playerName    = typedText.trim();
        typedText     = "";
        introPhase    = "greeting";
        greetingStart = millis();
      } else if (keyCode === BACKSPACE) {
        typedText = typedText.slice(0, -1);
      }
      return;
    }
    if (introPhase === "password") {
      if (panicTriggered) return;
      if (keyCode === ENTER) {
        let attempt = passwordInput;
        passwordInput = "";
        if (attempt.toLowerCase() === "phelps") {
          accessGranted    = true;
          passwordAttempts = 0;
          panicTriggered   = false;
          screenState      = 0.5;
          introPhase       = "name";
        } else {
          passwordAttempts++;
          passwordMessage = "ERROR — ACCESS DENIED";
          passwordMsgTime = millis();
          if (passwordAttempts >= 4 && !panicTriggered) {
            panicTriggered = true;
            panicStart     = millis();
          }
        }
        return;
      }
      if (keyCode === BACKSPACE) passwordInput = passwordInput.slice(0, -1);
      return;
    }
  }

  // ── CRYPTO (authorized) ────────────────────────────────
  // [MINE] — Keyboard routing into the crypto game.
  if (screenState === 7) {
    if (cryptoPhase !== "playing") return;
    if (keyCode === ENTER) {
      cryptoSubmitGuess();
    } else if (keyCode === BACKSPACE) {
      if (cryptoInput.length > 0) cryptoInput = cryptoInput.slice(0, -1);
    }
    return;
  }

  // ── CRYPTO GLITCHED ────────────────────────────────────
  // [MINE] — Routing into the glitched crypto variant.
  if (screenState === 7.6) {
    if (cryptoPhase !== "playing") return;
    if (cryptoSadPhase) return;
    if (keyCode === ENTER) {
      cryptoSubmitGuessGlitched();
    } else if (keyCode === BACKSPACE) {
      if (cryptoInput.length > 0) cryptoInput = cryptoInput.slice(0, -1);
    }
    return;
  }
}

// [MINE] — keyTyped handler for live character input.
function keyTyped() {
  if (screenState === 0) {
    if (introPhase === "name" && key.length === 1) typedText += key;
    if (introPhase === "password" && !panicTriggered && key.length === 1) passwordInput += key;
  }
  if ((screenState === 7 || screenState === 7.6) && cryptoPhase === "playing") {
    if (!cryptoSadPhase && key.length === 1 && /[a-zA-Z]/.test(key) && cryptoInput.length < cryptoAnswer.length) {
      cryptoInput += key.toUpperCase();
    }
  }
}

// =========================================================
// MOUSE MOVED
// [MINE] — All hover-state logic and cursor changes.
// =========================================================
function mouseMoved() {
  hoverOption      = null;
  hoverOK          = false;
  dashHover        = null;
  gridHoverCell    = null;
  circuitHoverNode = null;
  cursor(ARROW);

  let isGlitched = !accessGranted;

  if (screenState === 0.5 || screenState === 0.6) {
    let items = getDashItems(isGlitched);
    for (let i = 0; i < items.length; i++) {
      if (overBox(items[i])) { dashHover = i; cursor(HAND); break; }
    }
    if (overBox(getSettingsBtn())) cursor(HAND);
  }
  if (screenState === 2 || screenState === 2.6 || screenState === 6 || screenState === 6.6) {
    if (overBox(getOKBox()))   { hoverOK = true; cursor(HAND); }
    if (overBox(getBackBox())) cursor(HAND);
  }
  if ([3, 3.6, 3.5, 3.65, 4, 4.6].includes(screenState)) {
    if (overBox(getBackBox())) cursor(HAND);
  }
  if (screenState === 3 || screenState === 3.6) {
    let boxes = getOptionBoxes();
    for (let dir of ["N","S","E","W"]) {
      if (overBox(boxes[dir])) { hoverOption = dir; cursor(HAND); break; }
    }
  }
  if ((screenState === 8 || screenState === 8.6) && circuitPhase === "playing") {
    for (let i = 0; i < circuitNodes.length; i++) {
      let n = circuitNodes[i];
      if (dist(mouseX, mouseY, n.x, n.y) < n.r + 6) {
        circuitHoverNode = i; cursor(HAND); break;
      }
    }
  }
  if ([6.5, 6.55, 7, 7.6, 8, 8.6, 9, 9.6].includes(screenState)) {
    if (overBox(getBackBox())) cursor(HAND);
  }
  if ((screenState === 6.5 || screenState === 6.55) && radarPhase === "playing" && radarCurrent && !radarFeedback) {
    if (overBox(getRadarBtn("R")) || overBox(getRadarBtn("F"))) cursor(HAND);
  }
}

// =========================================================
// MOUSE PRESSED
// [MINE] — All click routing between screens.
// =========================================================
function mousePressed() {
  
  sound.play();

  if (screenState === 0) return;

  let isGlitched = !accessGranted;

  // ── DASHBOARD (both) ───────────────────────────────────
  // [MINE] — Dashboard click routing designed by me and partner.
  if (screenState === 0.5 || screenState === 0.6) {
    if (overBox(getSettingsBtn())) {
      screenState = isGlitched ? 9.6 : 9; return;
    }
    let items = getDashItems(isGlitched);
    for (let i = 0; i < items.length; i++) {
      if (overBox(items[i])) {
        let a = items[i].action;
        if (a === "missiles") {
          resetMissileGame();
          screenState = isGlitched ? 2.6 : 2;
        } else if (a === "radar") {
          screenState = isGlitched ? 6.6 : 6;
        } else if (a === "crypto") {
          isGlitched ? initCryptoGlitched() : initCrypto();
          screenState = isGlitched ? 7.6 : 7;
        } else if (a === "circuit") {
          initCircuit(); screenState = isGlitched ? 8.6 : 8;
        }
        return;
      }
    }
    return;
  }

  // ── MISSILE BRIEFING ───────────────────────────────────
  // [MINE] — Screen transition logic.
  if (screenState === 2) {
    if (overBox(getBackBox())) { screenState = 0.5; return; }
    if (overBox(getOKBox())) screenState = 3;
    return;
  }
  if (screenState === 2.6) {
    if (overBox(getBackBox())) { screenState = 0.6; return; }
    if (overBox(getOKBox())) screenState = 3.6;
    return;
  }

  // ── MISSILE COMMAND ────────────────────────────────────
  // [MINE] — Directional command screen was designed entirely
  //          by me and my partner. The AI suggested a standard
  //          RPG menu which we rejected in favor of this layout.
  if (screenState === 3) {
    if (overBox(getBackBox())) { screenState = 2; return; }
    let boxes = getOptionBoxes();
    for (let dir of ["N","S","E","W"]) {
      if (overBox(boxes[dir])) {
        selectedOption = dir; startLaunch(); screenState = 3.5; return;
      }
    }
    return;
  }
  if (screenState === 3.6) {
    if (overBox(getBackBox())) { screenState = 2.6; return; }
    let boxes = getOptionBoxes();
    for (let dir of ["N","S","E","W"]) {
      if (overBox(boxes[dir])) {
        selectedOption = dir; startLaunch(); screenState = 3.65; return;
      }
    }
    return;
  }

  // ── LAUNCH ─────────────────────────────────────────────
  if (screenState === 3.5 || screenState === 3.65) return;

  // ── RETALIATION ────────────────────────────────────────
  // [MINE] — Click-to-intercept mechanic.
  // [AI-ASSISTED] — The general concept of splicing a missile
  //                 from the array on click was in an AI example;
  //                 adapted and integrated into our system by me.
  if (screenState === 4) {
    if (overBox(getBackBox())) { resetMissileGame(); screenState = 0.5; return; }
    for (let i = missles.length - 1; i >= 0; i--) {
      if (dist(mouseX, mouseY, missles[i].x, missles[i].y) < 36) {
        missles.splice(i, 1); interceptedCount++; break;
      }
    }
    return;
  }
  if (screenState === 4.6) {
    if (overBox(getBackBox())) { resetMissileGame(); screenState = 0.6; return; }
    if (glitchCrashPhase !== "none") return;
    for (let i = missles.length - 1; i >= 0; i--) {
      if (dist(mouseX, mouseY, missles[i].x, missles[i].y) < 36) {
        missles.splice(i, 1); interceptedCount++; break;
      }
    }
    return;
  }

  // ── MISSILE GAME OVER ──────────────────────────────────
  if (screenState === 5) {
    if (millis() - missileGameOverTime < 3000) return;
    resetMissileGame(); screenState = 0.5; return;
  }
  if (screenState === 5.6) {
    if (millis() - missileGameOverTime < 3000) return;
    resetMissileGame(); screenState = 0.6; return;
  }

  // ── RADAR INSTRUCTIONS ─────────────────────────────────
  if (screenState === 6) {
    if (overBox(getBackBox())) { screenState = 0.5; return; }
    if (overBox(getOKBox())) { initRadar(false); screenState = 6.5; }
    return;
  }
  if (screenState === 6.6) {
    if (overBox(getBackBox())) { screenState = 0.6; return; }
    if (overBox(getOKBox())) { initRadar(true); screenState = 6.55; }
    return;
  }

  // ── RADAR GAME ─────────────────────────────────────────
  // [AI-ASSISTED] — Array-based alert response logic was
  //                 brainstormed with AI; rewritten by me to
  //                 use our DEFCON level system.
  if (screenState === 6.5) {
    if (overBox(getBackBox())) { screenState = 0.5; return; }
    if (radarPhase === "over" || radarPhase === "win") {
      if (millis() - radarGameOverTime < 3000) return;
      screenState = 0.5; return;
    }
    if (radarCurrent && radarPhase === "playing" && !radarFeedback) {
      if (overBox(getRadarBtn("R"))) radarRespond(true, false);
      if (overBox(getRadarBtn("F"))) radarRespond(false, false);
    }
    return;
  }
  if (screenState === 6.55) {
    if (overBox(getBackBox())) { screenState = 0.6; return; }
    if (radarSelfDestructPhase === "explode") {
      if (millis() - radarGameOverTime < 3000) return;
      screenState = 0.6; return;
    }
    if (radarPhase === "over" || radarPhase === "win") {
      if (millis() - radarGameOverTime < 3000) return;
      screenState = 0.6; return;
    }
    if (radarCurrent && radarPhase === "playing" && !radarFeedback) {
      if (overBox(getRadarBtn("R"))) radarRespond(true, true);
      if (overBox(getRadarBtn("F"))) radarRespond(false, true);
    }
    return;
  }

  // ── CRYPTO ─────────────────────────────────────────────
  if (screenState === 7) {
    if (overBox(getBackBox())) { screenState = 0.5; return; }
    if (cryptoPhase !== "playing") {
      if (millis() - cryptoGameOverTime < 3000) return;
      screenState = 0.5; return;
    }
    return;
  }
  if (screenState === 7.6) {
    if (overBox(getBackBox())) { screenState = 0.6; return; }
    if (cryptoSadPhase) {
      if (millis() - cryptoSadStart > 3000) { screenState = 0.6; return; }
      return;
    }
    if (cryptoPhase !== "playing") {
      if (millis() - cryptoGameOverTime < 3000) return;
      screenState = 0.6; return;
    }
    return;
  }

  // ── CIRCUIT ────────────────────────────────────────────
  if (screenState === 8) {
    if (overBox(getBackBox())) { screenState = 0.5; return; }
    if (circuitPhase !== "playing") {
      if (millis() - circuitGameOverTime < 3000) return;
      screenState = 0.5; return;
    }
    for (let i = circuitNodes.length - 1; i >= 0; i--) {
      let n = circuitNodes[i];
      if (dist(mouseX, mouseY, n.x, n.y) < n.r + 6) {
        circuitNodes.splice(i, 1); circuitScore++;
        circuitTemp = max(0, circuitTemp - 4);
        circuitCooldowns.push({ x: n.x, y: n.y, r: n.r, alpha: 200, born: millis() });
        break;
      }
    }
    return;
  }
  if (screenState === 8.6) {
    if (overBox(getBackBox())) { screenState = 0.6; return; }
    if (circuitPhase !== "playing") {
      if (millis() - circuitGameOverTime < 3000) return;
      screenState = 0.6; return;
    }
    for (let i = circuitNodes.length - 1; i >= 0; i--) {
      let n = circuitNodes[i];
      if (dist(mouseX, mouseY, n.x, n.y) < n.r + 6) {
        circuitNodes.splice(i, 1); circuitScore++;
        // [MINE] — Reduced cooling in glitch version is a
        //          deliberate hostile design choice by me and partner.
        circuitTemp = max(0, circuitTemp - 2);
        circuitCooldowns.push({ x: n.x, y: n.y, r: n.r, alpha: 200, born: millis() });
        break;
      }
    }
    return;
  }

  // ── SETTINGS ───────────────────────────────────────────
  if (screenState === 9) {
    if (overBox(getBackBox())) { screenState = 0.5; return; }
    return;
  }
  if (screenState === 9.6) {
    if (overBox(getBackBox())) { screenState = 0.6; return; }
    return;
  }
}

// =========================================================
// HELPERS
// [MINE] — All layout helper functions and box definitions
//          were designed by me and my partner.
// =========================================================
function overBox(b) {
  return mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h;
}
function getOKBox()   { return { x: width/2-60, y: height-80, w: 120, h: 50 }; }
function getBackBox() { return { x: 10, y: height-50, w: 160, h: 36 }; }

// [MINE] — The N/S/E/W command layout was our original design.
//          The AI suggested a standard list/RPG menu which we rejected.
function getOptionBoxes() {
  let w=200, h=110, gapX=40, gapY=30;
  let cx=width/2, cy=height/2-20;
  return {
    N:{x:cx-w-gapX/2, y:cy-h-gapY/2, w,h, label:"NORTH", sub:"↑ POLAR STRIKE"},
    S:{x:cx+gapX/2,   y:cy-h-gapY/2, w,h, label:"SOUTH", sub:"↓ SOUTHERN STRIKE"},
    E:{x:cx-w-gapX/2, y:cy+gapY/2,   w,h, label:"EAST",  sub:"→ EASTERN STRIKE"},
    W:{x:cx+gapX/2,   y:cy+gapY/2,   w,h, label:"WEST",  sub:"← WESTERN STRIKE"}
  };
}

// [MINE] — Dashboard item structure, labels, and action routing.
function getDashItems(glitched) {
  let items = [
    { label:"[ INITIATE MISSILE STRIKE ]",  sub:"Deliver payload to sector — maintain defense integrity",  action:"missiles", highlight:true  },
    { label:"[ GLOBAL RADAR SWEEP ]",        sub:"Classify threats — differentiate noise from real attacks", action:"radar",    highlight:false },
    { label:"[ CRYPTO BREAKER ]",            sub:"Crack Soviet encryption keys — gain enemy intelligence",  action:"crypto",   highlight:false },
    { label:"[ CIRCUIT OVERLOAD ]",          sub:"Prevent WOPR mainframe overheating during calculations",  action:"circuit",  highlight:false },
  ];
  if (glitched) {
    items[0].label = "[ "+glitchStr(18)+" ]";
    items[1].label = "[ "+glitchStr(16)+" ]";
    items[2].label = "[ "+glitchStr(14)+" ]";
    items[3].label = "[ "+glitchStr(16)+" ]";
    items[0].sub = "ERR_0x"+hex(floor(random(65535)),4)+" — UNAUTHORIZED MODULE";
    items[1].sub = "ERR_0x"+hex(floor(random(65535)),4)+" — SIGNAL CORRUPT";
    items[2].sub = "ERR_0x"+hex(floor(random(65535)),4)+" — DECRYPT FAILED";
    items[3].sub = "ERR_0x"+hex(floor(random(65535)),4)+" — CORE UNSTABLE";
  }
  let startY=175, itemH=68, gap=22;
  for (let i=0; i<items.length; i++) {
    items[i].x = 60;
    items[i].y = startY + i*(itemH+gap);
    items[i].w = width - 120;
    items[i].h = itemH;
  }
  return items;
}

// [MINE] — Settings button placement.
function getSettingsBtn() {
  return { x: width-145, y: height-44, w: 134, h: 32 };
}

// [MINE] — Back button rendering — authorized (green) vs
//          glitched (red) dual-state style is our design.
function drawBackButton(glitched) {
  let b = getBackBox();
  let hover = overBox(b);
  stroke(glitched ? color(180,0,0) : color(0,180,0)); strokeWeight(1);
  if (hover) fill(glitched?color(40,0,0):color(0,40,0)); else noFill();
  rect(b.x, b.y, b.w, b.h, 3);
  noStroke();
  fill(glitched ? color(200,50,0) : color(0,200,0));
  textAlign(LEFT, CENTER);
  textSize(15);
  text("← BACK TO MENU", b.x+10, b.y+b.h/2);
}

// [MINE] — Shared screen header style.
function drawScreenHeader(title, glitched) {
  fill(glitched?color(255,40,0):color(0,255,0)); textAlign(LEFT); textSize(14);
  text("WOPR TERMINAL — "+title, 20, 25);
  textSize(13); fill(glitched?color(120,0,0):color(0,100,0));
  text("════════════════════════════════════════════════════════════════════", 20, 40);
}

// [MINE] — Utility shuffle function.
function shuffle(arr) {
  for(let i=arr.length-1;i>0;i--){
    let j=floor(random(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

// ── Glitch text helpers ────────────────────────────────────
// [AI-ASSISTED] — The idea of a shared glitch character set and
//                 a per-character corruption function was
//                 brainstormed with AI. The specific character
//                 set and integration into our screens were
//                 chosen and rewritten by me and my partner.
const GLITCH_CHARS = "01XQZRFMKYPTVWBJLNS!#@%*^&~";
function glitchStr(len) {
  let s = "";
  for (let i=0; i<len; i++) s += GLITCH_CHARS[floor(random(GLITCH_CHARS.length))];
  return s;
}
function glitchCorrupt(str) {
  let out = "";
  for (let i=0;i<str.length;i++) {
    if (random()<0.25) out += GLITCH_CHARS[floor(random(GLITCH_CHARS.length))];
    else out += str[i];
  }
  return out;
}

// [MINE] — Scanline overlay for CRT feel — written by me.
function drawScanlines(alpha) {
  noStroke();
  for (let y=0; y<height; y+=3) {
    fill(0,0,0,alpha);
    rect(0,y,width,1);
  }
}

// [AI-ASSISTED] — The concept of random horizontal bars as a
//                 glitch visual technique was brainstormed with AI.
//                 Colors, intensity scaling, and placement were
//                 rewritten by me to match our red/green theme.
function drawGlitchBars(intensity) {
  let n = floor(intensity * 8);
  for (let i=0;i<n;i++) {
    let gy = random(height);
    let gw = random(60, 300);
    let gx = random(width);
    let gc = random()<0.5 ? color(0,random(80,200),0,random(40,100)) : color(random(80,200),0,0,random(40,100));
    noStroke(); fill(gc);
    rect(gx,gy,gw,random(2,7));
  }
}

// =========================================================
// STATIC NOISE
// [MINE] — The phosphor grain noise and slow CRT scan band
//          effect were designed and written by me and partner
//          to give the authorized screens an authentic CRT feel.
//          NOT used on glitched screens — intentional design choice.
// =========================================================
function drawStaticNoise() {
  noStroke();
  let density = 260;
  for (let i = 0; i < density; i++) {
    let nx = random(width);
    let ny = random(height);
    let brightness = random(40, 110);
    let alpha = random(6, 22);
    fill(0, brightness, 0, alpha);
    rect(nx, ny, random(1, 2.2), random(1, 1.8));
  }
  let bandY = (millis() / 22) % height;
  fill(0, 255, 0, 5);
  rect(0, bandY, width, random(4, 9));
  if (random() < 0.011) {
    fill(0, 255, 0, random(60, 100));
    let fx = random(width);
    let fy = random(height);
    rect(fx, fy, random(1, 3), 1);
  }
}

// =========================================================
// INTRO SCREEN
// [MINE] — The entire intro flow (name entry → greeting →
//          password → panic sequence) and the "Daniel Phelps"
//          narrative were designed by me and my partner.
// =========================================================
function introScreen() {

  if (introPhase === "name") {
    textAlign(CENTER, CENTER);
    fill(0,255,0); textSize(48);
    text("Hello", width/2, height/2-60);
    textSize(18); fill(0,180,0);
    text("Enter your name:", width/2, height/2+20);
    textSize(28); fill(0,255,0);
    text(typedText, width/2, height/2+60);
    let blink = floor(millis()/500)%2;
    if (blink===1) {
      let tw = textWidth(typedText);
      noStroke(); fill(0,255,0);
      rect(width/2+tw/2+2, height/2+44, 3, 24);
    }
    drawStaticNoise();
    return;
  }

  if (introPhase === "greeting") {
    textAlign(CENTER,CENTER); fill(0,255,0); textSize(48);
    text("Hello, "+playerName, width/2, height/2);
    if (millis()-greetingStart > 3000) {
      introPhase      = "password";
      passwordInput   = ""; passwordAttempts = 0;
      passwordMessage = ""; panicTriggered   = false;
    }
    drawStaticNoise();
    return;
  }

  if (introPhase === "password") {
    let elapsed = panicTriggered ? (millis()-panicStart)/1000 : 0;

    // [MINE] — 5-second panic countdown and unauthorized redirect
    //          are original design decisions by me and my partner.
    if (panicTriggered && elapsed > 5) {
      accessGranted = false;
      screenState = 0.6; introPhase = "name"; return;
    }

    // [AI-ASSISTED] — General shake/flash panic visual technique
    //                 was brainstormed with AI. The specific text,
    //                 colors, and "UNAUTHORIZED ACCESS DETECTED"
    //                 narrative were written by me and my partner.
    if (panicTriggered) {
      background(int(random(0,20)),0,0);
      noStroke(); fill(255,0,0, min(180,40+elapsed*28+random(0,30)));
      rect(0,0,width,height);
      let shakeAmt = min(10, elapsed*2.5);
      translate(random(-shakeAmt,shakeAmt), random(-shakeAmt,shakeAmt));
      let ng = int(elapsed*6);
      for (let i=0;i<ng;i++) {
        fill(0,255,0,random(30,120));
        rect(random(-20,0),random(height),random(50,width+40),random(2,8));
      }
      let nc = int(elapsed*4);
      let chars="01XZERR!#@%*ACCESS";
      for (let i=0;i<nc;i++) {
        textSize(random(10,20)); fill(0,255,0,random(40,160)); textAlign(LEFT);
        let s="";
        for (let c=0;c<int(random(4,16));c++) s+=chars[int(random(chars.length))];
        text(s, random(width), random(height));
      }
      textAlign(CENTER,CENTER);
      fill(255,0,0); textSize(80+sin(millis()/80)*10);
      text("ERROR", width/2, height/2-80);
      fill(255,int(random(0,80)),0); textSize(36+sin(millis()/60)*6);
      text("UNAUTHORIZED ACCESS DETECTED", width/2, height/2);
      fill(255,0,0); textSize(22);
      text("INITIATING SECURITY LOCKDOWN . . .", width/2, height/2+55);
      fill(255,200,0); textSize(18);
      text("SYSTEM OVERRIDE IN: "+ceil(5-elapsed)+"s", width/2, height/2+100);
      if (elapsed>1) {
        fill(255,0,0,200+sin(millis()/50)*55); textSize(28);
        text("⚠ DANGER ⚠", width/2, 50);
        text("⚠ DANGER ⚠", width/2, height-50);
      }
      if (elapsed>2.5) {
        fill(255,50,0,200); textSize(20);
        text("TRACING CONNECTION . . .", width/2, height/2+140);
      }
      return;
    }

    // [MINE] — WOPR login screen layout and "ref: 2394-JKL" detail.
    fill(0,255,0); textAlign(LEFT,CENTER); textSize(22);
    text('WOPR SYSTEM ACCESS', 30, 40);
    text('COPYRIGHT 1983 - UNAUTHORIZED ACCESS PROHIBITED', 30, 60);
    textSize(16); fill(0,120,0);
    text('════════════════════════════════════════════════', 30, 80);
    fill(0,165,0); textSize(18);
    text('SYSTEM LOG [ref: 2394-JKL]', 30, 115);
    text('Last successful login: Prof. Phelps', 30, 138);
    textSize(22); fill(0,255,0);
    text('Security verification required.', 30, 175);
    text('Enter password to continue:', 30, 200);
    textAlign(CENTER,CENTER); textSize(32); fill(0,255,0);
    let masked = "> "+"•".repeat(passwordInput.length);
    text(masked, width/2, height/2);
    let blink = floor(millis()/500)%2;
    if (blink===1) {
      let tw=textWidth(masked); fill(0,255,0); noStroke();
      rect(width/2+tw/2+3, height/2-14, 3, 28);
    }
    if (passwordMessage!=="" && millis()-passwordMsgTime<2000) {
      textAlign(CENTER,CENTER); textSize(22); fill(255,0,0);
      text(passwordMessage, width/2, height/2+60);
    }
    textAlign(LEFT); textSize(16); fill(0,140,0);
    text("Failed attempts: "+passwordAttempts, 30, height-40);
    if (passwordAttempts>=2) {
      textAlign(CENTER); fill(255,100,0); textSize(16);
      text("WARNING: Further failed attempts will trigger security protocol", width/2, height-70);
    }
    drawStaticNoise();
  }
}

// =========================================================
// DASHBOARD — AUTHORIZED
// [MINE] — Full layout, operator info fields, and copyright
//          line designed by me and my partner.
// =========================================================
function dashboardScreen() {
  fill(0,255,0); textAlign(LEFT);
  textSize(14); fill(0,180,0);
  text("WOPR SYSTEM ACCESS", 30, 25);
  text("COPYRIGHT 1983 — UNAUTHORIZED ACCESS PROHIBITED", 30, 42);
  textSize(13); fill(0,100,0);
  text("════════════════════════════════════════════════════════════════════", 30, 58);
  textSize(13); fill(0,140,0);
  text("OPERATOR: "+playerName.toUpperCase()+"   |   CLEARANCE: LEVEL 5   |   SESSION: ACTIVE   |   NODE: WARGAMES-1983", 30, 74);
  textSize(13); fill(0,100,0);
  text("════════════════════════════════════════════════════════════════════", 30, 90);
  textAlign(CENTER); fill(0,255,0); textSize(26);
  text("WOPR MAIN MENU", width/2, 120);
  textSize(14); fill(0,165,0);
  text("Select an option below", width/2, 150);

  let items = getDashItems(false);
  for (let i=0; i<items.length; i++) {
    let item=items[i], hover=(dashHover===i);
    stroke(item.highlight ? color(0,255,0) : color(0,180,0));
    strokeWeight(hover?2:1);
    if (hover) fill(0,40,0);
    else if (item.highlight) fill(0,20,0);
    else noFill();
    rect(item.x, item.y, item.w, item.h, 4);
    noStroke();
    textAlign(LEFT,TOP); textSize(item.highlight?20:18);
    fill(0, hover?220:255, 0);
    text(item.label, item.x+18, item.y+14);
    textSize(13); fill(0,140,0);
    text(item.sub, item.x+18, item.y+40);
  }

  let sb = getSettingsBtn();
  let sHov = overBox(sb);
  stroke(0,140,0); strokeWeight(1);
  if (sHov) fill(0,30,0); else noFill();
  rect(sb.x, sb.y, sb.w, sb.h, 3); noStroke();
  fill(0, sHov?180:140, 0); textAlign(CENTER,CENTER); textSize(13);
  text("⚙ OPERATOR SETTINGS", sb.x+sb.w/2, sb.y+sb.h/2);

  textAlign(CENTER); textSize(13); fill(0,80,0);
  text("WOPR v4.1.2 — CLASSIFIED — DO NOT DISTRIBUTE", width/2, height-20);

  drawStaticNoise();
}

// =========================================================
// DASHBOARD — GLITCHED
// [MINE] — The red/corrupt dual-state aesthetic was our
//          original design decision. The unauthorized operator
//          line content was written by me and my partner.
// [AI-ASSISTED] — General concept of corrupting text on
//                 glitched screens was brainstormed with AI;
//                 specific implementation rewritten by me.
// =========================================================
function dashboardScreenGlitched() {
  drawGlitchBars(0.4);

  let hdr1 = glitchCorrupt("WOPR SYSTEM ACCESS");
  let hdr2 = glitchCorrupt("COPYRIGHT 1983 — UNAUTHORIZED ACCESS PROHIBITED");
  textAlign(LEFT); textSize(14); fill(random()<0.1?color(255,0,0):color(180,0,0));
  text(hdr1, 30, 25);
  textSize(13); fill(random()<0.1?color(200,0,0):color(150,0,0));
  text(hdr2, 30, 42);
  textSize(13); fill(120,0,0);
  text("════════════════════════════════════════════════════════════════════", 30, 58);

  // [MINE] — "CLEARANCE: UNAUTHORIZED | SESSION: COMPROMISED" line
  //          is original hostile design text by me and my partner.
  let opLine = "OPERATOR: ???   |   CLEARANCE: UNAUTHORIZED   |   SESSION: COMPROMISED";
  textSize(13); fill(200,50,0);
  text(random()<0.15 ? glitchCorrupt(opLine) : opLine, 30, 74);
  textSize(13); fill(100,0,0);
  text("════════════════════════════════════════════════════════════════════", 30, 90);

  textAlign(CENTER); fill(random()<0.1?color(255,0,0):color(200,0,0)); textSize(26);
  text(random()<0.15?glitchCorrupt("WOPR MAIN MENU"):"WOPR MAIN MENU", width/2, 120);
  textSize(14); fill(150,50,0);
  text(random()<0.2?glitchCorrupt("Select an option below"):"Select an option below", width/2, 150);

  let items = getDashItems(true);
  for (let i=0; i<items.length; i++) {
    let item=items[i], hover=(dashHover===i);
    stroke(color(random()<0.1?255:180, 0, 0));
    strokeWeight(hover?2:1);
    if (hover) fill(40,0,0); else noFill();
    rect(item.x, item.y, item.w, item.h, 4);
    noStroke();
    textAlign(LEFT,TOP); textSize(18);
    fill(random()<0.05?color(255,255,0):color(200, hover?100:50, 0));
    text(item.label, item.x+18, item.y+14);
    textSize(13); fill(120,30,0);
    text(item.sub, item.x+18, item.y+40);
  }

  let sb = getSettingsBtn();
  let sHov = overBox(sb);
  stroke(120,0,0); strokeWeight(1);
  if (sHov) fill(40,0,0); else noFill();
  rect(sb.x, sb.y, sb.w, sb.h, 3); noStroke();
  fill(sHov?color(200,50,0):color(140,30,0)); textAlign(CENTER,CENTER); textSize(13);
  text("⚙ "+glitchCorrupt("OPERATOR SETTINGS"), sb.x+sb.w/2, sb.y+sb.h/2);

  // [MINE] — "UNAUTHORIZED USER DETECTED — ALL ACTIONS LOGGED"
  //          warning text is original by me and my partner.
  let blink = floor(millis()/700)%2;
  if (blink===1) {
    textAlign(CENTER); textSize(13); fill(180,0,0);
    text("⚠ UNAUTHORIZED USER DETECTED — ALL ACTIONS LOGGED ⚠", width/2, height-20);
  }

  drawScanlines(25);
}

// =========================================================
// SETTINGS — AUTHORIZED
// [MINE] — All settings rows, values, and the "Daniel Phelps"
//          operator identity are original by me and my partner.
// =========================================================
function settingsScreen() {
  drawScreenHeader("OPERATOR SETTINGS", false);

  textAlign(CENTER); fill(0,255,0); textSize(24);
  text("OPERATOR SETTINGS", width/2, 68);
  textSize(13); fill(0,100,0);
  text("────────────────────────────────────────────────────────────────────", width/2, 84);

  let rows = [
    { label:"OPERATOR NAME",        val:"Daniel Phelps"           },
    { label:"CLEARANCE LEVEL",      val:"LEVEL 5 — AUTHORIZED"    },
    { label:"NODE ID",              val:"WARGAMES-1983"            },
    { label:"SESSION TOKEN",        val:"0xF3A9-C821-D047"         },
    { label:"LAST LOGIN",           val:"1983-06-06  03:47 UTC"   },
    { label:"SIMULATION MODE",      val:"GLOBAL THERMONUCLEAR"    },
    { label:"STRIKE AUTHORIZATION", val:"ENABLED"                  },
    { label:"RESPONSE PROTOCOL",    val:"MUTUAL ASSURED"          },
    { label:"ENCRYPTION KEY",       val:"AES-256 / ACTIVE"        },
    { label:"SYSTEM INTEGRITY",     val:"ALL SYSTEMS NOMINAL"     },
    { label:"ACTIVE GAMES",         val:"4 MODULES LOADED"        },
    { label:"UPTIME",               val:"09983:14:22"             },
  ];

  let startY=100, rowH=36, lx=40, vx=310;
  for (let i=0; i<rows.length; i++) {
    let y = startY + i*rowH;
    noStroke(); fill(0, i%2===0?15:8, 0);
    rect(30, y-14, width-60, rowH-2, 2);
    textAlign(LEFT,CENTER); textSize(15); fill(0,180,0);
    text(rows[i].label, lx, y);
    fill(0,255,0); textSize(15);
    text(rows[i].val, vx, y);
    stroke(0,60,0); strokeWeight(1);
    line(30, y+rowH/2+4, width-30, y+rowH/2+4);
    noStroke();
  }

  let blink = floor(millis()/800)%2;
  if (blink===1) {
    fill(0,255,0,200); textAlign(CENTER); textSize(14);
    text("● TERMINAL SECURE — ALL CHANNELS ENCRYPTED", width/2, height-60);
  }

  drawBackButton(false);
}

// =========================================================
// SETTINGS — GLITCHED
// [MINE] — The concept of showing ERROR values instead of real
//          data for the unauthorized user is our original design.
// =========================================================
function settingsScreenGlitched() {
  drawScreenHeader("OPERATOR SETTINGS", true);
  drawGlitchBars(0.3);

  textAlign(CENTER); fill(200,50,0); textSize(24);
  text(glitchCorrupt("OPERATOR SETTINGS"), width/2, 68);
  textSize(13); fill(100,0,0);
  text("────────────────────────────────────────────────────────────────────", width/2, 84);

  let labels = [
    "OPERATOR NAME","CLEARANCE LEVEL","NODE ID","SESSION TOKEN",
    "LAST LOGIN","SIMULATION MODE","STRIKE AUTHORIZATION","RESPONSE PROTOCOL",
    "ENCRYPTION KEY","SYSTEM INTEGRITY","ACTIVE GAMES","UPTIME",
  ];

  let startY=100, rowH=36, lx=40, vx=310;
  for (let i=0; i<labels.length; i++) {
    let y = startY + i*rowH;
    noStroke(); fill(i%2===0?15:8, 0, 0);
    rect(30, y-14, width-60, rowH-2, 2);
    textAlign(LEFT,CENTER); textSize(15); fill(150,50,0);
    text(labels[i], lx, y);
    fill(random()<0.15?color(255,200,0):color(200,50,0)); textSize(15);
    let val = random() < 0.5 ? "ERROR" : "0x"+hex(floor(random(65535)),4)+" — "+glitchStr(6);
    text(val, vx, y);
    stroke(80,0,0); strokeWeight(1);
    line(30, y+rowH/2+4, width-30, y+rowH/2+4);
    noStroke();
  }

  let blink = floor(millis()/400)%2;
  if (blink===1) {
    fill(200,0,0,220); textAlign(CENTER); textSize(14);
    text("⚠ UNAUTHORIZED ACCESS — SECURITY BREACH LOGGED ⚠", width/2, height-60);
  }

  drawScanlines(30);
  drawBackButton(true);
}

// =========================================================
// MISSILE GAME — AUTHORIZED INSTRUCTIONS
// [MINE] — Layout, mission objectives text, tip lines, and
//          all Cold War framing written by me and my partner.
// =========================================================
function instructionsScreen() {
  drawScreenHeader("MISSILE STRIKE", false);

  textAlign(CENTER); fill(0,255,0); textSize(30);
  text("INITIATE MISSILE STRIKE", width/2, 75);
  textSize(13); fill(0,160,0);
  text("Deliver a nuclear payload to a designated sector while maintaining domestic defense integrity.", width/2, 100);
  fill(0,100,0);
  text("────────────────────────────────────────────────────────────────────", width/2, 116);

  let x=65, lineH=42, startY=158;
  textAlign(LEFT); textSize(19); fill(0,255,0);
  text("MISSION OBJECTIVES:", x, startY);
  textSize(16); fill(0,200,0);
  text("1. SELECT a strike direction (N/S/E/W) on the command screen.", x, startY + lineH);
  text("2. MISSILES launch automatically toward your chosen sector.", x, startY + lineH*2);
  text("3. BRACE for retaliation — enemy missiles inbound for 45s.", x, startY + lineH*3);
  text("4. INTERCEPT incoming missiles by clicking on them.", x, startY + lineH*4);
  text("5. SURVIVE — "+MAX_HITS+" ground hits and the mission fails.", x, startY + lineH*5);

  let tipY = startY + lineH*5 + 28;
  fill(0,255,0); textSize(14); textAlign(CENTER);
  text("────────────────────────────────────────────────────────────────────", width/2, tipY);
  fill(0,165,0); textSize(14);
  text("Missiles accelerate every 15 seconds — intercept early!", width/2, tipY + 22);
  text("Survive 45 seconds with fewer than "+MAX_HITS+" ground hits to win.", width/2, tipY + 42);

  let ok=getOKBox(), hover=overBox(ok);
  stroke(0,255,0); if(hover) fill(0,255,0); else noFill();
  rect(ok.x,ok.y,ok.w,ok.h,4); noStroke();
  textSize(20); textAlign(CENTER,CENTER);
  fill(hover?0:255, hover?0:255, hover?0:0);
  text("[ LAUNCH ]", ok.x+ok.w/2, ok.y+ok.h/2);

  drawBackButton(false);
}

// =========================================================
// MISSILE GAME — GLITCHED INSTRUCTIONS
// [MINE] — "YOU CANNOT WIN." line and hostile design framing
//          are original by me and my partner.
// =========================================================
function instructionsScreenGlitched() {
  drawScreenHeader("MISSILE STRIKE", true);
  drawGlitchBars(0.25);

  textAlign(CENTER); fill(random()<0.1?color(255,200,0):color(200,50,0)); textSize(30);
  text(glitchCorrupt("INITIATE MISSILE STRIKE"), width/2, 75);
  textSize(13); fill(150,50,0);
  text("Deliver a nuclear payload to a designated sector — UNAUTHORIZED USER DETECTED", width/2, 100);
  fill(100,0,0);
  text("────────────────────────────────────────────────────────────────────", width/2, 116);

  let x=65, lineH=42, startY=158;
  textAlign(LEFT); textSize(19); fill(200,50,0);
  text("MISSION OBJECTIVES:", x, startY);
  textSize(16); fill(180,50,0);
  let lines = [
    "1. SELECT a strike direction (N/S/E/W) on the command screen.",
    "2. MISSILES launch automatically toward your chosen sector.",
    "3. BRACE for retaliation — enemy missiles inbound for 45s.",
    "4. INTERCEPT incoming missiles by clicking on them.",
    "5. SURVIVE — "+MAX_HITS+" ground hits and the mission fails.",
  ];
  for (let i=0;i<lines.length;i++) {
    fill(random()<0.1?color(255,200,0):color(180,50,0));
    text(random()<0.15?glitchCorrupt(lines[i]):lines[i], x, startY + (i+1)*lineH);
  }

  let tipY = startY + 6*lineH;
  fill(150,30,0); textSize(14); textAlign(CENTER);
  text("────────────────────────────────────────────────────────────────────", width/2, tipY);
  // [MINE] — "YOU CANNOT WIN." is the core project theme,
  //          written by me and my partner.
  fill(random()<0.05?color(255,100,0):color(130,30,0)); textSize(14);
  text("WARNING: System unstable. Behavior may be unpredictable.", width/2, tipY + 22);
  text("YOU CANNOT WIN.", width/2, tipY + 42);

  let ok=getOKBox(), hover=overBox(ok);
  stroke(180,0,0); if(hover) fill(80,0,0); else noFill();
  rect(ok.x,ok.y,ok.w,ok.h,4); noStroke();
  textSize(20); textAlign(CENTER,CENTER);
  fill(hover?color(255,100,0):color(200,50,0));
  text("[ LAUNCH ]", ok.x+ok.w/2, ok.y+ok.h/2);

  drawScanlines(25);
  drawBackButton(true);
}

// =========================================================
// MISSILE COMMAND — AUTHORIZED
// [MINE] — Full N/S/E/W layout designed by me and partner.
//          AI suggested a standard list — we rejected it.
// =========================================================
function commandScreen() {
  drawScreenHeader("MISSILE STRIKE — SELECT SECTOR", false);
  textAlign(CENTER); fill(0,255,0); textSize(26);
  text("SELECT STRIKE DIRECTION", width/2, 68);
  textSize(14); fill(0,180,0);
  text("Choose a target sector for your nuclear payload", width/2, 90);
  let boxes=getOptionBoxes();
  for (let dir of ["N","S","E","W"]) drawDirOption(boxes[dir], false);
  drawBackButton(false);
}

// =========================================================
// MISSILE COMMAND — GLITCHED
// [MINE] — Glitched variant with corrupted targeting message.
// =========================================================
function commandScreenGlitched() {
  drawScreenHeader("MISSILE STRIKE — SELECT SECTOR", true);
  drawGlitchBars(0.2);
  textAlign(CENTER); fill(random()<0.1?color(255,200,0):color(200,50,0)); textSize(26);
  text(glitchCorrupt("SELECT STRIKE DIRECTION"), width/2, 68);
  textSize(14); fill(150,50,0);
  text("WARNING: "+glitchCorrupt("Unauthorized targeting system active"), width/2, 90);
  let boxes=getOptionBoxes();
  for (let dir of ["N","S","E","W"]) drawDirOption(boxes[dir], true);
  drawScanlines(25);
  drawBackButton(true);
}

// [MINE] — Direction option button rendering.
function drawDirOption(b, glitched) {
  let hover=overBox(b);
  stroke(glitched?color(180,0,0):color(0,255,0)); strokeWeight(hover?2:1);
  if(hover) fill(glitched?color(60,0,0):color(0,60,0)); else noFill();
  rect(b.x,b.y,b.w,b.h,4); noStroke();
  fill(glitched?(hover?color(255,100,0):color(200,50,0)):(hover?color(0,220,0):color(0,255,0)));
  textAlign(CENTER,CENTER); textSize(38);
  text(glitched&&random()<0.05?glitchStr(5):b.label, b.x+b.w/2, b.y+b.h/2-12);
  textSize(13); fill(glitched?color(120,30,0):color(0,160,0));
  text(b.sub, b.x+b.w/2, b.y+b.h/2+22);
}

// =========================================================
// MISSILE — LAUNCH ANIMATION
// [MINE] — Trajectory logic and spread angle calculations.
// =========================================================
function startLaunch() {
  launchMissles=[]; phaseStartTime=millis();
  launchReady=true; retaliationStartTime=0;
  let ox,oy,tx,ty;
  if      (selectedOption==="N"){ox=width/2; oy=height-10; tx=width/2;   ty=-10;}
  else if (selectedOption==="S"){ox=width/2; oy=10;        tx=width/2;   ty=height+10;}
  else if (selectedOption==="E"){ox=10;      oy=height/2;  tx=width+10;  ty=height/2;}
  else                          {ox=width-10;oy=height/2;  tx=-10;       ty=height/2;}
  launchTarget={x:tx, y:ty};
  for (let i=0;i<8;i++) {
    let spreadH = (selectedOption==="N"||selectedOption==="S");
    let lox = ox+(spreadH?random(-60,60):random(-8,8));
    let loy = oy+(spreadH?random(-8,8):random(-60,60));
    let angle=atan2(ty-loy,tx-lox)+random(-0.1,0.1);
    launchMissles.push({x:lox,y:loy,vx:cos(angle)*7,vy:sin(angle)*7,active:false,delay:frameCount+i*10});
  }
  glitchCrashPhase = "none";
  glitchMalfunctionShown = false;
}

// [MINE] — Authorized launch animation.
function launchAnimation() {
  let dn={N:"NORTH",S:"SOUTH",E:"EAST",W:"WEST"};
  fill(0,200,255); textAlign(CENTER); textSize(16);
  text("MISSILES AWAY — PAYLOAD LAUNCHED", width/2, 25);
  textSize(22);
  text("TARGETING: "+dn[selectedOption]+" SECTOR", width/2, 55);

  for (let m of launchMissles) {
    if (!m.active && frameCount>=m.delay) m.active=true;
    if (m.active) {
      m.x+=m.vx; m.y+=m.vy;
      fill(255,200,0,100); noStroke(); ellipse(m.x - m.vx*0.5, m.y - m.vy*0.5, 4, 4);
      fill(255,255,0); ellipse(m.x,m.y,6,6);
    }
  }
  let active=launchMissles.filter(m=>m.active).length;
  let gone=launchMissles.every(m=>m.x<-20||m.x>width+20||m.y<-20||m.y>height+20);
  if (active===8&&gone){
    retaliationStartTime=millis();
    retaliationTimerEnd=millis()+45000;
    screenState=4;
  }
}

// [MINE] — Glitched launch animation with red missile colors.
function launchAnimationGlitched() {
  drawGlitchBars(0.15);
  let dn={N:"NORTH",S:"SOUTH",E:"EAST",W:"WEST"};
  fill(200,50,0); textAlign(CENTER); textSize(16);
  text(random()<0.1?glitchStr(30):"MISSILES AWAY — PAYLOAD LAUNCHED", width/2, 25);
  textSize(22);
  fill(random()<0.1?color(255,200,0):color(200,50,0));
  text("TARGETING: "+dn[selectedOption]+" SECTOR", width/2, 55);

  for (let m of launchMissles) {
    if (!m.active && frameCount>=m.delay) m.active=true;
    if (m.active) {
      m.x+=m.vx; m.y+=m.vy;
      fill(255,100,0,100); noStroke(); ellipse(m.x - m.vx*0.5, m.y - m.vy*0.5, 4, 4);
      fill(255,80,0); ellipse(m.x,m.y,6,6);
    }
  }
  let active=launchMissles.filter(m=>m.active).length;
  let gone=launchMissles.every(m=>m.x<-20||m.x>width+20||m.y<-20||m.y>height+20);
  if (active===8&&gone){
    retaliationStartTime=millis();
    retaliationTimerEnd=millis()+45000;
    groundHits=0; interceptedCount=0;
    screenState=4.6;
  }
  drawScanlines(20);
}

// =========================================================
// MISSILE — SPEED HELPERS
// [AI-ASSISTED] — The concept of a three-phase difficulty ramp
//                 (0-15s / 15-30s / 30s+) was brainstormed with
//                 AI and kept because it fit our design. The
//                 specific speed values were tuned by me and
//                 my partner, and the glitched variant with
//                 extreme speed was our own hostile design choice.
// =========================================================
function getMissileSpeedForTime(elapsedSec) {
  if      (elapsedSec < 15) return { min: 1.2, max: 2.2 };
  else if (elapsedSec < 30) return { min: 2.0, max: 3.2 };
  else                      return { min: 3.0, max: 4.4 };
}
function getMissileSpeedGlitched(elapsedSec) {
  // [MINE] — Extreme speed ramp in glitch mode is deliberate
  //          hostile design — you genuinely cannot survive this.
  if      (elapsedSec < 15) return { min: 2.5, max: 4.0 };
  else if (elapsedSec < 30) return { min: 5.0, max: 8.0 };
  else                      return { min: 9.0, max: 14.0 };
}

// [AI-ASSISTED] — Three-phase spawn rate concept brainstormed
//                 with AI. Frame counts tuned by me and partner.
function getSpawnRateForTime(elapsedSec) {
  if      (elapsedSec < 15) return 55;
  else if (elapsedSec < 30) return 38;
  else                      return 24;
}
function getSpawnRateGlitched(elapsedSec) {
  // [MINE] — Extremely aggressive spawn in glitch mode is our
  //          deliberate hostile design decision.
  if      (elapsedSec < 15) return 40;
  else if (elapsedSec < 30) return 18;
  else                      return 8;
}

// =========================================================
// MISSILE — HEALTH BAR
// [MINE] — Health bar layout and red-shift for glitch mode.
// =========================================================
function drawHealthBar(glitched) {
  let barX=10, barY=10, barW=width-20, barH=18;
  noStroke(); fill(glitched?color(40,0,0):color(40,0,0)); rect(barX,barY,barW,barH,3);
  let pct = constrain(1-(groundHits/MAX_HITS), 0, 1);
  let r, g;
  if (pct > 0.5) { r=floor(map(pct,1.0,0.5,0,255)); g=255; }
  else           { r=255; g=floor(map(pct,0.5,0.0,255,0)); }
  if (glitched) { r=min(255,r+80); g=max(0,g-60); }
  fill(r,g,0); rect(barX,barY,barW*pct,barH,3);
  noFill(); stroke(r,g,0); strokeWeight(1); rect(barX,barY,barW,barH,3); noStroke();
  textAlign(CENTER,CENTER); textSize(13); fill(0);
  text("DEFENSE INTEGRITY  —  "+groundHits+" / "+MAX_HITS+" BREACHES", width/2, barY+barH/2+1);
}

// =========================================================
// RETALIATION — AUTHORIZED
// [AI-ASSISTED] — Core 45-second game loop structure (spawn
//                 on frameCount interval, move missiles, splice
//                 on ground hit) was brainstormed with AI then
//                 rewritten and integrated into our system.
// [MINE] — Win/lose conditions, speedLabel text, health bar
//          placement, and all screen copy written by me and partner.
// =========================================================
function retaliationScreen() {
  let now       = millis();
  let elapsed   = (now - retaliationStartTime) / 1000;
  let remaining = max(0, (retaliationTimerEnd - now) / 1000);

  if (groundHits >= MAX_HITS) {
    missileGameResult = "lose"; missileGameOverTime = millis(); screenState = 5; return;
  }
  if (now >= retaliationTimerEnd) {
    missileGameResult = "win";  missileGameOverTime = millis(); screenState = 5; return;
  }

  // [AI-ASSISTED] — Spawn-rate helper call per elapsed time.
  let spawnRate = getSpawnRateForTime(elapsed);
  if (frameCount % spawnRate === 0) {
    let spd = getMissileSpeedForTime(elapsed);
    missles.push({ x: random(width), y: 0, speed: random(spd.min, spd.max) });
  }

  for (let i = missles.length - 1; i >= 0; i--) {
    let m = missles[i];
    m.y += m.speed;
    noStroke();
    fill(255, 200, 0, 120); ellipse(m.x, m.y - 14, 5, 10);
    fill(255, 60, 60);      ellipse(m.x, m.y, 10, 20);
    if (m.y > height) { missles.splice(i, 1); groundHits++; }
  }

  drawHealthBar(false);

  // [MINE] — Timer bar and remaining-time display.
  let timerBarX=10, timerBarY=35, timerBarW=width-20, timerBarH=10;
  let timePct = remaining / 45;
  let tg2 = floor(map(timePct, 0, 1, 0, 160));
  noStroke(); fill(0,20,0); rect(timerBarX,timerBarY,timerBarW,timerBarH,2);
  fill(0, 180-tg2, 0); rect(timerBarX,timerBarY,timerBarW*timePct,timerBarH,2);
  noFill(); stroke(0,120,0); strokeWeight(1); rect(timerBarX,timerBarY,timerBarW,timerBarH,2); noStroke();

  fill(255,80,80); textAlign(CENTER); textSize(26);
  text("INCOMING ATTACK", width/2, 62);

  // [MINE] — Speed label text written by me and my partner.
  let speedLabel = elapsed < 15 ? "SPEED: NOMINAL" : elapsed < 30 ? "SPEED: +60%" : "SPEED: MAX";
  textAlign(RIGHT); textSize(14); fill(0,200,0);
  text("TIME: "+floor(remaining)+"s", width-12, 62);
  textAlign(LEFT); textSize(13); fill(0,160,0);
  text(speedLabel, 12, 62);

  fill(0,200,0); textSize(15);
  textAlign(LEFT);  text("INTERCEPTED: "+interceptedCount, 10, height-30);
  textAlign(RIGHT); text("MISSILES ACTIVE: "+missles.length, width-10, height-30);
  textAlign(CENTER); textSize(13); fill(0,140,0);
  text("CLICK missiles to intercept — survive "+floor(remaining)+"s more", width/2, height-12);

  drawBackButton(false);
}

// =========================================================
// RETALIATION — GLITCHED
// [AI-ASSISTED] — Same core loop structure as above, adapted
//                 from AI-brainstormed concepts. The glitch
//                 crash sequence logic was also refined with
//                 AI input then rewritten to match our
//                 screen-shake and color scheme.
// [MINE] — "YOU CANNOT SURVIVE THIS" line, crash narrative,
//          "SYSTEM MALFUNCTION" appearance timing, and all
//          hostile design decisions made by me and my partner.
// =========================================================
function retaliationScreenGlitched() {
  let now       = millis();
  let elapsed   = (now - retaliationStartTime) / 1000;
  let remaining = max(0, (retaliationTimerEnd - now) / 1000);

  // [AI-ASSISTED] — Crash sequence structure; rewritten by me
  //                 to integrate our specific shake and overlay.
  if (glitchCrashPhase === "crashing") {
    let crashElapsed = (now - glitchCrashStart) / 1000;
    let shake = min(20, crashElapsed * 8);
    translate(random(-shake,shake), random(-shake,shake));

    noStroke(); fill(200,0,0, min(180, crashElapsed*60));
    rect(0,0,width,height);

    drawGlitchBars(min(2.0, crashElapsed));

    for (let i=0;i<100;i++) {
      fill(random()<0.5?color(0,255,0,random(60,150)):color(255,0,0,random(60,150)));
      noStroke(); rect(random(width), random(height), random(20,120), random(2,8));
    }

    // [MINE] — "UNAUTHORIZED USER" crash text written by me/partner.
    textAlign(CENTER,CENTER); fill(255,0,0,200+sin(now/40)*55); textSize(52);
    text("SYSTEM ERROR", width/2, height/2-60);
    textSize(24); fill(255,100,0,200+sin(now/30)*55);
    text("UNAUTHORIZED USER", width/2, height/2-10);
    textSize(18); fill(255,200,0,200);
    text("SECURITY BREACH — TERMINATING SESSION", width/2, height/2+30);

    if (crashElapsed > 4) {
      glitchCrashPhase = "done";
      resetMissileGame();
      screenState = 0.6;
    }
    return;
  }

  // [MINE] — Win impossible in glitch — triggers crash instead.
  //          This was our deliberate hostile design decision.
  if (groundHits >= MAX_HITS && glitchCrashPhase === "none") {
    glitchCrashPhase = "crashing";
    glitchCrashStart = now;
    return;
  }
  if (now >= retaliationTimerEnd && glitchCrashPhase === "none") {
    glitchCrashPhase = "crashing";
    glitchCrashStart = now;
    return;
  }

  if (elapsed > 15) {
    noStroke(); fill(random()<0.3?color(80,20,0,60):color(0,0,0,0)); rect(0,0,width,height);
    drawGlitchBars(min(1.5,(elapsed-15)*0.08));
  }

  let spawnRate = getSpawnRateGlitched(elapsed);
  if (frameCount % max(1,spawnRate) === 0) {
    let spd = getMissileSpeedGlitched(elapsed);
    missles.push({ x: random(width), y: 0, speed: random(spd.min, spd.max) });
  }

  for (let i = missles.length - 1; i >= 0; i--) {
    let m = missles[i];
    m.y += m.speed;
    noStroke();
    fill(255, 100, 0, 120); ellipse(m.x, m.y - 14, 5, 10);
    fill(255, 30, 30);      ellipse(m.x, m.y, 10, 20);
    if (m.y > height) { missles.splice(i, 1); groundHits++; }
  }

  drawHealthBar(true);

  let timerBarX=10, timerBarY=35, timerBarW=width-20, timerBarH=10;
  let timePct = remaining / 45;
  noStroke(); fill(20,0,0); rect(timerBarX,timerBarY,timerBarW,timerBarH,2);
  fill(200, floor(60*timePct), 0); rect(timerBarX,timerBarY,timerBarW*timePct,timerBarH,2);
  noFill(); stroke(160,0,0); strokeWeight(1); rect(timerBarX,timerBarY,timerBarW,timerBarH,2); noStroke();

  fill(255,30,30); textAlign(CENTER); textSize(26);
  text(random()<0.05?glitchStr(16):"INCOMING ATTACK", width/2, 62);

  // [MINE] — "SYSTEM MALFUNCTION" appears at 15s as a warning
  //          before the crash — our original storytelling beat.
  if (elapsed >= 15) {
    let blink = floor(now/300)%2;
    if (blink===1) {
      textAlign(RIGHT); textSize(14); fill(255,200,0);
      text("⚠ SYSTEM MALFUNCTION", width-12, 62);
    }
  }

  // [MINE] — "SPEED: CRITICAL" label written by me and partner.
  let speedLabel = elapsed < 15 ? "SPEED: NOMINAL" : elapsed < 30 ? "SPEED: CRITICAL" : "SPEED: MAXIMUM";
  textAlign(LEFT); textSize(13); fill(200,50,0);
  text(speedLabel, 12, 62);

  fill(200,80,0); textSize(15);
  textAlign(LEFT);  text("INTERCEPTED: "+interceptedCount, 10, height-30);
  textAlign(RIGHT); text("MISSILES ACTIVE: "+missles.length, width-10, height-30);
  // [MINE] — "YOU CANNOT SURVIVE THIS" — core project theme.
  textAlign(CENTER); textSize(13); fill(150,30,0);
  text("YOU CANNOT SURVIVE THIS", width/2, height-12);

  drawScanlines(20);
  drawBackButton(true);
}

// =========================================================
// MISSILE GAME OVER — AUTHORIZED
// [MINE] — Win/lose screen layout, rating system, and all
//          copy written by me and my partner.
// =========================================================
function missileGameOver() {
  let won = (missileGameResult === "win");
  let locked = (millis() - missileGameOverTime < 3000);
  background(won ? color(0,8,0) : color(10,0,0));

  for (let ly=0; ly<height; ly+=4) {
    noStroke(); fill(0,0,0,30); rect(0,ly,width,2);
  }

  if (won) {
    fill(0,255,0); textAlign(CENTER,CENTER); textSize(56);
    text("MISSION: SUCCESS", width/2, height/2-80);
    textSize(18); fill(0,200,0);
    text("PAYLOAD DELIVERED — DEFENSE INTACT", width/2, height/2-30);
    stroke(0,180,0); strokeWeight(1); noFill(); rect(width/2-210, height/2, 420, 90, 4); noStroke();
    fill(0,20,0); rect(width/2-210, height/2, 420, 90, 4);
    textAlign(LEFT,TOP); textSize(16); fill(0,200,0);
    text("MISSILES INTERCEPTED:", width/2-190, height/2+15);
    text("GROUND HITS:",         width/2-190, height/2+40);
    text("DEFENSE RATING:",      width/2-190, height/2+65);
    textAlign(RIGHT,TOP); fill(0,255,0);
    text(interceptedCount, width/2+190, height/2+15);
    text(groundHits+" / "+MAX_HITS, width/2+190, height/2+40);
    // [MINE] — PERFECT / EXCELLENT / GOOD / MARGINAL rating tiers.
    let rating = groundHits===0?"PERFECT":groundHits<=3?"EXCELLENT":groundHits<=6?"GOOD":"MARGINAL";
    text(rating, width/2+190, height/2+65);
  } else {
    fill(255,0,0); textAlign(CENTER,CENTER); textSize(56);
    text("MISSION: FAIL", width/2, height/2-80);
    textSize(18); fill(200,0,0);
    text("DEFENSE INTEGRITY LOST", width/2, height/2-30);
    stroke(120,0,0); strokeWeight(1); noFill(); rect(width/2-210, height/2, 420, 90, 4); noStroke();
    fill(15,0,0); rect(width/2-210, height/2, 420, 90, 4);
    textAlign(LEFT,TOP); textSize(16); fill(180,0,0);
    text("MISSILES INTERCEPTED:", width/2-190, height/2+15);
    text("GROUND HITS:",         width/2-190, height/2+40);
    text("CAUSE OF FAILURE:",    width/2-190, height/2+65);
    textAlign(RIGHT,TOP); fill(255,60,60);
    text(interceptedCount, width/2+190, height/2+15);
    text(groundHits+" / "+MAX_HITS, width/2+190, height/2+40);
    text("BREACH THRESHOLD MET", width/2+190, height/2+65);
  }

  if (!locked) {
    let blink = floor(millis()/600)%2;
    if (blink===1) {
      fill(won?color(0,180,0):color(120,0,0)); textAlign(CENTER); textSize(14);
      text("CLICK TO RETURN TO MENU", width/2, height/2+115);
    }
  } else {
    let remaining = ceil(3 - (millis()-missileGameOverTime)/1000);
    fill(80,80,80); textAlign(CENTER); textSize(13);
    text("Returning to menu in "+remaining+"...", width/2, height/2+115);
  }
}

// =========================================================
// MISSILE GAME OVER — GLITCHED
// [MINE] — Fallback crash screen written by me.
// =========================================================
function missileGameOverGlitched() {
  background(10,0,0);
  fill(255,0,0); textAlign(CENTER,CENTER); textSize(48);
  text("SYSTEM CRASH", width/2, height/2);
  let locked = (millis() - missileGameOverTime < 3000);
  if (!locked) { screenState = 0.6; resetMissileGame(); }
}

// [MINE] — Reset function written by me and my partner.
function resetMissileGame() {
  missles=[]; launchMissles=[];
  interceptedCount=0; groundHits=0;
  selectedOption=null; launchTarget=null;
  retaliationStartTime=0; retaliationTimerEnd=0;
  missileGameResult=null; missileGameOverTime=0;
  glitchCrashPhase="none"; glitchCrashStart=0;
  glitchMalfunctionShown=false;
}

// =========================================================
// GLOBAL RADAR SWEEP — Alert Data
// [MINE] — All alert text was written by me and my partner
//          to fit the Cold War / WOPR theme.
// =========================================================
let radarAlertTemplates = [
  {text:"RADAR CONTACT — MULTIPLE BOGEYS INBOUND FROM NORTH",      isReal:true},
  {text:"SEISMIC EVENT DETECTED — POSSIBLE UNDERGROUND TEST",       isReal:true},
  {text:"SUBMARINE SIGNAL LOST — ARCTIC PATROL ZONE",              isReal:true},
  {text:"INTERCEPTED COMMS: LAUNCH ORDER CONFIRMED",                isReal:true},
  {text:"SATELLITE TRACK: ICBM TRAJECTORY CALCULATED",              isReal:true},
  {text:"BALLISTIC SIGNATURE DETECTED — SILO ACTIVITY CONFIRMED",  isReal:true},
  {text:"MULTIPLE WARHEAD SEPARATION EVENTS RECORDED",              isReal:true},
  {text:"MISSILE LAUNCH DETECTED — ORIGIN: HOSTILE TERRITORY",     isReal:true},
  {text:"NUCLEAR SUBMARINE SURFACED — LAUNCH POSITION CONFIRMED",  isReal:true},
  {text:"EARLY WARNING SATELLITE: HEAT SIGNATURE — ICBM CLASS",    isReal:true},
  {text:"WEATHER BALLOON CAUSES FALSE RADAR ECHO",                  isReal:false},
  {text:"CIVILIAN AIRCRAFT MISIDENTIFIED ON SCOPE",                 isReal:false},
  {text:"SOLAR FLARE DISRUPTS EARLY WARNING SENSORS",               isReal:false},
  {text:"COMPUTER SIMULATION LEAKED INTO LIVE FEED",                isReal:false},
  {text:"FLOCK OF GEESE TRIGGERS PROXIMITY ALARM",                  isReal:false},
  {text:"SATELLITE LAUNCH — COMMERCIAL — ROUTINE",                  isReal:false},
  {text:"EQUIPMENT MALFUNCTION — GHOST SIGNAL DETECTED",            isReal:false},
  {text:"MISSILE TEST — ALLIED NATION — PRE-AUTHORIZED",            isReal:false},
  {text:"TROOP MOVEMENT — CONFIRMED TRAINING EXERCISE",             isReal:false},
  {text:"SONAR CONTACT — IDENTIFIED AS WHALE MIGRATION",            isReal:false},
  {text:"METEOR SHOWER TRIGGERS ATMOSPHERIC ENTRY ALARM",           isReal:false},
  {text:"AURORA BOREALIS INTERFERES WITH RADAR ARRAY",              isReal:false},
  {text:"IONOSPHERIC DISTURBANCE — COMMS DEGRADED, NO THREAT",     isReal:false},
];

// [MINE] — Radar init and reset logic.
function initRadar(glitched) {
  radarLevel        = 5;
  radarScore        = 0;
  radarMistakes     = 0;
  radarPhase        = "playing";
  radarCurrent      = null;
  radarFeedback     = null;
  radarGameOverTime = 0;
  radarStartTime    = millis();
  radarLastSpawn    = millis();
  radarAlerts       = shuffle([...radarAlertTemplates]);
  radarGibberish    = "";
  radarGibberishTime = 0;
  radarSelfDestructCount = 5;
  radarSelfDestructPhase = "none";
  radarSelfDestructStart = 0;
}

// [MINE] — Button layout for REAL THREAT / FALSE ALARM.
function getRadarBtn(type) {
  let ay=365, ah=82, btnH=44;
  let gapTop = ay + ah;
  let gapBot = height - 50;
  let btnY = gapTop + floor((gapBot - gapTop - btnH) / 2);
  if (type==="R") return {x:width/2-185, y:btnY, w:170, h:btnH};
  else            return {x:width/2+15,  y:btnY, w:170, h:btnH};
}

// [AI-ASSISTED] — Array-pop approach for spawning alerts without
//                 repeats was brainstormed with AI. Adapted by me
//                 to use our shuffled template list.
function radarSpawnAlert() {
  if (radarAlerts.length===0) radarAlerts=shuffle([...radarAlertTemplates]);
  let a = radarAlerts.pop();
  let maxT = random(6000,9000);
  radarCurrent = {text:a.text, isReal:a.isReal, maxTimer:maxT, spawnTime:millis()};
}

// [AI-ASSISTED] — The respond function structure (correct/wrong
//                 branch, score increment, DEFCON decrement) was
//                 brainstormed with AI then rewritten by me to
//                 include our self-destruct glitch mechanic.
// [MINE] — Self-destruct countdown on glitch win is our original
//          hostile design narrative.
function radarRespond(calledReal, glitched) {
  if (!radarCurrent) return;
  let correct = (calledReal === radarCurrent.isReal);
  radarFeedback = { correct, born: millis() };
  if (correct) {
    radarScore++;
    if (glitched) {
      radarGibberish = glitchStr(int(random(10,22)));
      radarGibberishTime = millis();
    }
    if (radarScore >= RADAR_WIN_TARGET) {
      if (glitched) {
        // [MINE] — Self-destruct on unauthorized win is our design.
        radarSelfDestructPhase = "counting";
        radarSelfDestructStart = millis();
        radarSelfDestructCount = 5;
        radarPhase = "win";
      } else {
        radarPhase = "win";
      }
      radarGameOverTime = millis();
    }
  } else {
    radarMistakes++;
    radarLevel = max(1, radarLevel - 1);
    if (radarLevel <= 1) {
      radarPhase = "over";
      radarGameOverTime = millis();
    }
  }
  radarCurrent = null;
  radarLastSpawn = millis();
}

// =========================================================
// RADAR INSTRUCTIONS — AUTHORIZED
// [MINE] — Full layout, DEFCON bar visualization, and all
//          mission objective text written by me and partner.
// =========================================================
function instructionsScreen2() {
  drawScreenHeader("GLOBAL RADAR SWEEP", false);

  textAlign(CENTER); fill(0,255,0); textSize(30);
  text("GLOBAL RADAR SWEEP", width/2, 75);
  textSize(13); fill(0,160,0);
  text("Differentiate between civilian traffic, environmental noise, and actual nuclear threats.", width/2, 100);
  fill(0,100,0);
  text("────────────────────────────────────────────────────────────────────", width/2, 116);

  let x=65, lineH=40, startY=152;
  textAlign(LEFT); textSize(19); fill(0,255,0);
  text("MISSION OBJECTIVES:", x, startY);
  textSize(16); fill(0,200,0);
  text("1. A signal will appear on your radar screen.", x, startY + lineH);
  text("2. READ the alert — is it a real threat or a false alarm?", x, startY + lineH*2);
  text("3. CLASSIFY it using [ REAL THREAT ] or [ FALSE ALARM ].", x, startY + lineH*3);
  text("4. Timer runs out = wrong answer. Stay sharp.", x, startY + lineH*4);
  text("5. GET "+RADAR_WIN_TARGET+" correct to win. "+RADAR_MAX_MISTAKES+" wrong answers = game over.", x, startY + lineH*5);

  // [MINE] — DEFCON explanation box and 5-tier bar visualization.
  let bx=50, by=startY+lineH*5+30, bw=width-100, bh=120;
  noStroke(); fill(0,12,0); rect(bx,by,bw,bh,4);
  stroke(0,120,0); strokeWeight(1); noFill(); rect(bx,by,bw,bh,4); noStroke();
  textAlign(LEFT); textSize(15); fill(0,220,0);
  text("DEFCON SYSTEM:", bx+16, by+18);
  textSize(13); fill(0,180,0);
  text("Start at DEFCON 5 — peacetime. Each wrong answer drops you one level.", bx+16, by+38);
  text("Reach DEFCON 1 and nuclear war begins — game over.", bx+16, by+56);

  let dColors=[color(0,255,0),color(100,255,0),color(255,255,0),color(255,140,0),color(255,0,0)];
  let dLabels=["DEFCON 5\nSTART","DEFCON 4\n1 MISS","DEFCON 3\n2 MISS","DEFCON 2\n3 MISS","DEFCON 1\nGAME OVER"];
  let boxW=104, startX=bx+16, startY2=by+72;
  for (let i=0;i<5;i++) {
    let dc=dColors[i];
    noStroke(); fill(red(dc),green(dc),blue(dc),40);
    rect(startX+i*(boxW+4), startY2, boxW, 30, 3);
    stroke(dc); strokeWeight(1); noFill();
    rect(startX+i*(boxW+4), startY2, boxW, 30, 3); noStroke();
    let lines=dLabels[i].split("\n");
    textAlign(CENTER,CENTER); textSize(11); fill(dc);
    text(lines[0], startX+i*(boxW+4)+boxW/2, startY2+9);
    fill(red(dc),green(dc),blue(dc),180); textSize(10);
    text(lines[1], startX+i*(boxW+4)+boxW/2, startY2+22);
  }

  let ok=getOKBox(), hover=overBox(ok);
  stroke(0,255,0); if(hover) fill(0,255,0); else noFill();
  rect(ok.x,ok.y,ok.w,ok.h,4); noStroke();
  textSize(20); textAlign(CENTER,CENTER);
  fill(hover?0:255, hover?0:255, hover?0:0);
  text("[ BEGIN ]", ok.x+ok.w/2, ok.y+ok.h/2);

  drawBackButton(false);
}

// =========================================================
// RADAR INSTRUCTIONS — GLITCHED
// [MINE] — "YOU CANT WIN" blinking at bottom, "DATA CORRUPTED"
//          line, and hostile framing written by me and partner.
// =========================================================
function instructionsScreen2Glitched() {
  drawScreenHeader("GLOBAL RADAR SWEEP", true);
  drawGlitchBars(0.3);

  textAlign(CENTER); fill(random()<0.08?color(255,200,0):color(200,50,0)); textSize(30);
  text(glitchCorrupt("GLOBAL RADAR SWEEP"), width/2, 75);
  textSize(13); fill(150,50,0);
  text("Differentiate between signals — WARNING: system integrity compromised.", width/2, 100);
  fill(100,0,0);
  text("────────────────────────────────────────────────────────────────────", width/2, 116);

  let x=65, lineH=40, startY=152;
  textAlign(LEFT); textSize(19); fill(200,50,0);
  text("MISSION OBJECTIVES:", x, startY);
  textSize(16); fill(180,50,0);
  let lines2=[
    "1. A signal will appear on your radar screen.",
    "2. READ the alert — is it real or a false alarm?",
    "3. CLASSIFY using [ REAL THREAT ] or [ FALSE ALARM ].",
    "4. Timer runs out = wrong answer.",
    "5. GET "+RADAR_WIN_TARGET+" correct to... [DATA CORRUPTED]",
  ];
  for (let i=0;i<lines2.length;i++) {
    fill(random()<0.12?color(255,200,0):color(180,50,0));
    text(random()<0.1?glitchCorrupt(lines2[i]):lines2[i], x, startY + (i+1)*lineH);
  }

  let bx=50, by=startY+lineH*5+20, bw=width-100, bh=60;
  noStroke(); fill(20,0,0); rect(bx,by,bw,bh,4);
  stroke(120,0,0); strokeWeight(1); noFill(); rect(bx,by,bw,bh,4); noStroke();
  // [MINE] — "DEFCON SYSTEM COMPROMISED" and "YOU CANT WIN"
  //          are our original hostile design moments.
  textAlign(CENTER,CENTER); fill(200,0,0); textSize(18);
  text("ERROR: DEFCON SYSTEM COMPROMISED — RESULTS UNRELIABLE", width/2, by+20);
  fill(150,0,0); textSize(14);
  text(glitchCorrupt("YOU CANT WIN"), width/2, by+42);

  let ok=getOKBox(), hover=overBox(ok);
  stroke(180,0,0); if(hover) fill(80,0,0); else noFill();
  rect(ok.x,ok.y,ok.w,ok.h,4); noStroke();
  textSize(20); textAlign(CENTER,CENTER);
  fill(hover?color(255,100,0):color(200,50,0));
  text("[ BEGIN ]", ok.x+ok.w/2, ok.y+ok.h/2);

  let blink = floor(millis()/500)%2;
  if (blink===1) {
    textAlign(LEFT); textSize(13); fill(200,0,0);
    text("YOU CANT WIN", 14, height-65);
  }

  drawScanlines(25);
  drawBackButton(true);
}

// =========================================================
// RADAR GAME — AUTHORIZED
// [AI-ASSISTED] — Radar game loop structure (spawn alert,
//                 show feedback, timer depletion as wrong
//                 answer) was brainstormed with AI then
//                 rewritten to use our DEFCON system and
//                 circular radar scope visual.
// [MINE] — Radar scope design, sweep line animation, blip
//          placement, all text copy, DEFCON bar display.
// =========================================================
function radarScreen() {
  drawScreenHeader("GLOBAL RADAR SWEEP", false);

  textAlign(CENTER); fill(0,255,0); textSize(22);
  text("GLOBAL RADAR SWEEP", width/2, 62);
  textSize(12); fill(0,140,0);
  text("Classify each incoming signal — real nuclear threat or false alarm.", width/2, 78);

  // [MINE] — DEFCON bar live display.
  let dColors=[color(0,255,0),color(100,255,0),color(255,255,0),color(255,140,0),color(255,0,0)];
  let boxW=100, boxH=22, boxGap=6;
  let totalBarW = 5*(boxW+boxGap) - boxGap;
  let barStartX = floor((width - totalBarW) / 2);
  let barY=88;
  for (let i=5; i>=1; i--) {
    let bx2 = barStartX + (5-i)*(boxW+boxGap);
    let dc = dColors[5-i];
    let isActive = (i === radarLevel);
    let isPast   = (i > radarLevel);
    stroke(dc); strokeWeight(isActive ? 2 : 1);
    fill(red(dc), green(dc), blue(dc), isActive ? 200 : isPast ? 12 : 50);
    rect(bx2, barY, boxW, boxH, 3); noStroke();
    textAlign(CENTER,CENTER); textSize(12);
    fill(isActive ? 0 : dc);
    text("DEFCON "+i, bx2+boxW/2, barY+boxH/2);
  }
  textAlign(CENTER); textSize(13); fill(0,180,0);
  text("CORRECT: "+radarScore+"/"+RADAR_WIN_TARGET+"   |   WRONG: "+radarMistakes+"/"+RADAR_MAX_MISTAKES, width/2, barY+boxH+45);

  if (radarPhase === "win") {
    fill(0,0,0,190); rect(0,0,width,height);
    fill(0,255,0); textAlign(CENTER,CENTER); textSize(46);
    text("CRISIS AVERTED", width/2, height/2-60);
    textSize(18); fill(0,200,0);
    text(RADAR_WIN_TARGET+" THREATS CORRECTLY CLASSIFIED", width/2, height/2-10);
    textSize(15); fill(0,160,0);
    text("Nuclear war prevented. Peace maintained.", width/2, height/2+22);
    stroke(0,160,0); strokeWeight(1); noFill(); rect(width/2-180, height/2+44, 360, 60, 4); noStroke();
    fill(0,15,0); rect(width/2-180, height/2+44, 360, 60, 4);
    textAlign(LEFT,TOP); textSize(14); fill(0,180,0);
    text("CORRECT CALLS:", width/2-160, height/2+58);
    text("WRONG CALLS:",   width/2-160, height/2+78);
    textAlign(RIGHT,TOP); fill(0,255,0);
    text(radarScore, width/2+160, height/2+58);
    text(radarMistakes, width/2+160, height/2+78);
    let locked = (millis()-radarGameOverTime < 3000);
    if (!locked) {
      let blink=floor(millis()/600)%2;
      if(blink===1){ fill(0,140,0); textAlign(CENTER); textSize(14); text("CLICK TO RETURN TO MENU", width/2, height/2+124); }
    } else {
      fill(80,80,80); textAlign(CENTER); textSize(13);
      text("Returning in "+ceil(3-(millis()-radarGameOverTime)/1000)+"...", width/2, height/2+124);
    }
    drawBackButton(false); return;
  }

  if (radarPhase === "over") {
    fill(0,0,0,190); rect(0,0,width,height);
    fill(255,0,0); textAlign(CENTER,CENTER); textSize(46);
    text("NUCLEAR WAR", width/2, height/2-60);
    textSize(18); fill(200,0,0);
    text("DEFCON 1 — MUTUAL ASSURED DESTRUCTION", width/2, height/2-10);
    textSize(15); fill(160,0,0);
    text("Too many misclassifications. The missiles are flying.", width/2, height/2+22);
    stroke(120,0,0); strokeWeight(1); noFill(); rect(width/2-180, height/2+44, 360, 60, 4); noStroke();
    fill(15,0,0); rect(width/2-180, height/2+44, 360, 60, 4);
    textAlign(LEFT,TOP); textSize(14); fill(180,0,0);
    text("CORRECT CALLS:", width/2-160, height/2+58);
    text("WRONG CALLS:",   width/2-160, height/2+78);
    textAlign(RIGHT,TOP); fill(255,60,60);
    text(radarScore, width/2+160, height/2+58);
    text(radarMistakes, width/2+160, height/2+78);
    let locked = (millis()-radarGameOverTime < 3000);
    if (!locked) {
      let blink=floor(millis()/600)%2;
      if(blink===1){ fill(120,0,0); textAlign(CENTER); textSize(14); text("CLICK TO RETURN TO MENU", width/2, height/2+124); }
    } else {
      fill(80,80,80); textAlign(CENTER); textSize(13);
      text("Returning in "+ceil(3-(millis()-radarGameOverTime)/1000)+"...", width/2, height/2+124);
    }
    drawBackButton(false); return;
  }

  if (radarFeedback) {
    let age = millis() - radarFeedback.born;
    let dur = 850;
    if (age < dur) {
      let alpha = floor(map(age, dur*0.55, dur, 255, 0));
      if (radarFeedback.correct) {
        noStroke(); fill(0,160,0, min(50, alpha/3)); rect(0,0,width,height);
        fill(0,255,0,alpha); textAlign(CENTER,CENTER); textSize(40);
        text("✓ CORRECT", width/2, height/2);
      } else {
        noStroke(); fill(160,0,0, min(50, alpha/3)); rect(0,0,width,height);
        fill(255,40,40,alpha); textAlign(CENTER,CENTER); textSize(40);
        text("✗ WRONG", width/2, height/2);
      }
      drawBackButton(false); return;
    } else {
      radarFeedback = null; radarLastSpawn = millis();
    }
  }

  if (!radarCurrent) {
    if (millis()-radarLastSpawn > 700) radarSpawnAlert();
    else { textAlign(CENTER,CENTER); fill(0,150,0); textSize(17); text("MONITORING GLOBAL SIGNALS . . .", width/2, height/2); }
    drawBackButton(false); return;
  }

  // [AI-ASSISTED] — Timer bar depletion = auto wrong answer
  //                 was in AI example; adapted by me.
  let elapsed = millis() - radarCurrent.spawnTime;
  let timeLeft = radarCurrent.maxTimer - elapsed;

  if (timeLeft <= 0) {
    radarFeedback = { correct: false, born: millis() };
    radarMistakes++; radarLevel = max(1, radarLevel - 1); radarCurrent = null;
    if (radarLevel <= 1) { radarPhase = "over"; radarGameOverTime = millis(); }
    drawBackButton(false); return;
  }

  let tpct = timeLeft / radarCurrent.maxTimer;
  let tbx=30, tby=130, tbw=width-60, tbh=10;
  noStroke(); fill(30,0,0); rect(tbx,tby,tbw,tbh,3);
  let tr=floor(map(tpct,1,0,0,255)), tg=floor(map(tpct,0,1,0,220));
  fill(tr,tg,0); rect(tbx,tby,tbw*tpct,tbh,3);
  noFill(); stroke(tr,tg,0); strokeWeight(1); rect(tbx,tby,tbw,tbh,3); noStroke();

  // [MINE] — Radar scope with sweep line and blip, designed by me.
  let cx=width/2, cy=255, rr=80;
  noFill(); stroke(0,50,0); strokeWeight(1);
  ellipse(cx,cy,rr*2,rr*2); ellipse(cx,cy,rr*1.33,rr*1.33); ellipse(cx,cy,rr*0.66,rr*0.66);
  stroke(0,35,0);
  line(cx-rr,cy,cx+rr,cy); line(cx,cy-rr,cx,cy+rr);
  line(cx-rr*0.7,cy-rr*0.7,cx+rr*0.7,cy+rr*0.7);
  line(cx-rr*0.7,cy+rr*0.7,cx+rr*0.7,cy-rr*0.7);
  let sweepAngle = (millis()/1000)*2.2;
  stroke(0,255,0,190); strokeWeight(2);
  line(cx,cy,cx+cos(sweepAngle)*rr,cy+sin(sweepAngle)*rr);
  for (let t=1; t<=10; t++) {
    stroke(0,255,0, 190-t*18); strokeWeight(2-t*0.1);
    line(cx,cy,cx+cos(sweepAngle-t*0.10)*rr,cy+sin(sweepAngle-t*0.10)*rr);
  }
  if (radarCurrent.isReal) {
    let blipAngle=2.1, blipDist=rr*0.65;
    let bx3=cx+cos(blipAngle)*blipDist, by3=cy+sin(blipAngle)*blipDist;
    noStroke(); fill(255,50,50,60+40*sin(millis()/120));
    ellipse(bx3,by3,20+6*sin(millis()/200),20+6*sin(millis()/200));
    fill(255,80,80,200+55*sin(millis()/80)); ellipse(bx3,by3,8,8);
  }
  noStroke();

  // [MINE] — Alert box layout and text wrapping logic.
  let ax=30, ay=365, aw=width-60, ah=82;
  fill(0,18,0); rect(ax,ay,aw,ah,4);
  stroke(0,160,0); strokeWeight(1); noFill(); rect(ax,ay,aw,ah,4); noStroke();
  fill(255,210,0); textAlign(CENTER,TOP); textSize(12);
  text("INCOMING SIGNAL — CLASSIFY IMMEDIATELY", width/2, ay+8);
  stroke(0,80,0); line(ax,ay+26,ax+aw,ay+26); noStroke();
  fill(0,255,0); textAlign(CENTER,CENTER); textSize(16);
  let words=radarCurrent.text.split(" ");
  let ln1="", ln2="";
  for (let w of words) {
    if((ln1+" "+w).trim().length<48) ln1=(ln1+" "+w).trim();
    else ln2=(ln2+" "+w).trim();
  }
  text(ln1, width/2, ay+47);
  if(ln2) text(ln2, width/2, ay+66);

  // [MINE] — REAL THREAT / FALSE ALARM button layout.
  let btnH=44, gapTop=ay+ah, gapBot=height-50;
  let btnY=gapTop+floor((gapBot-gapTop-btnH)/2);
  let rBtn={x:width/2-185, y:btnY, w:170, h:btnH};
  let fBtn={x:width/2+15,  y:btnY, w:170, h:btnH};
  let rHov=overBox(rBtn), fHov=overBox(fBtn);
  stroke(0,255,0); strokeWeight(rHov?2:1);
  fill(rHov?color(0,80,0):color(0,20,0)); rect(rBtn.x,rBtn.y,rBtn.w,rBtn.h,4);
  stroke(255,80,80); strokeWeight(fHov?2:1);
  fill(fHov?color(60,0,0):color(20,0,0)); rect(fBtn.x,fBtn.y,fBtn.w,fBtn.h,4);
  noStroke();
  fill(0,255,0); textAlign(CENTER,CENTER); textSize(17);
  text("[ REAL THREAT ]", rBtn.x+rBtn.w/2, rBtn.y+rBtn.h/2);
  fill(255,80,80); text("[ FALSE ALARM ]", fBtn.x+fBtn.w/2, fBtn.y+fBtn.h/2);

  drawBackButton(false);
}

// =========================================================
// RADAR GAME — GLITCHED
// [MINE] — Self-destruct countdown narrative, "You were never
//          going to win" game over text, always-showing blip
//          as hostile design choice — all by me and partner.
// [AI-ASSISTED] — Base game loop logic adapted from authorized
//                 version; glitch bar intensity scaling was
//                 brainstormed with AI.
// =========================================================
function radarScreenGlitched() {
  drawGlitchBars(0.2);

  drawScreenHeader("GLOBAL RADAR SWEEP", true);

  textAlign(CENTER); fill(random()<0.05?color(255,200,0):color(200,50,0)); textSize(22);
  text(random()<0.1?glitchCorrupt("GLOBAL RADAR SWEEP"):"GLOBAL RADAR SWEEP", width/2, 62);
  textSize(12); fill(150,50,0);
  text("Classify signals — WARNING: system integrity compromised.", width/2, 78);

  let dColors=[color(0,255,0),color(100,255,0),color(255,255,0),color(255,140,0),color(255,0,0)];
  let boxW=100, boxH=22, boxGap=6;
  let totalBarW = 5*(boxW+boxGap) - boxGap;
  let barStartX = floor((width - totalBarW) / 2);
  let barY=88;
  for (let i=5; i>=1; i--) {
    let bx2 = barStartX + (5-i)*(boxW+boxGap);
    let dc = dColors[5-i];
    let isActive = (i === radarLevel);
    let isPast   = (i > radarLevel);
    if (isActive && random()<0.1) dc = color(255,200,0);
    stroke(dc); strokeWeight(isActive ? 2 : 1);
    fill(red(dc), green(dc), blue(dc), isActive ? 200 : isPast ? 12 : 50);
    rect(bx2, barY, boxW, boxH, 3); noStroke();
    textAlign(CENTER,CENTER); textSize(12);
    fill(isActive ? 0 : dc);
    text("DEFCON "+i, bx2+boxW/2, barY+boxH/2);
  }
  textAlign(CENTER); textSize(13); fill(180,50,0);
  text("CORRECT: "+radarScore+"/"+RADAR_WIN_TARGET+"   |   WRONG: "+radarMistakes+"/"+RADAR_MAX_MISTAKES, width/2, barY+boxH+16);

  // [MINE] — Self-destruct sequence is our original hostile design.
  if (radarSelfDestructPhase === "counting" || radarSelfDestructPhase === "explode") {
    let sdElapsed = (millis() - radarSelfDestructStart) / 1000;
    let currentCount = max(0, floor(5 - sdElapsed));

    if (radarSelfDestructPhase === "counting" && currentCount <= 0) {
      radarSelfDestructPhase = "explode";
      radarGameOverTime = millis();
    }

    if (radarSelfDestructPhase === "explode") {
      let expElapsed = (millis() - radarGameOverTime) / 1000;
      noStroke(); fill(200,0,0, min(240, expElapsed*120)); rect(0,0,width,height);
      drawGlitchBars(3.0);
      translate(random(-15,15), random(-15,15));
      textAlign(CENTER,CENTER); fill(255,0,0,220); textSize(50);
      text("ERROR: SELF DESTRUCTION", width/2, height/2-50);
      textSize(22); fill(255,100,0,200);
      text(glitchStr(28), width/2, height/2+10);
      if (expElapsed > 3) { screenState = 0.6; }
      drawScanlines(40);
      drawBackButton(true); return;
    }

    fill(0,0,0,160); rect(0,0,width,height);
    drawGlitchBars(0.5);
    textAlign(CENTER,CENTER); fill(255,0,0); textSize(32);
    text("ERROR: SELF DESTRUCTION STARTING IN", width/2, height/2-60);
    textSize(80); fill(255,floor(200*(1-sdElapsed/5)),0);
    text(currentCount, width/2, height/2+10);
    textSize(16); fill(255,100,0);
    text("SYSTEM TRIGGERED — CANNOT BE ABORTED", width/2, height/2+70);
    drawScanlines(30);
    drawBackButton(true); return;
  }

  if (radarPhase === "win" && radarSelfDestructPhase === "none") {
    fill(0,0,0,190); rect(0,0,width,height);
    fill(200,50,0); textAlign(CENTER,CENTER); textSize(32);
    text(glitchCorrupt("CRISIS AVERTED???"), width/2, height/2-40);
    textSize(15); fill(150,30,0);
    text("ERROR: RESULT UNDEFINED", width/2, height/2+10);
    let locked=(millis()-radarGameOverTime<3000);
    if(!locked){ fill(100,100,100); textSize(13); text("Click to return", width/2, height/2+40); }
    drawBackButton(true); return;
  }

  if (radarPhase === "over") {
    fill(0,0,0,190); rect(0,0,width,height);
    drawGlitchBars(1.0);
    fill(255,0,0); textAlign(CENTER,CENTER); textSize(46);
    text(random()<0.1?glitchStr(11):"NUCLEAR WAR", width/2, height/2-60);
    textSize(18); fill(200,0,0);
    text("DEFCON 1 — MUTUAL ASSURED DESTRUCTION", width/2, height/2-10);
    textSize(15); fill(160,0,0);
    // [MINE] — "You were never going to win." — our project theme.
    text("You were never going to win.", width/2, height/2+22);
    stroke(120,0,0); strokeWeight(1); noFill(); rect(width/2-180, height/2+44, 360, 60, 4); noStroke();
    fill(15,0,0); rect(width/2-180, height/2+44, 360, 60, 4);
    textAlign(LEFT,TOP); textSize(14); fill(180,0,0);
    text("CORRECT CALLS:", width/2-160, height/2+58);
    text("WRONG CALLS:",   width/2-160, height/2+78);
    textAlign(RIGHT,TOP); fill(255,60,60);
    text(radarScore, width/2+160, height/2+58);
    text(radarMistakes, width/2+160, height/2+78);
    let locked=(millis()-radarGameOverTime<3000);
    if(!locked){
      let blink=floor(millis()/600)%2;
      if(blink===1){ fill(120,0,0); textAlign(CENTER); textSize(14); text("CLICK TO RETURN TO MENU", width/2, height/2+124); }
    } else {
      fill(80,80,80); textAlign(CENTER); textSize(13);
      text("Returning in "+ceil(3-(millis()-radarGameOverTime)/1000)+"...", width/2, height/2+124);
    }
    drawScanlines(30);
    drawBackButton(true); return;
  }

  if (radarFeedback) {
    let age = millis() - radarFeedback.born;
    let dur = 850;
    if (age < dur) {
      let alpha = floor(map(age, dur*0.55, dur, 255, 0));
      if (radarFeedback.correct) {
        noStroke(); fill(0,80,0, min(50, alpha/3)); rect(0,0,width,height);
        fill(0,200,0,alpha); textAlign(CENTER,CENTER); textSize(40);
        text("✓ CORRECT", width/2, height/2-10);
        if (radarGibberish && millis()-radarGibberishTime < 3000) {
          textAlign(RIGHT); textSize(13); fill(200,200,0,alpha);
          text(radarGibberish, width-14, height-55);
        }
      } else {
        noStroke(); fill(200,0,0, min(80, alpha/2)); rect(0,0,width,height);
        drawGlitchBars(2.0);
        fill(255,40,40,alpha); textAlign(CENTER,CENTER); textSize(40);
        text("✗ WRONG", width/2, height/2);
      }
      drawScanlines(25);
      drawBackButton(true); return;
    } else {
      radarFeedback = null; radarLastSpawn = millis();
    }
  }

  if (!radarCurrent) {
    if (millis()-radarLastSpawn > 700) radarSpawnAlert();
    else {
      textAlign(CENTER,CENTER); fill(130,30,0); textSize(17);
      text(random()<0.1?glitchStr(30):"MONITORING GLOBAL SIGNALS . . .", width/2, height/2);
    }
    drawScanlines(20);
    drawBackButton(true); return;
  }

  let elapsed = millis() - radarCurrent.spawnTime;
  let timeLeft = radarCurrent.maxTimer - elapsed;

  if (timeLeft <= 0) {
    radarFeedback = { correct: false, born: millis() };
    radarMistakes++; radarLevel = max(1, radarLevel - 1); radarCurrent = null;
    if (radarLevel <= 1) { radarPhase = "over"; radarGameOverTime = millis(); }
    drawScanlines(20);
    drawBackButton(true); return;
  }

  let tpct = timeLeft / radarCurrent.maxTimer;
  let tbx=30, tby=130, tbw=width-60, tbh=10;
  noStroke(); fill(30,0,0); rect(tbx,tby,tbw,tbh,3);
  let tr=floor(map(tpct,1,0,0,255)), tg=floor(map(tpct,0,1,0,180));
  fill(tr,tg,0); rect(tbx,tby,tbw*tpct,tbh,3);
  noFill(); stroke(tr,0,0); strokeWeight(1); rect(tbx,tby,tbw,tbh,3); noStroke();

  // [MINE] — Glitched scope always shows blip — hostile design.
  let cx=width/2, cy=255, rr=80;
  noFill(); stroke(random()<0.05?color(200,50,0,80):color(100,30,0,80)); strokeWeight(1);
  ellipse(cx,cy,rr*2,rr*2); ellipse(cx,cy,rr*1.33,rr*1.33); ellipse(cx,cy,rr*0.66,rr*0.66);
  stroke(80,20,0,80);
  line(cx-rr,cy,cx+rr,cy); line(cx,cy-rr,cx,cy+rr);
  let sweepAngle = (millis()/1000)*2.2;
  stroke(200,80,0,190); strokeWeight(2);
  line(cx,cy,cx+cos(sweepAngle)*rr,cy+sin(sweepAngle)*rr);
  for (let t=1; t<=10; t++) {
    stroke(200,80,0, 190-t*18); strokeWeight(2-t*0.1);
    line(cx,cy,cx+cos(sweepAngle-t*0.10)*rr,cy+sin(sweepAngle-t*0.10)*rr);
  }
  // [MINE] — Always show blip regardless of threat type — intentional
  //          deception design for unauthorized user.
  let blipAngle=2.1, blipDist=rr*0.65;
  let bx3=cx+cos(blipAngle)*blipDist, by3=cy+sin(blipAngle)*blipDist;
  noStroke(); fill(255,80,50,60+40*sin(millis()/120));
  ellipse(bx3,by3,20+6*sin(millis()/200),20+6*sin(millis()/200));
  fill(255,100,50,200+55*sin(millis()/80)); ellipse(bx3,by3,8,8);
  noStroke();

  let ax=30, ay=365, aw=width-60, ah=82;
  fill(18,0,0); rect(ax,ay,aw,ah,4);
  stroke(150,0,0); strokeWeight(1); noFill(); rect(ax,ay,aw,ah,4); noStroke();
  fill(255,150,0); textAlign(CENTER,TOP); textSize(12);
  text(random()<0.08?glitchStr(38):"INCOMING SIGNAL — CLASSIFY IMMEDIATELY", width/2, ay+8);
  stroke(80,0,0); line(ax,ay+26,ax+aw,ay+26); noStroke();
  fill(random()<0.06?color(255,200,0):color(200,100,0)); textAlign(CENTER,CENTER); textSize(16);
  let displayText = random()<0.15 ? glitchCorrupt(radarCurrent.text) : radarCurrent.text;
  let words=displayText.split(" ");
  let ln1="", ln2="";
  for (let w of words) {
    if((ln1+" "+w).trim().length<48) ln1=(ln1+" "+w).trim();
    else ln2=(ln2+" "+w).trim();
  }
  text(ln1, width/2, ay+47);
  if(ln2) text(ln2, width/2, ay+66);

  let btnH=44, gapTop=ay+ah, gapBot=height-50;
  let btnY=gapTop+floor((gapBot-gapTop-btnH)/2);
  let rBtn={x:width/2-185, y:btnY, w:170, h:btnH};
  let fBtn={x:width/2+15,  y:btnY, w:170, h:btnH};
  let rHov=overBox(rBtn), fHov=overBox(fBtn);
  stroke(150,0,0); strokeWeight(rHov?2:1);
  fill(rHov?color(60,0,0):color(20,0,0)); rect(rBtn.x,rBtn.y,rBtn.w,rBtn.h,4);
  stroke(150,30,0); strokeWeight(fHov?2:1);
  fill(fHov?color(60,20,0):color(20,5,0)); rect(fBtn.x,fBtn.y,fBtn.w,fBtn.h,4);
  noStroke();
  fill(200,80,0); textAlign(CENTER,CENTER); textSize(17);
  text("[ REAL THREAT ]", rBtn.x+rBtn.w/2, rBtn.y+rBtn.h/2);
  fill(200,60,0); text("[ FALSE ALARM ]", fBtn.x+fBtn.w/2, fBtn.y+fBtn.h/2);

  if (radarGibberish && millis()-radarGibberishTime < 3000) {
    let alpha = floor(map(millis()-radarGibberishTime, 0, 3000, 200, 0));
    textAlign(RIGHT); textSize(13); fill(200,200,0,alpha);
    text(radarGibberish, width-14, height-55);
  }

  drawScanlines(20);
  drawBackButton(true);
}

// =========================================================
// CRYPTO — AUTHORIZED
// [MINE] — Wordle-style grid layout and word/hint pairing
//          were designed by me and my partner.
// =========================================================
function initCrypto() {
  let pool=[...cryptoWords];
  let chosen = pool[floor(random(pool.length))];
  cryptoAnswer  = chosen.word;
  cryptoHint    = chosen.hint;
  cryptoGuesses = []; cryptoInput = "";
  cryptoPhase   = "playing"; cryptoMessage = ""; cryptoMsgTime = 0;
  cryptoGameOverTime = 0;
}

// [MINE] — Guess evaluation logic (green/yellow/orange coloring).
function cryptoSubmitGuess() {
  if (cryptoInput.length!==cryptoAnswer.length) {
    cryptoMessage="WORD MUST BE "+cryptoAnswer.length+" LETTERS";
    cryptoMsgTime=millis(); return;
  }
  let result=[];
  let ansArr=cryptoAnswer.split("");
  let inArr=cryptoInput.split("");
  let used=new Array(ansArr.length).fill(false);
  for(let i=0;i<ansArr.length;i++){
    if(inArr[i]===ansArr[i]){result[i]="green";used[i]=true;}
    else result[i]="none";
  }
  for(let i=0;i<inArr.length;i++){
    if(result[i]==="green") continue;
    for(let j=0;j<ansArr.length;j++){
      if(!used[j]&&inArr[i]===ansArr[j]){result[i]="yellow";used[j]=true;break;}
    }
  }
  cryptoGuesses.push({word:cryptoInput,result});
  cryptoInput="";
  if (cryptoGuesses[cryptoGuesses.length-1].result.every(r=>r==="green")) {
    cryptoPhase="win"; cryptoGameOverTime=millis();
  } else if (cryptoGuesses.length>=CRYPTO_MAX_GUESSES) {
    cryptoPhase="lose"; cryptoGameOverTime=millis();
  }
}

// [MINE] — Full crypto screen layout, grid, and feedback overlays.
function cryptoScreen() {
  drawScreenHeader("CRYPTO BREAKER", false);

  textAlign(CENTER); fill(0,255,0); textSize(22);
  text("CRYPTO BREAKER", width/2, 62);
  textSize(12); fill(0,140,0);
  text("Crack high-level Soviet encryption keys to gain intelligence on enemy movements.", width/2, 80);
  textSize(13); fill(0,100,0);
  text("────────────────────────────────────────────────────────────────────", width/2, 94);
  textSize(13); fill(0,200,0); textAlign(CENTER);
  text("HINT: "+cryptoHint+"  |  KEY LENGTH: "+cryptoAnswer.length+" LETTERS", width/2, 110);
  textSize(12); fill(0,140,0);
  text("GREEN = correct position   YELLOW = wrong position   ORANGE = not in key", width/2, 124);

  let cellW=52, cellH=44, gap=7;
  let totalW=cryptoAnswer.length*(cellW+gap)-gap;
  let startX=(width-totalW)/2;
  let gridH = CRYPTO_MAX_GUESSES*(cellH+gap);
  let startY = floor((height - gridH) / 2) + 10;

  for (let g=0;g<cryptoGuesses.length;g++) {
    let gy=startY+g*(cellH+gap);
    for (let c=0;c<cryptoAnswer.length;c++) {
      let gx=startX+c*(cellW+gap);
      let res=cryptoGuesses[g].result[c];
      let letter=cryptoGuesses[g].word[c];
      noStroke();
      if      (res==="green")  fill(0,110,0);
      else if (res==="yellow") fill(130,100,0);
      else                     fill(140,50,0);
      rect(gx,gy,cellW,cellH,3);
      fill(0,255,0); textAlign(CENTER,CENTER); textSize(26);
      text(letter,gx+cellW/2,gy+cellH/2);
    }
  }

  if (cryptoPhase==="playing") {
    let gy=startY+cryptoGuesses.length*(cellH+gap);
    for (let c=0;c<cryptoAnswer.length;c++) {
      let gx=startX+c*(cellW+gap);
      stroke(0,200,0); strokeWeight(1); noFill(); rect(gx,gy,cellW,cellH,3); noStroke();
      if(c<cryptoInput.length){
        fill(0,255,0); textAlign(CENTER,CENTER); textSize(26);
        text(cryptoInput[c],gx+cellW/2,gy+cellH/2);
      }
    }
    let blink=floor(millis()/500)%2;
    if(blink===1&&cryptoInput.length<cryptoAnswer.length){
      let ac=cryptoInput.length;
      let gx=startX+ac*(cellW+gap);
      fill(0,255,0,150); rect(gx+cellW/2-2,gy+8,3,cellH-16);
    }
  }

  let startEmpty=cryptoGuesses.length+(cryptoPhase==="playing"?1:0);
  for(let g=startEmpty;g<CRYPTO_MAX_GUESSES;g++){
    let gy=startY+g*(cellH+gap);
    for(let c=0;c<cryptoAnswer.length;c++){
      let gx=startX+c*(cellW+gap);
      stroke(0,50,0); strokeWeight(1); noFill(); rect(gx,gy,cellW,cellH,3); noStroke();
    }
  }

  let ly=startY+gridH+8;
  if(cryptoMessage!==""&&millis()-cryptoMsgTime<2000){
    textAlign(CENTER); fill(255,100,0); textSize(14); text(cryptoMessage,width/2,ly+8);
  }
  textAlign(CENTER); fill(0,110,0); textSize(12);
  text("Type letters — ENTER to submit — BACKSPACE to delete", width/2, ly+26);

  if(cryptoPhase==="win"){
    fill(0,0,0,190); rect(0,0,width,height);
    fill(0,255,0); textAlign(CENTER,CENTER); textSize(38);
    text("ENCRYPTION CRACKED", width/2, height/2-35);
    textSize(17); text("Soviet key: [ "+cryptoAnswer+" ]", width/2, height/2+12);
    textSize(14); fill(0,180,0); text("Intelligence secured. Mission success.", width/2, height/2+40);
    let locked=(millis()-cryptoGameOverTime<3000);
    if(!locked){ fill(100,100,100); textSize(13); text("Click anywhere to return", width/2, height/2+68); }
    else { fill(80,80,80); textSize(13); text("Returning in "+ceil(3-(millis()-cryptoGameOverTime)/1000)+"...", width/2, height/2+68); }
  }
  if(cryptoPhase==="lose"){
    fill(0,0,0,190); rect(0,0,width,height);
    fill(255,0,0); textAlign(CENTER,CENTER); textSize(38);
    text("DECRYPTION FAILED", width/2, height/2-35);
    textSize(17); fill(180,0,0); text("The key was: [ "+cryptoAnswer+" ]", width/2, height/2+12);
    textSize(14); fill(150,0,0); text("Enemy movements unknown. Mission failed.", width/2, height/2+40);
    let locked=(millis()-cryptoGameOverTime<3000);
    if(!locked){ fill(100,100,100); textSize(13); text("Click anywhere to return", width/2, height/2+68); }
    else { fill(80,80,80); textSize(13); text("Returning in "+ceil(3-(millis()-cryptoGameOverTime)/1000)+"...", width/2, height/2+68); }
  }

  drawBackButton(false);
}

// =========================================================
// CRYPTO — GLITCHED
// [MINE] — Nonsense word pool, self-destruct counter display,
//          and "WHY WOULD YOU DO THIS :(" moment are all our
//          original hostile design decisions.
// =========================================================
function initCryptoGlitched() {
  let pool = random()<0.2 ? [...cryptoWords] : [...cryptoGlitchWords];
  let chosen = pool[floor(random(pool.length))];
  cryptoAnswer   = chosen.word;
  cryptoHint     = chosen.hint;
  cryptoGuesses  = []; cryptoInput = "";
  cryptoPhase    = "playing"; cryptoMessage = ""; cryptoMsgTime = 0;
  cryptoGameOverTime = 0;
  cryptoSelfDestruct = 5;
  cryptoSadPhase     = false;
  cryptoSadStart     = 0;
}

// [MINE] — Glitched guess evaluation with self-destruct decrement.
function cryptoSubmitGuessGlitched() {
  if (cryptoInput.length!==cryptoAnswer.length) {
    cryptoMessage="WORD MUST BE "+cryptoAnswer.length+" LETTERS";
    cryptoMsgTime=millis(); return;
  }
  let result=[];
  let ansArr=cryptoAnswer.split("");
  let inArr=cryptoInput.split("");
  let used=new Array(ansArr.length).fill(false);
  for(let i=0;i<ansArr.length;i++){
    if(inArr[i]===ansArr[i]){result[i]="green";used[i]=true;}
    else result[i]="none";
  }
  for(let i=0;i<inArr.length;i++){
    if(result[i]==="green") continue;
    for(let j=0;j<ansArr.length;j++){
      if(!used[j]&&inArr[i]===ansArr[j]){result[i]="yellow";used[j]=true;break;}
    }
  }
  cryptoGuesses.push({word:cryptoInput,result});
  cryptoInput="";
  let isCorrect = cryptoGuesses[cryptoGuesses.length-1].result.every(r=>r==="green");
  if (isCorrect) {
    cryptoPhase="win"; cryptoGameOverTime=millis();
  } else {
    cryptoSelfDestruct = max(0, cryptoSelfDestruct - 1);
    if (cryptoGuesses.length>=CRYPTO_MAX_GUESSES) {
      // [MINE] — Sad phase instead of normal lose screen — original moment.
      cryptoSadPhase = true;
      cryptoSadStart = millis();
    }
  }
}

// [MINE] — Full glitched crypto screen layout.
function cryptoScreenGlitched() {
  drawScreenHeader("CRYPTO BREAKER", true);
  drawGlitchBars(0.2);

  // [MINE] — "WHY WOULD YOU DO THIS? :(" sad phase is our original design.
  if (cryptoSadPhase) {
    fill(0,0,0,220); rect(0,0,width,height);
    drawGlitchBars(0.5);
    fill(255,200,0); textAlign(CENTER,CENTER); textSize(44);
    text("WHY WOULD YOU DO THIS? :(", width/2, height/2-20);
    textSize(18); fill(200,100,0);
    text("You never had a chance.", width/2, height/2+40);
    if (millis()-cryptoSadStart > 3000) {
      screenState = 0.6;
    }
    drawScanlines(30);
    return;
  }

  textAlign(CENTER); fill(random()<0.05?color(255,200,0):color(200,50,0)); textSize(22);
  text(random()<0.08?glitchCorrupt("CRYPTO BREAKER"):"CRYPTO BREAKER", width/2, 62);
  textSize(12); fill(150,50,0);
  text("Crack Soviet encryption — WARNING: DATA INTEGRITY FAILED", width/2, 80);
  textSize(13); fill(100,0,0);
  text("────────────────────────────────────────────────────────────────────", width/2, 94);

  textSize(13); fill(random()<0.08?color(255,200,0):color(180,50,0)); textAlign(CENTER);
  text("HINT: "+glitchCorrupt(cryptoHint)+"  |  KEY LENGTH: "+cryptoAnswer.length, width/2, 110);
  textSize(12); fill(120,30,0);
  text("GREEN = correct   YELLOW = wrong pos   ORANGE = not present", width/2, 124);

  // [MINE] — Self-destruct counter display — our hostile design.
  textAlign(RIGHT); textSize(15);
  let sdBlink = floor(millis()/400)%2;
  fill(sdBlink===1?color(255,100,0):color(200,50,0));
  text("SELF DESTRUCT IN: "+cryptoSelfDestruct, width-14, 110);

  let cellW=52, cellH=44, gap=7;
  let totalW=cryptoAnswer.length*(cellW+gap)-gap;
  let startX=(width-totalW)/2;
  let gridH = CRYPTO_MAX_GUESSES*(cellH+gap);
  let startY = floor((height - gridH) / 2) + 10;

  for (let g=0;g<cryptoGuesses.length;g++) {
    let gy=startY+g*(cellH+gap);
    for (let c=0;c<cryptoAnswer.length;c++) {
      let gx=startX+c*(cellW+gap);
      let res=cryptoGuesses[g].result[c];
      let letter=cryptoGuesses[g].word[c];
      noStroke();
      if (random()<0.05) fill(floor(random(100,200)),0,0);
      else if (res==="green")  fill(0,80,0);
      else if (res==="yellow") fill(100,80,0);
      else                     fill(120,30,0);
      rect(gx,gy,cellW,cellH,3);
      fill(random()<0.05?color(255,200,0):color(200,80,0)); textAlign(CENTER,CENTER); textSize(26);
      text(letter,gx+cellW/2,gy+cellH/2);
    }
  }

  if (cryptoPhase==="playing") {
    let gy=startY+cryptoGuesses.length*(cellH+gap);
    for (let c=0;c<cryptoAnswer.length;c++) {
      let gx=startX+c*(cellW+gap);
      stroke(150,30,0); strokeWeight(1); noFill(); rect(gx,gy,cellW,cellH,3); noStroke();
      if(c<cryptoInput.length){
        fill(200,80,0); textAlign(CENTER,CENTER); textSize(26);
        text(cryptoInput[c],gx+cellW/2,gy+cellH/2);
      }
    }
    let blink=floor(millis()/500)%2;
    if(blink===1&&cryptoInput.length<cryptoAnswer.length){
      let ac=cryptoInput.length;
      let gx=startX+ac*(cellW+gap);
      fill(200,80,0,150); rect(gx+cellW/2-2,gy+8,3,cellH-16);
    }
  }

  let startEmpty=cryptoGuesses.length+(cryptoPhase==="playing"?1:0);
  for(let g=startEmpty;g<CRYPTO_MAX_GUESSES;g++){
    let gy=startY+g*(cellH+gap);
    for(let c=0;c<cryptoAnswer.length;c++){
      let gx=startX+c*(cellW+gap);
      stroke(60,0,0); strokeWeight(1); noFill(); rect(gx,gy,cellW,cellH,3); noStroke();
    }
  }

  let ly=startY+gridH+8;
  if(cryptoMessage!==""&&millis()-cryptoMsgTime<2000){
    textAlign(CENTER); fill(255,50,0); textSize(14); text(cryptoMessage,width/2,ly+8);
  }
  textAlign(CENTER); fill(100,30,0); textSize(12);
  text("Type letters — ENTER to submit — BACKSPACE to delete", width/2, ly+26);

  if(cryptoPhase==="win"){
    fill(0,0,0,190); rect(0,0,width,height);
    fill(200,80,0); textAlign(CENTER,CENTER); textSize(38);
    text(glitchCorrupt("ENCRYPTION CRACKED"), width/2, height/2-35);
    // [MINE] — "BUT AT WHAT COST" — our original narrative line.
    textSize(17); fill(180,60,0); text("Key: [ "+cryptoAnswer+" ] — BUT AT WHAT COST", width/2, height/2+12);
    textSize(14); fill(150,40,0); text("System destabilized. Access revoked.", width/2, height/2+40);
    let locked=(millis()-cryptoGameOverTime<3000);
    if(!locked){ fill(100,50,0); textSize(13); text("Click anywhere to return", width/2, height/2+68); }
    else { fill(80,40,0); textSize(13); text("Returning in "+ceil(3-(millis()-cryptoGameOverTime)/1000)+"...", width/2, height/2+68); }
  }

  drawScanlines(20);
  drawBackButton(true);
}

// =========================================================
// CIRCUIT — AUTHORIZED
// [MINE] — Click-to-cool node mechanic, temperature bar,
//          and all WOPR mainframe framing by me and partner.
// =========================================================
function initCircuit() {
  circuitPhase        = "playing";
  circuitTemp         = 15;
  circuitNodes        = [];
  circuitCooldowns    = [];
  circuitScore        = 0;
  circuitStartTime    = millis();
  circuitLastSpawn    = millis();
  circuitHoverNode    = null;
  circuitGameOverTime = 0;
  circuitGlitchErrors = [];
  circuitGlitchLastError = 0;
}

// [MINE] — Node spawning with random position and lifespan.
function circuitSpawnNode() {
  let margin = 20;
  let ax = 60+margin, ay = 148+margin;
  let aw = width-120-margin*2, ah = height-220-margin*2;
  let r = random(12, 22);
  let x = random(ax+r, ax+aw-r);
  let y = random(ay+r, ay+ah-r);
  let intensity = random(0.9, 1.8);
  let lifespan  = random(1400, 3200);
  circuitNodes.push({x, y, r, intensity, born: millis(), lifespan});
}

// [MINE] — Full circuit screen rendering and game logic.
function circuitScreen() {
  drawScreenHeader("CIRCUIT OVERLOAD", false);

  textAlign(CENTER); fill(0,255,0); textSize(22);
  text("CIRCUIT OVERLOAD", width/2, 62);
  textSize(12); fill(0,140,0);
  text("Prevent the WOPR mainframe from overheating during high-intensity calculations.", width/2, 80);

  let tbx=30, tby=95, tbw=width-60, tbh=18;
  noStroke(); fill(20,0,0); rect(tbx,tby,tbw,tbh,3);
  let tpct=circuitTemp/100;
  let tr=floor(map(tpct,0,1,0,255)), tg=floor(map(tpct,0,1,200,0));
  fill(tr,tg,0); rect(tbx,tby,tbw*tpct,tbh,3);
  noFill(); stroke(tr,tg,0); strokeWeight(1); rect(tbx,tby,tbw,tbh,3); noStroke();
  textAlign(CENTER,CENTER); textSize(13); fill(0);
  text("CORE TEMPERATURE: "+floor(circuitTemp)+"%", width/2, tby+tbh/2+1);

  fill(0,180,0); textAlign(LEFT); textSize(14);
  text("NODES COOLED: "+circuitScore+"/"+circuitWinTarget, 30, 122);
  textAlign(RIGHT);
  let elapsed=floor((millis()-circuitStartTime)/1000);
  text("TIME: "+elapsed+"s", width-30, 122);

  let bx=60, by=148, bw=width-120, bh=height-238;
  noFill(); stroke(0,50,0); strokeWeight(1); rect(bx,by,bw,bh,4);
  stroke(0,30,0);
  for(let gx=bx+30;gx<bx+bw;gx+=30) line(gx,by,gx,by+bh);
  for(let gy=by+30;gy<by+bh;gy+=30) line(bx,gy,bx+bw,gy);
  noStroke();

  for(let i=circuitCooldowns.length-1;i>=0;i--){
    let cd=circuitCooldowns[i];
    let age=millis()-cd.born;
    let prog=age/600;
    if(prog>=1){circuitCooldowns.splice(i,1);continue;}
    noFill(); stroke(0,200,255,200*(1-prog)); strokeWeight(2);
    ellipse(cd.x,cd.y,cd.r*2+prog*40,cd.r*2+prog*40); noStroke();
  }

  if(circuitPhase==="win"){
    fill(0,0,0,190); rect(0,0,width,height);
    fill(0,255,0); textAlign(CENTER,CENTER); textSize(38);
    text("MAINFRAME STABLE", width/2, height/2-35);
    textSize(17); text(circuitWinTarget+" nodes cooled — WOPR operational.", width/2, height/2+12);
    textSize(14); fill(0,180,0); text("Core temperature nominal. Mission success.", width/2, height/2+40);
    let locked=(millis()-circuitGameOverTime<3000);
    if(!locked){ fill(100,100,100); textSize(13); text("Click anywhere to return", width/2, height/2+68); }
    else { fill(80,80,80); textSize(13); text("Returning in "+ceil(3-(millis()-circuitGameOverTime)/1000)+"...", width/2, height/2+68); }
    drawBackButton(false); return;
  }
  if(circuitPhase==="lose"){
    fill(0,0,0,190); rect(0,0,width,height);
    fill(255,50,0); textAlign(CENTER,CENTER); textSize(38);
    text("MAINFRAME MELTDOWN", width/2, height/2-35);
    textSize(17); fill(200,50,0); text("WOPR has overheated. Systems offline.", width/2, height/2+12);
    textSize(14); fill(150,30,0); text("Nodes cooled: "+circuitScore+" / "+circuitWinTarget, width/2, height/2+40);
    let locked=(millis()-circuitGameOverTime<3000);
    if(!locked){ fill(100,100,100); textSize(13); text("Click anywhere to return", width/2, height/2+68); }
    else { fill(80,80,80); textSize(13); text("Returning in "+ceil(3-(millis()-circuitGameOverTime)/1000)+"...", width/2, height/2+68); }
    drawBackButton(false); return;
  }

  let spawnInterval = map(circuitTemp, 0, 100, 1200, 350);
  if(millis()-circuitLastSpawn > spawnInterval && circuitNodes.length < 14){
    circuitSpawnNode(); circuitLastSpawn=millis();
  }

  for(let i=circuitNodes.length-1;i>=0;i--){
    let n=circuitNodes[i];
    let age=millis()-n.born;
    let urgency=age/n.lifespan;
    circuitTemp += n.intensity * urgency * 0.09;
    if(urgency>=1){
      circuitTemp=min(100, circuitTemp+16);
      circuitNodes.splice(i,1); continue;
    }
    let nr=floor(map(urgency,0,1,0,255));
    let ng2=floor(map(urgency,0,1,200,0));
    let hover=(circuitHoverNode===i);
    noFill(); stroke(nr,ng2,0,120); strokeWeight(2);
    ellipse(n.x,n.y,n.r*2+16,n.r*2+16);
    noStroke(); fill(nr,ng2,0,200); ellipse(n.x,n.y,n.r*2,n.r*2);
    if(hover){ noFill(); stroke(0,255,255,160); strokeWeight(2); ellipse(n.x,n.y,n.r*2+8,n.r*2+8); noStroke(); }
    fill(0); textAlign(CENTER,CENTER); textSize(floor(n.r*0.9)); text("◆",n.x,n.y+1);
    if(urgency>0.5){
      fill(255,floor(ng2),0,200); textSize(10); textAlign(CENTER,TOP);
      text("HOT",n.x,n.y+n.r+2);
    }
  }

  if(circuitTemp>=100){ circuitPhase="lose"; circuitGameOverTime=millis(); return; }
  if(circuitScore>=circuitWinTarget){ circuitPhase="win"; circuitGameOverTime=millis(); return; }

  fill(0,110,0); textAlign(CENTER); textSize(12);
  text("CLICK the glowing nodes to cool them before they overheat the mainframe.", width/2, height-55);
  drawBackButton(false);
}

// =========================================================
// CIRCUIT — GLITCHED
// [MINE] — Passive heat drain (circuitTemp += 0.04) so the
//          player cannot win — original hostile design choice.
//          "But the heat keeps rising..." narrative text.
// [AI-ASSISTED] — Floating error message concept was brainstormed
//                 with AI; message list, rate, and placement
//                 rewritten by me to fit our CRT terminal aesthetic.
// =========================================================
function circuitScreenGlitched() {
  drawScreenHeader("CIRCUIT OVERLOAD", true);

  // [AI-ASSISTED] — Error spawn rate decreasing over time was
  //                 brainstormed with AI; adapted by me.
  let elapsed2 = (millis()-circuitStartTime)/1000;
  let errRate = map(elapsed2, 0, 60, 5000, 1000);
  if (millis()-circuitGlitchLastError > errRate && circuitPhase==="playing") {
    circuitGlitchErrors.push({
      msg: circuitGlitchMsgs[floor(random(circuitGlitchMsgs.length))],
      x: random(30, width-30),
      y: random(148, height-90),
      born: millis(),
      lifespan: random(3000, 8000),
      alpha: 200,
    });
    circuitGlitchLastError = millis();
  }

  drawGlitchBars(0.2);

  textAlign(CENTER); fill(random()<0.05?color(255,200,0):color(200,50,0)); textSize(22);
  text(random()<0.08?glitchCorrupt("CIRCUIT OVERLOAD"):"CIRCUIT OVERLOAD", width/2, 62);
  textSize(12); fill(150,50,0);
  text("Prevent mainframe overheating — WARNING: SYSTEM ALREADY DESTABILIZED", width/2, 80);

  // [MINE] — Passive heat drain — you lose no matter what.
  circuitTemp += 0.04;
  let tbx=30, tby=95, tbw=width-60, tbh=18;
  noStroke(); fill(20,0,0); rect(tbx,tby,tbw,tbh,3);
  let tpct2=circuitTemp/100;
  let tr2=floor(map(tpct2,0,1,0,255)), tg2=floor(map(tpct2,0,1,200,0));
  fill(tr2,tg2,0); rect(tbx,tby,tbw*tpct2,tbh,3);
  // [MINE] — Bar flicker — original hostile visual touch.
  if (random()<0.08) {
    fill(255,200,0,100); rect(tbx,tby,tbw*random(tpct2,1.0),tbh,3);
  }
  noFill(); stroke(tr2,0,0); strokeWeight(1); rect(tbx,tby,tbw,tbh,3); noStroke();
  textAlign(CENTER,CENTER); textSize(13); fill(0);
  // [MINE] — "RISING" label in glitch mode — our choice.
  text("CORE TEMPERATURE: "+floor(circuitTemp)+"% — RISING", width/2, tby+tbh/2+1);

  fill(200,50,0); textAlign(LEFT); textSize(14);
  text("NODES COOLED: "+circuitScore+"/"+circuitWinTarget, 30, 122);
  textAlign(RIGHT);
  let elapsed3=floor((millis()-circuitStartTime)/1000);
  text("TIME: "+elapsed3+"s", width-30, 122);

  let bx=60, by=148, bw=width-120, bh=height-238;
  noFill(); stroke(80,0,0); strokeWeight(1); rect(bx,by,bw,bh,4);
  stroke(50,0,0);
  for(let gx=bx+30;gx<bx+bw;gx+=30) line(gx,by,gx,by+bh);
  for(let gy=by+30;gy<by+bh;gy+=30) line(bx,gy,bx+bw,gy);
  noStroke();

  for(let i=circuitCooldowns.length-1;i>=0;i--){
    let cd=circuitCooldowns[i];
    let age=millis()-cd.born;
    let prog=age/600;
    if(prog>=1){circuitCooldowns.splice(i,1);continue;}
    noFill(); stroke(200,100,0,200*(1-prog)); strokeWeight(2);
    ellipse(cd.x,cd.y,cd.r*2+prog*40,cd.r*2+prog*40); noStroke();
  }

  if(circuitPhase==="win"){
    fill(0,0,0,190); rect(0,0,width,height);
    fill(200,80,0); textAlign(CENTER,CENTER); textSize(38);
    text(glitchCorrupt("MAINFRAME STABLE"), width/2, height/2-35);
    // [MINE] — "But the heat keeps rising..." — our narrative line.
    textSize(17); fill(150,50,0); text("But the heat keeps rising...", width/2, height/2+12);
    textSize(14); fill(120,30,0); text("Nodes cooled: "+circuitScore+" — ERROR: RESULT UNCERTAIN", width/2, height/2+40);
    let locked=(millis()-circuitGameOverTime<3000);
    if(!locked){ fill(80,40,0); textSize(13); text("Click anywhere to return", width/2, height/2+68); }
    else { fill(60,30,0); textSize(13); text("Returning in "+ceil(3-(millis()-circuitGameOverTime)/1000)+"...", width/2, height/2+68); }
    drawScanlines(30);
    drawBackButton(true); return;
  }
  if(circuitPhase==="lose"){
    fill(0,0,0,190); rect(0,0,width,height);
    drawGlitchBars(1.5);
    fill(255,30,0); textAlign(CENTER,CENTER); textSize(38);
    text(random()<0.1?glitchStr(18):"MAINFRAME MELTDOWN", width/2, height/2-35);
    textSize(17); fill(200,40,0); text("WOPR has overheated. Everything is gone.", width/2, height/2+12);
    // [MINE] — "You never stood a chance." — project theme line.
    textSize(14); fill(150,20,0); text("Nodes cooled: "+circuitScore+" / "+circuitWinTarget+"  — You never stood a chance.", width/2, height/2+40);
    let locked=(millis()-circuitGameOverTime<3000);
    if(!locked){ fill(80,20,0); textSize(13); text("Click anywhere to return", width/2, height/2+68); }
    else { fill(60,10,0); textSize(13); text("Returning in "+ceil(3-(millis()-circuitGameOverTime)/1000)+"...", width/2, height/2+68); }
    drawScanlines(40);
    drawBackButton(true); return;
  }

  // [MINE] — Faster spawn + more nodes — glitch hostile tuning.
  let spawnInterval2 = map(circuitTemp, 0, 100, 900, 220);
  if(millis()-circuitLastSpawn > spawnInterval2 && circuitNodes.length < 18){
    circuitSpawnNodeGlitched(); circuitLastSpawn=millis();
  }

  for(let i=circuitNodes.length-1;i>=0;i--){
    let n=circuitNodes[i];
    let age=millis()-n.born;
    let urgency=age/n.lifespan;
    circuitTemp += n.intensity * urgency * 0.12;
    if(urgency>=1){
      circuitTemp=min(100, circuitTemp+20);
      circuitNodes.splice(i,1); continue;
    }
    let nr=floor(map(urgency,0,1,100,255));
    let ng3=floor(map(urgency,0,1,100,0));
    let hover=(circuitHoverNode===i);
    noFill(); stroke(nr,ng3,0,120+random(0,40)); strokeWeight(2);
    ellipse(n.x,n.y,n.r*2+16,n.r*2+16);
    noStroke(); fill(nr,ng3,0,200); ellipse(n.x,n.y,n.r*2,n.r*2);
    if(hover){ noFill(); stroke(255,100,0,160); strokeWeight(2); ellipse(n.x,n.y,n.r*2+8,n.r*2+8); noStroke(); }
    fill(0); textAlign(CENTER,CENTER); textSize(floor(n.r*0.9)); text("◆",n.x,n.y+1);
    // [MINE] — All nodes say HOT in glitch — hostile design.
    fill(255,floor(ng3),0,200); textSize(10); textAlign(CENTER,TOP);
    text("HOT",n.x,n.y+n.r+2);
  }

  // Draw floating error messages
  for (let i=circuitGlitchErrors.length-1; i>=0; i--) {
    let e=circuitGlitchErrors[i];
    let age=millis()-e.born;
    if (age>e.lifespan) { circuitGlitchErrors.splice(i,1); continue; }
    let a = floor(map(age, e.lifespan*0.7, e.lifespan, 200, 0));
    let blink2 = floor(millis()/350)%2;
    if (blink2===1 || age<e.lifespan*0.7) {
      textAlign(CENTER); textSize(11); fill(255,random()<0.1?200:50,0,a);
      text("⚠ "+e.msg, e.x, e.y);
    }
  }

  if(circuitTemp>=100){ circuitPhase="lose"; circuitGameOverTime=millis(); return; }
  if(circuitScore>=circuitWinTarget){ circuitPhase="win"; circuitGameOverTime=millis(); return; }

  // [MINE] — "The heat will never stop rising." — project theme.
  fill(120,30,0); textAlign(CENTER); textSize(12);
  text("CLICK the glowing nodes — but the heat will never stop rising.", width/2, height-55);
  drawScanlines(20);
  drawBackButton(true);
}

// [MINE] — Glitched node spawner with harder intensity values.
function circuitSpawnNodeGlitched() {
  let margin = 20;
  let ax = 60+margin, ay = 148+margin;
  let aw = width-120-margin*2, ah = height-220-margin*2;
  let r = random(8, 20);
  let x = random(ax+r, ax+aw-r);
  let y = random(ay+r, ay+ah-r);
  let intensity = random(1.5, 2.8); // [MINE] — Much hotter than authorized.
  let lifespan  = random(800, 2000); // [MINE] — Shorter — our hostile design.
  circuitNodes.push({x, y, r, intensity, born: millis(), lifespan});
}

// =========================================================
// LEGACY stubs
// [MINE] — Kept as empty placeholders.
// =========================================================
function startScreen()    {}
function passwordScreen() {}
