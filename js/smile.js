'use strict';

/**
 * Smile Page Logic
 */
const noMessages = [
  "Не", 
  "Сигурна ли си?", 
  "Хммм...", 
  "Пробвай пак!", 
  "Сърдиш ми се? 😢",
  "Наистина ли?",
  "👀",
  "Счупи сърцето ми 💔",
  "Последен шанс!",
];
let noClickCount = 0;

function initSmilePage() {
  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const questionContainer = document.getElementById('question-container');
  const successContainer = document.getElementById('success-container');
  
  // Reset View
  if (questionContainer) questionContainer.style.display = 'block';
  if (successContainer) successContainer.style.display = 'none';
  
  // Reset state
  noClickCount = 0;
  if (yesBtn) {
    yesBtn.onclick = handleYesClick;
    yesBtn.style.transform = 'none'; // Remove scale
    yesBtn.style.fontSize = '1.2rem'; // Reset font size
  }
  
  if (noBtn) {
    noBtn.onmouseover = null; 
    noBtn.onclick = handleNoClick;
    noBtn.innerText = noMessages[0];
  }
}

function handleNoClick() {
  const noBtn = document.getElementById('no-btn');
  const yesBtn = document.getElementById('yes-btn');
  
  // Update No button text
  noClickCount++;
  const msgIndex = Math.min(noClickCount, noMessages.length - 1);
  noBtn.innerText = noMessages[msgIndex];
  
  // Grow Yes button by percentage (layout affecting)
  // Increase font-size significantly per click
  const currentSize = 1.2 * (1 + (noClickCount * 2.5));
  yesBtn.style.fontSize = `${currentSize}rem`;
}

function handleYesClick() {
  document.getElementById('question-container').style.display = 'none';
  document.getElementById('success-container').style.display = 'block';
  
  // Refresh Tenor embed if needed
  if (window.Tenor && window.Tenor.embed) {
    window.Tenor.embed.initialize();
  }
  
  if (typeof startConfetti === 'function') {
    startConfetti();
  }
}

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
    initSmilePage();
});
