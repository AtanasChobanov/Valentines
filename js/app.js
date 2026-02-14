/**
 * Valentine's SPA Logic
 * Handles Navigation, Music, and Page Interactions
 */

'use strict';

// ==========================================
// Music System
// ==========================================
const musicConfig = {
  src: 'assets/audio/background.mp3',
  volume: 0.03, // 10% volume as requested
  loop: true
};

let audioElement = null;
let isMuted = false;

function initMusic() {
  audioElement = new Audio(musicConfig.src);
  audioElement.volume = musicConfig.volume;
  audioElement.loop = musicConfig.loop;
  
  // Try to restore mute state
  isMuted = localStorage.getItem('valentinesMusicMuted') === 'true';
  audioElement.muted = isMuted;
  updateMuteButton();
}

function playMusic() {
  if (!audioElement) initMusic();
  audioElement.play().catch(e => console.log("Autoplay waiting for interaction"));
}

function toggleMute() {
  isMuted = !isMuted;
  if (audioElement) audioElement.muted = isMuted;
  localStorage.setItem('valentinesMusicMuted', isMuted);
  updateMuteButton();
}

function updateMuteButton() {
  const btn = document.getElementById('music-control');
  if (btn) btn.innerHTML = isMuted ? '🔇' : '🔊';
}

// ==========================================
// Navigation System
// ==========================================
function navigateTo(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
    page.classList.add('hidden');
  });
  
  // Show target page
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('active');
    
    // Manage Body Scroll (Lock for Smile page to annoying scrolling to "No")
    document.body.style.overflow = (pageId === 'smile') ? 'hidden' : '';
    
    // Trigger specific page logic
    if (pageId === 'smile') initSmilePage();
    if (pageId === 'tired') initTiredPage();
  }
}

// ==========================================
// Page Logic: Tired
// ==========================================
// ==========================================
// Page Logic: Tired
// ==========================================
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

// ==========================================
// Page Logic: Smile (Game + Confetti)
// ==========================================
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
  
  startConfetti();
}

// Confetti Logic
let canvas, ctx, particles = [];
let animationId = null;
let isConfettiStopping = false;

function startConfetti() {
  canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  
  ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Create particles (tumbling confetti)
  particles = [];
  const colors = ['#ffb7c5', '#ff69b4', '#ff1493', '#ffffff', '#ffd700'];
  
  for(let i=0; i<150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 15 + 6, // Larger particles
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 2 + 1.5, // Slower
      tilt: Math.random() * 10,
      tiltAngle: Math.random(),
      tiltAngleInc: Math.random() * 0.05 + 0.05,
      isHeart: Math.random() > 0.6 // 40% hearts
    });
  }
  
  // Reset stopping flag
  isConfettiStopping = false;
  
  if (animationId) cancelAnimationFrame(animationId);
  animateConfetti();
  
  // Stop recycling particles after 5 seconds
  setTimeout(() => {
    isConfettiStopping = true;
  }, 5000);
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  let activeParticles = 0;
  
  particles.forEach((p, i) => {
    p.tiltAngle += p.tiltAngleInc;
    p.y += (Math.cos(p.tiltAngle) + 3 + p.speed) / 2;
    p.tilt = Math.sin(p.tiltAngle) * 15;
    p.x += Math.sin(p.tiltAngle) * 2;
    
    // Check if particle is still on screen
    if (p.y <= canvas.height) {
      activeParticles++;
    } else if (!isConfettiStopping) {
      // Loop: Send back to top ONLY if not stopping
      p.y = -20;
      p.x = Math.random() * canvas.width;
    }
    
    // Draw only if on screen (optimization)
    if (p.y <= canvas.height) {
        ctx.beginPath();
        ctx.lineWidth = p.size / 2;
        ctx.strokeStyle = p.color;
        ctx.fillStyle = p.color;
        
        if (p.isHeart) {
          // Draw Heart
          const x = p.x; 
          const y = p.y;
          const s = p.size;
          ctx.moveTo(x, y + s / 4);
          ctx.quadraticCurveTo(x, y, x + s / 4, y);
          ctx.quadraticCurveTo(x + s / 2, y, x + s / 2, y + s / 4);
          ctx.quadraticCurveTo(x + s / 2, y, x + s * 3/4, y);
          ctx.quadraticCurveTo(x + s, y, x + s, y + s / 4);
          ctx.quadraticCurveTo(x + s, y + s / 2, x + s * 3/4, y + s * 3/4);
          ctx.lineTo(x + s / 2, y + s);
          ctx.lineTo(x + s / 4, y + s * 3/4);
          ctx.quadraticCurveTo(x, y + s / 2, x, y + s / 4);
          ctx.fill();
        } else {
          // Draw Tumbling Square/Rect
          ctx.moveTo(p.x + p.tilt + p.size / 2, p.y);
          ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.size / 2);
          ctx.stroke(); 
        }
    }
  });
  
  // Stop animation loop if all particles have fallen
  if (isConfettiStopping && activeParticles === 0) {
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  } else {
    animationId = requestAnimationFrame(animateConfetti);
  }
}

// ==========================================
// Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Enter Button
  document.getElementById('enter-btn').addEventListener('click', () => {
    document.getElementById('enter-overlay').style.opacity = '0';
    setTimeout(() => {
      document.getElementById('enter-overlay').style.display = 'none';
    }, 500);
    playMusic();
  });
  
  // Music Control
  document.getElementById('music-control').addEventListener('click', toggleMute);
  
  // Initialize music setup (but don't play yet)
  initMusic();
});

// Expose navigateTo globally for HTML onclicks
window.navigateTo = navigateTo;
