/* ==========================================================
   WORKMATCH — Interactions
   ========================================================== */

/* ---------- Nav scroll state ---------- */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- Scroll reveal ---------- */
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.reveal').forEach((el) => revealIO.observe(el));

/* ---------- Cursor glow (desktop only) ---------- */
const glow = document.querySelector('.cursor-glow');
const isFine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
if (glow && isFine) {
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let gx = mx, gy = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  const loop = () => {
    gx += (mx - gx) * 0.12;
    gy += (my - gy) * 0.12;
    glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };
  loop();
}

/* ---------- Bento spotlight hover ---------- */
document.querySelectorAll('.bento__cell').forEach((cell) => {
  cell.addEventListener('mousemove', (e) => {
    const rect = cell.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cell.style.setProperty('--mx', `${x}%`);
    cell.style.setProperty('--my', `${y}%`);
  });
});

/* ---------- Animated number counters ---------- */
const counters = document.querySelectorAll('[data-count]');
const countIO = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countIO.unobserve(el);
  });
}, { threshold: 0.6 });

counters.forEach((c) => countIO.observe(c));

/* ---------- Waitlist forms ---------- */
document.querySelectorAll('.js-waitlist').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const value = (input?.value || '').trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!valid) {
      input.style.borderColor = '#FF6B35';
      input.focus();
      setTimeout(() => { input.style.borderColor = ''; }, 1800);
      return;
    }

    form.innerHTML =
      '<div class="form-success">' +
        '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' +
        "You're on the list — we'll be in touch soon." +
      '</div>';
  });
});

/* ---------- Smooth anchor scroll with fixed nav offset ---------- */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---------- Pause marquee when off-screen (perf) ---------- */
const marquee = document.querySelector('.marquee__track');
if (marquee) {
  const mIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      marquee.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
    });
  }, { threshold: 0 });
  mIO.observe(marquee.parentElement);
}
