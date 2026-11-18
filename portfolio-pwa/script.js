/* OnePavan Portfolio — vanilla JS, no dependencies */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* ---------- Loader ---------- */
  window.addEventListener('load', () => {
    setTimeout(() => $('#loader')?.classList.add('hidden'), 800);
  });

  /* ---------- Year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Particle canvas ---------- */
  const canvas = $('#bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const colors = ['124,92,255', '76,201,240'];
    const mouse = { x: -9999, y: -9999 };
    let w, h, dpr, particles = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor(Math.min(80, (w * h) / 18000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.8,
        c: colors[Math.random() < 0.5 ? 0 : 1]
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // soft radial purple glow
      const g = ctx.createRadialGradient(w * 0.7, h * 0.3, 0, w * 0.7, h * 0.3, Math.max(w, h) * 0.6);
      g.addColorStop(0, 'rgba(124,92,255,0.10)');
      g.addColorStop(1, 'rgba(124,92,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        if (!reduceMotion) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < 140 && d > 0) {
            const f = (140 - d) / 140;
            p.x += (dx / d) * f * 3;
            p.y += (dy / d) * f * 3;
          }
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = w; else if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h; else if (p.y > h) p.y = 0;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},0.8)`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.strokeStyle = `rgba(${a.c},${(1 - d / 130) * 0.35})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      if (!reduceMotion) requestAnimationFrame(draw);
    };

    window.addEventListener('resize', () => { resize(); if (reduceMotion) draw(); });
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseout', e => { if (!e.relatedTarget) mouse.x = mouse.y = -9999; });
    resize();
    draw();
  }

  /* ---------- Custom cursor ---------- */
  if (!isTouch) {
    const ring = $('.cursor-ring'), dot = $('.cursor-dot');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });
    const loop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    const hoverSel = 'a, button, input, textarea, .tilt';
    document.addEventListener('mouseover', e => { if (e.target.closest(hoverSel)) ring.classList.add('hover'); });
    document.addEventListener('mouseout', e => { if (e.target.closest(hoverSel)) ring.classList.remove('hover'); });
  }

  /* ---------- Nav ---------- */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = $('#hamburger'), links = $('#nav-links');
  const setMenu = open => {
    burger.classList.toggle('open', open);
    links.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  };
  burger.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  $$('.nav-link').forEach(l => l.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Active link highlight ---------- */
  const navLinks = $$('.nav-link');
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  $$('main section[id]').forEach(s => sectionObs.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.filter(e => e.isIntersecting).forEach((entry, i) => {
      const el = entry.target;
      el.style.transitionDelay = `${i * 80}ms`;
      el.classList.add('visible');
      setTimeout(() => { el.style.transitionDelay = ''; }, 900 + i * 80);
      obs.unobserve(el);
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => revealObs.observe(el));

  /* ---------- Typewriter ---------- */
  const tw = $('#typewriter');
  if (tw) {
    const roles = ['MuleSoft Integration Architect', 'Senior Java Engineer', 'API-Led Specialist',
      'Cloud Integration Lead', 'Spring Boot Developer', 'Solution Architect'];
    if (reduceMotion) {
      tw.textContent = roles[0];
    } else {
      let r = 0, c = 0, deleting = false;
      const tick = () => {
        const word = roles[r];
        c += deleting ? -1 : 1;
        tw.textContent = word.slice(0, c);
        let delay = deleting ? 40 : 85;
        if (!deleting && c === word.length) { deleting = true; delay = 1800; }
        else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; delay = 400; }
        setTimeout(tick, delay);
      };
      setTimeout(tick, 1000);
    }
  }

  /* ---------- Stat counters ---------- */
  const counterObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target, target = +el.dataset.target;
      obs.unobserve(el);
      if (reduceMotion) { el.textContent = target; return; }
      const dur = 1800, start = performance.now();
      const step = now => {
        const t = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  $$('.stat-num').forEach(el => counterObs.observe(el));

  /* ---------- 3D tilt ---------- */
  if (!isTouch && !reduceMotion) {
    $$('.tilt').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.transition = 'transform .1s ease-out, border-color .3s, box-shadow .3s';
        el.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * 24}deg) rotateY(${(px - 0.5) * 24}deg) translateZ(10px)`;
        el.style.setProperty('--mx', `${px * 100}%`);
        el.style.setProperty('--my', `${py * 100}%`);
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform .5s ease, border-color .3s, box-shadow .3s';
        el.style.transform = '';
      });
    });
  }

  /* ---------- Install prompt ---------- */
  let deferredPrompt = null;
  const installBtn = $('#install-btn');
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.hidden = false;
  });
  installBtn?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.hidden = true;
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    if (installBtn) installBtn.hidden = true;
  });

  /* ---------- Service worker ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => { /* fail silently */ });
    });
  }
})();

/* ---------- Contact form (global: referenced by onsubmit) ----------
 * This is a front-end stub. To actually deliver messages, wire it up, e.g.:
 *
 *   // Formspree: create a form at https://formspree.io and use its endpoint
 *   await fetch('https://formspree.io/f/YOUR_FORM_ID', {
 *     method: 'POST',
 *     headers: { Accept: 'application/json' },
 *     body: new FormData(form)
 *   });
 *
 *   // EmailJS: include the EmailJS SDK, then
 *   // emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form, 'YOUR_PUBLIC_KEY');
 */
function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const note = document.getElementById('form-note');
  note.textContent = "Thanks! Message sent — I'll respond within 24 hours.";
  form.reset();
  setTimeout(() => { note.textContent = ''; }, 5000);
}
