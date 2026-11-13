(() => {
  'use strict';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const waitForGSAP = (ready) => {
    let n = 0;
    const poll = setInterval(() => {
      if (window.gsap && window.ScrollTrigger) { clearInterval(poll); ready(); }
      else if (++n > 120) { clearInterval(poll); document.documentElement.classList.add('journey-no-motion'); }
    }, 40);
  };

  document.querySelectorAll('.gallery-column figure img').forEach((img, i) => {
    img.addEventListener('error', () => {
      const f = img.closest('figure');
      if (f) { f.dataset.fallback = `FIELD ARCHIVE / ${String(i + 1).padStart(2, '0')}`; f.classList.add('gallery-missing'); }
      img.remove();
    }, { once: true });
  });

  if (reduceMotion) {
    document.querySelectorAll('.rev-row').forEach((r) => r.classList.add('rev-static'));
    document.querySelectorAll('.world-panel').forEach((p) => Object.assign(p.style, { opacity: '1', visibility: 'visible', position: 'relative', inset: 'auto', minHeight: '100svh' }));
    return;
  }

  waitForGSAP(() => {
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ force3D: true });
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Inertia scrolling (Lenis) driven by GSAP's own ticker: one clock, no fighting.
    let lenis = null;
    if (window.Lenis && !isTouch) {
      lenis = new window.Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      gsap.ticker.lagSmoothing(1000, 16);
    }

    const $ = (s) => document.querySelector(s);
    const runway = $('.journey-runway'), gateway = $('.alien-gateway');
    const about = $('.about-world'), ctf = $('.ctf-world'), team = $('.team-world'), contact = $('.contact-world');
    const progress = $('.journey-progress span');
    if (!runway || !gateway || !about || !ctf || !team || !contact) return;
    const setProgress = progress ? gsap.quickSetter(progress, 'scaleX') : () => {};

    gsap.set([about, ctf, team, contact], { autoAlpha: 0 });
    gsap.set('.depth-card, .team-depth-card', { autoAlpha: 0, xPercent: -50, x: 0, y: 0, scale: .985 });
    gsap.set('.portal-white-core', { opacity: .58, scale: .94 });
    gsap.set('.portal-light-beam, .portal-fog', { opacity: .12 });
    gsap.set('.portal-floor-light', { opacity: .5 });
    const gap = () => (window.innerWidth < 700 ? 15 : 7.5); // slit width in vw

    const journey = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: runway, start: 'top top', end: 'bottom bottom',
        scrub: lenis ? true : 0.6, invalidateOnRefresh: true,
        onUpdate: (self) => setProgress(self.progress)
      }
    });

    // ROYAL GATE: heavy doors swing inward in true 3D, light + rays pour out, camera pushes in.
    journey
      .to('.welcome-overlay', { y: -46, autoAlpha: 0, duration: .42, ease: 'power2.in' }, 0)
      .to(gateway, { scale: 1.08, duration: 1.0, ease: 'sine.inOut' }, 0)
      .fromTo('.door-left',  { xPercent: () => -gap() }, { xPercent: -104, duration: 1.6, ease: 'power3.inOut' }, .14)
      .fromTo('.door-right', { xPercent: () => gap() },  { xPercent: 104,  duration: 1.6, ease: 'power3.inOut' }, .14)
      .to('.gateway-lintel', { opacity: 0, duration: .9 }, .2)
      .to('.gateway-atmosphere', { opacity: 0, duration: .8 }, .9)
      .to('.portal-white-core', { opacity: 1, scale: 1.12, duration: 1.05, ease: 'power2.out' }, .3)
      .to('.portal-rays', { opacity: .9, scale: 1.15, duration: 1.1, ease: 'power2.out' }, .4)
      .to('.portal-light-beam', { opacity: .95, scale: 1.12, duration: 1.05 }, .36)
      .to('.portal-floor-light', { opacity: 1, scaleX: 3.2, duration: 1.4, ease: 'power2.out' }, .3)
      .to('.portal-fog', { opacity: .88, duration: 1.05 }, .44)
      .to(gateway, { scale: 2.8, y: '18%', autoAlpha: 0, duration: 1.2, ease: 'power2.in', immediateRender: false }, 1.1)
      .to('.world-backdrop', { scale: 1.18, duration: 1.2 }, 1.1)
      .to('.flight-layer', { autoAlpha: 1, duration: .12 }, 1.18)
      .fromTo('.flight-tunnel', { scale: .72, opacity: .18 }, { scale: 4.4, opacity: .8, duration: .9 }, 1.23)
      .to('.flight-ring-a', { rotation: 110, scale: 1.8, duration: .9 }, 1.23)
      .to('.flight-ring-b', { rotation: -90, scale: 2, duration: .9 }, 1.23)
      .to('.flight-label', { opacity: 0, scale: 1.12, duration: .55 }, 1.5)
      .to('.flight-layer', { autoAlpha: 0, duration: .15 }, 2.08);

    // Fully reversible panel fades (no callbacks, so scrolling back up never leaves ghosts).
    const enter = (el, at) => journey.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: .1, immediateRender: false }, at);

    enter(about, 2.16);
    journey.fromTo(about, { scale: 1.08, z: -180 }, { scale: 1, z: 0, duration: .68, immediateRender: false }, 2.16)
      .fromTo('.about-world-copy', { x: -42, opacity: 0 }, { x: 0, opacity: 1, duration: .55, ease: 'power2.out' }, 2.22)
      .fromTo('.world-gallery', { x: 42, opacity: 0 }, { x: 0, opacity: 1, duration: .55, ease: 'power2.out' }, 2.22)
      .to('.gallery-column-a', { yPercent: -28, duration: 1.65 }, 2.58)
      .to('.gallery-column-b', { yPercent: -36, duration: 1.65 }, 2.58)
      .to('.about-world-copy', { y: -90, opacity: 0, duration: .42 }, 4.16)
      .to('.world-gallery', { y: -90, opacity: 0, duration: .42 }, 4.16)
      .to(about, { autoAlpha: 0, duration: .16 }, 4.63);

    // ===== REVIEWS: three rows on a curved gallery wall. Row 1 moves left, row 2 right, row 3 left but slower. =====
    const reviews = $('.reviews-world');
    const rows = gsap.utils.toArray('.rev-row').map((el, i) => ({
      el, dir: i === 1 ? 1 : -1, speed: [1, .92, .72][i] || 1, sign: i - 1, phase: [0, .5, .25][i] || 0,
      cards: gsap.utils.toArray('.rev-card', el)
    }));
    const rev = { p: 0, vis: 0 };
    let cw = 300, ch = 150, W = window.innerWidth, pitch = 330;
    const measure = () => {
      W = window.innerWidth;
      const c = rows[0] && rows[0].cards[0];
      if (c) { cw = c.offsetWidth; ch = c.offsetHeight; }
      pitch = cw + Math.round(Math.max(14, W * .014));
    };
    const renderReviews = () => {
      const Rad = Math.max(W * .9, 760);
      rows.forEach((r) => {
        const n = r.cards.length;
        const maxTravel = Math.max(0, Math.min(n * pitch - W * 1.1 - cw - 2 * pitch * r.phase, W * 1.35));
        const off = r.dir * maxTravel * r.speed * (rev.p - .5);
        r.cards.forEach((el, i) => {
          const x = (i - (n - 1) / 2) * pitch + r.phase * pitch + off;
          const th = Math.max(-1.4, Math.min(1.4, x / Rad));       // angle on the curved wall
          const X = Rad * Math.sin(th), Z = Rad * (Math.cos(th) - 1);
          const Y = r.sign * (1 - Math.cos(th)) * Rad * .2 + (1 - rev.vis) * 80 * (r.sign + 1.6);
          const op = Math.max(0, Math.min(1, 1 - (Math.abs(th) - .85) / .45)) * rev.vis;
          el.style.transform = `translate3d(${(X - cw / 2).toFixed(1)}px,${(Y - ch / 2).toFixed(1)}px,${Z.toFixed(1)}px) rotateY(${(-th * 57.3).toFixed(2)}deg) rotateZ(${(r.sign * th * 4).toFixed(2)}deg)`;
          el.style.opacity = op.toFixed(3);
        });
      });
    };
    if (reviews && rows.length) {
      measure(); renderReviews();
      window.addEventListener('load', () => { measure(); renderReviews(); }, { once: true });
      window.addEventListener('resize', () => { measure(); renderReviews(); }, { passive: true });
      enter(reviews, 4.72);
      journey.fromTo('.reviews-heading', { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: 'power2.out', immediateRender: false }, 4.78)
        .fromTo(rev, { vis: 0 }, { vis: 1, duration: .6, ease: 'power2.out', onUpdate: renderReviews, immediateRender: false }, 4.8)
        .fromTo(rev, { p: 0 }, { p: 1, duration: 2.5, ease: 'none', onUpdate: renderReviews, immediateRender: false }, 4.95)
        .to(rev, { vis: 0, duration: .5, ease: 'power2.in', onUpdate: renderReviews }, 7.62)
        .to('.reviews-heading', { y: -30, opacity: 0, duration: .3 }, 7.7)
        .to(reviews, { autoAlpha: 0, duration: .16 }, 8.08);
    }

    enter(ctf, 8.2);
    journey.fromTo(ctf, { scale: 1.045, z: -120 }, { scale: 1, z: 0, duration: .42, immediateRender: false }, 8.2)
      .fromTo('.ctf-world-heading', { x: -28, opacity: 0 }, { x: 0, opacity: 1, duration: .42 }, 8.27);

    // CTF cards ROLL like a drum: each card sits on a cylinder, rolls in from the right, pauses, rolls out to the left.
    const eventCard = (sel, at, pause = .34) => journey
      .fromTo(sel, { autoAlpha: 0, xPercent: -50, rotateY: 80, scale: .94, transformPerspective: 1600, transformOrigin: '50% 50% -950px' },
        { autoAlpha: 1, rotateY: 0, scale: 1, duration: .62, ease: 'power2.out', immediateRender: false }, at)
      .to(sel, { autoAlpha: 0, rotateY: -80, scale: .94, duration: .36, ease: 'power2.in' }, at + .62 + pause);
    eventCard('.blackout-card', 8.46); eventCard('.evil-card', 9.82); eventCard('.paradox-card', 11.18);
    journey.to('.ctf-world-heading', { y: -28, opacity: 0, duration: .28 }, 12.55)
      .to(ctf, { autoAlpha: 0, duration: .16 }, 12.84);

    enter(team, 12.94);
    journey.fromTo(team, { scale: 1.045, z: -120 }, { scale: 1, z: 0, duration: .4, immediateRender: false }, 12.94)
      .fromTo('.team-world-heading', { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: .36 }, 13);

    const profile = (sel, at) => journey
      .fromTo(sel, { autoAlpha: 0, y: 24, xPercent: -50, scale: .985 },
        { autoAlpha: 1, y: 0, xPercent: -50, scale: 1, duration: .48, ease: 'power2.out', immediateRender: false }, at)
      .to(sel, { autoAlpha: 0, y: -20, scale: .985, duration: .3, ease: 'power2.in' }, at + .74);
    profile('.team-ayush', 13.2); profile('.team-akshay', 14.3); profile('.team-sahil', 15.4);
    journey.to('.team-world-heading', { y: -38, opacity: 0, duration: .28 }, 16.34)
      .to(team, { autoAlpha: 0, duration: .16 }, 16.57);

    enter(contact, 16.68);
    journey.fromTo(contact, { scale: 1.06, z: -160 }, { scale: 1, z: 0, duration: .54, immediateRender: false }, 16.68)
      .fromTo('.contact-world-heading', { x: -34, opacity: 0 }, { x: 0, opacity: 1, duration: .45 }, 16.74)
      .fromTo('.contact-world-form', { x: 34, opacity: 0 }, { x: 0, opacity: 1, duration: .45 }, 16.74)
      .to('.journey-endmark', { opacity: 1, duration: .25 }, 17.3);

    // Nav "Contact" link: glide to the last scene (it lives inside the pinned journey).
    document.querySelectorAll('a[href$="#contact"]').forEach((a) => a.addEventListener('click', (e) => {
      const st = journey.scrollTrigger; if (!st) return;
      e.preventDefault();
      const y = st.start + (st.end - st.start) * (17.34 / journey.duration());
      lenis ? lenis.scrollTo(y, { duration: 2.2 }) : window.scrollTo({ top: y, behavior: 'smooth' });
    }));

    let raf = 0;
    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true, passive: true });
    window.addEventListener('resize', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => ScrollTrigger.refresh()); }, { passive: true });
    ScrollTrigger.refresh();
  });
})();
