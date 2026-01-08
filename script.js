/* =========================================================
   Roommate Sync – FINAL Frontend Logic (Polished Demo Build)
   ========================================================= */

/* ---------------- Firebase ---------------- */

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyABBlqXZtpYAhdsdCcB96pfQ0_77ASzCeg",
  authDomain: "roommate-sync-e8a32.firebaseapp.com",
  projectId: "roommate-sync-e8a32",
  storageBucket: "roommate-sync-e8a32.firebasestorage.app",
  messagingSenderId: "553409019094",
  appId: "1:553409019094:web:7062426a48cd5c47ad1d77"
};

initializeApp(firebaseConfig);
const auth = getAuth();

/* ---------------- Navigation ---------------- */

function rsNavigateTo(page) {
  const map = {
    auth: "index.html",
    quiz: "quiz.html",
    results: "result.html"
  };
  if (map[page]) window.location.href = map[page];
}

/* ---------------- Guards ---------------- */

function rsRequireAuth() {
  if (!localStorage.getItem("roommateSync::session")) {
    rsNavigateTo("auth");
    return false;
  }
  return true;
}

function rsRequireQuiz() {
  if (!localStorage.getItem("roommateSync::quiz")) {
    rsNavigateTo("quiz");
    return false;
  }
  return true;
}

/* ---------------- AUTH ---------------- */

function rsInitAuthPage() {
  const form = document.getElementById("authForm");
  if (!form) return;

  const email = document.getElementById("authEmail");
  const password = document.getElementById("authPassword");

  form.addEventListener("submit", e => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email.value, password.value)
      .then(() => {
        localStorage.setItem(
          "roommateSync::session",
          JSON.stringify({ email: email.value, at: Date.now() })
        );
        rsNavigateTo("quiz");
      })
      .catch(() => {
        createUserWithEmailAndPassword(auth, email.value, password.value)
          .then(() => {
            localStorage.setItem(
              "roommateSync::session",
              JSON.stringify({ email: email.value, at: Date.now() })
            );
            rsNavigateTo("quiz");
          })
          .catch(err => alert(err.message));
      });
  });

  document.getElementById("rsYear").textContent = new Date().getFullYear();
}

/* ---------------- QUIZ ---------------- */

function rsInitQuizPage() {
  if (!rsRequireAuth()) return;

  const steps = document.querySelectorAll(".rs-quiz-step");
  const nextBtn = document.getElementById("quizNextButton");
  const backBtn = document.getElementById("quizBackButton");
  const progress = document.getElementById("quizProgressBar");
  const progressValue = document.getElementById("quizProgressValue");

  let currentStep = 0;

  function showStep(i) {
    steps.forEach((s, idx) =>
      s.classList.toggle("rs-quiz-step-active", idx === i)
    );
    backBtn.disabled = i === 0;
    nextBtn.textContent = i === steps.length - 1
      ? "Generate compatibility"
      : "Next";

    const pct = Math.round(((i + 1) / steps.length) * 100);
    progress.style.width = pct + "%";
    progressValue.textContent = pct + "%";
  }

  nextBtn.addEventListener("click", () => {
    const inputs = steps[currentStep].querySelectorAll("input[type=radio]");
    if (![...inputs].some(i => i.checked)) {
      alert("Please select an option");
      return;
    }

    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
    } else {
      const data = Object.fromEntries(
        new FormData(document.getElementById("quizForm"))
      );
      localStorage.setItem("roommateSync::quiz", JSON.stringify(data));
      rsNavigateTo("results");
    }
  });

  backBtn.addEventListener("click", () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });

  showStep(0);
}

/* ---------------- SCORING ---------------- */

function rsComputeResult(q) {
  let score = 0;
  const b = {};

  score += q.sleepTiming === "early" ? 22 : 20;
  b.sleep = q.sleepTiming === "early"
    ? "Early sleeper — structured routine alignment."
    : "Late sleeper — flexible rhythm alignment.";

  score += q.foodPreference === "veg" ? 25 : 23;
  b.food = q.foodPreference === "veg"
    ? "Vegetarian kitchen comfort."
    : "Non-veg friendly kitchen.";

  if (q.cleanlinessLevel === "high") {
    score += 25; b.cleanliness = "High cleanliness preference.";
  } else if (q.cleanlinessLevel === "medium") {
    score += 22; b.cleanliness = "Balanced cleanliness expectation.";
  } else {
    score += 18; b.cleanliness = "Relaxed cleanliness tolerance.";
  }

  if (q.budgetComfort === "high") {
    score += 23; b.budget = "Comfort-led rent mindset.";
  } else if (q.budgetComfort === "medium") {
    score += 22; b.budget = "Balanced budget expectation.";
  } else {
    score += 18; b.budget = "Cost-conscious living.";
  }

  score = Math.min(score, 100);

  return {
    score,
    label: score >= 80 ? "Good match" : score >= 60 ? "Average match" : "Low match",
    message:
      score >= 80
        ? "Strong lifestyle alignment with minimal friction."
        : score >= 60
        ? "Some differences worth discussing."
        : "This pairing needs deeper conversation.",
    breakdown: b
  };
}

/* ---------------- RESULTS (FIXED + POLISHED) ---------------- */

function rsInitResultPage() {
  if (!rsRequireAuth() || !rsRequireQuiz()) return;

  // Loading state
  document.getElementById("scorePercentage").textContent = "—";
  document.getElementById("matchQualityLabel").textContent = "Calculating";
  document.getElementById("scoreMessage").textContent =
    "Analyzing lifestyle alignment across key dimensions…";

  setTimeout(() => {
    const quiz = JSON.parse(localStorage.getItem("roommateSync::quiz"));
    const result = rsComputeResult(quiz);
    const score = result.score;

    document.getElementById("scorePercentage").textContent = score + "%";
    document.getElementById("matchQualityLabel").textContent = result.label;
    document.getElementById("scoreMessage").textContent = result.message;

    document.getElementById("dimensionSleepScore").textContent = quiz.sleepTiming;
    document.getElementById("dimensionSleepText").textContent = result.breakdown.sleep;

    document.getElementById("dimensionFoodScore").textContent = quiz.foodPreference;
    document.getElementById("dimensionFoodText").textContent = result.breakdown.food;

    document.getElementById("dimensionCleanScore").textContent = quiz.cleanlinessLevel;
    document.getElementById("dimensionCleanText").textContent = result.breakdown.cleanliness;

    document.getElementById("dimensionBudgetScore").textContent = quiz.budgetComfort;
    document.getElementById("dimensionBudgetText").textContent = result.breakdown.budget;

    const ring = document.getElementById("scoreRingIndicator");
    const c = 326;
    ring.style.strokeDasharray = c;
    ring.style.strokeDashoffset = c - (score / 100) * c;
    ring.style.stroke =
      score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";
  }, 900);
}

/* ---------------- BOOT ---------------- */

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.classList.contains("rs-body-auth")) rsInitAuthPage();
  if (document.body.classList.contains("rs-body-quiz")) rsInitQuizPage();
  if (document.body.classList.contains("rs-body-result")) rsInitResultPage();
});
