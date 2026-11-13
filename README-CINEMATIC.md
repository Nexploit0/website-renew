# Nexploit continuous cinematic homepage

## Files
- `index.html` — homepage markup and existing navigation.
- `css/cinematic-home.css` — all cinematic scene, gate, event-card, team-card and responsive styles.
- `js/cinematic-home.js` — scroll-driven GSAP/ScrollTrigger timeline.
- `css/styles.css` and `js/main.js` — original site styling and existing site behavior.

## Run locally
Serve the project root with any static web server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

GSAP and ScrollTrigger are loaded from jsDelivr in `index.html`. The homepage uses native browser scrolling with ScrollTrigger scrub; no second smooth-scroll engine is enabled.

## Optional gallery images
Add your own images as `assets/1.jpg` through `assets/10.jpg`. If they are not present, the gallery displays designed archive placeholders rather than broken image icons.

## Deployment
Upload the complete project folder while preserving the `css/`, `js/`, `assets/`, `certificate/`, and `Writeup/` directories. Do not merge the cinematic CSS or JavaScript into the original files; they are intentionally kept separate.


## About page refresh (V17)

- Rebuilt `about.html` to match the current Nexploit dark / neon-lime homepage theme.
- New hero copy: “ABOUT NEXPLOIT / PEOPLE & PRACTICE — The people behind Nexploit.”
- The supplied mascot image is used as the helper avatar's face; a CSS-drawn hoodie body, waving, walking and pulling motions complete the character.
- Scroll-driven sequence: mascot greets the visitor, drags in Ayush's portrait frame, the profile details snap into view, the frame transitions through a flame effect, then Akshay and Sahil arrive in the same sequence.
- The existing full team biographies, stats, skills, work history and project content remain in the lower “Full Dossier” section.
- About styles and behavior remain separate in `css/about-journey.css` and `js/about-journey.js`.
- Removed the separate Lenis smooth-scroll engine from the About page; GSAP ScrollTrigger is the single scroll animation driver.


## About page mascot interaction (V18)

- Replaced the small CSS-built mascot with the supplied full-body Nexploit polar-bear artwork.
- Prepared a transparent cutout of the mascot so the square black image background no longer appears over the dark scene.
- The mascot enters from the right only after the visitor scrolls, walks across to the lower-left corner, and pauses when scrolling pauses.
- A rope draws in and the first portrait frame is pulled into the scene.
- Each profile's information materialises from a smoke / particle-like reveal; the outgoing portrait burns away before the next member appears.
- Ayush, Akshay, and Sahil follow the same scroll-controlled sequence.
- All motion is scrubbed by GSAP ScrollTrigger. No independent autoplay animation or second smooth-scroll engine is used.
