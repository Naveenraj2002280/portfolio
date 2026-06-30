/* ═══════════════════════════════════════════════
   Portfolio – main.js
═══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

    /* ── Particle Canvas ─────────────────────────── */
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(true); }
        reset(init) {
            this.x = Math.random() * W;
            this.y = init ? Math.random() * H : H + 10;
            this.r = Math.random() * 1.3 + 0.4;
            this.vy = -(Math.random() * 0.38 + 0.14);
            this.vx = (Math.random() - 0.5) * 0.18;
            this.life = 0;
            this.max = Math.random() * 200 + 110;
            const pal = ['34,211,160', '56,189,248', '167,139,250'];
            this.col = pal[Math.floor(Math.random() * pal.length)];
        }
        draw() {
            if (++this.life > this.max) { this.reset(false); return; }
            const a = Math.sin((this.life / this.max) * Math.PI) * 0.5;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.col},${a})`;
            ctx.fill();
            this.x += this.vx; this.y += this.vy;
        }
    }

    for (let i = 0; i < 85; i++) particles.push(new Particle());
    (function loop() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => p.draw());
        requestAnimationFrame(loop);
    })();

    /* ── Cursor Glow ─────────────────────────────── */
    const glow = document.getElementById('cursorGlow');
    document.addEventListener('mousemove', e => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });

    /* ── Scroll Progress + Navbar ────────────────── */
    const bar = document.getElementById('scrollProgress');
    const navbar = document.getElementById('navbar');

    function onScroll() {
        const max = document.documentElement.scrollHeight - innerHeight;
        const ratio = max > 0 ? (scrollY / max) * 100 : 0;
        bar.style.width = ratio + '%';
        navbar.classList.toggle('scrolled', scrollY > 40);
        updateActiveNav();
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ── Active Nav ──────────────────────────────── */
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        let current = '';
        sections.forEach(s => { if (scrollY >= s.offsetTop - 160) current = s.id; });
        navLinks.forEach(a => a.classList.toggle('active', a.dataset.section === current));
    }

    /* ── Hamburger ───────────────────────────────── */
    const ham = document.getElementById('hamburger');
    const navList = document.getElementById('navLinks');
    ham.addEventListener('click', () => navList.classList.toggle('open'));
    navLinks.forEach(a => a.addEventListener('click', () => navList.classList.remove('open')));

    /* ── Reveal on Scroll ────────────────────────── */
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
        });
    }, { threshold: 0.11 });
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    /* ── Counter Animation ───────────────────────── */
    const countObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            const target = parseInt(el.dataset.target, 10);
            let cur = 0;
            const step = target / 40;
            const tick = setInterval(() => {
                cur += step;
                if (cur >= target) { el.textContent = target; clearInterval(tick); }
                else el.textContent = Math.floor(cur);
            }, 32);
            countObs.unobserve(el);
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-num[data-target]').forEach(c => countObs.observe(c));

    /* ── Typed Text ──────────────────────────────── */
    const phrases = [
        'enterprise AI pipelines.',
        'cloud-native backends.',
        'RAG & LLM systems.',
        'big data solutions.',
        'scalable microservices.',
        'intelligent automation.',
    ];
    let pi = 0, ci = 0, deleting = false;
    const typedEl = document.getElementById('typedText');

    function typeLoop() {
        if (!typedEl) return;
        const phrase = phrases[pi];
        if (!deleting) {
            typedEl.textContent = phrase.slice(0, ++ci);
            if (ci === phrase.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
            setTimeout(typeLoop, 56);
        } else {
            typedEl.textContent = phrase.slice(0, --ci);
            if (ci === 0) {
                deleting = false; pi = (pi + 1) % phrases.length;
                setTimeout(typeLoop, 300); return;
            }
            setTimeout(typeLoop, 28);
        }
    }
    setTimeout(typeLoop, 1200);

    /* ── Project card 3-D tilt ───────────────────── */
    document.querySelectorAll('.pcard').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const rx = ((e.clientY - r.top) / r.height - 0.5) * -9;
            const ry = ((e.clientX - r.left) / r.width - 0.5) * 9;
            card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });

    onScroll();
});
