/**
 * THE ULTIMATE VALENTINE ENGINE
 * Physics-based evasion, Thanos-snap disintegration, and Cinematic celebration.
 */

const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const whisper = document.getElementById('whisperText');
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
const music = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

let particles = [];
let confetti = [];
let animationFrame;
let mouseX = 0, mouseY = 0;
let buttonX = 0, buttonY = 0;
let velX = 0, velY = 0;

// Resize handler
window.addEventListener('resize', initCanvas);
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
initCanvas();

// Track Mouse/Touch
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    applyYesMagnetism(e.clientX, e.clientY);
});

window.addEventListener('touchmove', (e) => {
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
});

/**
 * 1. NO BUTTON PHYSICS (The Evasion)
 */
let noRect = noBtn.getBoundingClientRect();
buttonX = noRect.left + noRect.width / 2;
buttonY = noRect.top + noRect.height / 2;

function updateNoButton() {
    if (!noBtn.parentElement) return;

    const dx = mouseX - buttonX;
    const dy = mouseY - buttonY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const triggerDist = 150;

    if (distance < triggerDist) {
        // Calculate angle away from cursor
        const angle = Math.atan2(dy, dx);
        const force = (triggerDist - distance) / triggerDist;
        
        // Push velocity with a bit of "chaos"
        const speed = 15 * force;
        velX -= Math.cos(angle) * speed + (Math.random() - 0.5) * 5;
        velY -= Math.sin(angle) * speed + (Math.random() - 0.5) * 5;

        // Add a wobble/rotation effect
        const rotate = (Math.random() - 0.5) * 40;
        const scale = 1 - (force * 0.3);
        noBtn.style.transform = `translate(${velX}px, ${velY}px) rotate(${rotate}deg) scale(${scale})`;
    }

    // Spring friction (slows it down)
    velX *= 0.92;
    velY *= 0.92;

    // Boundary check
    const bounds = 50;
    if (buttonX + velX < bounds || buttonX + velX > window.innerWidth - bounds) velX *= -1;
    if (buttonY + velY < bounds || buttonY + velY > window.innerHeight - bounds) velY *= -1;

    buttonX += velX;
    buttonY += velY;
    
    noBtn.style.left = `${buttonX - noRect.width / 2}px`;
    noBtn.style.top = `${buttonY - noRect.height / 2}px`;
    noBtn.style.position = 'fixed';

    requestAnimationFrame(updateNoButton);
}
requestAnimationFrame(updateNoButton);

/**
 * 2. YES BUTTON MAGNETISM
 */
function applyYesMagnetism(mx, my) {
    const rect = yesBtn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.sqrt((mx - cx)**2 + (my - cy)**2);

    if (dist < 200) {
        const pullX = (cx - mx) * 0.1;
        const pullY = (cy - my) * 0.1;
        yesBtn.style.transform = `translate(${-pullX}px, ${-pullY}px) scale(1.1)`;
    } else {
        yesBtn.style.transform = `translate(0,0) scale(1)`;
    }
}

/**
 * 3. THE THANOS SNAP (Disintegration)
 */
noBtn.addEventListener('click', () => {
    noBtn.style.pointerEvents = 'none';
    setTimeout(disintegrate, 200);
});

function disintegrate() {
    const rect = noBtn.getBoundingClientRect();
    const count = 60;
    
    for (let i = 0; i < count; i++) {
        particles.push({
            x: rect.left + Math.random() * rect.width,
            y: rect.top + Math.random() * rect.height,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 1) * 4,
            size: Math.random() * 4 + 2,
            life: 1,
            color: '#ff85a1'
        });
    }
    
    noBtn.style.transition = 'opacity 0.2s ease, filter 0.5s ease';
    noBtn.style.opacity = '0';
    noBtn.style.filter = 'blur(10px)';
    
    setTimeout(() => {
        noBtn.remove();
        whisper.style.opacity = '1';
    }, 200);
}

/**
 * 4. CELEBRATION LOGIC
 */
yesBtn.addEventListener('click', () => {
    document.getElementById('questionSection').classList.add('hidden');
    document.getElementById('celebrationSection').classList.remove('hidden');
    document.querySelector('.gradient-bg').classList.add('celebrate');
    
    triggerConfetti();
    typeMessage();
    if(navigator.vibrate) navigator.vibrate([100, 50, 100]);
});

function triggerConfetti() {
    const colors = ['#ff4d6d', '#ff85a1', '#fff', '#ffb3c1'];
    for (let i = 0; i < 150; i++) {
        confetti.push({
            x: window.innerWidth / 2,
            y: window.innerHeight + 10,
            vx: (Math.random() - 0.5) * 15,
            vy: -Math.random() * 20 - 10,
            size: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            type: Math.random() > 0.5 ? 'heart' : 'circle'
        });
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update Snap Particles
    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.01;
        ctx.fillStyle = `rgba(255, 133, 161, ${p.life})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        if (p.life <= 0) particles.splice(i, 1);
    });

    // Update Confetti
    confetti.forEach((c, i) => {
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.2; // Gravity
        c.rotation += 5;
        
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rotation * Math.PI) / 180);
        ctx.fillStyle = c.color;
        
        if (c.type === 'heart') {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-c.size, -c.size, -c.size*1.5, c.size/2, 0, c.size);
            ctx.bezierCurveTo(c.size*1.5, c.size/2, c.size, -c.size, 0, 0);
            ctx.fill();
        } else {
            ctx.fillRect(-c.size/2, -c.size/2, c.size, c.size);
        }
        ctx.restore();
        
        if (c.y > canvas.height + 50) confetti.splice(i, 1);
    });

    requestAnimationFrame(draw);
}
draw();

function typeMessage() {
    const text = "I love you man...Thank you for being you. ❤️";
    const container = document.getElementById('romanticMessage');
    let i = 0;
    
    function next() {
        if (i < text.length) {
            container.innerHTML += text.charAt(i);
            i++;
            setTimeout(next, 50);
        }
    }
    setTimeout(next, 1000);
}

// Music Logic
musicToggle.addEventListener('click', () => {
    if (music.paused) {
        music.play();
        musicToggle.innerHTML = "<span>I</span>"; // Pause icon
    } else {
        music.pause();
        musicToggle.innerHTML = "<span>♪</span>";
    }
});