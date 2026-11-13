(() => {
  'use strict';
  const html = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (selector, scope = document) => scope.querySelector(selector);

  const staticFallback = () => {
    html.classList.add('about-static');
    document.querySelectorAll('.profile-scene').forEach((scene) => {
      scene.style.opacity = '1';
      scene.style.visibility = 'visible';
      scene.style.transform = 'none';
      scene.querySelectorAll('.snap-item').forEach((item) => {
        item.style.opacity = '1';
        item.style.visibility = 'visible';
        item.style.transform = 'none';
        item.style.filter = 'none';
      });
    });
  };

  if (reduceMotion) {
    staticFallback();
    return;
  }

  const waitForGSAP = (callback) => {
    let attempts = 0;
    const poll = window.setInterval(() => {
      if (window.gsap && window.ScrollTrigger) {
        window.clearInterval(poll);
        callback();
      } else if (++attempts > 150) {
        window.clearInterval(poll);
        staticFallback();
      }
    }, 40);
  };

  waitForGSAP(() => {
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ force3D: true });
    gsap.ticker.lagSmoothing(1000, 16);
    ScrollTrigger.config({ ignoreMobileResize: true });

    const runway = $('.about-journey');
    const stage = $('.about-stage');
    const intro = $('.about-intro');
    const mascot = $('.mascot-character');
    const rope = $('.mascot-rope');
    const ropePath = $('.mascot-rope path');
    const scenes = gsap.utils.toArray('.profile-scene');
    const progress = $('.about-progress span');
    const counter = $('.about-counter');

    if (!runway || !stage || !intro || !mascot || !rope || !ropePath || scenes.length !== 3) {
      staticFallback();
      return;
    }

    gsap.set(mascot, { autoAlpha: 0, x: 90, y: 24, scale: .88, rotate: 2 });
    gsap.set(rope, { autoAlpha: 0 });
    gsap.set(ropePath, { strokeDashoffset: 900 });
    gsap.set(scenes, { autoAlpha: 0, x: 150, scale: .97, filter: 'blur(5px)' });

    scenes.forEach((scene) => {
      const frame = $('.scene-photo-frame', scene);
      const image = $('img', frame);
      const flame = $('.scene-flame', scene);
      const smoke = $('.scene-smoke', scene);
      const items = scene.querySelectorAll('.snap-item');
      gsap.set(frame, { x: 150, y: 30, scale: .72, rotate: 7, clipPath: 'inset(24% 18% 18% 18%)' });
      gsap.set(image, { scale: 1.2, filter: 'brightness(.55) saturate(.5)' });
      gsap.set(flame, { autoAlpha: 0, scaleY: .12, transformOrigin: '50% 100%' });
      gsap.set(smoke, { autoAlpha: 0, scale: .55 });
      gsap.set(items, { autoAlpha: 0, x: 20, y: 24, scale: .58, rotate: -3, filter: 'blur(14px)', transformOrigin: '0 50%' });
    });

    const setProgress = progress ? gsap.quickSetter(progress, 'scaleX') : () => {};
    const names = ['AYUSH KUMAR', 'AKSHAY ANAND', 'SAHIL KUMAR'];

    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: runway,
        start: 'top top',
        end: 'bottom bottom',
        scrub: .7,
        invalidateOnRefresh: true,
        onUpdate: (self) => setProgress(self.progress)
      }
    });

    // The intro leaves. The full-body polar-bear mascot enters from the right.
    timeline
      .to(intro, { y: -90, autoAlpha: 0, duration: .72, ease: 'power2.in' }, .1)
      .fromTo(mascot,
        { autoAlpha: 0, x: 90, y: 28, scale: .88 },
        { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: .55, ease: 'power3.out' }, .82);

    // It walks across the stage to the left corner. The bobbing is tied to scroll,
    // so stopping the wheel freezes the character at the exact same point.
    const walkDistance = () => -window.innerWidth * (
      window.matchMedia('(max-width:650px)').matches ? .60 :
      window.matchMedia('(max-width:900px)').matches ? .67 : .70
    );
    timeline
      .to(mascot, { x: walkDistance, duration: 1.55, ease: 'power1.inOut' }, 1.35)
      .to(mascot, { y: -9, duration: .13, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 1.38)
      .to(mascot, { rotate: -4, duration: .22, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 1.45)
      .to(mascot, { rotate: 0, scale: .96, duration: .22, ease: 'power2.out' }, 2.78);

    // The rope draws only after the mascot reaches its corner.
    timeline
      .to(rope, { autoAlpha: 1, duration: .12 }, 2.68)
      .to(ropePath, { strokeDashoffset: 0, duration: .62, ease: 'power2.out' }, 2.72);

    const bringProfile = (scene, index, at) => {
      const frame = $('.scene-photo-frame', scene);
      const image = $('img', frame);
      const flame = $('.scene-flame', scene);
      const smoke = $('.scene-smoke', scene);
      const items = scene.querySelectorAll('.snap-item');

      // A cloudy silhouette gathers, then the portrait frame is dragged into place.
      timeline
        .fromTo(scene,
          { autoAlpha: 0, x: 150, scale: .96, filter: 'blur(8px)' },
          { autoAlpha: 1, x: 0, scale: 1, filter: 'blur(0px)', duration: .7, ease: 'power3.out', immediateRender: false }, at)
        .fromTo(smoke,
          { autoAlpha: 0, scale: .48, x: 20, y: 16 },
          { autoAlpha: .86, scale: 1.05, x: 0, y: 0, duration: .35, ease: 'power2.out', immediateRender: false }, at + .05)
        .to(smoke, { autoAlpha: 0, scale: 1.5, x: -15, y: -25, duration: .8, ease: 'power2.out' }, at + .34)
        .fromTo(frame,
          { x: 170, y: 26, scale: .7, rotate: 8, clipPath: 'inset(24% 18% 18% 18%)' },
          { x: 0, y: 0, scale: 1, rotate: -2, clipPath: 'inset(0% 0% 0% 0%)', duration: .82, ease: 'back.out(1.35)', immediateRender: false }, at + .08)
        .fromTo(image,
          { scale: 1.2, filter: 'brightness(.55) saturate(.5)' },
          { scale: 1, filter: 'brightness(1) saturate(.88)', duration: .95, ease: 'power2.out', immediateRender: false }, at + .08)
        .fromTo(items,
          { autoAlpha: 0, x: 24, y: 28, scale: .55, rotate: -4, filter: 'blur(16px)' },
          { autoAlpha: 1, x: 0, y: 0, scale: 1, rotate: 0, filter: 'blur(0px)', duration: .68, stagger: .14, ease: 'elastic.out(1, .62)', immediateRender: false }, at + .62);

      // Rope tightens as each frame is pulled into the scene.
      timeline
        .to(ropePath, { strokeDashoffset: 0, duration: .5, ease: 'power2.out' }, at + .03)
        .to(mascot, { x: '+=-8', y: -4, rotate: -3, duration: .22, ease: 'power2.in' }, at + .1)
        .to(mascot, { y: 0, rotate: 0, duration: .35, ease: 'power2.out' }, at + .43);

      timeline.call(() => {
        if (counter) {
          counter.textContent = `0${index + 1} / 03 — ${names[index]}`;
          counter.style.opacity = '1';
        }
      }, null, at + .62);

      return { scene, frame, image, flame, smoke, items };
    };

    const burnAndDissolve = (profile, at) => {
      // Portrait burns away first; then the entire card breaks into a soft smoke cloud.
      timeline
        .to(profile.flame, { autoAlpha: .98, scaleY: 1.18, duration: .5, ease: 'power2.in' }, at)
        .to(profile.image, { filter: 'brightness(2.1) saturate(1.7) sepia(.7) blur(3px)', scale: 1.08, duration: .48, ease: 'power2.in' }, at)
        .to(profile.items, { autoAlpha: 0, x: -14, y: -18, scale: .8, filter: 'blur(12px)', duration: .38, stagger: .035, ease: 'power2.in' }, at + .12)
        .to(profile.smoke, { autoAlpha: .92, scale: 1.35, x: -20, y: -20, duration: .52, ease: 'power2.out' }, at + .28)
        .to(profile.scene, { autoAlpha: 0, x: -45, scale: .94, filter: 'blur(12px)', duration: .48, ease: 'power2.in' }, at + .56)
        .to(profile.smoke, { autoAlpha: 0, scale: 1.7, duration: .35 }, at + .72)
        .to(profile.flame, { autoAlpha: 0, duration: .18 }, at + .78)
        .to(ropePath, { strokeDashoffset: 900, duration: .28, ease: 'power2.in' }, at + .72);
    };

    const ayush = bringProfile(scenes[0], 0, 3.12);
    burnAndDissolve(ayush, 4.95);

    const akshay = bringProfile(scenes[1], 1, 5.72);
    burnAndDissolve(akshay, 7.62);

    const sahil = bringProfile(scenes[2], 2, 8.38);
    timeline.to({}, { duration: 1.05 }, 10.1);

    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true, passive: true });
    let resizeFrame = 0;
    window.addEventListener('resize', () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    }, { passive: true });
    ScrollTrigger.refresh();
  });
})();