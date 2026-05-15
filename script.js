/* ═══════════════════════════════════════════
   WEDDING INVITATION — script.js
   Rama Krishna & Sravani | 01 May 2026
═══════════════════════════════════════════ */
(function () {
  'use strict';
  gsap.registerPlugin(ScrollTrigger);

  /* ─────────────────────────────────────────
     PETAL CANVAS
  ───────────────────────────────────────── */
  const canvas = document.getElementById('petal-canvas');
  const ctx    = canvas.getContext('2d');
  let petals   = [];
  const PETAL_COLORS = [
    'rgba(255,192,203,0.75)', 'rgba(255,218,185,0.65)',
    'rgba(255,240,200,0.7)',  'rgba(255,160,170,0.6)',
    'rgba(255,230,210,0.65)'
  ];
  function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  class Petal {
    constructor() { this.reset(true); }
    reset(init) {
      this.x      = Math.random() * canvas.width;
      this.y      = init ? Math.random() * canvas.height : -20;
      this.w      = 8 + Math.random() * 14;
      this.h      = this.w * 0.55;
      this.angle  = Math.random() * Math.PI * 2;
      this.spin   = (Math.random() - 0.5) * 0.025;
      this.speedY = 0.6 + Math.random() * 1.8;
      this.drift  = (Math.random() - 0.5) * 0.6;
      this.color  = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
      this.opacity = 0.4 + Math.random() * 0.4;
    }
    draw() {
      ctx.save(); ctx.globalAlpha = this.opacity;
      ctx.translate(this.x, this.y); ctx.rotate(this.angle);
      ctx.fillStyle = this.color; ctx.beginPath();
      ctx.ellipse(0, 0, this.w, this.h, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.restore();
    }
    update() {
      this.y += this.speedY;
      this.x += this.drift + Math.sin(this.y / 60) * 0.4;
      this.angle += this.spin;
      if (this.y > canvas.height + 30) this.reset();
    }
  }
  function initPetals() { petals = []; for (let i = 0; i < 50; i++) petals.push(new Petal()); }
  function animatePetals() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animatePetals);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas(); initPetals(); animatePetals();

  /* ─────────────────────────────────────────
     INTRO OVERLAY ANIMATIONS (cosmetic only)
     Main site is always visible underneath
  ───────────────────────────────────────── */
  gsap.timeline({ delay: 0.3 })
    .from('.intro-deco',  { scale: 0, opacity: 0, duration: 1,   stagger: 0.15, ease: 'back.out(1.4)' })
    .from('.intro-om',    { y: -30,   opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
    .from('.intro-sub',   { y: 20,    opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4')
    .from('.intro-names', { y: 40,    opacity: 0, duration: 1,   ease: 'power3.out' }, '-=0.3')
    .from('.intro-date',  { y: 20,    opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.4')
    .from('#open-btn',    { scale: 0.7, opacity: 0, duration: 0.8, ease: 'back.out(2)' }, '-=0.3');

  /* ─────────────────────────────────────────
     OPEN INVITATION — just hides the overlay
  ───────────────────────────────────────── */
  window.openInvitation = function () {
    const intro    = document.getElementById('intro');
    const navbar   = document.getElementById('navbar');
    const musicBtn = document.getElementById('music-btn');

    gsap.to('#intro-inner', { y: -40, opacity: 0, duration: 0.7, ease: 'power3.in' });
    gsap.to(intro, {
      opacity: 0, duration: 1.1, delay: 0.4, ease: 'power2.inOut',
      onComplete: () => {
        intro.style.display = 'none';
        navbar.classList.add('visible');
        musicBtn.style.display = 'flex';
        gsap.from('#music-btn', { scale: 0, rotation: -180, opacity: 0, duration: 0.8, ease: 'back.out(2)' });
        // play music
        const audio = document.getElementById('bg-music');
        audio.volume = 0.25;
        audio.play().catch(() => {});
      }
    });
  };

  /* ─────────────────────────────────────────
     NAVBAR scroll behaviour
  ───────────────────────────────────────── */
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').style.background =
      window.scrollY > 80 ? 'rgba(255,253,248,0.97)' : 'rgba(255,253,248,0.85)';
  });
  document.querySelectorAll('#navbar ul a').forEach(link => {
    link.addEventListener('mouseenter', () => gsap.to(link, { color: '#8b0000', duration: 0.2 }));
    link.addEventListener('mouseleave', () => gsap.to(link, { color: '#4a3728', duration: 0.2 }));
  });

  /* ─────────────────────────────────────────
     HERO — scroll-triggered (always runs)
  ───────────────────────────────────────── */
  // Parallax bg — simple CSS transform, no pin spacer
  gsap.to('#hero-bg', {
    y: '30%', ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      pin: false
    }
  });

  // Hero content entrance — triggered when hero enters viewport
  gsap.timeline({
    scrollTrigger: { trigger: '#hero', start: 'top 90%', once: true }
  })
    .from('.garland-left',   { x: -80, opacity: 0, duration: 1.2, ease: 'power3.out' }, 0)
    .from('.garland-right',  { x:  80, opacity: 0, duration: 1.2, ease: 'power3.out' }, 0)
    .from('.hero-eyebrow',   { y: 30,  opacity: 0, duration: 0.8, ease: 'power2.out' }, 0.3)
    .from('.hero-names',     { y: 60,  opacity: 0, duration: 1.2, ease: 'power3.out' }, 0.5)
    .from('.hero-divider',   { scaleX: 0, duration: 0.8, ease: 'power2.inOut', transformOrigin: 'center' }, 0.9)
    .from('.hero-date-line', { y: 20,  opacity: 0, duration: 0.7, ease: 'power2.out' }, 1.1)
    .from('.hero-cta',       { y: 20,  opacity: 0, scale: 0.9, duration: 0.7, ease: 'back.out(1.5)' }, 1.3)
    .from('.scroll-hint',    { opacity: 0, y: 10, duration: 0.6 }, 1.5);

  // Garlands ambient sway (always)
  gsap.to('.garland-left',  { rotation:  3, duration: 3,   repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: 'top center' });
  gsap.to('.garland-right', { rotation: -3, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: 'top center' });

  /* ─────────────────────────────────────────
     SECTION TITLES — all of them
  ───────────────────────────────────────── */
  document.querySelectorAll('.section-title').forEach(el => {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: {
        trigger: el, start: 'top 88%', once: true,
        onEnter: () => el.classList.add('anim-done')
      }
    });
  });

  /* ─────────────────────────────────────────
     COUNTDOWN
  ───────────────────────────────────────── */
  gsap.from('.count-card', {
    y: 60, opacity: 0, scale: 0.85, duration: 0.9, stagger: 0.15, ease: 'back.out(1.6)',
    scrollTrigger: { trigger: '.countdown-grid', start: 'top 85%', once: true }
  });
  gsap.from('.count-label', {
    opacity: 0, y: 10, duration: 0.6, stagger: 0.15, delay: 0.6,
    scrollTrigger: { trigger: '.countdown-grid', start: 'top 85%', once: true }
  });
  // Cards float continuously
  gsap.to('.count-card', {
    y: -6, duration: 2, repeat: -1, yoyo: true, ease: 'sine.inOut',
    stagger: { each: 0.4 }
  });

  /* ─────────────────────────────────────────
     EVENTS
  ───────────────────────────────────────── */
  gsap.from('.events-grid .event-card', {
    y: 80, opacity: 0, scale: 0.9, duration: 1, stagger: 0.2, ease: 'power3.out',
    scrollTrigger: { trigger: '.events-grid', start: 'top 82%', once: true }
  });
  document.querySelectorAll('.event-card').forEach(card => {
    gsap.from(card.querySelector('.event-icon'), {
      scale: 0, rotation: -30, opacity: 0, duration: 0.7, ease: 'back.out(2)',
      scrollTrigger: { trigger: card, start: 'top 85%', once: true }
    });
    gsap.from(card.querySelector('h4'), {
      y: 20, opacity: 0, duration: 0.6, delay: 0.2,
      scrollTrigger: { trigger: card, start: 'top 85%', once: true }
    });
    const dateEl  = card.querySelector('.event-date');
    const venueEl = card.querySelector('.event-venue');
    if (dateEl)  gsap.from(dateEl,  { x: -20, opacity: 0, duration: 0.5, delay: 0.35, scrollTrigger: { trigger: card, start: 'top 85%', once: true } });
    if (venueEl) gsap.from(venueEl, { x: -20, opacity: 0, duration: 0.5, delay: 0.5,  scrollTrigger: { trigger: card, start: 'top 85%', once: true } });
  });
  // Event icons bounce continuously
  gsap.to('.event-icon', {
    y: -5, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: { each: 0.5 }
  });

  /* ─────────────────────────────────────────
     FAMILIES
  ───────────────────────────────────────── */
  gsap.from('.family-block:first-of-type', {
    x: -80, opacity: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.families-wrap', start: 'top 82%', once: true }
  });
  gsap.from('.family-block:last-of-type', {
    x: 80, opacity: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.families-wrap', start: 'top 82%', once: true }
  });
  gsap.from('.family-heart', {
    scale: 0, opacity: 0, duration: 0.8, delay: 0.4, ease: 'back.out(2)',
    scrollTrigger: { trigger: '.families-wrap', start: 'top 82%', once: true }
  });
  // Heart pulse continuously
  gsap.to('.family-heart', { scale: 1.2, duration: 0.6, repeat: -1, yoyo: true, ease: 'power1.inOut' });

  document.querySelectorAll('.family-side').forEach(el => {
    gsap.from(el, { y: 15, opacity: 0, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });
  document.querySelectorAll('.family-block p').forEach((el, i) => {
    gsap.from(el, { y: 10, opacity: 0, duration: 0.5, delay: i * 0.08,
      scrollTrigger: { trigger: el.closest('.family-block'), start: 'top 85%', once: true }
    });
  });

  /* ─────────────────────────────────────────
     LOVE STORY TIMELINE
  ───────────────────────────────────────── */
  document.querySelectorAll('.tl-item').forEach(item => {
    const isRight = item.classList.contains('tl-right');
    gsap.from(item.querySelector('.tl-card'), {
      x: isRight ? 80 : -80, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 85%', once: true }
    });
    gsap.from(item.querySelector('.tl-dot'), {
      scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(3)',
      scrollTrigger: { trigger: item, start: 'top 85%', once: true }
    });
    gsap.from(item.querySelector('.tl-year'), {
      y: 20, opacity: 0, duration: 0.7, delay: 0.2,
      scrollTrigger: { trigger: item, start: 'top 85%', once: true }
    });
    gsap.from(item.querySelector('h5'), {
      y: 15, opacity: 0, duration: 0.6, delay: 0.35,
      scrollTrigger: { trigger: item, start: 'top 85%', once: true }
    });
    gsap.from(item.querySelector('p'), {
      y: 10, opacity: 0, duration: 0.5, delay: 0.5,
      scrollTrigger: { trigger: item, start: 'top 85%', once: true }
    });
  });
  // Timeline dots pulse ring continuously
  gsap.to('.tl-dot', {
    boxShadow: '0 0 0 8px rgba(201,169,110,0.35)', duration: 1.2,
    repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.3
  });

  /* ─────────────────────────────────────────
     GALLERY
  ───────────────────────────────────────── */
  gsap.from('.gallery-item', {
    y: 60, opacity: 0, scale: 0.88, duration: 0.9,
    stagger: { amount: 0.8, from: 'start' }, ease: 'power3.out',
    scrollTrigger: { trigger: '.gallery-grid', start: 'top 82%', once: true }
  });

  /* ─────────────────────────────────────────
     MAP / VENUE
  ───────────────────────────────────────── */
  gsap.from('.map-wrap', {
    y: 50, opacity: 0, scale: 0.95, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.map-wrap', start: 'top 85%', once: true }
  });

  /* ─────────────────────────────────────────
     RSVP
  ───────────────────────────────────────── */
  gsap.from('.rsvp-sub', {
    y: 20, opacity: 0, duration: 0.7, ease: 'power2.out',
    scrollTrigger: { trigger: '#rsvp', start: 'top 85%', once: true }
  });
  gsap.from('.rsvp-form', {
    y: 60, opacity: 0, scale: 0.96, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.rsvp-form', start: 'top 85%', once: true }
  });
  document.querySelectorAll('.form-group').forEach((el, i) => {
    gsap.from(el, {
      y: 25, opacity: 0, duration: 0.6, delay: i * 0.08, ease: 'power2.out',
      scrollTrigger: { trigger: '.rsvp-form', start: 'top 80%', once: true }
    });
  });
  gsap.from('.rsvp-btn', {
    scale: 0.85, opacity: 0, duration: 0.8, ease: 'back.out(1.8)',
    scrollTrigger: { trigger: '.rsvp-btn', start: 'top 92%', once: true }
  });
  const rsvpBtn = document.querySelector('.rsvp-btn');
  rsvpBtn.addEventListener('mouseenter', () => gsap.to(rsvpBtn, { scale: 1.04, duration: 0.2 }));
  rsvpBtn.addEventListener('mouseleave', () => gsap.to(rsvpBtn, { scale: 1,    duration: 0.2 }));

  /* ─────────────────────────────────────────
     FOOTER
  ───────────────────────────────────────── */
  gsap.from('.footer-om', {
    scale: 0, rotation: 180, opacity: 0, duration: 1, ease: 'back.out(2)',
    scrollTrigger: { trigger: '#footer', start: 'top 90%', once: true }
  });
  gsap.from('.footer-names', {
    y: 30, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2,
    scrollTrigger: { trigger: '#footer', start: 'top 90%', once: true }
  });
  gsap.from('.footer-date', {
    y: 20, opacity: 0, duration: 0.7, delay: 0.4,
    scrollTrigger: { trigger: '#footer', start: 'top 90%', once: true }
  });
  gsap.from('.footer-hashtag', {
    y: 15, opacity: 0, duration: 0.6, delay: 0.55,
    scrollTrigger: { trigger: '#footer', start: 'top 90%', once: true }
  });
  gsap.from('.footer-note', {
    y: 10, opacity: 0, duration: 0.5, delay: 0.7,
    scrollTrigger: { trigger: '#footer', start: 'top 90%', once: true }
  });
  // OM spins forever
  gsap.to('.footer-om', { rotation: 360, duration: 12, repeat: -1, ease: 'none' });

  /* ─────────────────────────────────────────
     COUNTDOWN TIMER
  ───────────────────────────────────────── */
  const WEDDING_DATE = new Date('May 1, 2026 08:00:00 GMT+0530').getTime();
  function updateCountdown() {
    const diff = WEDDING_DATE - Date.now();
    if (diff <= 0) {
      ['days','hours','minutes','seconds'].forEach(id => { document.getElementById(id).textContent = '00'; });
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);
    const secEl = document.getElementById('seconds');
    const newS  = String(s).padStart(2, '0');
    if (secEl.textContent !== newS) {
      gsap.fromTo(secEl, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' });
    }
    document.getElementById('days').textContent    = String(d).padStart(2, '0');
    document.getElementById('hours').textContent   = String(h).padStart(2, '0');
    document.getElementById('minutes').textContent = String(m).padStart(2, '0');
    secEl.textContent = newS;
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ─────────────────────────────────────────
     GALLERY LIGHTBOX
  ───────────────────────────────────────── */
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lb-img');
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      lbImg.src = item.dataset.src || item.querySelector('img').src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      gsap.from(lbImg, { scale: 0.8, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' });
    });
  });
  window.closeLightbox = function () {
    gsap.to(lbImg, {
      scale: 0.8, opacity: 0, duration: 0.3, ease: 'power2.in',
      onComplete: () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; lbImg.src = ''; }
    });
  };
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  /* ─────────────────────────────────────────
     MUSIC TOGGLE
  ───────────────────────────────────────── */
  const musicBtn = document.getElementById('music-btn');
  const audio    = document.getElementById('bg-music');
  let   playing  = false;
  const spinAnim = gsap.to('#music-btn', { rotation: '+=360', duration: 4, repeat: -1, ease: 'none', paused: true });
  musicBtn.addEventListener('click', () => {
    if (playing) { audio.pause(); musicBtn.textContent = '🎵'; spinAnim.pause(); }
    else         { audio.play().catch(() => {}); musicBtn.textContent = '⏸'; spinAnim.play(); }
    playing = !playing;
    gsap.fromTo(musicBtn, { scale: 0.8 }, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
  });
  audio.addEventListener('play',  () => { playing = true;  musicBtn.textContent = '⏸'; spinAnim.play(); });
  audio.addEventListener('pause', () => { playing = false; musicBtn.textContent = '🎵'; spinAnim.pause(); });

  /* ─────────────────────────────────────────
     SMOOTH SCROLL
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // Refresh ScrollTrigger after everything loads to prevent extra space
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
    // Remove any pin spacers GSAP may have injected
    document.querySelectorAll('.gsap-marker-start, .gsap-marker-end, [data-gsap-spacer]').forEach(el => el.remove());
  });

  /* ═══════════════════════════════════════════════════════════
     RSVP — 3-destination submit
     ① Formspree  → email + dashboard  (endpoint already set)
     ② Google Sheets → Apps Script webhook
     ③ EmailJS   → instant email to couple
  ═══════════════════════════════════════════════════════════ */

  /* ── CONFIG — fill these in after setup ── */
  const CFG = {
    // ② Google Apps Script Web App URL (after deployment)
    googleScriptURL: 'GOOGLE_SCRIPT_URL',

    // ③ EmailJS credentials
    emailjsServiceID:  'EMAILJS_SERVICE_ID',
    emailjsTemplateID: 'EMAILJS_TEMPLATE_ID',
    emailjsPublicKey:  'EMAILJS_PUBLIC_KEY',
  };

  /* ── Init EmailJS ── */
  if (typeof emailjs !== 'undefined' && CFG.emailjsPublicKey !== 'EMAILJS_PUBLIC_KEY') {
    emailjs.init({ publicKey: CFG.emailjsPublicKey });
  }

  const rsvpForm    = document.getElementById('rsvp-form');
  const rsvpSuccess = document.getElementById('rsvp-success');
  const btnText     = document.getElementById('btn-text');
  const btnLoader   = document.getElementById('btn-loader');
  const submitBtn   = document.getElementById('rsvp-submit-btn');

  rsvpForm.addEventListener('submit', async e => {
    e.preventDefault();

    const name     = document.getElementById('name').value.trim();
    const phone    = document.getElementById('phone').value.trim();
    const email    = document.getElementById('email').value.trim();
    const guests   = document.getElementById('guests').value;
    const attend   = document.getElementById('attend').value;
    const relation = document.getElementById('relation').value.trim();
    const message  = document.getElementById('message').value.trim();

    if (!name) {
      gsap.fromTo('#name', { x: -8 }, { x: 0, duration: 0.4, ease: 'elastic.out(1,0.3)', repeat: 3, yoyo: true });
      document.getElementById('name').focus();
      return;
    }

    // Show loading
    btnText.style.display   = 'none';
    btnLoader.style.display = 'inline';
    submitBtn.disabled      = true;

    const payload = { name, phone, email, guests, attendance: attend, relation, message,
                      submitted_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) };

    /* ── ① FORMSPREE ── */
    const formspreePromise = fetch(rsvpForm.getAttribute('action'), {
      method:  'POST',
      body:    new FormData(rsvpForm),
      headers: { 'Accept': 'application/json' }
    }).catch(() => null);

    /* ── ② GOOGLE SHEETS ── */
    const sheetsPromise = (CFG.googleScriptURL !== 'GOOGLE_SCRIPT_URL')
      ? fetch(CFG.googleScriptURL, {
          method: 'POST',
          mode:   'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload)
        }).catch(() => null)
      : Promise.resolve(null);

    /* ── ③ EMAILJS ── */
    const emailjsPromise = (typeof emailjs !== 'undefined' && CFG.emailjsPublicKey !== 'EMAILJS_PUBLIC_KEY')
      ? emailjs.send(CFG.emailjsServiceID, CFG.emailjsTemplateID, {
          guest_name:   name,
          phone:        phone || '—',
          email:        email || '—',
          guests:       guests,
          attendance:   attend,
          relation:     relation || '—',
          message:      message  || '—',
          submitted_at: payload.submitted_at
        }).catch(() => null)
      : Promise.resolve(null);

    /* ── Wait for Formspree (primary), others fire-and-forget ── */
    try {
      const [formspreeRes] = await Promise.all([formspreePromise, sheetsPromise, emailjsPromise]);

      if (formspreeRes && !formspreeRes.ok) {
        const json = await formspreeRes.json().catch(() => ({}));
        const msg  = json.errors ? json.errors.map(err => err.message).join(', ') : 'Submission failed. Please try again.';
        alert(msg);
        resetBtn();
        return;
      }

      showSuccess(name, attend);
    } catch {
      // If network fails entirely, still show success (data may have gone through)
      showSuccess(name, attend);
    }
  });

  function showSuccess(name, attend) {
    const isAttending = attend.toLowerCase().includes('accept');
    document.getElementById('success-msg').textContent = isAttending
      ? `We're so happy you'll be joining us, ${name}! See you on 01 May 2026. 🎉`
      : `Thank you for letting us know, ${name}. We'll miss you and keep you in our hearts. 💕`;

    gsap.to(rsvpForm, {
      opacity: 0, y: -20, duration: 0.5, ease: 'power2.in',
      onComplete: () => {
        rsvpForm.style.display    = 'none';
        rsvpSuccess.style.display = 'block';
        gsap.from(rsvpSuccess, { opacity: 0, y: 30, scale: 0.95, duration: 0.7, ease: 'back.out(1.5)' });
        gsap.from('#rsvp-success .success-icon', { scale: 0, rotation: -30, duration: 0.6, ease: 'back.out(2)', delay: 0.3 });
      }
    });
    rsvpForm.reset();
  }

  function resetBtn() {
    btnText.style.display   = 'inline';
    btnLoader.style.display = 'none';
    submitBtn.disabled      = false;
  }

  window.resetRsvp = function () {
    rsvpSuccess.style.display = 'none';
    rsvpForm.style.display    = 'block';
    gsap.from(rsvpForm, { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });
    resetBtn();
  };

})();
