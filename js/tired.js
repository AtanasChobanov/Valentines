'use strict';

/**
 * Tired Page Logic
 */
const reassurances = [
  "Ти си бъдещ лекар, гордея се с теб! 🩺",
  "Един изпит не определя колко си умна. 🧠",
  "Софийският университет е труден, но ти си по-силна! 🏛️",
  "Вдишай дълбоко. Ще спасяваш животи един ден. 😄",
  "Всичкото това учене ще си струва, д-р Димитрова! 👩‍⚕️",
  "Ти си моята гордост и вдъхновение! ✨",
  "Малко по малко, всичко ще се нареди. 📚",
  "Ти се справяш страхотно, дори и да не вярваш в себе си! 💪",
  "Вярвам в теб безкрайно! 🌟"
];

function initTiredPage() {
  const btn = document.getElementById('reassurance-btn');
  if (btn) btn.onclick = showReassurance;
}

function showReassurance() {
  const text = document.getElementById('tired-instruction');
  
  // Pick random unique message
  const msg = reassurances[Math.floor(Math.random() * reassurances.length)];
  
  text.textContent = msg;
  text.style.fontWeight = 'bold';
  
  // Re-trigger animation
  text.classList.remove('fade-in');
  void text.offsetWidth; // force reflow
  text.classList.add('fade-in');
}

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
    initTiredPage();
});
