/* ==========================================================
   WORKMATCH — Interactions (final)
   ========================================================== */

/* ---------- Nav scroll state ---------- */
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Scroll progress bar ---------- */
const progressBar = document.getElementById('progressBar');
if (progressBar) {
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progressBar.style.width = pct + '%';
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
}

/* ---------- Chapter dot nav — active state ---------- */
const chapLinks = document.querySelectorAll('.chapnav a');
const sections = document.querySelectorAll('section[data-section]');

if (chapLinks.length && sections.length) {
  const setActive = (id) => {
    chapLinks.forEach((a) => a.classList.toggle('active', a.dataset.section === id));
  };

  const sectionIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.dataset.section);
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  sections.forEach((s) => sectionIO.observe(s));
}

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
      setTimeout(() => { input.style.borderColor = ''; }, 1600);
      return;
    }

    const isLight = form.classList.contains('wl--light');
    form.innerHTML =
      '<div class="form-success" style="' +
        (isLight ? 'background:rgba(76,139,94,.16);border-color:rgba(76,139,94,.4);color:#9DDBAA;' : '') +
      '">' +
        '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' +
        "You're on the list — we'll be in touch soon." +
      '</div>';
  });
});

/* ---------- Smooth anchor scroll with nav offset ---------- */
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
