/*
 * NEXPLOIT SHARED FRONT-END SCRIPT
 * --------------------------------
 * This file contains the interactive behavior shared by the static HTML pages:
 * responsive navigation, active-page highlighting, footer year, CTF filters,
 * event details dialog, scroll reveals, and the contact form.
 *
 * The immediately invoked function keeps variables private to this file instead
 * of creating globals. Strict mode helps catch common JavaScript mistakes.
 */
(() => {
  'use strict';
  // NAVIGATION ELEMENTS: these IDs are present on pages using the shared header.
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  // MOBILE NAVIGATION: only attach handlers when both required elements exist.
  if (navToggle && siteNav) {
    // Toggle the mobile menu and keep accessible state/label in sync.
    navToggle.addEventListener('click', () => {
      const open = navToggle.getAttribute('aria-expanded') !== 'true';
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      siteNav.classList.toggle('is-open', open);
    });
    // Close the menu after a visitor follows any navigation link.
    siteNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open navigation');
      siteNav.classList.remove('is-open');
    }));
    // Escape closes the mobile menu and returns keyboard focus to its toggle.
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && siteNav.classList.contains('is-open')) {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation');
        navToggle.focus();
      }
    });
    // A click outside the open menu also dismisses it.
    document.addEventListener('click', event => {
      if (siteNav.classList.contains('is-open') && !siteNav.contains(event.target) && !navToggle.contains(event.target)) {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation');
      }
    });
  }
  // ACTIVE PAGE: data-page on <body> is compared with data-nav on each link.
  const currentPage = document.body.dataset.page;
  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.dataset.nav === currentPage) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    }
  });
  // COPYRIGHT YEAR: keep any footer year placeholders current automatically.
  document.querySelectorAll('.current-year').forEach(el => el.textContent = String(new Date().getFullYear()));

  // CTF STATUS FILTERS: show all cards or only cards matching the chosen data-status.
  // data-filter values must match data-status on cards exactly (both lowercase).
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const ctfCards = [...document.querySelectorAll('.ctf-card[data-status]')];
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle('is-active', item === button));
    ctfCards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.status !== filter; });
  }));

  // CTF EVENT DATA: the content below feeds the accessible event details dialog.
  // Each key matches a card's data-modal value. Facts and links are authored here
  // so the dialog can be reused for all events without duplicating modal markup.
  //
  // EVENT CODE REFERENCE (chronological order):
  //   NX / CTF-001 — Evil Corp CTF V2   — August 20, 2026     (first event)
  //   NX / CTF-002 — Paradox CTF        — September 17, 2026  (second event)
  //   NX / CTF-003 — Blackout CTF       — October 31, 2026    (third event)
  const events = {
    // CTF DETAILS — BLACKOUT CTF (NX / CTF-003): edit this object for the popup opened by the Blackout card. Update its date/status, description, facts, leaderboard (extra), and community links here. The card itself is in ctf.html.
    blackout: {
      eyebrow: 'COMPLETED · OCTOBER 31, 2026', title: 'Blackout CTF',
      description: 'A jeopardy-style Capture the Flag hosted on our own CTFd instance. Break into systems, capture the flags, and climb the leaderboard — including a short live Web Break System challenge on web exploitation. Built entirely in-house by the Nexploit team.',
      facts: [['DATE', 'October 31st, 2026'], ['FORMAT', 'Jeopardy-style · 6 hours'], ['TEAM SIZE', 'Solo or squad'], ['STATUS', 'Completed']],
      extra: '<h3>Leaderboard</h3><ul class="modal-list"><li>1st Place — MCTE-S114 — 2280 points</li><li>2nd Place — Hackerzzz — 2280 points</li><li>3rd Place — EgyptianPharohs — 2280 points</li></ul>',
      links: [['Join WhatsApp Group ↗', 'https://chat.whatsapp.com/DtwJd1rmghxHMYpP7S4kqj', 'outline'], ['Join Discord Server ↗', 'https://discord.gg/Ry4zDehrA', 'outline']]
    },
    // CTF DETAILS — PARADOX CTF (NX / CTF-002): edit this object for the popup opened by the Paradox card. Update host/date/time, description, participant details, and winners (extra) here. The card itself is in ctf.html.
    paradox: {
      eyebrow: 'COMPLETED · SEPTEMBER 17, 2026', title: 'Paradox CTF',
      description: 'Paradox CTF was organised by the Nexploit team for RNSIT. Participants competed on our self-hosted CTFd platform, solving jeopardy-style challenges built in-house by Nexploit. Congratulations to all the teams who took part!',
      facts: [['HOST INSTITUTE', 'RNSIT'], ['FORMAT', 'Jeopardy-style'], ['DATE & TIME', 'September 17, 2026 · 11 AM–6:30 PM IST'], ['TEAM SIZE', '4 participants']],
      extra: '<h3>Winners</h3><ul class="modal-list"><li>1st Place — ctrl-alt-elite</li><li>2nd Place — HackStreetBoys</li><li>3rd Place — brahmastra</li></ul>',
      links: []
    },
    // CTF DETAILS — EVIL CORP CTF V2 (NX / CTF-001): edit this object for the popup opened by the Evil Corp card. Update its description, date/time, format, leaderboard (extra), and community links here. The card itself is in ctf.html.
    evilcorp: {
      eyebrow: 'COMPLETED · AUGUST 20, 2026', title: 'Evil Corp CTF V2',
      description: 'A six-hour jeopardy-style Capture the Flag hosted on our own CTFd instance. Expect web exploitation, Linux privilege escalation chains, hardcore reverse engineering, and an OSINT hunt — all wrapped in a Mr. Robot-inspired theme. Built entirely in-house by the Nexploit team.',
      facts: [['DATE & TIME', 'August 20, 2026 · 6 PM–12 AM IST'], ['FORMAT', 'Jeopardy-style · 6 hours'], ['TEAM SIZE', 'Solo or squad'], ['STATUS', 'Completed']],
      extra: '<h3>Leaderboard</h3><ul class="modal-list"><li>1st Place — TEAM_UNFINDABLES · 3000 points</li><li>2nd Place — AmbokOps · 2950 points</li><li>3rd Place — PwnNepal · 2950 points</li></ul>',
      links: [['Join WhatsApp Group ↗', 'https://chat.whatsapp.com/DtwJd1rmghxHMYpP7S4kqj', 'outline'], ['Join Discord Server ↗', 'https://discord.gg/Ry4zDehrA', 'outline']]
    }
  };
  // DIALOG ELEMENT REFERENCES: some pages do not contain a modal, so handlers below guard for absence.
  const modal = document.getElementById('eventModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalEyebrow = document.getElementById('modalEyebrow');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  let lastTrigger = null;
  // Close the event dialog, restore page scrolling, and return focus to its opener.
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastTrigger) lastTrigger.focus();
  }
  // Fill and open the dialog for the selected event; trigger is remembered for focus restoration.
  function openModal(key, trigger) {
    const event = events[key];
    if (!event || !modal) return;
    lastTrigger = trigger;
    modalEyebrow.textContent = event.eyebrow;
    modalTitle.textContent = event.title;
    // Build the event facts and external-link buttons from the trusted local event data above.
    const facts = event.facts.map(([label, value]) => `<div class="modal-fact"><span>${label}</span><strong>${value}</strong></div>`).join('');
    const links = event.links.map(([label, href, style]) => `<a class="button ${style === 'primary' ? 'button-primary' : 'button-outline'}" href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`).join('');
    modalBody.innerHTML = `<p class="modal-description">${event.description}</p><div class="modal-facts">${facts}</div>${event.extra}<div class="modal-actions">${links}</div>`;
    modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open'); modalClose?.focus();
  }
  // DIALOG CONTROLS: open from event cards; close by button, backdrop, or Escape.
  document.querySelectorAll('[data-modal]').forEach(button => button.addEventListener('click', () => openModal(button.dataset.modal, button)));
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal?.classList.contains('is-open')) closeModal(); });


  // SCROLL REVEALS: animate marked elements only when motion is allowed and the
  // browser supports IntersectionObserver. Otherwise show everything immediately.
  const revealItems = [...document.querySelectorAll('[data-reveal="up"]')];
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (revealItems.length && !reduceMotion && 'IntersectionObserver' in window) {
    document.body.classList.add('motion-enabled');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-revealed'));
  }

  // CONTACT FORM CONFIGURATION: endpoint retained from the existing website.
  // Note: mode:'no-cors' prevents JavaScript from reading the server response;
  // a resolved fetch therefore cannot prove that the form was accepted server-side.
  const GOOGLE_SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzGAbE1K6kcrCRu1hJTC4VgNzniQSQpzKHKAWuR0LHbn2q2bP_wzAORsE35xwAazhd0IA/exec';
  const messageField = document.getElementById('messageField');
  const messageCounter = document.getElementById('messageCounter');
  // MESSAGE COUNTER: update the visible character count while the visitor types.
  if (messageField && messageCounter) {
    const updateMessageCounter = () => { messageCounter.textContent = `${messageField.value.length} / 3000 characters (~500 words)`; };
    messageField.addEventListener('input', updateMessageCounter);
    updateMessageCounter();
  }
  // FORM SUBMISSION: intercept native submission, show progress, and POST form fields.
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async event => {
      event.preventDefault();
      const button = contactForm.querySelector('.submit-btn');
      const status = document.getElementById('contactFormStatus');
      if (!button) return;
      const originalLabel = button.innerHTML;
      button.disabled = true;
      button.textContent = 'Sending…';
      if (status) { status.classList.remove('is-success', 'is-error'); status.textContent = 'Sending your message…'; }
      try {
        // Send the form fields to Google Apps Script. no-cors makes the response opaque to the page.
        await fetch(GOOGLE_SHEET_ENDPOINT, { method: 'POST', mode: 'no-cors', body: new FormData(contactForm) });
        contactForm.innerHTML = '<p class="contact-success"><span class="status-dot"></span><strong>Message sent.</strong><br>Thanks for reaching out. We\'ll get back to you soon.</p>';
      } catch (error) {
        button.disabled = false;
        button.innerHTML = originalLabel;
        if (status) { status.classList.add('is-error'); status.textContent = 'Something went wrong. Please try again or email contact@nexploit.in directly.'; }
      }
    });
  }

})();
