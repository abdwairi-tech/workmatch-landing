/* ==========================================================
   WORKMATCH — Interactions v2
   ========================================================== */

/* ---------- Nav scroll state ---------- */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
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

/* ---------- Demo: scroll-linked step activation ---------- */
const demoSteps = document.querySelectorAll('.demo__step');
const demoStates = document.querySelectorAll('.demo__state');

if (demoSteps.length && demoStates.length) {
  const activateDemo = (n) => {
    demoSteps.forEach((s) => s.classList.toggle('is-active', s.dataset.demo === String(n)));
    demoStates.forEach((s) => s.classList.toggle('is-active', s.dataset.state === String(n)));
  };

  const demoIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) activateDemo(entry.target.dataset.demo);
    });
  }, { threshold: 0.55, rootMargin: '-25% 0px -25% 0px' });

  demoSteps.forEach((s) => demoIO.observe(s));

  // Default state
  activateDemo(1);
}

/* ---------- Waitlist forms ---------- */
document.querySelectorAll('.js-waitlist').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const value = (input?.value || '').trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!valid) {
      input.style.borderColor = '#C8451A';
      input.focus();
      setTimeout(() => { input.style.borderColor = ''; }, 1600);
      return;
    }

    const isLight = form.classList.contains('wl--light');
    form.innerHTML =
      '<div class="form-success" style="' +
        (isLight ? 'background:rgba(76,139,94,.14);border-color:rgba(76,139,94,.35);color:#9DDBAA;' : '') +
      '">' +
        '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' +
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
    const top = target.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---------- Marquee pause when off-screen ---------- */
const ticker = document.querySelector('.ticker__row');
if (ticker) {
  const tIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      ticker.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
    });
  }, { threshold: 0 });
  tIO.observe(ticker.parentElement);
}
