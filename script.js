/* ==========================================================
   WORKMATCH — Interactions v3
   ========================================================== */

const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- Reveal on scroll ---------- */
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
document.querySelectorAll('.reveal').forEach((el) => revealIO.observe(el));

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

/* ---------- Smooth anchor scroll ---------- */
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

/* ---------- Pause marquees when off-screen (perf) ---------- */
const marquees = [
  document.querySelector('.ticker__row'),
  document.querySelector('.band__track')
].filter(Boolean);

marquees.forEach((el) => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      el.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
    });
  }, { threshold: 0 });
  io.observe(el.parentElement);
});

/* ---------- Lazy-load fallback for older browsers ---------- */
if ('loading' in HTMLImageElement.prototype) {
  // Native lazy loading supported — nothing to do.
} else {
  const lazyIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      if (img.dataset.src) img.src = img.dataset.src;
      lazyIO.unobserve(img);
    });
  }, { rootMargin: '200px' });
  document.querySelectorAll('img[data-src]').forEach((img) => lazyIO.observe(img));
}
