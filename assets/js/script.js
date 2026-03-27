// ─── CONFIG ───────────────────────────────────────────────
    const FORMSPREE_ID = "mzdjpdpb";
    // ──────────────────────────────────────────────────────────

    // ─── THEME TOGGLE ─────────────────────────────────────────
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon   = themeToggle.querySelector('.theme-icon');

 function applyTheme(mode) {
  if (mode === 'light') {
    document.documentElement.classList.add('light');
    themeIcon.innerHTML = '<img src="dark-mode.png" width="20" height="20" alt="Switch to dark mode" />';
  } else {
    document.documentElement.classList.remove('light');
    themeIcon.innerHTML = '<img src="light-mode.png" width="40" height="40" alt="Switch to light mode" />';
  }
  localStorage.setItem('gg-theme', mode);
}

    // Load saved preference, default dark
    applyTheme(localStorage.getItem('gg-theme') || 'dark');

    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.classList.contains('light');
      applyTheme(isLight ? 'dark' : 'light');
    });

    // ─── MOBILE MENU ──────────────────────────────────────────
    const hamburger   = document.getElementById('hamburger');
    const mobileMenu  = document.getElementById('mobile-menu');

    function openMobileMenu() {
      mobileMenu.classList.add('open');
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
      mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    });

    // Close on backdrop tap (clicking outside the links)
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMobileMenu();
    });

    // ─── SMOOTH SCROLL ────────────────────────────────────────
    function smoothScroll(e, id) {
      e.preventDefault();
      const el = document.getElementById(id);
      if (!el) return;
      const navH = document.getElementById('navbar').offsetHeight || 72;
      const top = el.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }

    // ─── STICKY NAV GLASS EFFECT ──────────────────────────────
    window.addEventListener('scroll', () => {
      document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
    });

    // ─── INTERSECTION OBSERVER — fade-up + counter trigger ────
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          entry.target.querySelectorAll('.stat-value[data-target]').forEach(animateCounter);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // ─── ANIMATE COUNTERS ─────────────────────────────────────
    function animateCounter(el) {
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current + suffix;
      }, 20);
    }

    // ─── TESTIMONIALS ─────────────────────────────────────────
    const testimonials = [
      {
        quote:  "GreengridEnergy slashed our electricity bill by 68% in the first quarter. The whole process felt personal — not like dealing with a corporation.",
        name:   "Priya S.",
        role:   "Founder, Farmstead Organics"
      },
      {
        quote:  "Honest, detailed, and no upselling. Exactly what a small business needs when going solar for the first time.",
        name:   "Rajan M.",
        role:   "Owner, Meridian Café"
      }
    ];
    let activeTest = 0;

    function setTestimonial(i) {
      activeTest = i;
      document.getElementById('test-quote').textContent  = `"${testimonials[i].quote}"`;
      document.getElementById('test-name').textContent   = testimonials[i].name;
      document.getElementById('test-role').textContent   = testimonials[i].role;
      document.getElementById('test-avatar').textContent = testimonials[i].name[0];
      document.querySelectorAll('.test-dot').forEach((d, idx) => d.classList.toggle('active', idx === i));
    }
    setInterval(() => setTestimonial((activeTest + 1) % testimonials.length), 5000);

    // ─── CONTACT FORM ─────────────────────────────────────────
    function clearErrors() {
      ['name', 'email', 'message'].forEach(f => {
        const input = document.getElementById(`f-${f}`);
        const err   = document.getElementById(`err-${f}`);
        if (input) input.classList.remove('error');
        if (err)   err.textContent = '';
      });
      document.getElementById('form-error').style.display = 'none';
    }

    function showError(field, msg) {
      const input = document.getElementById(`f-${field}`);
      const err   = document.getElementById(`err-${field}`);
      if (input) input.classList.add('error');
      if (err)   err.textContent = msg;
    }

    async function submitForm() {
      clearErrors();
      const name    = document.getElementById('f-name').value.trim();
      const email   = document.getElementById('f-email').value.trim();
      const subject = document.getElementById('f-subject').value.trim();
      const message = document.getElementById('f-message').value.trim();

      let hasError = false;
      if (!name)    { showError('name',    'Name is required');        hasError = true; }
      if (!email)   { showError('email',   'Email is required');       hasError = true; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                      showError('email',   'Enter a valid email');      hasError = true; }
      if (!message) { showError('message', 'Message is required');     hasError = true; }
      if (hasError) return;

      const btn = document.getElementById('submit-btn');
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span>Sending…';

      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body:    JSON.stringify({ name, email, subject, message })
        });
        if (res.ok) {
          document.getElementById('contact-form').style.display = 'none';
          document.getElementById('success-card').style.display  = 'block';
        } else {
          document.getElementById('form-error').style.display = 'block';
          btn.disabled  = false;
          btn.innerHTML = 'Send Message ✉️';
        }
      } catch {
        document.getElementById('form-error').style.display = 'block';
        btn.disabled  = false;
        btn.innerHTML = 'Send Message ✉️';
      }
    }

    function resetForm() {
      ['f-name', 'f-email', 'f-subject', 'f-message'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      clearErrors();
      document.getElementById('success-card').style.display  = 'none';
      document.getElementById('contact-form').style.display  = 'flex';
      document.getElementById('submit-btn').innerHTML = 'Send Message ✉️';
    }