/* ===========================
   CURSOR
=========================== */
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

(function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
})();

document.querySelectorAll('a, button, .skill-card, .project-card, .cert-card, .contact-link').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorFollower.style.transform = 'translate(-50%,-50%) scale(1.5)';
    cursorFollower.style.borderColor = 'rgba(0,229,160,0.7)';
  });
  el.addEventListener('mouseleave', () => {
    cursorFollower.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorFollower.style.borderColor = 'rgba(0,229,160,0.45)';
  });
});

/* ===========================
   NEURAL NET CANVAS
=========================== */
const canvas = document.getElementById('neuralCanvas');
const ctx = canvas.getContext('2d');
let nodes = [], W, H;
const NODE_COUNT = 55;

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

for (let i = 0; i < NODE_COUNT; i++) {
  nodes.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.8 + 0.8
  });
}

function drawNeural() {
  ctx.clearRect(0, 0, W, H);
  nodes.forEach(n => {
    n.x += n.vx; n.y += n.vy;
    if (n.x < 0 || n.x > W) n.vx *= -1;
    if (n.y < 0 || n.y > H) n.vy *= -1;
  });
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 140) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,229,160,${0.07 * (1 - dist/140)})`;
        ctx.lineWidth = 0.8;
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,229,160,0.35)';
    ctx.fill();
  });
  requestAnimationFrame(drawNeural);
}
drawNeural();

/* ===========================
   NAV SCROLL
=========================== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ===========================
   HAMBURGER / MOBILE MENU
=========================== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const isOpen = mobileMenu.classList.contains('open');
  spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
  spans[1].style.opacity = isOpen ? '0' : '1';
  spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
});
document.querySelectorAll('.mobile-link').forEach(l => {
  l.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity='1'; });
  });
});

/* ===========================
   REVEAL ON SCROLL
=========================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));

/* ===========================
   COUNTER ANIMATION
=========================== */
function animateCounter(el) {
  const target = +el.dataset.target;
  let current = 0;
  const step = target / 55;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { el.textContent = target; clearInterval(timer); return; }
    el.textContent = Math.floor(current);
  }, 28);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

/* ===========================
   SKILL BAR ANIMATION
=========================== */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(bar => bar.classList.add('animated'));
      skillObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(el => skillObserver.observe(el));

/* ===========================
   ACTIVE NAV LINK ON SCROLL
=========================== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ===========================
   SMOOTH ANCHOR SCROLL
=========================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});