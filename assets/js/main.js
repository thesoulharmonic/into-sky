/* Into Sky — interaction layer */
(function () {
  "use strict";

  var D = window.INTO_SKY;
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (m) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m]; }); };
  var mark = function (s) { return esc(s).replace(/\*([^*]+)\*/g, "<em>$1</em>"); };

  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ---------------------------------------------------------------- render */
  var PRODUCT_ART = {
    tee: '<svg viewBox="0 0 200 200" fill="none" aria-hidden="true"><path d="M70 34 46 46 32 74l20 12 8-14v92h80V72l8 14 20-12-14-28-24-12-13 12c-5 5-14 5-19 0L70 34Z" stroke="#1c3a60" stroke-width="2.5" stroke-linejoin="round"/><path d="M70 34c6 12 24 12 30 0" stroke="#1c3a60" stroke-width="2.5"/><circle cx="100" cy="112" r="17" stroke="#1c3a60" stroke-width="2"/><path d="M83 128h34" stroke="#1c3a60" stroke-width="2"/></svg>',
    tote: '<svg viewBox="0 0 200 200" fill="none" aria-hidden="true"><rect x="45" y="66" width="110" height="106" stroke="#1c3a60" stroke-width="2.5"/><path d="M72 66V50a28 28 0 0 1 56 0v16" stroke="#1c3a60" stroke-width="2.5"/><path d="M74 108h52M74 124h34" stroke="#1c3a60" stroke-width="2"/><circle cx="100" cy="140" r="9" stroke="#1c3a60" stroke-width="2"/></svg>',
    lp: '<svg viewBox="0 0 200 200" fill="none" aria-hidden="true"><rect x="34" y="34" width="118" height="118" stroke="#1c3a60" stroke-width="2.5"/><circle cx="122" cy="93" r="58" stroke="#1c3a60" stroke-width="2.5"/><circle cx="122" cy="93" r="26" stroke="#1c3a60" stroke-width="1.6"/><circle cx="122" cy="93" r="6" fill="#1c3a60"/></svg>',
    cd: '<svg viewBox="0 0 200 200" fill="none" aria-hidden="true"><rect x="32" y="32" width="136" height="136" rx="4" stroke="#1c3a60" stroke-width="2.5"/><path d="M46 32v136" stroke="#1c3a60" stroke-width="2"/><circle cx="108" cy="100" r="50" stroke="#1c3a60" stroke-width="2.5"/><circle cx="108" cy="100" r="17" stroke="#1c3a60" stroke-width="1.6"/><circle cx="108" cy="100" r="6" fill="#1c3a60"/></svg>'
  };

  // slides + covers
  var slidesEl = $("#slides"), coversEl = $("#covers"), dotsEl = $("#dots");
  D.releases.forEach(function (r, i) {
    var links = r.links.map(function (l) {
      return '<a class="btn' + (l.solid ? " btn--solid" : "") + '" href="' + esc(l.href) + '">' + esc(l.label) + ' <span class="btn__dot"></span></a>';
    }).join("");
    var s = document.createElement("article");
    s.className = "slide" + (i === 0 ? " is-active" : "");
    s.setAttribute("role", "tabpanel");
    s.id = "slide-" + i;
    s.setAttribute("aria-label", r.artist + " — " + r.title);
    s.innerHTML =
      '<h2 class="slide__artist" data-anim>' + esc(r.artist) + '</h2>' +
      '<p class="display slide__title" data-anim>' + esc(r.title) + '</p>' +
      '<p class="lede slide__sub" data-anim>' + mark(r.blurb) + '</p>' +
      '<dl class="slide__facts" data-anim>' +
        '<div class="fact"><dt>Format</dt><dd>' + esc(r.format) + '</dd></div>' +
        '<div class="fact"><dt>Release</dt><dd>' + esc(r.date) + '</dd></div>' +
        '<div class="fact"><dt>Catalogue</dt><dd>' + esc(r.cat) + '</dd></div>' +
      '</dl>' +
      '<div class="slide__actions" data-anim>' + links + '</div>';
    slidesEl.appendChild(s);

    var c = document.createElement("div");
    c.className = "cover" + (i === 0 ? " is-active" : "");
    c.innerHTML = '<img src="' + esc(r.cover) + '" alt="Cover artwork for ' + esc(r.title) + ' by ' + esc(r.artist) + '"' + (i ? ' loading="lazy"' : '') + ' width="900" height="900" decoding="async">';
    coversEl.appendChild(c);

    var d = document.createElement("button");
    d.type = "button";
    d.setAttribute("role", "tab");
    d.setAttribute("aria-controls", "slide-" + i);
    d.setAttribute("aria-current", i === 0 ? "true" : "false");
    d.setAttribute("aria-label", "Release " + (i + 1) + ": " + r.title);
    d.innerHTML = "<i></i>";
    d.addEventListener("click", function () { go(i, i > idx ? 1 : -1); });
    dotsEl.appendChild(d);
  });

  // artists
  var ag = $("#artistsGrid");
  if (D.artists.length === 1) ag.classList.add("artists__grid--single");
  ag.innerHTML = D.artists.map(function (a, i) {
    return '<a class="artist fade-up" href="#">' +
      '<div class="artist__media"><img src="' + esc(a.img) + '" alt="' + esc(a.alt || a.name) + '" width="1000" height="1000" loading="lazy" decoding="async"><span class="artist__veil"></span></div>' +
      '<span class="artist__idx">' + String(i + 1).padStart(2, "0") + '</span>' +
      '<div class="artist__body"><h3 class="artist__name">' + esc(a.name) + '</h3>' +
      (a.tags ? '<p class="artist__tags">' + esc(a.tags) + '</p>' : '') +
      '<span class="artist__more">' + esc(a.latest) + ' <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true"><path d="M8 1l4 4-4 4M12 5H0" stroke="currentColor" stroke-width="1.2"/></svg></span></div></a>';
  }).join("");
  if (D.artists.length === 1) {
    var a0 = D.artists[0];
    var note = a0.note ? [a0.note] : [D.lorem.b, D.lorem.c];
    ag.insertAdjacentHTML("beforeend",
      '<div class="artists__note">' + note.map(function (t) { return '<p class="lede">' + esc(t) + '</p>'; }).join("") + '</div>');
  }

  // merch
  $("#merchGrid").innerHTML = D.merch.map(function (p) {
    return '<a class="product fade-up" href="#">' +
      '<div class="product__media">' + (PRODUCT_ART[p.art] || "") + '</div>' +
      '<div><div class="product__row"><h3 class="product__name">' + esc(p.name) + '</h3><span class="product__price">' + esc(p.price) + '</span></div>' +
      '<p class="product__meta" style="margin-top:.5rem">' + esc(p.meta) + '</p></div></a>';
  }).join("");

  // marquee
  var mq = $("#marquee");
  var words = D.marquee.concat(D.marquee).concat(D.marquee);
  mq.innerHTML = words.map(function (w) { return "<span>" + esc(w) + "</span>"; }).join("");

  $("#year").textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------- slider */
  var slides = $$(".slide"), covers = $$(".cover"), dots = $$("#dots button");
  var idx = 0, busy = false, timer = null, AUTO = 7000;
  var single = slides.length < 2;
  if (single) document.body.classList.add("single-release");

  function go(next, dir) {
    if (busy || next === idx) return;
    busy = true;
    dir = dir || 1;
    var out = slides[idx], inn = slides[next];
    var cOut = covers[idx], cIn = covers[next];

    inn.classList.add("is-active");
    cIn.classList.add("is-active");

    var tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: function () {
        out.classList.remove("is-active");
        cOut.classList.remove("is-active");
        gsap.set(out, { clearProps: "all" });
        gsap.set($$("[data-anim]", out), { clearProps: "all" });
        busy = false;
      }
    });

    tl.to($$("[data-anim]", out), { yPercent: -40, opacity: 0, duration: .45, stagger: .035, ease: "power2.in" }, 0)
      .to(cOut, { scale: .94, opacity: 0, duration: .6, ease: "power2.inOut" }, 0)
      .fromTo(cIn, { scale: 1.06, opacity: 0, clipPath: dir > 0 ? "inset(0% 0% 100% 0%)" : "inset(100% 0% 0% 0%)" },
        { scale: 1, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.05, ease: "expo.out" }, .12)
      .fromTo($$("[data-anim]", inn), { yPercent: 60, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: .85, stagger: .06 }, .18);

    dots[idx].setAttribute("aria-current", "false");
    dots[next].setAttribute("aria-current", "true");
    idx = next;
    restart();
  }

  function nextSlide() { if (single) return; go((idx + 1) % slides.length, 1); }
  function prevSlide() { if (single) return; go((idx - 1 + slides.length) % slides.length, -1); }
  function restart() { clearInterval(timer); if (!REDUCED && !single) timer = setInterval(nextSlide, AUTO); }

  $("#next").addEventListener("click", nextSlide);
  $("#prev").addEventListener("click", prevSlide);
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "Escape") closeMenu();
  });

  // swipe / drag
  (function () {
    var sx = 0, sy = 0, down = false;
    var hero = $(".hero");
    hero.addEventListener("pointerdown", function (e) { down = true; sx = e.clientX; sy = e.clientY; }, { passive: true });
    hero.addEventListener("pointerup", function (e) {
      if (!down) return; down = false;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) { dx < 0 ? nextSlide() : prevSlide(); }
    }, { passive: true });
    hero.addEventListener("pointercancel", function () { down = false; }, { passive: true });
    hero.addEventListener("pointerenter", function () { clearInterval(timer); });
    hero.addEventListener("pointerleave", restart);
  })();

  /* ---------------------------------------------------------------- loader */
  function boot() {
    var tl = gsap.timeline();
    var num = { v: 0 };
    tl.to(num, {
      v: 100, duration: REDUCED ? .2 : 1.15, ease: "power2.inOut",
      onUpdate: function () {
        var n = Math.round(num.v);
        $("#loaderNum").textContent = String(n).padStart(2, "0");
        gsap.set("#loaderBar", { right: (100 - n) + "%" });
      }
    })
      .to("#loader", { yPercent: -100, duration: REDUCED ? .2 : .9, ease: "expo.inOut" }, "+=.15")
      .set("#loader", { display: "none" })
      .add(heroIn, "-=.55");
  }

  function heroIn() {
    document.body.classList.add("ready");
    if (REDUCED) { gsap.set(["[data-anim]", ".cover.is-active", ".nav", ".hero__bar"], { clearProps: "all", opacity: 1 }); return; }
    gsap.from(".nav", { yPercent: -100, opacity: 0, duration: .9, ease: "expo.out" });
    gsap.from($$("[data-anim]", slides[0]), { yPercent: 70, opacity: 0, duration: 1.1, stagger: .075, ease: "expo.out" });
    gsap.from(".cover.is-active", { scale: 1.1, opacity: 0, clipPath: "inset(0% 0% 100% 0%)", duration: 1.4, ease: "expo.out" }, .1);
    gsap.from(".hero__bar", { opacity: 0, y: 24, duration: 1, ease: "power3.out", delay: .35 });
  }

  /* ---------------------------------------------------------------- smooth scroll */
  function scrollTo(target) {
    var el = document.querySelector(target);
    if (!el) return;
    var top = el.getBoundingClientRect().top + window.pageYOffset - (target === "#top" ? 0 : 72);
    window.scrollTo({ top: Math.max(0, top), behavior: REDUCED ? "auto" : "smooth" });
  }
  $$("[data-link]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var h = a.getAttribute("href");
      if (!h || h.charAt(0) !== "#") return;
      e.preventDefault();
      closeMenu();
      setTimeout(function () { scrollTo(h); }, 10);
    });
  });

  /* ---------------------------------------------------------------- menu */
  var menuOpen = false, menuTl = null;
  function openMenu() {
    menuOpen = true;
    document.body.classList.add("menu-open");
    $("#menu").setAttribute("aria-hidden", "false");
    $("#burger").setAttribute("aria-expanded", "true");
    $("#menu").style.pointerEvents = "auto";
    document.documentElement.style.overflow = "hidden";
    menuTl = gsap.timeline()
      .to("#menu", { clipPath: "inset(0 0 0% 0)", duration: .8, ease: "expo.inOut" })
      .to("#menu a span", { y: 0, duration: .7, stagger: .06, ease: "expo.out" }, "-=.4")
      .fromTo(".menu__foot", { opacity: 0 }, { opacity: 1, duration: .5 }, "-=.3");
  }
  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    document.body.classList.remove("menu-open");
    $("#menu").setAttribute("aria-hidden", "true");
    $("#burger").setAttribute("aria-expanded", "false");
    $("#menu").style.pointerEvents = "none";
    document.documentElement.style.overflow = "";
    gsap.timeline()
      .to("#menu a span", { y: "110%", duration: .35, stagger: .03, ease: "power2.in" })
      .to("#menu", { clipPath: "inset(0 0 100% 0)", duration: .6, ease: "expo.inOut" }, "-=.15");
  }
  gsap.set("#menu", { clipPath: "inset(0 0 100% 0)" });
  gsap.set("#menu a span", { y: "110%" });
  $("#burger").addEventListener("click", function () { menuOpen ? closeMenu() : openMenu(); });

  /* ---------------------------------------------------------------- scroll fx */
  ScrollTrigger.create({
    start: 60, end: 99999,
    onUpdate: function (s) { $("#nav").classList.toggle("is-stuck", s.scroll() > 60); }
  });
  gsap.to("#progress", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: .2 } });

  // split section titles into lines of words
  $$("[data-split]").forEach(function (el) {
    var html = el.innerHTML.split(/<br\s*\/?>/i).map(function (part) {
      return '<span class="line-mask"><span>' + part + "</span></span>";
    }).join("");
    el.innerHTML = html;
    gsap.from(el.querySelectorAll(".line-mask > span"), {
      yPercent: 115, duration: 1.1, stagger: .08, ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 85%" }
    });
  });

  // manifesto ladder
  gsap.from("#ladder span > i", {
    yPercent: 110, duration: 1.2, stagger: .09, ease: "expo.out",
    scrollTrigger: { trigger: "#ladder", start: "top 82%" }
  });

  // generic fade-ups
  $$(".fade-up").forEach(function (el, i) {
    gsap.from(el, {
      y: 46, opacity: 0, duration: 1, ease: "power3.out", delay: (i % 3) * .06,
      scrollTrigger: { trigger: el, start: "top 88%" }
    });
  });

  // eyebrows + ledes
  $$(".sec .eyebrow, .sec__aside, .about__copy p, .manifesto__text p, .artists__note p, .form, .merch__foot > *").forEach(function (el) {
    gsap.from(el, { y: 26, opacity: 0, duration: .9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } });
  });

  // contact rows
  $$(".chan").forEach(function (el, i) {
    gsap.from(el, { y: 34, opacity: 0, duration: .9, delay: i * .05, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } });
  });

  // about image parallax
  $$("[data-parallax] img").forEach(function (img) {
    gsap.fromTo(img, { yPercent: -7 }, {
      yPercent: 7, ease: "none",
      scrollTrigger: { trigger: img.parentNode, start: "top bottom", end: "bottom top", scrub: true }
    });
  });

  // marquee
  if (!REDUCED) {
    var oneThird = function () { return mq.scrollWidth / 3; };
    gsap.to(mq, {
      x: function () { return -oneThird(); },
      duration: 26, ease: "none", repeat: -1,
      modifiers: { x: function (x) { return (parseFloat(x) % oneThird()) + "px"; } }
    });
  }

  // hero copy drifts out on scroll
  if (!REDUCED) {
    gsap.to(".hero__grid", {
      yPercent: -8, opacity: .25, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .4 }
    });
    gsap.to("#cueLine", { scaleX: .2, repeat: -1, yoyo: true, duration: 1.4, ease: "power1.inOut" });
  }

  /* ---------------------------------------------------------------- form */
  $("#signupForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var input = $("#email");
    if (!input.checkValidity() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value)) {
      gsap.fromTo(input, { x: -8 }, { x: 0, duration: .5, ease: "elastic.out(1,0.3)" });
      input.focus();
      return;
    }
    // TODO: point this at your provider (Buttondown / Mailchimp / Formspree endpoint).
    $("#formOk").classList.add("is-on");
    gsap.fromTo("#formOk", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: .6 });
    input.value = "";
  });

  /* ---------------------------------------------------------------- go */
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  if (document.readyState === "complete") boot();
  else window.addEventListener("load", boot);
})();
