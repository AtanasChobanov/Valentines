'use strict';

/**
 * Confetti Logic
 */
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
