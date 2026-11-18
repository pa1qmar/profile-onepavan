# OnePavan — Portfolio PWA

A single-page, installable Progressive Web App portfolio for **Pavan Kumar Banala**, Senior
Integration Architect & Java Technology Leader (18 years in IT, 8 on the MuleSoft Anypoint Platform).

It's hand-written HTML, CSS and JavaScript, with no framework, build step or npm dependencies.
It has a dark theme, pure-CSS 3D effects, a canvas particle background, and offline support.

```
portfolio-pwa/
  index.html      # markup for all sections
  styles.css      # design tokens, layout, 3D effects, responsive + reduced-motion rules
  script.js       # particles, cursor, nav, reveal, tilt, typewriter, counters, install, SW registration
  manifest.json   # web app manifest
  sw.js           # service worker (offline caching)
  icons/icon.svg  # app icon / favicon
```

## Quick start

Serve the folder statically:

```bash
cd portfolio-pwa
python -m http.server 5173      # → http://localhost:5173
# or
npx serve .
```

> The service worker and the install prompt only work over `http://localhost` or `https://`.
> Opening `index.html` via `file://` renders the page, but no PWA features.

## What's filled in vs. what still needs your input

Already filled in: name, branding, email, headline and bio, skills, project write-ups, role
titles and achievements, certification names, and the current employer (Cognizant).

These literal `[BRACKET]` placeholders still need replacing (search the repo for `[`):

| Placeholder | Where | Replace with |
|---|---|---|
| `[RESUME_LINK]` | Hero "Download CV" | URL/path to your CV PDF |
| `[YOUR_PHOTO]` | About | Swap the placeholder div for `<img src="assets/profile.jpg">` |
| `[CITY, COUNTRY]` | About, Experience, Contact | e.g. Hyderabad, India |
| `[YEAR_JOINED]` | Experience (Cognizant) | Year you joined |
| `[YEAR]` | Experience dates, certifications | Years |
| `[COMPANY_NAME]` | Experience (previous roles) | Employer names |
| `[ID]` | Certifications | Credential IDs |
| `[UNIVERSITY_NAME]`, `[GRADUATION_YEAR]`, `[CGPA / %]` | Education card | Your degree details |
| `[+91-XXXXX-XXXXX]` | Contact | Phone number |
| `[SCREENSHOT_PLACEHOLDER]` | Project cards | Screenshots / architecture images |
| `[PROJECT_N_URL]`, `[PROJECT_N_LIVE_URL]`, `[PROJECT_N_REPO_URL]` | Project cards | Case study / diagram links |
| `[GITHUB_URL]`, `[LINKEDIN_URL]`, `[TWITTER_URL]`, `[STACKOVERFLOW_URL]` | Contact, footer | Social profiles |
| `[GITHUB_PROFILE_URL]` | Below projects grid | GitHub profile |

**Icons:** `manifest.json` lists `icons/icon-192.png` and `icons/icon-512.png`, but neither file
exists yet. Export them from `icons/icon.svg` (or your own brand art). You can also remove those
two entries, because the SVG icon already covers every size.

**Contact form:** `handleSubmit()` in `script.js` is a front-end stub. It shows a success note
and resets the form. The code comment above it shows how to connect Formspree or EmailJS.

## Architecture notes

- **No framework.** Everything is plain DOM APIs and lives in one IIFE (`handleSubmit` is
  global because the form's `onsubmit` attribute calls it).
- **Pure-CSS 3D.** The hero cube, loader cube, orbit rings and flipping social buttons use
  `transform-style: preserve-3d`. Card tilt is computed in JS on `mousemove`, which also sets
  `--mx`/`--my` for the radial hover glow.
- **Canvas particles.** Up to 80 particles (`min(80, w·h/18000)`) with linking lines inside
  130px and mouse repulsion inside 140px. The canvas respects DPR, capped at 2.
- **PWA caching.**
  - The app shell is precached on install.
  - Navigations are **network-first**, falling back to the cache and then `index.html` when offline.
  - All other GET requests are **cache-first**. Only 200, non-opaque responses are cached.
  - Bump `CACHE` in `sw.js` (`portfolio-v1` → `v2`) after changing assets.
- **Accessibility.**
  - `prefers-reduced-motion` turns off the cube, orbit, particle drift and typewriter animations.
  - Interactive elements are keyboard-reachable, with visible focus rings.
  - Icon-only controls have `aria-label`s.
  - The custom cursor is off on touch devices (`hover: none`).

## Deploy

Any static host works. HTTPS is required for the service worker.

- **Netlify:** the repo's root `netlify.toml` already publishes `portfolio-pwa/` with no build step.
- **GitHub Pages:** publish the `portfolio-pwa/` folder, for example with an Actions workflow
  that uploads it as the Pages artifact.
- **Vercel / Cloudflare Pages:** set the output (root) directory to `portfolio-pwa`. Leave the
  build command empty.
