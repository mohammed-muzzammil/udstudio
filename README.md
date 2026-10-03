# UD Studio website

The website for **UD Studio — Umme's Design Studio**. It's plain HTML, CSS and JavaScript with no build step, so it can be hosted for free (GitHub Pages, Netlify, Cloudflare Pages).

```
index.html     Home: logo intro, lights-on hero, two featured homes, room gallery, approach,
               sketch slider, services, floor-plan process, studio, client words, contact
work.html      All projects
project.html   One project, room by room, plus its walkthrough video (project.html?p=<slug>)
studio.html    About the studio, founder, values, process, numbers, contact
contact.html   Contact details, enquiry form, FAQ
404.html       "Page not found"
css/style.css  All styling. Colours and fonts are at the top under :root
js/config.js   Contact details, projects, photos, stats, testimonials  ← edit this
js/main.js     Shared header/footer, form, WhatsApp chat and all animations
js/logo.js     The logo as vector paths (traced from the supplied logo)
assets/        Logo, favicon, share image (og.png). Put the studio's photos in assets/img/
```

## Preview on your computer

```bash
cd ~/Documents/udstudio-website && python3 -m http.server 8766
```

Open http://localhost:8766. The logo intro plays once per browser tab. Open a new tab to see it again.

## The design in short

- **Colours** come from the logo: espresso brown `#3D1108` from "UD" and blush `#C19A90` from the "Studio" script. They sit on warm ivory and linen, with brass and lamp-light gold for a richer, more luxurious feel. It's a light site with two deep "evening" sections (services and client words).
- **Type:** Bodoni Moda for headings (it matches the "UD" letterforms), Mrs Saint Delafield for the handwritten accents (it echoes the "Studio" signature) and Manrope for body text.
- **Written for clients:** plain words, lots of photos, and a quick way to call, WhatsApp or ask for a quote on every screen.
- **Animations, all about light and rooms:**
  - *Intro:* the logo is drawn line by line and "Studio" is written in, then two sliding doors open onto the site.
  - *Hero:* a room shown at dusk. A light switch flicks and the lamps flicker on. Visitors can tap the switch to turn the lights off and on.
  - *Our work:* linen curtains draw open onto each featured home. Swipe the photo or tap the tabs to move between rooms.
  - *Rooms we've designed:* a gallery of sample work, filtered by room. Each photo appears with a sweep of light, and tapping one opens a full-screen viewer you can swipe through.
  - *See it before it's built:* drag a slider to turn a pencil sketch into the finished room.
  - *What we do:* a brass picture light above each service switches on as the card comes into view. On phones, the cards light up one by one as you swipe.
  - *How it works:* a floor plan builds itself as you scroll, and the lights come on at the end.
  - *Contact:* a pendant lamp drops in, swings and lights up the enquiry section. Tap it to switch it off and on.
- **Phones first:** every animation works by tapping, swiping or scrolling. A bottom bar (Call · WhatsApp · Get a quote) appears once you start scrolling.
- Visitors who turn on "reduce motion" see every section fully, with the lights on and nothing moving.

## Updating details

| What | Where |
|---|---|
| Phone, WhatsApp, email, address, hours, city, map link, Instagram | top of `js/config.js` |
| Enquiry form inbox | `web3formsKey` in `js/config.js` (see below) |
| Projects: names, details, room photos, video | `projects` in `js/config.js` |
| Founder name, role, photo, bio | `founder` in `js/config.js` |
| Studio numbers, client quotes | `stats` and `testimonials` in `js/config.js` |
| Hero photo and where its lamps glow | `hero` in `js/config.js` |
| Extra photos for the "Rooms we've designed" gallery | `gallery` in `js/config.js` (project room photos appear there automatically) |
| Other photos (sketch slider, studio, contact, services) | `images` in `js/config.js` |
| Colours and fonts for the whole site | `:root` at the top of `css/style.css` |
| Wording on each page | the page's `.html` file |

### Adding the studio's photos and videos

1. Put the photos in a folder per project, for example `assets/img/ivory/living-1.jpg`. Export them about 2000 px wide, as JPG or WebP, under 500 KB each.
2. In `js/config.js`, replace each `U("photo-…")` with the path, for example `"assets/img/ivory/living-1.jpg"`.
3. **Video:** set `video.src` to an `.mp4` file, a YouTube link or an Instagram reel link. Until then, the play button shows "Coming soon" over the poster photo.
4. **Hero photo:** pick a photo with lamps you can see (pendants, a floor lamp, wall lights). In `hero.lights`, give each lamp's position as a percentage from the left and top of the photo, so the glow sits on the lamp when the lights switch on.
5. **Sketch slider:** `images.sketch` is shown as both the pencil sketch and the finished room. A living-room shot with clear lines works best.

### Enquiry form (free)

1. Go to https://web3forms.com and enter the email address that should receive enquiries.
2. Copy the access key from the confirmation email into `web3formsKey` in `js/config.js`.
3. Submit a test enquiry from the live site.

Until a key is added, **Send enquiry** opens the visitor's email app with the message filled in, addressed to `email` in `js/config.js`.

### WhatsApp chat

The green button opens a small chat panel. Visitors type a message (or tap a suggestion) and WhatsApp opens on their phone or computer with the message ready to send to `whatsapp` in `js/config.js`.

## Placeholders to replace

- [ ] Phone, WhatsApp number, email, address, hours, city, Google Maps link, Instagram (`js/config.js`)
- [ ] Web3Forms access key (`js/config.js`)
- [ ] Two featured projects: real names, type, location, area, year, scope, summary, palette, room photos, walkthrough videos
- [ ] Service list and wording (e.g. "3D views", study tables, turnkey). Confirm the studio offers each one
- [ ] All placeholder photos. They're free Unsplash images loaded from Unsplash, used only until the studio's own photos arrive
- [ ] Founder full name, portrait and bio
- [ ] Studio numbers (years, homes delivered and so on). The current figures are made up for the layout. Replace or delete them before launch
- [ ] Client quotes. Use real ones with the client's permission, or delete them to hide the section
- [ ] FAQ answers marked TODO in `contact.html` (first consultation, typical timelines, cities)
- [ ] Floor-plan dimensions (11.2 m × 7.6 m) are illustrative; fine to keep or change in `planSVG` in `js/main.js`

## Live preview

The site is published with GitHub Pages from the public repo **mohammed-muzzammil/udstudio**:

**https://mohammed-muzzammil.github.io/udstudio/**

To update it, commit and push to `main`. It goes live in about a minute:

```bash
cd ~/Documents/udstudio-website && git add -A && git commit -m "Update content" && git push
```

### Preview mode (switch off at launch)

While the site has sample photos and placeholder details, three things keep it marked as a preview:

1. `preview: true` in `js/config.js` shows the "Design preview · sample photos" tag. Set it to `false`.
2. Each page has `<meta name="robots" content="noindex, nofollow">` so Google doesn't list it. Delete that line from every `.html` file.
3. `robots.txt` blocks search engines. Change `Disallow: /` to `Allow: /`.

## A nicer address, still free

| Option | Address | How |
|---|---|---|
| GitHub Pages (now) | `mohammed-muzzammil.github.io/udstudio` | Already set up |
| GitHub organisation | `udstudio.github.io` | Create a free organisation named `udstudio` on GitHub, then move this repo into it and rename the repo to `udstudio.github.io` |
| Cloudflare Pages | `udstudio.pages.dev` | Free Cloudflare account → Workers & Pages → Create → Pages → connect this GitHub repo. No build command, output folder `/` |
| Netlify / Vercel | `udstudio.netlify.app` / `udstudio.vercel.app` | Sign in with GitHub → import this repo → choose the site name |

For a business, a real domain (for example `udstudio.in`, about ₹500–900 a year) looks most trustworthy and gives you `hello@udstudio.in` style email. It should be bought in the studio's name. Any of the options above can point to it later.

If you change the address, update the `og:image` URLs at the top of each page so link previews keep working.

## Free hosting

The steps are the same as for the Bombay Soda site: GitHub Pages plus the studio's domain.

1. Create a public GitHub repository and upload everything in this folder.
2. **Settings → Pages →** Deploy from a branch → `main` / root.
3. Add the custom domain. At the domain registrar, add the four GitHub `A` records on `@` and a `www` CNAME to `<username>.github.io`.
4. Once DNS has updated, tick **Enforce HTTPS**.

Netlify or Cloudflare Pages also work: drag this folder onto their dashboard.
