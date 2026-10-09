/*
  UD Studio — site behaviour.
  Content lives in js/config.js. This file builds the shared header, footer,
  forms and chat, and runs the animations. Every animation has a still
  fallback for reduced motion or a failed library load.
*/
(() => {
  "use strict";

  const S = window.SITE;
  const LOGO = window.UD_LOGO;
  const html = document.documentElement;
  const page = document.body.dataset.page || "";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const G = window.gsap && window.ScrollTrigger ? window.gsap : null;
  const anim = !!G && !reduce;

  html.classList.add("js");
  if (!anim) { html.classList.add("no-anim"); html.classList.remove("intro"); }
  if (G) G.registerPlugin(ScrollTrigger);

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };
  const emailMode = !!S.web3formsKey;
  const waLink = (text = "") => `https://wa.me/${S.whatsapp}${text ? "?text=" + encodeURIComponent(text) : ""}`;

  /* ───────────── Logo ───────────── */
  let logoN = 0;
  function logoSVG({ wipe = false, label = "UD Studio" } = {}) {
    const id = "lg" + (++logoN);
    const [vx, vy, vw, vh] = LOGO.viewBox.split(" ").map(Number);
    const defs = wipe ? `<defs>
        <linearGradient id="${id}g" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff"/><stop offset=".86" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
        <mask id="${id}m" maskUnits="userSpaceOnUse" x="${vx - vw}" y="${vy - vh}" width="${vw * 3}" height="${vh * 3}">
          <rect class="lg-wipe" x="${vx - vw * 1.4}" y="${vy - vh * .5}" width="${vw * 1.4}" height="${vh * 2}" fill="url(#${id}g)" transform="skewX(-18)"/>
        </mask></defs>` : "";
    return `<svg viewBox="${LOGO.viewBox}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(label)}">${defs}
      <path class="lg-ud" fill="#3d1108" fill-rule="evenodd" d="${LOGO.ud}"/>
      <path class="lg-st" fill="#c19a90" fill-rule="evenodd" d="${LOGO.studio}" ${wipe ? `mask="url(#${id}m)"` : ""}/></svg>`;
  }
  /* ───────────── Shared header, menu, footer ───────────── */
  const onHome = page === "home";
  const NAV = [
    { href: "work.html", label: "Work", key: "work" },
    { href: onHome ? "#services" : "index.html#services", label: "Services" },
    { href: onHome ? "#process" : "index.html#process", label: "Process" },
    { href: "studio.html", label: "Studio", key: "studio" },
    { href: "contact.html", label: "Contact", key: "contact" }
  ];

  function buildHeader() {
    const h = $("#site-header");
    if (!h) return;
    const cur = k => (k && (k === page || (k === "work" && page === "project")) ? ' aria-current="page"' : "");
    h.innerHTML = `
      <a class="brand" href="index.html" aria-label="UD Studio, home"><span class="brand__mark">${logoSVG()}</span><span class="brand__name">Umme's<br>Design Studio</span></a>
      <nav class="nav" aria-label="Main">
        <ul class="nav__links">${NAV.map(n => `<li><a href="${n.href}"${cur(n.key)}>${n.label}</a></li>`).join("")}</ul>
        <a class="btn btn--dark btn--sm nav__cta" href="contact.html" data-magnetic><span>Book a consultation</span></a>
        <button class="burger" aria-label="Open menu" aria-expanded="false" aria-controls="menu"><span></span><span></span></button>
      </nav>`;
    const menu = document.createElement("div");
    menu.className = "menu"; menu.id = "menu";
    menu.innerHTML = `<ul>${NAV.map((n, i) => `<li><a href="${n.href}"><small>0${i + 1}</small>${n.label}</a></li>`).join("")}</ul>
      <div class="menu__foot"><a href="tel:${S.phoneTel}">${esc(S.phoneDisplay)}</a>${S.email ? `<a href="mailto:${S.email}">${esc(S.email)}</a>` : ""}${S.instagram ? `<a href="${esc(S.instagram)}" target="_blank" rel="noopener">${esc(S.instagramHandle || "Instagram")}</a>` : ""}${S.hours ? `<span>${esc(S.hours)}</span>` : ""}</div>`;
    document.body.appendChild(menu);
    const burger = $(".burger", h);
    const setMenu = open => {
      html.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", open);
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      lenis && (open ? lenis.stop() : lenis.start());
    };
    burger.addEventListener("click", () => setMenu(!html.classList.contains("menu-open")));
    $$("a", menu).forEach(a => a.addEventListener("click", () => setMenu(false)));
    addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

    // header state on scroll
    let last = 0;
    const onScroll = y => {
      h.classList.toggle("is-scrolled", y > 30);
      h.classList.toggle("is-hidden", y > 400 && y > last && !html.classList.contains("menu-open"));
      last = y;
    };
    addEventListener("scroll", () => onScroll(scrollY), { passive: true });
    onScroll(scrollY);
  }

  function buildFooter() {
    const f = $("#site-footer");
    if (!f) return;
    const social = [["Instagram", S.instagram], ["Pinterest", S.pinterest], ["LinkedIn", S.linkedin]].filter(s => s[1]);
    f.innerHTML = `
      <div class="footer__cta">
        <h2 class="split">Have a space <em>in mind?</em></h2>
        <a class="btn btn--dark" href="contact.html" data-magnetic><span>Start your project</span><i class="btn__arrow"></i></a>
      </div>
      <div class="footer__grid">
        <div class="footer__brand"><span class="brand__mark">${logoSVG()}</span><p>${esc(S.fullName)}<br>Interior design for homes, offices, cafés and restaurants.</p></div>
        <div><h4>Visit</h4><p>${esc(S.address)}</p>${S.hours ? `<p>${esc(S.hours)}</p>` : ""}${S.mapsLink ? `<p><a href="${esc(S.mapsLink)}" target="_blank" rel="noopener">Get directions →</a></p>` : ""}</div>
        <div><h4>Talk to us</h4><ul>
          <li><a href="tel:${S.phoneTel}">${esc(S.phoneDisplay)}</a></li>
          ${S.email ? `<li><a href="mailto:${S.email}">${esc(S.email)}</a></li>` : ""}
          <li><a href="${waLink("Hello UD Studio! I'd like to talk about my space.")}" target="_blank" rel="noopener">WhatsApp us →</a></li></ul></div>
        <div><h4>Explore</h4><ul>
          ${NAV.map(n => `<li><a href="${n.href}">${n.label}</a></li>`).join("")}
          ${social.map(s => `<li><a href="${esc(s[1])}" target="_blank" rel="noopener">${s[0]} ↗</a></li>`).join("")}</ul></div>
      </div>
      <div class="footer__sig" aria-hidden="true"><span class="script">Studio</span></div>
      <div class="footer__base"><span>© ${new Date().getFullYear()} ${esc(S.fullName)}. All rights reserved.</span><span>Website by ${esc(S.builtBy)}</span></div>`;
  }

  /* ───────────── Simple data binding ───────────── */
  function bindData() {
    $$("[data-img]").forEach(el => {
      const src = S.images[el.dataset.img];
      if (src && el.tagName === "IMG") el.src = src;
    });
    $$("[data-city]").forEach(el => (el.textContent = S.city));
    $$("[data-founder]").forEach(el => (el.textContent = S.founder.name));
    $$("[data-founder-role]").forEach(el => (el.textContent = S.founder.role));
    $$("[data-founder-bio]").forEach(el => (el.innerHTML = S.founder.bio.map(p => `<p>${esc(p)}</p>`).join("")));
    $$("[data-founder-photo]").forEach(el => {
      if (S.founder.photo) { el.src = S.founder.photo; return; }
      const fig = el.closest("figure");
      fig.classList.add("founder__mark");
      fig.innerHTML = `<div class="founder__mark-in">${logoSVG()}<span>${esc(S.fullName)}</span></div>`;
    });
    $$("[data-instagram]").forEach(el => (S.instagram ? (el.href = S.instagram) : el.remove()));
    $$("[data-instagram-handle]").forEach(el => (el.textContent = S.instagramHandle || ""));
    $$("[data-pill]").forEach(el => (el.style.backgroundImage = `url("${S.images.statement[+el.dataset.pill]}")`));
    const cm = $(".curtain__mark");
    if (cm) cm.innerHTML = logoSVG();
  }

  /* ───────────── Text splitting ───────────── */
  function splitWords(el) {
    if (el.dataset.split) return;
    el.dataset.split = 1;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            const w = document.createElement("span"); w.className = "w";
            const i = document.createElement("span"); i.textContent = part;
            w.appendChild(i); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
    };
    walk(el);
  }

  /* ───────────── Smooth scroll ───────────── */
  let lenis = null;
  function initScroll() {
    if (!anim || !window.Lenis) return;
    lenis = new Lenis({ lerp: 0.095, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    G.ticker.add(t => lenis.raf(t * 1000));
    G.ticker.lagSmoothing(0);
  }
  function scrollToEl(target) {
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: -60, duration: 1.6 });
    else target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const t = a.getAttribute("href") === "#" ? null : $(a.getAttribute("href"));
    if (t) { e.preventDefault(); scrollToEl(t); }
  });

  /* ───────────── Page transitions ───────────── */
  function initTransitions() {
    const c = $(".curtain");
    if (!c) return;
    if (html.classList.contains("arriving")) {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        html.classList.add("curtain-out");
        setTimeout(() => { c.style.transition = "none"; html.classList.remove("arriving", "curtain-out"); void c.offsetWidth; c.style.transition = ""; }, 950);
      }));
    }
    if (reduce) return;
    document.addEventListener("click", e => {
      const a = e.target.closest("a[href]");
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || /^(mailto|tel):/.test(a.getAttribute("href"))) return;
      if (url.pathname === location.pathname && url.hash) return; // same-page anchor
      e.preventDefault();
      store.set("ud-nav", "1");
      c.classList.add("is-cover");
      setTimeout(() => (location.href = url.href), 620);
    });
    addEventListener("pageshow", e => { if (e.persisted) c.classList.remove("is-cover"); });
  }

  /* ───────────── Intro: draw, sign, open the doors ───────────── */
  function runIntro(done) {
    const loader = $("#loader");
    if (!loader || !html.classList.contains("intro") || !anim) { loader && loader.remove(); done(); return; }
    store.set("ud-intro", "1");
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    scrollTo(0, 0);
    document.body.classList.add("is-locked");
    lenis && lenis.stop();
    const box = $("#loader-logo");
    box.innerHTML = logoSVG({ wipe: true });
    const ud = $(".lg-ud", box), wipe = $(".lg-wipe", box);
    const cap = $(".loader__caption", loader);
    cap.innerHTML = [...cap.textContent].map(ch => `<span class="ch">${ch === " " ? "&nbsp;" : esc(ch)}</span>`).join("");
    const len = ud.getTotalLength ? ud.getTotalLength() : 20000;
    const [, , vw] = LOGO.viewBox.split(" ").map(Number);

    G.set(ud, { attr: { stroke: "#3d1108", "stroke-width": 7, "stroke-dasharray": len, "stroke-dashoffset": len }, fillOpacity: 0 });
    let finished = false;
    const finish = () => {
      if (finished) return; finished = true;
      document.body.classList.remove("is-locked");
      lenis && lenis.start();
      loader.remove();
      html.classList.remove("intro");
    };
    const tl = G.timeline({ onComplete: finish });
    tl.to(ud, { attr: { "stroke-dashoffset": 0 }, duration: 1.5, ease: "power2.inOut" })
      .to(ud, { fillOpacity: 1, duration: .6, ease: "power1.out" }, "-=.35")
      .to(ud, { attr: { "stroke-width": 0 }, duration: .4 }, "<")
      .to(wipe, { attr: { x: "+=" + vw * 1.55 }, duration: 1.25, ease: "power1.inOut" }, "-=.25")
      .to($$(".ch", cap), { opacity: 1, y: 0, duration: .5, stagger: .025, ease: "power2.out" }, "-=.7")
      .add(() => loader.classList.add("is-doors"), "+=.2")
      .to(".loader__mark", { scale: .92, opacity: 0, duration: .6, ease: "power2.in" }, "+=.25")
      .add(() => done(), "-=.15")
      .to(".loader__door--l", { xPercent: -101, duration: 1.2, ease: "expo.inOut" }, "-=.2")
      .to(".loader__door--r", { xPercent: 101, duration: 1.2, ease: "expo.inOut" }, "<");
    loader.addEventListener("click", () => tl.progress(.9).timeScale(3), { once: true });
    setTimeout(() => { if (!finished) { tl.progress(1); } }, 9000);
  }

  /* ───────────── Hero: night view ⟷ day view, switched by a light switch ───────────── */
  function initLightsHero() {
    const hero = $(".hero"), room = $("#room");
    if (!hero || !room) return;
    const H = S.hero || {};
    const src = H.image || S.images.sketch;
    const scene = $(".room__scene", room), img = $(".room__img", room), linesImg = $(".room__lines", room);
    img.src = src;
    // optional video for the day view; the still above still draws the night view
    let vid = null;
    if (H.video) {
      vid = document.createElement("video");
      vid.className = "room__img";
      vid.muted = true; vid.loop = true; vid.playsInline = true;
      vid.setAttribute("playsinline", ""); vid.setAttribute("muted", "");
      vid.preload = "auto"; vid.poster = src; vid.src = H.video;
      vid.setAttribute("aria-label", img.alt);
      img.replaceWith(vid);
      room.classList.add("has-video");
    }
    const lights = H.lights || [];
    const main = lights.find(l => !l.soft) || { x: 50, y: 35 };
    room.style.setProperty("--lx", main.x + "%");
    room.style.setProperty("--ly", main.y + "%");
    $(".room__lights", room).innerHTML = lights.map(l =>
      `<i class="${l.soft ? "is-soft" : ""}" style="left:${l.x}%;top:${l.y}%;--s:${l.size || 30}"></i>`).join("");

    // night view: the same photo redrawn as glowing gold lines (canvas where supported)
    const cv = document.createElement("canvas"), ctx = cv.getContext("2d");
    if (ctx && "filter" in ctx) {
      const paint = () => {
        const r = scene.getBoundingClientRect();
        if (!r.width || !img.naturalWidth) return;
        const dpr = Math.min(devicePixelRatio || 1, 2);
        cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
        const k = Math.max(cv.width / img.naturalWidth, cv.height / img.naturalHeight);
        const w = img.naturalWidth * k, h = img.naturalHeight * k;
        ctx.filter = "url(#nightlines)";
        ctx.drawImage(img, (cv.width - w) / 2, (cv.height - h) / 2, w, h);
      };
      cv.className = "room__lines"; cv.setAttribute("aria-hidden", "true");
      const go = () => { linesImg.replaceWith(cv); paint(); };
      if (img.complete && img.naturalWidth) go(); else img.addEventListener("load", go, { once: true });
      let t; addEventListener("resize", () => { clearTimeout(t); t = setTimeout(paint, 200); });
    } else linesImg.src = src;

    const sw = $(".switch", hero), hint = $(".switch__hint", hero);
    let timer;
    const set = (on, flicker = true) => {
      hero.classList.toggle("is-on", on);
      if (vid) {
        if (on && !reduce) { try { vid.currentTime = 0; } catch (e) { /* not loaded yet */ } vid.play().catch(() => {}); }
        else if (!on) setTimeout(() => !hero.classList.contains("is-on") && vid.pause(), 1100);
      }
      sw.setAttribute("aria-pressed", on);
      sw.setAttribute("aria-label", on ? "Switch to the night view" : "Switch to the day view");
      hint.textContent = on ? "Tap for night view" : "Tap for day view";
      hero.classList.remove("is-flicker");
      if (on && flicker && !reduce) {
        void hero.offsetWidth; hero.classList.add("is-flicker");
        clearTimeout(timer); timer = setTimeout(() => hero.classList.remove("is-flicker"), 1600);
      }
    };
    const toggle = () => { hero.classList.add("is-touched"); set(!hero.classList.contains("is-on")); };
    sw.addEventListener("click", toggle);
    $(".room__mode", room).addEventListener("click", toggle);
    if (!anim) { set(true, false); return; }

    initLightsHero.play = () => {
      const outline = $(".arch-outline path", hero);
      const ol = outline.getTotalLength();
      G.set(outline, { strokeDasharray: ol, strokeDashoffset: ol });
      G.timeline({ defaults: { ease: "expo.out" } })
        .from(".hero__title .line__in:not(.script)", { yPercent: 115, duration: 1.4, stagger: .1 })
        .to(".hero__title .script", { clipPath: "inset(-20% 0% -40% 0%)", duration: 1.4, ease: "power2.inOut" }, "-=.7")
        .to(".hero__eyebrow, .hero .reveal", { opacity: 1, y: 0, duration: 1.1, stagger: .08 }, .3)
        .from(room, { clipPath: "inset(100% 0% 0% 0% round 300px 300px 6px 6px)", duration: 1.6, ease: "expo.inOut" }, .1)
        .from(scene, { scale: 1.2, duration: 2.6 }, .1)
        .to(outline, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut" }, .3)
        .from(".room__mode", { opacity: 0, y: -10, duration: .8 }, 1.2)
        .from(sw, { scale: 0, rotate: -30, duration: .9, ease: "back.out(2)" }, 1.4)
        .add(() => sw.classList.add("is-press"), 2.6)
        .add(() => { sw.classList.remove("is-press"); set(true); }, 2.75);
    };
    G.set(".hero__eyebrow", { opacity: 0, y: 20 });
    G.to(scene, { yPercent: 6, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
  }

  /* ───────────── Latest reel in a phone frame ───────────── */
  function initReel() {
    const sec = $("#reel");
    if (!sec) return;
    const P = S.reel && S.projects.find(p => p.slug === S.reel.project);
    if (!P || !P.video || !P.video.src) { sec.remove(); return; }
    const v = $(".phone__video", sec);
    v.src = P.video.src; v.poster = P.video.poster || "";
    $("[data-reel-title]", sec).textContent = P.summary;
    $("[data-reel-sound]", sec).setAttribute("data-video", P.slug);
    if ("IntersectionObserver" in window && !reduce) {
      new IntersectionObserver(es => es.forEach(e => (e.isIntersecting ? v.play().catch(() => {}) : v.pause())), { threshold: .35 }).observe(v);
    }
    if (anim) {
      G.from($(".phone", sec), { y: 140, rotate: 7, opacity: 0, duration: 1.5, ease: "expo.out", scrollTrigger: { trigger: sec, start: "top 72%" } });
      G.from($(".reel__glow", sec), { scale: .4, opacity: 0, duration: 2, ease: "power2.out", scrollTrigger: { trigger: sec, start: "top 72%" } });
    }
  }

  /* ───────────── Sketch ⟷ finished room slider ───────────── */
  function initCompare() {
    $$("[data-compare]").forEach(ba => {
      const photo = $(".ba__photo", ba), wrap = $(".ba__sketch-wrap", ba), draw = $(".ba__draw", ba), handle = $(".ba__handle", ba);
      let x = anim ? 100 : 50, dragging = false;
      const state = { x };
      const setX = v => { x = Math.max(0, Math.min(100, v)); ba.style.setProperty("--x", x + "%"); handle.setAttribute("aria-valuenow", Math.round(x)); };
      setX(x);

      // draw the sketch once onto a canvas where supported (cheaper than a live filter)
      const sketchImg = $(".ba__sketch", ba);
      const cv = document.createElement("canvas"), ctx = cv.getContext("2d");
      if (ctx && "filter" in ctx) {
        const paint = () => {
          const r = wrap.getBoundingClientRect();
          if (!r.width || !photo.naturalWidth) return;
          const dpr = Math.min(devicePixelRatio || 1, 2);
          cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
          const k = Math.max(cv.width / photo.naturalWidth, cv.height / photo.naturalHeight) * 1.08;
          const w = photo.naturalWidth * k, h = photo.naturalHeight * k;
          ctx.filter = "url(#sketch)";
          ctx.drawImage(photo, (cv.width - w) / 2, (cv.height - h) / 2, w, h);
        };
        cv.className = "ba__sketch"; cv.setAttribute("aria-hidden", "true");
        const go = () => { sketchImg.replaceWith(cv); paint(); };
        if (photo.complete && photo.naturalWidth) go(); else photo.addEventListener("load", go, { once: true });
        let t; addEventListener("resize", () => { clearTimeout(t); t = setTimeout(paint, 200); });
      }

      const fromEvent = e => { const r = ba.getBoundingClientRect(); setX(((e.clientX - r.left) / r.width) * 100); };
      ba.addEventListener("pointerdown", e => { dragging = true; ba.setPointerCapture(e.pointerId); fromEvent(e); G && G.killTweensOf(state); });
      ba.addEventListener("pointermove", e => dragging && fromEvent(e));
      ba.addEventListener("pointerup", () => (dragging = false));
      ba.addEventListener("pointercancel", () => (dragging = false));
      handle.addEventListener("keydown", e => {
        if (e.key === "ArrowLeft") { setX(x - 5); e.preventDefault(); }
        if (e.key === "ArrowRight") { setX(x + 5); e.preventDefault(); }
      });
      if (!anim) return;
      const bits = $$(".ba__handle, .ba__tag", ba);
      G.set(draw, { clipPath: "inset(0% 0% 100% 0%)" });
      G.set(bits, { opacity: 0 });
      ScrollTrigger.create({ trigger: ba, start: "top 72%", once: true, onEnter: () => {
        G.timeline()
          .to(draw, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "power1.inOut" })
          .to(state, { x: 50, duration: 1.6, ease: "expo.inOut", onUpdate: () => !dragging && setX(state.x) }, "+=.1")
          .to(bits, { opacity: 1, duration: .5, stagger: .08 }, "-=.7");
      } });
    });
  }

  /* ───────────── Generic reveals ───────────── */
  function initReveals() {
    if (!anim) return;
    $$(".split").forEach(el => {
      splitWords(el);
      G.from($$(".w > span", el), { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: .05, scrollTrigger: { trigger: el, start: "top 86%" } });
    });
    $$(".reveal").forEach(el => {
      if (el.closest(".hero")) return;
      G.to(el, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } });
    });
    $$(".arch-img img, .work-card__img img").forEach(img => {
      G.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });
    $$(".arch-img").forEach(el => {
      G.from(el, { clipPath: "inset(100% 0% 0% 0% round 300px 300px 6px 6px)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 80%" } });
    });
  }

  /* ───────────── Statement: words light up as you read ───────────── */
  function initStatement() {
    const el = $("[data-words]");
    if (!el) return;
    // wrap words, keep pills
    [...el.childNodes].forEach(n => {
      if (n.nodeType !== 3) return;
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(p => {
        if (!p) return;
        if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(" "));
        else { const s = document.createElement("span"); s.className = "word"; s.textContent = p; frag.appendChild(s); }
      });
      n.replaceWith(frag);
    });
    if (!anim) return;
    const items = $$(".word, .pill", el);
    const tl = G.timeline({ scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 45%", scrub: .6 } });
    items.forEach((it, i) => {
      if (it.classList.contains("pill")) tl.to(it, { scaleX: 1, duration: 1.2, ease: "power2.out" }, i * .35);
      else tl.to(it, { opacity: 1, duration: .6 }, i * .35);
    });
  }

  /* ───────────── Featured projects ───────────── */
  function playButton(label = "Watch the walkthrough · Play film · ") {
    return `<svg class="ring" viewBox="0 0 120 120" aria-hidden="true"><defs><path id="pr${++logoN}" d="M60 60 m-48 0 a48 48 0 1 1 96 0 a48 48 0 1 1 -96 0"/></defs><text><textPath href="#pr${logoN}" textLength="296" lengthAdjust="spacing">${label}</textPath></text></svg><span class="tri"></span>`;
  }
  function initFeatured() {
    const box = $("#featured");
    if (!box) return;
    box.innerHTML = S.projects.slice(0, 2).map((p, i) => {
      const imgs = p.rooms.map((r, ri) => `<img src="${r.images[0]}" alt="${esc(r.name)}, ${esc(p.name)}" loading="lazy" data-room="${ri}"${ri === 0 ? ' class="is-on"' : ""}>`).join("");
      return `<article class="feature" data-slug="${p.slug}">
        <div class="feature__media">
          <a class="feature__frame" href="project.html?p=${p.slug}" data-cursor="View" aria-label="View ${esc(p.name)}">${imgs}<span class="feature__room-label">${esc(p.rooms[0].name)}</span><span class="drape drape--l" aria-hidden="true"></span><span class="drape drape--r" aria-hidden="true"></span></a>
          <button class="feature__play" data-video="${p.slug}" aria-label="Watch the walkthrough of ${esc(p.name)}">${playButton()}</button>
        </div>
        <div class="feature__info">
          <span class="feature__num">${String(i + 1).padStart(2, "0")} / ${esc(p.kind)}</span>
          <h3 class="feature__title split">${esc(p.name)}</h3>
          <p class="feature__meta">${[p.type, p.location, p.area].filter(Boolean).map(x => `<span>${esc(x)}</span>`).join("")}</p>
          <p class="feature__summary reveal">${esc(p.summary)}</p>
          <div class="tabs reveal" role="tablist" aria-label="Rooms">${p.rooms.map((r, ri) => `<button class="tab" role="tab" aria-selected="${ri === 0}" data-room="${ri}">${esc(r.name)}</button>`).join("")}</div>
          <p class="feature__palette reveal">Palette ${p.palette.map(c => `<i style="--c:${c}"></i>`).join("")}</p>
          <a class="link-arrow reveal" href="project.html?p=${p.slug}">View the project</a>
        </div>
      </article>`;
    }).join("");

    $$(".feature", box).forEach(f => {
      const p = S.projects.find(x => x.slug === f.dataset.slug);
      const label = $(".feature__room-label", f);
      const tabs = $$(".tab", f), frame = $(".feature__frame", f);
      let cur = 0;
      const showRoom = ri => {
        cur = (ri + p.rooms.length) % p.rooms.length;
        tabs.forEach((b, k) => b.setAttribute("aria-selected", k === cur));
        $$("img", frame).forEach(im => im.classList.toggle("is-on", +im.dataset.room === cur));
        label.textContent = p.rooms[cur].name;
        tabs[cur].scrollIntoView({ block: "nearest", inline: "center", behavior: reduce ? "auto" : "smooth" });
      };
      tabs.forEach((t, k) => t.addEventListener("click", () => showRoom(k)));
      // swipe the photo to move between rooms
      let sx = null, moved = false;
      frame.addEventListener("pointerdown", e => { sx = e.clientX; moved = false; });
      frame.addEventListener("pointerup", e => {
        if (sx === null) return;
        const dx = e.clientX - sx; sx = null;
        if (Math.abs(dx) > 40) { moved = true; showRoom(cur + (dx < 0 ? 1 : -1)); }
      });
      frame.addEventListener("click", e => { if (moved) { e.preventDefault(); moved = false; } });
      frame.addEventListener("dragstart", e => e.preventDefault());
      if (!anim) return;
      // the curtains open onto the room
      G.timeline({ scrollTrigger: { trigger: frame, start: "top 72%" } })
        .to($$(".drape", frame), { scaleX: 0, duration: 2.1, ease: "power3.inOut" })
        .from($$("img", frame), { scale: 1.18, duration: 2.6, ease: "power2.out" }, 0)
        .from(label, { opacity: 0, y: -10, duration: .6 }, 1.4);
      G.fromTo($$("img", frame), { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true } });
      G.from($(".feature__play", f), { scale: 0, rotate: -90, duration: 1.2, ease: "back.out(1.6)", scrollTrigger: { trigger: frame, start: "center 70%" } });
      G.from($$(".feature__meta span, .feature__num", f), { opacity: 0, y: 14, stagger: .06, duration: .8, scrollTrigger: { trigger: f, start: "top 70%" } });
    });
  }

  /* ───────────── Services: picture lights switch on over each card ───────────── */
  function initServiceCards() {
    const cards = $$(".svc-card");
    if (!cards.length) return;
    cards.forEach((c, i) => { const im = $("img", c); if (im) im.src = S.images.services[c.dataset.img]; c.style.setProperty("--i", i % 4); });
    if (!("IntersectionObserver" in window) || reduce) { cards.forEach(c => c.classList.add("is-lit")); return; }
    const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle("is-lit", e.isIntersecting)), { threshold: .55 });
    cards.forEach(c => io.observe(c));
  }

  /* ───────────── Gallery: sample work by room ───────────── */
  const CATS = ["Living", "Bedroom", "Kitchen", "Dining", "Kids & study", "Entrance & details"];
  const CAT_LABEL = { Living: "Living rooms", Bedroom: "Bedrooms", Kitchen: "Kitchens", Dining: "Dining", "Kids & study": "Kids & study", "Entrance & details": "Entrances & details" };
  const catOf = n => /living/i.test(n) ? "Living" : /bed|wardrobe/i.test(n) ? "Bedroom" : /kitchen/i.test(n) ? "Kitchen" : /dining/i.test(n) ? "Dining" : /kid|study/i.test(n) ? "Kids & study" : "Entrance & details";
  function galleryItems() {
    const out = [];
    S.projects.forEach(p => p.rooms.forEach(r => r.images.forEach(src => out.push({ src, cat: r.category || catOf(r.name), label: r.name, project: p.name }))));
    (S.gallery || []).forEach(g => out.push({ ...g, cat: g.cat || catOf(g.label || "") }));
    // interleave rooms so the first screen shows variety
    const by = CATS.map(c => out.filter(o => o.cat === c));
    const mixed = [];
    for (let i = 0; by.some(b => b[i]); i++) by.forEach(b => b[i] && mixed.push(b[i]));
    return mixed;
  }
  function initGallery() {
    const grid = $("#gallery"), chips = $("#gallery-chips"), more = $("#gallery-more");
    if (!grid) return;
    const items = galleryItems();
    const cats = ["All", ...CATS.filter(c => items.some(i => i.cat === c))];
    chips.innerHTML = cats.map((c, i) => `<button class="chip-btn" type="button" role="tab" aria-selected="${!i}" data-cat="${c}">${c === "All" ? "All rooms" : CAT_LABEL[c]}<sup>${c === "All" ? items.length : items.filter(x => x.cat === c).length}</sup></button>`).join("");
    let cat = "All", limit = 8;
    const io = anim && "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { threshold: .15 }) : null;
    const render = () => {
      const list = items.filter(i => cat === "All" || i.cat === cat);
      const shown = list.slice(0, limit);
      grid.innerHTML = shown.map((it, k) => `<button class="g-item g-item--${k % 5}" type="button" style="--d:${(k % 4) * .08}s" aria-label="Open photo: ${esc(it.label)}"><img src="${it.src}" alt="${esc(it.label)}${it.project ? ", " + esc(it.project) : ""}" loading="lazy"><span class="g-item__tag"><b>${esc(it.label)}</b>${it.project ? `<small>${esc(it.project)}</small>` : ""}</span></button>`).join("");
      $$(".g-item", grid).forEach((b, k) => {
        b.addEventListener("click", () => openLightbox(list, k));
        io ? io.observe(b) : b.classList.add("is-in");
      });
      more.parentElement.hidden = list.length <= limit;
      if (G) requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    chips.addEventListener("click", e => {
      const b = e.target.closest(".chip-btn");
      if (!b) return;
      cat = b.dataset.cat; limit = 8;
      $$(".chip-btn", chips).forEach(x => x.setAttribute("aria-selected", x === b));
      b.scrollIntoView({ block: "nearest", inline: "center", behavior: reduce ? "auto" : "smooth" });
      render();
    });
    more.addEventListener("click", () => { limit += 8; render(); });
    render();
  }

  /* ───────────── Full-screen photo viewer ───────────── */
  let lb = null;
  function openLightbox(list, i) {
    if (!lb) {
      lb = document.createElement("div");
      lb.className = "lb"; lb.hidden = true;
      lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Photo viewer");
      lb.innerHTML = `<button class="lb__close" aria-label="Close"><span></span></button>
        <button class="lb__nav lb__nav--prev" aria-label="Previous photo"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button>
        <button class="lb__nav lb__nav--next" aria-label="Next photo"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>
        <figure class="lb__fig"><img alt=""><figcaption></figcaption></figure><span class="lb__count"></span>`;
      document.body.appendChild(lb);
      const img = $("img", lb), cap = $("figcaption", lb), count = $(".lb__count", lb);
      lb.show = k => {
        lb.i = (k + lb.list.length) % lb.list.length;
        const it = lb.list[lb.i];
        img.classList.remove("is-in"); void img.offsetWidth;
        img.src = it.src.replace(/w=\d+/, "w=2000"); img.alt = it.label;
        img.classList.add("is-in");
        cap.innerHTML = `<b>${esc(it.label)}</b>${it.project ? ` · ${esc(it.project)}` : ""}`;
        count.textContent = `${lb.i + 1} / ${lb.list.length}`;
      };
      const close = () => { lb.classList.remove("is-open"); setTimeout(() => (lb.hidden = true), 350); lenis && lenis.start(); document.body.classList.remove("is-locked"); };
      $(".lb__close", lb).addEventListener("click", close);
      $(".lb__nav--prev", lb).addEventListener("click", () => lb.show(lb.i - 1));
      $(".lb__nav--next", lb).addEventListener("click", () => lb.show(lb.i + 1));
      lb.addEventListener("click", e => { if (e.target === lb || e.target.classList.contains("lb__fig")) close(); });
      addEventListener("keydown", e => {
        if (lb.hidden) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowRight") lb.show(lb.i + 1);
        if (e.key === "ArrowLeft") lb.show(lb.i - 1);
      });
      let sx = null;
      lb.addEventListener("pointerdown", e => (sx = e.clientX));
      lb.addEventListener("pointerup", e => { if (sx === null) return; const dx = e.clientX - sx; sx = null; if (Math.abs(dx) > 45) lb.show(lb.i + (dx < 0 ? 1 : -1)); });
    }
    lb.list = list;
    lb.hidden = false;
    lb.show(i);
    requestAnimationFrame(() => lb.classList.add("is-open"));
    lenis && lenis.stop();
    document.body.classList.add("is-locked");
    $(".lb__close", lb).focus();
  }

  /* ───────────── Process: floor plan builds itself ───────────── */
  function planSVG(layer) {
    const WALLS = "M60 400 H20 V20 H580 V400 H110 M360 20 V70 M360 140 V180 H380 M440 180 H580 M360 260 V400 M360 260 H380 M430 260 H580 M470 180 V200 M470 240 V260";
    if (layer === "wall") {
      return `<svg viewBox="0 0 600 420" aria-hidden="true"><path d="${WALLS}" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="square"/></svg>`;
    }
    const fur = (d, extra = "") => `<g class="fx" ${extra}>${d}</g>`;
    const F = 'fill="#FFFDFB" stroke="#3d1108" stroke-width="1.3"';
    return `<svg viewBox="0 0 600 420" aria-hidden="true">
      <defs>
        <pattern id="pOak" width="90" height="14" patternUnits="userSpaceOnUse"><rect width="90" height="7" fill="#D7B48D"/><rect y="7" width="90" height="7" fill="#CFAA81"/><path d="M0 .4H90M0 7.4H90M38 0V7M74 7V14M14 7V14" stroke="#B88E64" stroke-width=".7"/></pattern>
        <pattern id="pMarble" width="120" height="120" patternUnits="userSpaceOnUse"><rect width="120" height="120" fill="#EEEAE4"/><path d="M-5 30 C30 20 50 60 125 40 M10 120 C30 80 70 95 90 60 S120 40 125 20" fill="none" stroke="#CFC5BA" stroke-width=".8"/></pattern>
        <pattern id="pTile" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#E5D7C5"/><path d="M0 .3H20M.3 0V20" stroke="#CDBBA4" stroke-width=".7"/></pattern>
        <pattern id="pLinen" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#EBD8CE"/><path d="M0 .5H5M.5 0V5" stroke="#E0C8BB" stroke-width=".6"/></pattern>
        <radialGradient id="pGlow"><stop offset="0" stop-color="#FFC77A" stop-opacity=".9"/><stop offset=".45" stop-color="#FFB561" stop-opacity=".35"/><stop offset="1" stop-color="#FFB561" stop-opacity="0"/></radialGradient>
        <mask id="pFlowM"><path class="flow-draw" d="M85 392 C110 330 160 300 185 262 C210 220 300 230 330 220 C350 214 380 222 410 220 M330 220 C380 240 400 250 405 290" fill="none" stroke="#fff" stroke-width="6"/></mask>
      </defs>
      <rect width="600" height="420" fill="#FFFDFB" opacity=".0"/>
      <g class="floors">
        <rect x="20" y="20" width="340" height="380" fill="url(#pOak)"/>
        <rect x="360" y="180" width="110" height="80" fill="url(#pOak)"/>
        <rect x="360" y="20" width="220" height="160" fill="url(#pMarble)"/>
        <rect x="470" y="180" width="110" height="80" fill="url(#pTile)"/>
        <rect x="360" y="260" width="220" height="140" fill="url(#pLinen)"/>
      </g>
      <g class="grid"><path d="${Array.from({ length: 29 }, (_, i) => `M${20 + i * 20} 20V400`).join("")}${Array.from({ length: 19 }, (_, i) => `M20 ${20 + i * 20}H580`).join("")}" stroke="#C19A90" stroke-opacity=".22" stroke-width=".5"/></g>
      <g class="dims" fill="none" stroke="#9E6E61" stroke-width=".8">
        <path d="M20 6H580M20 2V10M580 2V10M6 20V400M2 20H10M2 400H10"/>
        <rect x="270" y="0" width="60" height="12" fill="#FBF7F3" stroke="none"/><text x="300" y="9" text-anchor="middle" font-size="9" fill="#9E6E61" stroke="none" font-family="Manrope" letter-spacing="1">11.2 m</text>
        <g transform="translate(6 210) rotate(-90)"><rect x="-26" y="-6" width="52" height="12" fill="#FBF7F3" stroke="none"/><text y="3" text-anchor="middle" font-size="9" fill="#9E6E61" stroke="none" font-family="Manrope" letter-spacing="1">7.6 m</text></g>
      </g>
      <g class="rug">${fur('<rect x="60" y="228" width="250" height="148" rx="4" fill="#EBD8D0" opacity=".8"/>')}</g>
      <g class="furniture">
        ${fur(`<rect x="120" y="60" width="130" height="62" rx="6" ${F}/>`)}
        ${[135, 174, 213].map(x => fur(`<rect x="${x}" y="44" width="22" height="12" rx="4" ${F}/>`) + fur(`<rect x="${x}" y="126" width="22" height="12" rx="4" ${F}/>`)).join("")}
        ${fur(`<rect x="80" y="330" width="210" height="36" rx="8" ${F}/><rect x="80" y="362" width="210" height="14" rx="5" fill="#E7DBCF" stroke="#3d1108" stroke-width="1.3"/><path d="M150 334V362M220 334V362" stroke="#3d1108" stroke-width=".8"/>`)}
        ${fur(`<circle cx="185" cy="290" r="24" ${F}/><circle cx="185" cy="290" r="15" fill="none" stroke="#C19A90" stroke-width=".8"/>`)}
        ${fur(`<rect x="72" y="240" width="44" height="44" rx="12" ${F}/>`)}${fur(`<rect x="254" y="240" width="44" height="44" rx="12" ${F}/>`)}
        ${fur(`<circle cx="44" cy="44" r="13" fill="#7D7F63" opacity=".75"/><path d="M44 32V56M32 44H56M36 36L52 52M52 36L36 52" stroke="#FBF7F3" stroke-width=".8"/>`)}
        ${fur(`<circle cx="336" cy="378" r="11" fill="#7D7F63" opacity=".75"/>`)}
        ${fur(`<rect x="366" y="26" width="208" height="26" ${F}/><rect x="548" y="26" width="26" height="148" ${F}/><circle cx="398" cy="39" r="5" fill="none" stroke="#3d1108"/><circle cx="414" cy="39" r="5" fill="none" stroke="#3d1108"/><rect x="470" y="30" width="34" height="18" rx="6" fill="none" stroke="#3d1108"/>`)}
        ${fur(`<rect x="396" y="92" width="120" height="40" rx="4" ${F}/>`)}
        ${[420, 456, 492].map(x => fur(`<circle cx="${x}" cy="150" r="8" ${F}/>`)).join("")}
        ${fur(`<rect x="476" y="186" width="46" height="18" rx="3" ${F}/><ellipse cx="499" cy="195" rx="10" ry="5" fill="none" stroke="#3d1108" stroke-width=".8"/>`)}
        ${fur(`<rect x="548" y="190" width="24" height="30" rx="10" ${F}/>`)}
        ${fur(`<rect x="528" y="226" width="46" height="30" fill="none" stroke="#3d1108" stroke-width="1" stroke-dasharray="3 3"/>`)}
        ${fur(`<rect x="452" y="282" width="120" height="100" rx="6" ${F}/><rect x="546" y="292" width="18" height="36" rx="4" fill="#EBD8D0" stroke="#3d1108"/><rect x="546" y="336" width="18" height="36" rx="4" fill="#EBD8D0" stroke="#3d1108"/><path d="M500 282V382" stroke="#C19A90" stroke-width="1"/>`)}
        ${fur(`<rect x="366" y="328" width="24" height="68" ${F}/><path d="M366 351H390M366 374H390" stroke="#3d1108" stroke-width=".8"/>`)}
      </g>
      <path class="flow" d="M85 392 C110 330 160 300 185 262 C210 220 300 230 330 220 C350 214 380 222 410 220 M330 220 C380 240 400 250 405 290" fill="none" stroke="#9E6E61" stroke-width="1.6" stroke-dasharray="2 6" stroke-linecap="round" mask="url(#pFlowM)"/>
      <path class="walls" d="${WALLS}" fill="none" stroke="#3d1108" stroke-width="7" stroke-linecap="square"/>
      <g class="windows" stroke-linecap="butt"><path d="M90 20H230M420 20H520M20 140V300M580 290V370" stroke="#FBF7F3" stroke-width="4.4"/><path d="M90 20H230M420 20H520M20 140V300M580 290V370" stroke="#C19A90" stroke-width="1.2"/></g>
      <g class="doors" fill="none" stroke="#9E6E61" stroke-width="1.1"><path d="M60 400V350A50 50 0 0 1 110 400"/><path d="M440 180V120A60 60 0 0 0 380 180"/><path d="M470 240H510A40 40 0 0 0 470 200"/><path d="M430 260V310A50 50 0 0 1 380 260"/></g>
      <g class="labels" font-family="Manrope" font-size="8.5" letter-spacing="2.2" fill="#7E6A63" text-anchor="middle" font-weight="600">
        <text x="185" y="170">DINING</text><text x="185" y="214">LIVING</text><text x="470" y="80">KITCHEN</text><text x="525" y="252">BATH</text><text x="420" y="300">BEDROOM</text>
      </g>
      <rect class="dusk" x="0" y="0" width="600" height="420" fill="#2A1410" opacity="0"/>
      <g class="lights" style="mix-blend-mode:screen">
        <circle cx="185" cy="91" r="70" fill="url(#pGlow)"/><circle cx="185" cy="290" r="80" fill="url(#pGlow)"/><circle cx="456" cy="112" r="64" fill="url(#pGlow)"/><circle cx="510" cy="332" r="70" fill="url(#pGlow)"/><circle cx="525" cy="220" r="40" fill="url(#pGlow)"/><circle cx="85" cy="392" r="30" fill="url(#pGlow)"/>
      </g>
    </svg>`;
  }

  function initProcess() {
    const plan = $("#plan");
    if (!plan) return;
    const LAYERS = 12;
    plan.innerHTML = planSVG() + Array.from({ length: LAYERS }, (_, i) =>
      `<div class="wall-layer" style="position:absolute;inset:0;transform:translateZ(${(i + 1) * 2.6}px);color:${i === LAYERS - 1 ? "#3d1108" : "#C2A193"}">${planSVG("wall")}</div>`).join("");
    const svg = $("svg", plan);
    const steps = $$("#steps li");
    const bar = $(".process__bar i");
    const setStep = i => steps.forEach((s, k) => s.classList.toggle("is-active", k === i));
    if (!anim) { setStep(4); G && G.set($$(".wall-layer", plan), { opacity: 1 }); $(".plan__welcome").style.clipPath = "none"; $$(".plan__swatches i").forEach(i => (i.style.transform = "scale(1)")); return; }

    const walls = $(".walls", svg);
    const wl = walls.getTotalLength();
    const flow = $(".flow-draw", svg);
    const fl = flow.getTotalLength();
    G.set(walls, { strokeDasharray: wl, strokeDashoffset: wl });
    G.set(flow, { strokeDasharray: fl, strokeDashoffset: fl });
    G.set($$(".fx", svg), { transformOrigin: "50% 50%", transformBox: "fill-box", scale: 0, opacity: 0 });
    G.set([".floors", ".windows", ".doors", ".labels", ".dims", ".lights"].map(s => $(s, svg)), { opacity: 0 });
    G.set($(".grid", svg), { opacity: 1 });

    const tl = G.timeline({ defaults: { ease: "power2.inOut" } });
    // 1 · listen & measure
    tl.to(walls, { strokeDashoffset: 0, duration: 1 }, 0)
      .to($(".dims", svg), { opacity: 1, duration: .4 }, .4)
      .to([$(".windows", svg), $(".doors", svg)], { opacity: 1, duration: .3 }, .7)
      .to($(".labels", svg), { opacity: 1, duration: .3 }, .8)
    // 2 · layout
      .to($$(".fx", svg), { scale: 1, opacity: 1, duration: .5, stagger: .035, ease: "back.out(1.7)" }, 1.1)
      .to(flow, { strokeDashoffset: 0, duration: .8 }, 1.4)
    // 3 · materials
      .to($(".grid", svg), { opacity: 0, duration: .4 }, 2.1)
      .to($(".floors", svg), { opacity: 1, duration: .7 }, 2.1)
      .to(".plan__swatches i", { scale: 1, duration: .5, stagger: .08, ease: "back.out(2)" }, 2.2)
      .to($(".dims", svg), { opacity: 0, duration: .3 }, 2.6)
    // 4 · build — tilt into 3D and raise the walls
      .to(plan, { rotateX: 56, rotateZ: -34, scale: .86, y: -10, duration: 1, ease: "power3.inOut" }, 3.05)
      .to($(".flow", svg), { opacity: 0, duration: .3 }, 3.05)
      .to(".plan__swatches i", { scale: 0, duration: .3, stagger: .04 }, 3.05)
      .to($$(".wall-layer", plan), { opacity: 1, duration: .08, stagger: .05 }, 3.35)
      .to($(".labels", svg), { opacity: 0, duration: .3 }, 3.3)
    // 5 · welcome home — evening falls, the lights come on
      .to($(".dusk", svg), { opacity: .22, duration: .5 }, 4.1)
      .to($(".lights", svg), { opacity: 1, duration: .6 }, 4.3)
      .to(".plan__welcome", { clipPath: "inset(-30% 0% -30% 0%)", duration: .8, ease: "power1.inOut" }, 4.4)
      .to({}, { duration: .4 });

    const total = tl.duration();
    ScrollTrigger.create({
      trigger: ".process", start: "top top", end: () => "+=" + innerHeight * 4.2, pin: ".process__pin", scrub: .8, animation: tl,
      onUpdate: self => {
        const t = self.progress * total;
        setStep(t < 1.05 ? 0 : t < 2.05 ? 1 : t < 3.0 ? 2 : t < 4.05 ? 3 : 4);
        bar.style.transform = `scaleX(${self.progress})`;
      }
    });
  }

  /* ───────────── Studio teaser: signature + stats ───────────── */
  function initStudio() {
    const sig = $(".signature");
    if (sig) {
      sig.innerHTML = `<span class="script" style="font-size:clamp(3.4rem,6vw,5rem);color:var(--rose-deep);display:inline-block;padding:0 .2em;clip-path:${anim ? "inset(-30% 100% -30% 0)" : "none"}">${esc(S.founder.name)}</span>`;
      if (anim) G.to($("span", sig), { clipPath: "inset(-30% 0% -30% 0%)", duration: 1.8, ease: "power1.inOut", scrollTrigger: { trigger: sig, start: "top 85%" } });
    }
    $$("#stats, [data-stats]").forEach(ul => {
      if (!S.stats.length) { ul.remove(); return; }
      ul.innerHTML = S.stats.map(s => `<li><b><span data-n="${s.value}">${anim ? 0 : s.value}</span><sup>${esc(s.suffix)}</sup></b><span>${esc(s.label)}</span></li>`).join("");
      if (!anim) return;
      $$("[data-n]", ul).forEach(n => {
        const o = { v: 0 };
        G.to(o, { v: +n.dataset.n, duration: 2, ease: "power2.out", scrollTrigger: { trigger: ul, start: "top 88%" }, onUpdate: () => (n.textContent = Math.round(o.v)) });
      });
    });
  }

  /* ───────────── Testimonials ───────────── */
  function initWords() {
    const stage = $("#words-stage"), dots = $("#words-dots");
    const T = (S.testimonials || []).filter(t => t.approved).map(t => {
      const p = S.projects.find(x => x.slug === t.project);
      return { quote: t.quote, name: S.showClientNames ? t.name : "Homeowners", place: p ? [p.type, p.location].filter(Boolean).join(", ") : "" };
    });
    if (!stage || !T.length) { stage && stage.closest("section").remove(); return; }
    stage.innerHTML = T.map((t, i) => `<figure class="quote${i ? "" : " is-on"}"><span class="quote__mark" aria-hidden="true">“</span><blockquote>${esc(t.quote)}</blockquote><figcaption><cite>${esc(t.name)}<span>${esc(t.place)}</span></cite></figcaption></figure>`).join("");
    dots.innerHTML = T.map((_, i) => `<button aria-label="Show quote ${i + 1}"${i ? "" : ' class="is-on"'}><i></i></button>`).join("");
    const qs = $$(".quote", stage), ds = $$("button", dots);
    let cur = 0, timer;
    const show = i => {
      cur = (i + qs.length) % qs.length;
      qs.forEach((q, k) => q.classList.toggle("is-on", k === cur));
      ds.forEach((d, k) => { d.classList.remove("is-on"); void d.offsetWidth; d.classList.toggle("is-on", k === cur); });
      clearTimeout(timer); timer = setTimeout(() => show(cur + 1), 7000);
    };
    ds.forEach((d, i) => d.addEventListener("click", () => show(i)));
    show(0);
  }

  /* ───────────── Contact details + enquiry form ───────────── */
  function initContact() {
    $$("[data-contact-list]").forEach(ul => {
      ul.innerHTML = `
        <li><span>Call</span><a href="tel:${S.phoneTel}">${esc(S.phoneDisplay)}</a></li>
        <li><span>WhatsApp</span><a href="${waLink("Hello UD Studio! I'd like to talk about my space.")}" target="_blank" rel="noopener">Chat with us</a></li>
        ${S.email ? `<li><span>Email</span><a href="mailto:${S.email}">${esc(S.email)}</a></li>` : ""}
        ${S.instagram ? `<li><span>Instagram</span><a href="${esc(S.instagram)}" target="_blank" rel="noopener">${esc(S.instagramHandle || "Follow us")}</a></li>` : ""}
        <li><span>Studio</span><span>${esc(S.address)}${S.mapsLink ? ` · <a href="${esc(S.mapsLink)}" target="_blank" rel="noopener">Directions</a>` : ""}</span></li>
        ${S.hours ? `<li><span>Hours</span><span>${esc(S.hours)}</span></li>` : ""}`;
    });
    $$("[data-enquiry-form]").forEach((box, n) => {
      const chips = (name, opts, type = "radio") => `<div class="chipset">${opts.map(o => `<label class="chip"><input type="${type}" name="${name}" value="${esc(o)}"><span>${esc(o)}</span></label>`).join("")}</div>`;
      box.innerHTML = `<form class="form" novalidate>
        <div class="form__row">
          <div class="field"><label for="f${n}-name">Your name</label><input id="f${n}-name" name="name" required autocomplete="name" placeholder="Full name"></div>
          <div class="field"><label for="f${n}-phone">Phone / WhatsApp</label><input id="f${n}-phone" name="phone" type="tel" required autocomplete="tel" placeholder="+91"></div>
        </div>
        <div class="field"><label for="f${n}-email">Email</label><input id="f${n}-email" name="email" type="email" autocomplete="email" placeholder="you@example.com"></div>
        <fieldset class="field chips"><legend>What are we designing?</legend>${chips("project", ["Complete home", "Kitchen", "Wardrobes", "Bedroom", "Office", "Café / restaurant", "Something else"])}</fieldset>
        <fieldset class="field chips"><legend>Property</legend>${chips("property", ["1 BHK", "2 BHK", "3 BHK", "4 BHK +", "Villa / bungalow", "Commercial space"])}</fieldset>
        <div class="form__row">
          <div class="field"><label for="f${n}-loc">Site location</label><input id="f${n}-loc" name="location" placeholder="Area, city"></div>
          <div class="field"><label for="f${n}-when">When would you like to start?</label><select id="f${n}-when" name="timeline"><option>Right away</option><option>In 1–3 months</option><option>In 3–6 months</option><option>Just exploring</option></select></div>
        </div>
        <div class="field"><label for="f${n}-msg">Tell us about your space</label><textarea id="f${n}-msg" name="message" placeholder="Size, possession date, styles you like, rooms you want done…"></textarea></div>
        <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        <div class="form__foot"><p class="form__fine">${emailMode ? "We only use your details to reply to your enquiry." : "Your enquiry opens in WhatsApp, ready to send to us."}</p><button class="btn btn--dark" type="submit"><span>${emailMode ? "Send enquiry" : "Send on WhatsApp"}</span><i class="btn__arrow"></i></button></div>
        <p class="form__status" role="status" aria-live="polite"></p>
        <div class="form__done" aria-live="polite"><div>
          <svg viewBox="0 0 100 80" aria-hidden="true"><path class="done-draw" d="M10 76V34L50 6l40 28v42M10 76h80M40 76V50h20v26M24 42h10v10H24zM66 42h10v10H66z"/></svg>
          <span class="script">Thank you</span>
          <h3>${emailMode ? "We've got your message" : "Almost there"}</h3>
          <p>${emailMode ? `We'll be in touch soon. If it's urgent, <a href="${waLink("Hi UD Studio, I just sent an enquiry from the website.")}" target="_blank" rel="noopener">message us on WhatsApp</a>.` : "Your enquiry is ready in WhatsApp. Just tap send, and we'll get back to you soon."}</p>
        </div></div>
      </form>`;
      const form = $("form", box), status = $(".form__status", form), btn = $('button[type="submit"]', form);
      form.addEventListener("submit", async e => {
        e.preventDefault();
        const d = Object.fromEntries(new FormData(form));
        if (d.botcheck) return;
        const bad = [];
        if (!d.name || d.name.trim().length < 2) bad.push(form.elements.name);
        if (!d.phone || d.phone.replace(/\D/g, "").length < 8) bad.push(form.elements.phone);
        if (d.email && !/^\S+@\S+\.\S+$/.test(d.email)) bad.push(form.elements.email);
        if (bad.length) { status.textContent = "Please add your name and a phone number we can reach you on."; bad[0].focus(); return; }
        const lines = ["Hello UD Studio! I'd like to talk about a project.", "", `Name: ${d.name}`, `Phone: ${d.phone}`, d.email ? `Email: ${d.email}` : "", `Project: ${d.project || "-"}`, `Property: ${d.property || "-"}`, `Location: ${d.location || "-"}`, `Start: ${d.timeline || "-"}`, d.message ? `\n${d.message}` : ""].filter(Boolean);
        const done = () => {
          form.classList.add("is-sent");
          const p = $(".done-draw", form);
          if (anim && p.getTotalLength) { const l = p.getTotalLength(); G.fromTo(p, { strokeDasharray: l, strokeDashoffset: l }, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut" }); }
        };
        if (!emailMode) {
          window.open(waLink(lines.join("\n")), "_blank", "noopener");
          status.textContent = "";
          setTimeout(done, 500);
          return;
        }
        if (!S.web3formsKey) {
          location.href = `mailto:${S.email}?subject=${encodeURIComponent("Website enquiry from " + d.name)}&body=${encodeURIComponent(lines.join("\n"))}`;
          status.textContent = "Your email app should open with the enquiry ready to send.";
          setTimeout(done, 800);
          return;
        }
        btn.disabled = true; status.textContent = "Sending…";
        try {
          const res = await fetch("https://api.web3forms.com/submit", {
            method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ access_key: S.web3formsKey, subject: `New enquiry: ${d.name} (${d.project || "website"})`, from_name: "UD Studio website", ...d, botcheck: undefined })
          });
          const j = await res.json();
          if (!j.success) throw new Error(j.message);
          status.textContent = ""; done(); form.reset();
        } catch (err) {
          status.innerHTML = `That didn't go through. Please try again, or <a href="${waLink(lines.join("\n"))}" target="_blank" rel="noopener">send it on WhatsApp</a>.`;
        } finally { btn.disabled = false; }
      });
    });
  }

  /* ───────────── WhatsApp chat ───────────── */
  function initWhatsApp() {
    let wa = $("#wa");
    if (!wa) { wa = document.createElement("div"); wa.className = "wa"; wa.id = "wa"; document.body.appendChild(wa); }
    const icon = `<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.8 1.2 1.2-3.7-.3-.4c-1.2-1.8-1.8-3.8-1.8-5.9C5 9.9 9.9 5.1 16 5.1s11 4.8 11 10.7-4.9 10.6-11 10.6zm6-7.9c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.3-.7.1-.3-.2-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.5c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8 0 1.6 1.2 3.2 1.4 3.4.2.2 2.4 3.6 5.8 5.1.8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 2-.8 2.2-1.6.3-.8.3-1.5.2-1.6-.1-.1-.3-.2-.6-.4z"/></svg>`;
    wa.innerHTML = `
      <div class="wa__panel" role="dialog" aria-label="Chat with UD Studio on WhatsApp">
        <div class="wa__top"><span class="wa__avatar">${logoSVG()}</span><div><b>UD Studio</b><small>Usually replies during studio hours</small></div><button class="wa__close" aria-label="Close chat"></button></div>
        <div class="wa__chat"><div class="wa__typing"><i></i><i></i><i></i></div></div>
        <div class="wa__chips">${["Design my full home", "Modular kitchen", "Office interiors", "Book a site visit"].map(c => `<button type="button">${c}</button>`).join("")}</div>
        <form class="wa__form"><label class="sr" for="wa-msg" style="position:absolute;left:-9999px">Your message</label><textarea id="wa-msg" rows="1" placeholder="Type your message…"></textarea><button class="wa__send" aria-label="Send on WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20l18-8L3 4v6l12 2-12 2z"/></svg></button></form>
      </div>
      <span class="wa__nudge">Questions? Chat with us 👋</span>
      <button class="wa__btn" aria-label="Chat on WhatsApp" aria-expanded="false">${icon}</button>`;
    const btn = $(".wa__btn", wa), ta = $("textarea", wa), chat = $(".wa__chat", wa);
    let greeted = false;
    const open = o => {
      wa.classList.toggle("is-open", o); btn.setAttribute("aria-expanded", o);
      if (o && !greeted) {
        greeted = true;
        setTimeout(() => {
          chat.innerHTML = `<div class="wa__bubble">Hello! 👋 Welcome to UD Studio.<small>now</small></div>`;
          setTimeout(() => chat.insertAdjacentHTML("beforeend", `<div class="wa__bubble">Tell us a little about your space: the rooms, the city, and when you'd like to start. Your message opens in WhatsApp, ready to send.<small>now</small></div>`), 650);
        }, 900);
      }
      if (o) setTimeout(() => ta.focus({ preventScroll: true }), 400);
    };
    btn.addEventListener("click", () => open(!wa.classList.contains("is-open")));
    document.addEventListener("click", e => { if (e.target.closest("[data-wa-open]")) open(!wa.classList.contains("is-open")); });
    $(".wa__close", wa).addEventListener("click", () => open(false));
    $$(".wa__chips button", wa).forEach(c => c.addEventListener("click", () => { ta.value = `Hi UD Studio! I'm interested in: ${c.textContent}. `; ta.focus(); }));
    ta.addEventListener("input", () => { ta.style.height = "auto"; ta.style.height = ta.scrollHeight + "px"; });
    ta.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); $(".wa__form", wa).requestSubmit(); } });
    $(".wa__form", wa).addEventListener("submit", e => {
      e.preventDefault();
      const msg = ta.value.trim() || "Hello UD Studio! I'd like to talk about my space.";
      window.open(waLink(msg), "_blank", "noopener");
    });
    setTimeout(() => { if (!wa.classList.contains("is-open")) { wa.classList.add("is-nudge"); setTimeout(() => wa.classList.remove("is-nudge"), 6000); } }, 9000);
  }

  /* ───────────── Video modal ───────────── */
  function initVideo() {
    const m = $("#vmodal");
    if (!m) return;
    const body = $(".vmodal__body", m);
    const close = () => { m.classList.remove("is-open"); setTimeout(() => { m.hidden = true; body.innerHTML = ""; }, 400); lenis && lenis.start(); };
    const openFor = p => {
      const v = p.video || {}, src = v.src || "";
      let inner;
      const yt = src.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
      if (yt) inner = `<iframe src="https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0" title="Walkthrough of ${esc(p.name)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
      else if (/instagram\.com\/(reel|p)\//.test(src)) inner = `<iframe src="${esc(src.replace(/\/?(\?.*)?$/, "/"))}embed" title="Walkthrough of ${esc(p.name)}" allowfullscreen></iframe>`;
      else if (src) inner = `<video src="${esc(src)}" poster="${esc(v.poster || "")}" controls autoplay playsinline${v.sound ? "" : " muted"}></video>`;
      else inner = `<div class="vmodal__soon" style="background-image:url('${esc(v.poster || p.cover)}')"><div><span class="script">Coming soon</span><p>A walkthrough of ${esc(p.name)}</p><small>The video is being edited. Until then, explore the photographs.</small></div></div>`;
      body.innerHTML = inner;
      body.classList.toggle("is-vertical", !!v.vertical);
      m.hidden = false; requestAnimationFrame(() => m.classList.add("is-open"));
      lenis && lenis.stop();
      $(".vmodal__close", m).focus();
    };
    document.addEventListener("click", e => {
      const b = e.target.closest("[data-video]");
      if (!b) return;
      const p = S.projects.find(x => x.slug === b.dataset.video);
      if (p) openFor(p);
    });
    $(".vmodal__close", m).addEventListener("click", close);
    m.addEventListener("click", e => { if (e.target === m) close(); });
    addEventListener("keydown", e => { if (e.key === "Escape" && !m.hidden) close(); });
  }

  /* ───────────── Cursor + magnetic buttons ───────────── */
  function initCursor() {
    const c = $(".cursor");
    if (!c || !fine || !G || reduce) return;
    const label = $(".cursor__label", c);
    const qx = G.quickTo(c, "x", { duration: .35, ease: "power3" }), qy = G.quickTo(c, "y", { duration: .35, ease: "power3" });
    addEventListener("pointermove", e => { qx(e.clientX); qy(e.clientY); c.style.opacity = 1; }, { passive: true });
    document.addEventListener("pointerleave", () => (c.style.opacity = 0));
    document.addEventListener("pointerover", e => {
      const t = e.target.closest("[data-cursor], a, button, input, textarea, select");
      const l = t && t.dataset.cursor;
      c.classList.toggle("is-label", !!l);
      c.classList.toggle("is-link", !!t && !l);
      label.textContent = l || "";
    });
    $$("[data-magnetic]").forEach(b => {
      b.addEventListener("pointermove", e => {
        const r = b.getBoundingClientRect();
        G.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .5, ease: "power3" });
      });
      b.addEventListener("pointerleave", () => G.to(b, { x: 0, y: 0, duration: .8, ease: "elastic.out(1, .4)" }));
    });
  }

  /* ───────────── Footer signature ───────────── */
  function initFooterSig() {
    const w = $(".footer__sig .script");
    if (!w || !anim) return;
    G.fromTo(w, { clipPath: "inset(-20% 100% -40% 0%)" }, { clipPath: "inset(-20% 0% -40% 0%)", ease: "none", scrollTrigger: { trigger: ".footer__sig", start: "top 100%", end: "bottom 92%", scrub: 1 } });
  }

  /* ───────────── Work page ───────────── */
  function initWorkPage() {
    const grid = $("#work-grid");
    if (!grid) return;
    grid.innerHTML = S.projects.map(p => `<a class="work-card" href="project.html?p=${p.slug}" data-cursor="View">
        <div class="work-card__img"><img src="${p.cover}" alt="${esc(p.name)}" loading="lazy"></div>
        <div class="work-card__info"><div><h2>${esc(p.name)}</h2><p>${esc(p.type)} · ${esc(p.location)}</p></div><span class="link-arrow" aria-hidden="true">View</span></div>
      </a>`).join("") + `<div class="work-card work-card--soon"><div class="work-card__img"><div><span class="script">more soon</span><p class="eyebrow" style="margin:10px 0 0">New homes are being photographed</p></div></div></div>`;
  }

  /* ───────────── Project page ───────────── */
  function initProjectPage() {
    const root = $("#project");
    if (!root) return;
    const slug = new URLSearchParams(location.search).get("p");
    const i = Math.max(0, S.projects.findIndex(x => x.slug === slug));
    const p = S.projects[i], next = S.projects[(i + 1) % S.projects.length];
    document.title = `${p.name} · UD Studio`;
    root.innerHTML = `
      <section class="p-hero">
        <div class="p-hero__img"><img src="${p.cover}" alt="${esc(p.name)}"></div>
        <div class="p-hero__copy"><p class="eyebrow">${[p.type, p.location].filter(Boolean).map(esc).join(" · ")}</p><h1 class="split">${esc(p.name)}</h1></div>
      </section>
      <section class="p-facts">
        <dl class="reveal">${[["Location", p.location], ["Type", p.type], ["Area", p.area], ["Completed", p.year]].filter(x => x[1]).map(x => `<div><dt>${x[0]}</dt><dd>${esc(x[1])}</dd></div>`).join("")}${p.scope ? `<div style="grid-column:1/-1"><dt>Scope</dt><dd>${esc(p.scope)}</dd></div>` : ""}</dl>
        <div><p class="p-facts__summary reveal">${esc(p.summary)}</p><p class="feature__palette reveal">Palette ${p.palette.map(c => `<i style="--c:${c}"></i>`).join("")}</p></div>
      </section>
      ${p.rooms.length ? `<section class="p-rooms">
        <ul class="p-rooms__nav">${p.rooms.map((r, k) => `<li><a href="#room-${k}"${k ? "" : ' class="is-on"'}>${esc(r.name)}</a></li>`).join("")}</ul>
        <div>${p.rooms.map((r, k) => `<div class="p-room" id="room-${k}"><h2 class="split">${esc(r.name)}</h2><div class="p-room__grid">${r.images.map(src => `<figure class="p-img"><img src="${src}" alt="${esc(r.name)}, ${esc(p.name)}" loading="lazy"></figure>`).join("")}</div></div>`).join("")}</div>
      </section>` : ""}
      ${p.video && p.video.src ? `<section class="p-video${p.video.vertical ? " is-vertical" : ""}">
        <div class="p-video__copy"><p class="eyebrow">${p.rooms.length ? "Walkthrough" : "Film"}</p><h2 class="split">Walk through <em>${esc(p.name)}</em></h2><p class="reveal">${p.rooms.length ? "A short film of the finished home, room by room." : "A short film of the finished room."}</p></div>
        <div class="p-video__frame"><video src="${esc(p.video.src)}" poster="${esc(p.video.poster || p.cover)}" controls playsinline preload="metadata"${p.video.sound ? "" : " muted"}></video></div>
      </section>` : ""}
      <a class="p-next" href="project.html?p=${next.slug}"><p class="eyebrow">Next project</p><h2>${esc(next.name)}</h2></a>`;
    const navLinks = $$(".p-rooms__nav a", root);
    if (anim) {
      G.fromTo(".p-hero__img", { clipPath: "inset(18% 30% 0% 30% round 300px 300px 0px 0px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)", duration: 2, ease: "expo.inOut", delay: .3 });
      G.from(".p-hero__img img", { scale: 1.25, duration: 2.6, ease: "expo.out", delay: .3 });
      G.to(".p-hero__img img", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".p-hero", start: "top top", end: "bottom top", scrub: true } });
      $$(".p-img", root).forEach(f => G.from(f, { clipPath: "inset(100% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut", scrollTrigger: { trigger: f, start: "top 88%" } }));
      $$(".p-img img", root).forEach(im => G.from(im, { scale: 1.2, duration: 2, ease: "expo.out", scrollTrigger: { trigger: im, start: "top 88%" } }));
    }
    $$(".p-room", root).forEach((r, k) => {
      if (!G) return;
      ScrollTrigger.create({ trigger: r, start: "top 50%", end: "bottom 50%", onToggle: s => s.isActive && navLinks.forEach((a, j) => a.classList.toggle("is-on", j === k)) });
    });
  }

  /* ───────────── Studio page values (line icons draw in) ───────────── */
  function initDrawIcons() {
    if (!anim) return;
    $$("[data-draw] path, [data-draw] circle, [data-draw] rect, [data-draw] line, [data-draw] polyline").forEach(p => {
      if (!p.getTotalLength) return;
      const l = p.getTotalLength();
      G.fromTo(p, { strokeDasharray: l, strokeDashoffset: l }, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut", scrollTrigger: { trigger: p.closest("[data-draw]"), start: "top 85%" } });
    });
  }

  /* ───────────── Pendant lamp: drops in, swings, lights the contact section ───────────── */
  function initPendant() {
    const p = $(".pendant");
    if (!p) return;
    const sec = p.closest("section"), sway = $(".pendant__sway", p);
    const set = (on, flicker = true) => {
      sec.classList.toggle("is-lit", on);
      sec.classList.remove("is-flicker");
      if (on && flicker && !reduce) { void sec.offsetWidth; sec.classList.add("is-flicker"); }
    };
    p.addEventListener("click", () => {
      set(!sec.classList.contains("is-lit"));
      if (anim) G.fromTo(sway, { rotate: 6 }, { rotate: 0, duration: 2.4, ease: "elastic.out(1, .3)" });
    });
    if (!anim) { set(true, false); return; }
    G.set(p, { yPercent: -130 });
    ScrollTrigger.create({ trigger: sec, start: "top 70%", once: true, onEnter: () => {
      G.timeline()
        .to(p, { yPercent: 0, duration: 1.3, ease: "power3.out" })
        .fromTo(sway, { rotate: 16 }, { rotate: 0, duration: 3.4, ease: "elastic.out(1, .22)" }, .45)
        .add(() => set(true), 1.3)
        .add(() => sway.classList.add("is-idle"), 3.9);
    } });
  }

  /* ───────────── Mobile quick-contact bar ───────────── */
  function initMobileBar() {
    const bar = document.createElement("nav");
    bar.className = "mbar"; bar.setAttribute("aria-label", "Quick contact");
    bar.innerHTML = `
      <a href="tel:${S.phoneTel}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/></svg>Call</a>
      <button type="button" data-wa-open><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4C9.4 4 4 9.3 4 15.8c0 2.3.7 4.5 1.9 6.4L4 28l6-1.9c1.8 1 3.9 1.6 6 1.6 6.6 0 12-5.3 12-11.9S22.6 4 16 4z"/></svg>WhatsApp</button>
      <a class="mbar__cta" href="${onHome ? "#contact" : "contact.html"}">Get a quote</a>`;
    document.body.appendChild(bar);
    const onScroll = () => bar.classList.toggle("is-on", scrollY > 260);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ───────────── Boot ───────────── */
  buildHeader();
  buildFooter();
  bindData();
  initScroll();
  initTransitions();
  initLightsHero();
  initCompare();
  initStatement();
  initFeatured();
  initGallery();
  initReel();
  initServiceCards();
  initProcess();
  initStudio();
  initWords();
  initContact();
  initPendant();
  initMobileBar();
  initWhatsApp();
  initVideo();
  initWorkPage();
  initProjectPage();
  initReveals();
  initDrawIcons();
  initFooterSig();
  initCursor();

  const startPage = () => {
    if (initLightsHero.play) initLightsHero.play();
    if (G) ScrollTrigger.refresh();
  };
  if (onHome) runIntro(startPage);
  else startPage();
  addEventListener("load", () => G && ScrollTrigger.refresh());
})();
