/**
 * Roommate Sync - Frontend Logic (FIXED)
 * Handles Authentication, Quiz State, and Score Animation
 */

/* ================= FIREBASE ================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyABBlqXZtpYAhdsdCcB96pfQ0_77ASzCeg",
  authDomain: "roommate-sync-e8a32.firebaseapp.com",
  projectId: "roommate-sync-e8a32",
  storageBucket: "roommate-sync-e8a32.firebasestorage.app",
  messagingSenderId: "553409019094",
  appId: "1:553409019094:web:7062426a48cd5c47ad1d77"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ================= DOM READY ================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ================= 1. AUTH PAGE ================= */

  if (document.querySelector(".page-auth")) {
    const form = document.querySelector("form");
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const submitBtn = document.querySelector(".btn-primary");

    let mode = "login"; // default

    /* ---- Tab Toggle ---- */
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabIndicator = document.querySelector(".tab-indicator");

    tabBtns.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        mode = btn.dataset.tab;

        tabIndicator.style.transform =
          index === 0 ? "translateX(0)" : "translateX(100%)";

        submitBtn.querySelector("span").textContent =
          mode === "login" ? "Continue" : "Create Account";
      });
    });

    /* ---- FORM SUBMIT (FIXED) ---- */
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      // 🚫 HARD VALIDATION
      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.7";

      try {
        if (mode === "login") {
          await signInWithEmailAndPassword(auth, email, password);
        } else {
          await createUserWithEmailAndPassword(auth, email, password);
        }

        // ✅ SUCCESS → REDIRECT
        window.location.href = "quiz.html";

      } catch (err) {
        alert(err.message);
      } finally {
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
      }
    });
  }

  /* ================= 2. QUIZ PAGE ================= */

  if (document.querySelector(".page-quiz")) {
    let currentStep = 1;
    const totalSteps = 4;

    const progressBar = document.getElementById("progressBar");
    const progressPercent = document.getElementById("progressPercent");
    const currentStepText = document.getElementById("currentStep");
    const checkItems = document.querySelectorAll(".check-item");

    window.nextStep = function (step) {
      if (step > totalSteps) return;

      document.querySelector(".question-card.active").classList.remove("active");
      document.getElementById(`q${step}`).classList.add("active");

      currentStep = step;
      updateProgress();
    };

    window.prevStep = function (step) {
      if (step < 1) return;

      document.querySelector(".question-card.active").classList.remove("active");
      document.getElementById(`q${step}`).classList.add("active");

      currentStep = step;
      updateProgress();
    };

    function updateProgress() {
      const percent = Math.round((currentStep / totalSteps) * 100);
      progressBar.style.width = percent + "%";
      progressPercent.textContent = percent + "%";
      currentStepText.textContent = currentStep;

      checkItems.forEach((item, index) => {
        item.classList.toggle("active", index < currentStep);
      });
    }
  }

  /* ================= 3. RESULT PAGE ================= */

  if (document.querySelector(".page-result")) {
    const scoreCircle = document.getElementById("scoreCircle");
    const scoreNumber = document.getElementById("scoreNumber");
    const targetScore = 94;

    const radius = scoreCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    scoreCircle.style.strokeDasharray = circumference;
    scoreCircle.style.strokeDashoffset = circumference;

    function setProgress(percent) {
      scoreCircle.style.strokeDashoffset =
        circumference - (percent / 100) * circumference;
    }

    setTimeout(() => {
      setProgress(targetScore);

      let current = 0;
      const timer = setInterval(() => {
        current++;
        scoreNumber.textContent = current;
        if (current >= targetScore) clearInterval(timer);
      }, 20);
    }, 400);
  }
});
