# Into Sky — record label site

A single-page, dependency-light site for the Into Sky record label. Static files only:
drop the folder on GitHub Pages, Netlify, Vercel or any web host and it runs.

## What's in it

- **Hero release slider** — the latest release front and centre, with autoplay, arrows,
  dots, keyboard arrows and swipe. The WebGL sky behind it re-tints to each release's palette.
- **WebGL sky** (`assets/js/sky.js`) — hand-written WebGL: a domain-warped fBm cloud field
  over a two-stop gradient, plus additive dust motes. No 3D library needed for a
  full-screen shader, so the page stays light. Automatically drops to a CSS gradient
  if WebGL is unavailable, pauses when off-screen or when the tab is hidden, and
  freezes for `prefers-reduced-motion`.
- **GSAP + ScrollTrigger** for the loader, slider transitions, line reveals, parallax
  and the marquee. Native browser scrolling — no smooth-scroll library, so the page
  never fights the OS scroller.
- Sections: manifesto, artists, about, merch, newsletter, contact, footer.
- Self-hosted fonts (Bodoni Moda + Inter, latin subsets) — no third-party requests at all.

## Editing content

Everything on the page comes from **`assets/js/data.js`**. Change the objects there and
the page rebuilds itself — no build step, no framework.

```js
releases: [{ cat, artist, title, status, format, date, blurb, cover, links, sky }]
artists:  [{ name, tags, img, latest }]
merch:    [{ name, meta, price, art }]   // art: "tee" | "tote" | "lp" | "tape"
```

`sky` is `[dark, mid, light]` — the three colours the shader lerps to when that slide
is showing. Cover images live in `assets/img/covers/`, artist images in
`assets/img/artists/`. Square covers, 3:4 artist portraits.

### Placeholders to replace before launch

- All body copy is lorem ipsum. Headings, labels and section titles are real.
- One release (*Draw Out Your World*) and one artist (Caoilfhionn Rose). Format,
  release date and catalogue number are placeholders.
- Cover and artist images are generated placeholders.
- Merch names, prices and product copy are placeholders.
- Email addresses (`@intosky.co`) and social links are placeholders.
- The newsletter form does not post anywhere yet — see below.

With one release the slider controls hide themselves; add a second object to
`releases` and the dots, arrows, autoplay and swipe all come back.

### Wiring up the newsletter

In `assets/js/main.js`, find the `#signupForm` submit handler. Replace the
"TODO" with a POST to your provider, or change the `<form>` in `index.html` to
`<form action="https://buttondown.email/api/emails/embed-subscribe/YOURNAME" method="post">`
and delete the JS handler. Formspree, Mailchimp and Buttondown all work with plain
static hosting.

## Deploying to GitHub Pages

```bash
git init
git add .
git commit -m "Into Sky site"
git branch -M main
git remote add origin git@github.com:YOURNAME/into-sky.git
git push -u origin main
```

Then in the repo: **Settings → Pages → Source: Deploy from a branch → `main` / `root`**.
The `.nojekyll` file is already there so the `assets/` folder is served as-is.
A custom domain goes in **Settings → Pages → Custom domain** (add a `CNAME` file if
you prefer to keep it in the repo).

## Browser support

Tested in headless Chrome at 1440, 820 and 390px wide. Requires a browser with
WebGL for the animated sky; everything else works without it.
