/* ============================================================
   Zero to Launched — shared engine
   Scroll reveals · scene player · rail · sound · confetti
   No dependencies. Pages may define window.ZTL_SCENES before
   DOMContentLoaded to register mock-window scenes.
   ============================================================ */
(function () {
  "use strict";

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = matchMedia("(hover: none)").matches;

  /* ---------------- sound ---------------- */
  const Sound = {
    ctx: null,
    get enabled() { return localStorage.getItem("ztl-sound") === "on"; },
    set enabled(v) { localStorage.setItem("ztl-sound", v ? "on" : "off"); },
    ensure() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this.ctx = new AC();
      }
      if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
      return this.ctx;
    },
    tone(freq, dur, type, gain, when) {
      if (!this.enabled) return;
      const ctx = this.ensure();
      if (!ctx) return;
      const t = ctx.currentTime + (when || 0);
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type || "sine";
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(gain || 0.08, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t); o.stop(t + dur + 0.05);
    },
    click() { this.tone(660, 0.09, "triangle", 0.06); },
    pop() { this.tone(440, 0.12, "sine", 0.07); this.tone(880, 0.1, "sine", 0.03, 0.03); },
    whoosh() {
      if (!this.enabled) return;
      const ctx = this.ensure(); if (!ctx) return;
      const t = ctx.currentTime;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(220, t);
      o.frequency.exponentialRampToValueAtTime(520, t + 0.28);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.04, t + 0.08);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
      o.connect(g).connect(ctx.destination);
      o.start(t); o.stop(t + 0.4);
    },
    chime() {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, 0.7, "sine", 0.06, i * 0.12));
    },
  };

  function initSoundToggle() {
    const btn = $("#sound-toggle");
    if (!btn) return;
    const paint = () => btn.setAttribute("aria-pressed", Sound.enabled ? "true" : "false");
    paint();
    btn.addEventListener("click", () => {
      Sound.enabled = !Sound.enabled;
      paint();
      if (Sound.enabled) { Sound.ensure(); Sound.pop(); }
    });
  }

  /* ---------------- header ---------------- */
  function initHeader() {
    const h = $(".site-header");
    if (!h) return;
    const on = () => h.classList.toggle("scrolled", scrollY > 12);
    addEventListener("scroll", on, { passive: true });
    on();
  }

  /* ---------------- reveals ---------------- */
  function initReveals() {
    const els = $$(".reveal, .reveal-scale, .step");
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }
    }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
    els.forEach((el) => io.observe(el));
  }

  /* ---------------- SVG stroke drawing ---------------- */
  function initDrawings() {
    const svgs = $$("svg.draw-on-scroll");
    if (!svgs.length) return;
    svgs.forEach((svg) => {
      $$(".draw-path", svg).forEach((p) => {
        try { p.style.setProperty("--len", Math.ceil(p.getTotalLength()) + 1); } catch (_) { /* non-geometry el */ }
      });
    });
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add("drawn"); io.unobserve(e.target); }
      }
    }, { threshold: 0.4 });
    svgs.forEach((s) => io.observe(s));
  }

  /* ---------------- count-up numbers ---------------- */
  function initCounters() {
    const els = $$("[data-count-to]");
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        const el = e.target;
        const to = parseFloat(el.dataset.countTo);
        const suffix = el.dataset.countSuffix || "";
        if (reducedMotion) { el.textContent = to + suffix; continue; }
        const t0 = performance.now(), dur = 1400;
        (function frame(t) {
          const k = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - k, 3);
          el.textContent = Math.round(to * eased) + suffix;
          if (k < 1) requestAnimationFrame(frame);
        })(t0);
      }
    }, { threshold: 0.6 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------------- glossary tooltips ---------------- */
  function initTerms() {
    const terms = $$(".term[data-def]");
    if (!terms.length) return;
    const tip = document.createElement("div");
    tip.className = "term-tip";
    tip.setAttribute("role", "tooltip");
    document.body.appendChild(tip);
    let current = null;

    function show(el) {
      current = el;
      tip.innerHTML = "";
      const w = document.createElement("span");
      w.className = "tt-word";
      w.textContent = el.dataset.word || el.textContent;
      tip.appendChild(w);
      tip.appendChild(document.createTextNode(el.dataset.def));
      tip.classList.add("show");
      const r = el.getBoundingClientRect();
      tip.style.left = "0px"; tip.style.top = "0px";
      const tw = tip.offsetWidth, th = tip.offsetHeight;
      let x = r.left + r.width / 2 - tw / 2 + scrollX;
      x = Math.max(12, Math.min(x, scrollX + innerWidth - tw - 12));
      let y = r.top + scrollY - th - 10;
      if (y < scrollY + 8) y = r.bottom + scrollY + 10;
      tip.style.left = x + "px"; tip.style.top = y + "px";
    }
    function hide() { current = null; tip.classList.remove("show"); }

    terms.forEach((el) => {
      el.setAttribute("type", "button");
      el.addEventListener("mouseenter", () => show(el));
      el.addEventListener("mouseleave", hide);
      el.addEventListener("focus", () => show(el));
      el.addEventListener("blur", hide);
      el.addEventListener("click", (e) => { e.preventDefault(); current === el && tip.classList.contains("show") ? hide() : show(el); });
    });
    addEventListener("scroll", () => { if (current) hide(); }, { passive: true });
  }

  /* ---------------- copy buttons ---------------- */
  function initCopy() {
    async function copyText(text) {
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          return true;
        } catch (_) { /* use the selection fallback below */ }
      }

      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      area.style.pointerEvents = "none";
      document.body.appendChild(area);
      area.select();
      let copied = false;
      try { copied = document.execCommand("copy"); } catch (_) { copied = false; }
      area.remove();
      return copied;
    }

    $$(".copy-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const card = btn.closest("[data-copy-root]") || btn.parentElement;
        const src = $(".pc-text", card) || $(".out-text", card);
        const text = (btn.dataset.copyText || (src ? src.textContent : "")).trim();
        if (await copyText(text)) {
          const old = btn.textContent;
          btn.textContent = "Copied! ✓";
          btn.classList.add("copied");
          Sound.pop();
          burstAt(btn);
          setTimeout(() => { btn.textContent = old; btn.classList.remove("copied"); }, 1600);
        } else {
          const selection = window.getSelection();
          const range = document.createRange();
          if (src && selection) {
            range.selectNodeContents(src);
            selection.removeAllRanges();
            selection.addRange(range);
          }
          btn.textContent = "Selected — press Ctrl+C";
        }
      });
    });
  }

  /* ---------------- checklists ---------------- */
  function initChecklists() {
    $$("[data-checklist]").forEach((card) => {
      const id = "ztl-check:" + card.dataset.checklist;
      const boxes = $$("input[type=checkbox]", card);
      const bar = $(".try-progress .bar i", card);
      const label = $(".try-progress .count", card);
      let saved = [];
      try { saved = JSON.parse(localStorage.getItem(id) || "[]"); } catch (_) {}
      boxes.forEach((b, i) => { b.checked = !!saved[i]; });

      function paint(fireCelebrate) {
        const done = boxes.filter((b) => b.checked).length;
        if (bar) bar.style.width = (done / boxes.length) * 100 + "%";
        if (label) label.textContent = done + " / " + boxes.length;
        const complete = done === boxes.length;
        const was = card.classList.contains("complete");
        card.classList.toggle("complete", complete);
        if (complete && !was && fireCelebrate) { Sound.chime(); burstAt(card, 60); }
      }
      paint(false);

      boxes.forEach((b) => b.addEventListener("change", () => {
        if (b.checked) Sound.click();
        localStorage.setItem(id, JSON.stringify(boxes.map((x) => x.checked)));
        paint(true);
      }));
    });
  }

  /* ---------------- confetti ---------------- */
  let confettiCanvas = null, confettiCtx = null, particles = [], confettiRAF = 0;
  const CONFETTI_COLORS = ["#D97757", "#F2B880", "#52708B", "#3E8E63", "#E9C46A", "#BE5B3D"];
  function ensureCanvas() {
    if (confettiCanvas) return;
    confettiCanvas = document.createElement("canvas");
    confettiCanvas.id = "confetti-canvas";
    document.body.appendChild(confettiCanvas);
    confettiCtx = confettiCanvas.getContext("2d");
    const size = () => { confettiCanvas.width = innerWidth * devicePixelRatio; confettiCanvas.height = innerHeight * devicePixelRatio; confettiCtx.scale(devicePixelRatio, devicePixelRatio); confettiCanvas.style.width = innerWidth + "px"; confettiCanvas.style.height = innerHeight + "px"; };
    size();
    addEventListener("resize", size);
  }
  function spawn(x, y, n, spread) {
    if (reducedMotion) return;
    ensureCanvas();
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 2 + Math.random() * (spread || 6);
      particles.push({
        x, y,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4,
        w: 5 + Math.random() * 6, h: 3 + Math.random() * 4,
        rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
        color: CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0],
        life: 90 + Math.random() * 60,
      });
    }
    if (!confettiRAF) tick();
  }
  function tick() {
    confettiRAF = requestAnimationFrame(tick);
    confettiCtx.clearRect(0, 0, innerWidth, innerHeight);
    particles = particles.filter((p) => p.life > 0 && p.y < innerHeight + 30);
    if (!particles.length) { cancelAnimationFrame(confettiRAF); confettiRAF = 0; return; }
    for (const p of particles) {
      p.vy += 0.16; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rot);
      confettiCtx.globalAlpha = Math.min(1, p.life / 40);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      confettiCtx.restore();
    }
  }
  function burstAt(el, n) {
    const r = el.getBoundingClientRect();
    spawn(r.left + r.width / 2, r.top + r.height / 2, n || 26, 5);
  }
  function celebrate() {
    Sound.chime();
    if (reducedMotion) return;
    let shots = 0;
    const iv = setInterval(() => {
      spawn(innerWidth * (0.2 + Math.random() * 0.6), innerHeight * 0.25, 60, 8);
      if (++shots >= 5) clearInterval(iv);
    }, 260);
  }
  window.ZTL_celebrate = celebrate;
  window.ZTL_burst = burstAt;

  /* ---------------- progress rail ---------------- */
  function initRail() {
    const rail = $(".rail");
    if (!rail) return;
    const chapters = $$("section[data-chapter]");
    if (!chapters.length) { rail.remove(); return; }
    const track = $(".rail-track", rail);
    const fill = $(".rail-fill", rail);
    const stops = chapters.map((sec, i) => {
      const s = document.createElement("button");
      s.className = "rail-stop";
      s.style.top = (i / (chapters.length - 1)) * 100 + "%";
      s.dataset.label = sec.dataset.chapter;
      s.setAttribute("aria-label", "Jump to: " + sec.dataset.chapter);
      s.addEventListener("click", () => sec.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }));
      track.appendChild(s);
      return s;
    });
    function update() {
      const doc = document.documentElement;
      const total = doc.scrollHeight - innerHeight;
      const overall = total > 0 ? scrollY / total : 0;
      // fill relative to chapter positions
      const mid = scrollY + innerHeight * 0.45;
      let idx = 0;
      chapters.forEach((sec, i) => { if (sec.offsetTop <= mid) idx = i; });
      const cur = chapters[idx];
      const within = Math.max(0, Math.min(1, (mid - cur.offsetTop) / Math.max(1, cur.offsetHeight)));
      const pct = ((idx + within) / chapters.length) * 100;
      fill.style.height = Math.min(100, pct) + "%";
      rail.style.setProperty("--mob-progress", Math.round(overall * 100) + "%");
      stops.forEach((s, i) => {
        s.classList.toggle("done", i < idx);
        s.classList.toggle("current", i === idx);
      });
    }
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();
  }

  /* ---------------- magnetic buttons ---------------- */
  function initMagnetic() {
    if (reducedMotion || isTouch) return;
    $$(".magnetic").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
        el.style.transform = `translate(${dx * 5}px, ${dy * 5}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------------- OS tabs ---------------- */
  function initOsTabs() {
    const tabsets = $$(".os-tabs");
    if (!tabsets.length) return;
    const isWin = /Win/i.test(navigator.platform || "") || /Windows/i.test(navigator.userAgent);
    const initial = isWin ? "windows" : "mac";
    tabsets.forEach((set) => {
      const tabs = $$(".os-tab", set);
      const scope = set.closest("[data-os-scope]") || document;
      function select(os) {
        tabs.forEach((t) => t.setAttribute("aria-selected", t.dataset.os === os ? "true" : "false"));
        $$("[data-os-panel]", scope).forEach((p) => { p.hidden = p.dataset.osPanel !== os; });
      }
      tabs.forEach((t) => t.addEventListener("click", () => { select(t.dataset.os); Sound.click(); }));
      select(initial);
    });
  }

  /* ============================================================
     SCENE PLAYER — the simulated Claude Code window
     ============================================================ */
  const SPEED = reducedMotion ? 0 : 1;

  function el(tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  class ScenePlayer {
    constructor(win, steps) {
      this.win = win;
      this.steps = steps;
      this.chat = $(".cc-chat", win);
      this.composerText = $(".cc-composer-text", win);
      this.composer = $(".cc-composer", win);
      this.placeholder = $(".cc-composer .ph", win);
      this.sendBtn = $(".cc-composer .send", win);
      this.gen = 0;
      this.paused = true;
      this.started = false;
      this.finished = false;
      this._resume = null;

      const replay = $(".cc-replay", win);
      if (replay) replay.addEventListener("click", () => this.replay());

      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            this.paused = false;
            if (this._resume) { this._resume(); this._resume = null; }
            if (!this.started) { this.started = true; this.run(); }
          } else {
            this.paused = true;
          }
        }
      }, { threshold: 0.3 });
      io.observe(win);
    }

    sleep(ms) {
      const myGen = this.gen;
      const step = 50;
      let left = ms * (SPEED === 0 ? 0.02 : 1);
      return new Promise((resolve) => {
        const loop = () => {
          if (myGen !== this.gen) return; // cancelled
          if (this.paused) { this._resume = loop; return; }
          if (left <= 0) return resolve();
          left -= step;
          setTimeout(loop, Math.min(step, Math.max(10, left + step)));
        };
        loop();
      });
    }

    cancelled(g) { return g !== this.gen; }

    add(node) {
      this.chat.appendChild(node);
      this.chat.scrollTop = this.chat.scrollHeight;
      return node;
    }

    async typeIn(text) {
      const g = this.gen;
      this.win.classList.add("typing");
      if (this.placeholder) this.placeholder.style.display = "none";
      if (SPEED === 0) { this.composerText.textContent = text; return; }
      for (let i = 0; i < text.length; i++) {
        if (this.cancelled(g)) return;
        this.composerText.textContent += text[i];
        await this.sleep(text[i] === " " ? 34 : 20 + Math.random() * 26);
      }
    }

    async pressSend() {
      if (this.sendBtn) {
        this.sendBtn.classList.add("pressed");
        await this.sleep(140);
        this.sendBtn.classList.remove("pressed");
      }
      Sound.pop();
    }

    async run() {
      const g = ++this.gen;
      this.finished = false;
      this.win.classList.remove("done");
      this.paused = false;
      for (const s of this.steps) {
        if (this.cancelled(g)) return;
        await this.exec(s, g);
        if (this.cancelled(g)) return;
        await this.sleep(s.gap != null ? s.gap : 500);
      }
      if (this.cancelled(g)) return;
      this.finished = true;
      this.win.classList.add("done");
    }

    replay() {
      this.gen++;
      this.chat.innerHTML = "";
      this.composerText.textContent = "";
      this.win.classList.remove("typing", "done");
      if (this.placeholder) this.placeholder.style.display = "";
      this.paused = false;
      Sound.whoosh();
      this.run();
    }

    cue(name) {
      this.win.dispatchEvent(new CustomEvent("scenecue", { detail: name, bubbles: true }));
    }

    async exec(s, g) {
      /* user message: type into composer, send, bubble appears */
      if (s.u != null) {
        let chip = null;
        if (s.attach) {
          chip = el("span", "cc-attach", "🖼 " + s.attach);
          this.composer.insertBefore(chip, this.composerText);
          this.win.classList.add("typing");
          if (this.placeholder) this.placeholder.style.display = "none";
          await this.sleep(700);
        }
        await this.typeIn(s.u);
        if (this.cancelled(g)) return;
        await this.sleep(420);
        await this.pressSend();
        const msg = el("div", "cc-msg user");
        if (s.attach) msg.appendChild(el("span", "cc-attach", "🖼 " + s.attach)).insertAdjacentHTML("afterend", "<br>");
        msg.appendChild(document.createTextNode(s.u));
        this.composerText.textContent = "";
        if (chip) chip.remove();
        this.win.classList.remove("typing");
        if (this.placeholder) this.placeholder.style.display = "";
        this.add(msg);
        return;
      }
      /* thinking indicator */
      if (s.think != null) {
        const t = this.add(el("div", "cc-thinking", `<span class="spinner"></span>${s.think}`));
        await this.sleep(s.ms || 1400);
        t.remove();
        return;
      }
      /* claude message (html allowed) */
      if (s.c != null) {
        this.add(el("div", "cc-msg claude", s.c));
        return;
      }
      /* permission card */
      if (s.perm) {
        const p = this.add(el("div", "cc-perm",
          `<div class="cc-perm-title"><span class="shield">🛡</span>${s.perm.title}</div>` +
          `<div class="cc-perm-desc">${s.perm.desc || ""}</div>` +
          `<div class="cc-perm-actions"><button class="allow">${s.perm.allow || "Accept"}</button><button>Reject</button></div>`));
        await this.sleep(s.perm.ms || 1300);
        if (this.cancelled(g)) return;
        p.classList.add("approved");
        Sound.click();
        return;
      }
      /* plan card */
      if (s.plan) {
        const items = (s.plan.items || []).map((i) => `<li>${i}</li>`).join("");
        const p = this.add(el("div", "cc-plan",
          `<div class="cc-plan-title">📋 ${s.plan.title}</div><ul>${items}</ul><button class="approve">${s.plan.approve || "Approve plan"}</button>`));
        await this.sleep(s.plan.ms || 1800);
        if (this.cancelled(g)) return;
        p.classList.add("approved");
        Sound.click();
        return;
      }
      /* file chips */
      if (s.files) {
        const wrap = el("div", "cc-files");
        s.files.forEach((f, i) => {
          const chip = el("span", "cc-file", `<span class="dot-new"></span>${f.name}${f.add ? ` <span class="plus">+${f.add}</span>` : ""}`);
          chip.style.setProperty("--d", (i * 0.22) + "s");
          wrap.appendChild(chip);
        });
        this.add(wrap);
        await this.sleep(s.files.length * 240);
        return;
      }
      /* mini preview */
      if (s.preview) {
        this.add(el("div", "cc-preview",
          `<div class="bar"><span>◂ ▸ ⟳</span><span class="url">${s.url || "localhost:3000"}</span></div>` +
          `<div class="page">${s.preview}</div>`));
        Sound.whoosh();
        return;
      }
      if (s.cue) { this.cue(s.cue); return; }
      if (s.clear) { this.chat.innerHTML = ""; return; }
      if (s.wait) { await this.sleep(s.wait); return; }
    }
  }

  function initScenes() {
    const registry = window.ZTL_SCENES || {};
    $$(".cc-window[data-scene]").forEach((win) => {
      const steps = registry[win.dataset.scene];
      if (steps) new ScenePlayer(win, steps);
    });
  }

  /* ---------------- app-tour hotspots ---------------- */
  function initHotspots() {
    $$(".hotspot[data-tip]").forEach((h) => {
      let tipEl = null;
      function show() {
        hide();
        tipEl = el("div", "tour-tip", h.dataset.tip);
        tipEl.style.position = "absolute";
        document.body.appendChild(tipEl);
        const r = h.getBoundingClientRect();
        const tw = tipEl.offsetWidth;
        let x = r.left + scrollX + r.width / 2 - tw / 2;
        x = Math.max(12, Math.min(x, scrollX + innerWidth - tw - 12));
        tipEl.style.left = x + "px";
        tipEl.style.top = (r.bottom + scrollY + 12) + "px";
        tipEl.style.zIndex = 1300;
        Sound.click();
      }
      function hide() { if (tipEl) { tipEl.remove(); tipEl = null; } }
      h.addEventListener("click", (e) => { e.stopPropagation(); tipEl ? hide() : show(); });
      h.addEventListener("mouseleave", hide);
      addEventListener("scroll", hide, { passive: true });
      document.addEventListener("click", hide);
    });
  }

  /* ---------------- section whoosh (subtle, sound only) -------- */
  function initSectionSound() {
    const secs = $$("section[data-chapter]");
    if (!secs.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) Sound.whoosh(); });
    }, { threshold: 0.25 });
    secs.forEach((s) => io.observe(s));
  }

  /* ---------------- mobile menu ---------------- */
  function initMobileNav() {
    const header = $(".site-header");
    if (!header) return;
    const nav = $(".header-actions", header);
    const links = nav ? $$(".header-link", nav) : [];
    if (!links.length) return;

    const toggle = el("button", "nav-toggle", "<span></span><span></span><span></span>");
    toggle.setAttribute("aria-label", "Open menu");
    toggle.setAttribute("aria-expanded", "false");

    const menu = el("nav", "mobile-menu");
    menu.setAttribute("aria-label", "Site");
    links.forEach((l) => {
      const a = el("a", "mm-link", l.textContent.trim());
      a.href = l.getAttribute("href");
      if (l.getAttribute("aria-current")) a.setAttribute("aria-current", l.getAttribute("aria-current"));
      menu.appendChild(a);
    });
    const scrim = el("div", "mobile-scrim");

    header.appendChild(toggle);
    document.body.appendChild(scrim);
    document.body.appendChild(menu);

    const setOpen = (open) => {
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      toggle.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", () => { setOpen(!document.body.classList.contains("menu-open")); Sound.click(); });
    scrim.addEventListener("click", () => setOpen(false));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
    addEventListener("resize", () => { if (innerWidth > 640) setOpen(false); });
  }

  /* ---------------- scroll showcase (generalized sticky-unlock) ----
     Markup:
       <div data-showcase data-mode="replace|accrue" data-sticky-top="92" data-mobile="820">
         <div class="show-stage"> …layers with [data-stage]… <x data-showcase-stamp></x> </div>
         <div class="show-steps">
           <div class="show-step" data-stage="a" data-label="Caption">…</div> …
         </div>
       </div>
     Each .show-step's data-stage maps to layer(s) [data-stage] inside .show-stage.
     "accrue" keeps prior layers on (like the Gather board); "replace" swaps. ---- */
  function initShowcase() {
    $$("[data-showcase]").forEach((root) => {
      const mode = root.dataset.mode || "accrue";
      const mobileBP = parseInt(root.dataset.mobile || "820", 10);
      const steps = $$(".show-step", root);
      if (!steps.length) return;
      const stage = $(".show-stage", root);
      if (stage && root.dataset.stickyTop) stage.style.setProperty("--sticky-top", root.dataset.stickyTop + "px");
      const layers = stage ? $$("[data-stage]", stage) : [];
      const stamp = $("[data-showcase-stamp]", root);
      const order = steps.map((s) => s.dataset.stage);
      let current = -1;

      const apply = (idx) => {
        if (idx === current) return;
        current = idx;
        const active = mode === "replace" ? [order[idx]] : order.slice(0, idx + 1);
        layers.forEach((l) => l.classList.toggle("on", active.indexOf(l.dataset.stage) > -1));
        root.classList.toggle("at-last", idx === steps.length - 1);
        steps.forEach((s, i) => {
          s.classList.toggle("done", mode === "accrue" && i < idx);
          s.classList.toggle("active", i === idx);
        });
        const st = steps[idx];
        if (stamp && st && st.dataset.label != null) stamp.textContent = st.dataset.label;
        root.dispatchEvent(new CustomEvent("showcasechange", { detail: { stage: order[idx], idx: idx }, bubbles: true }));
      };

      if (window.matchMedia("(max-width:" + mobileBP + "px)").matches) {
        // No sticky on small screens: accrue → show finished; replace → CSS shows per-step inline visuals.
        if (mode === "accrue") { layers.forEach((l) => l.classList.add("on")); steps.forEach((s) => s.classList.add("done")); }
        else { steps.forEach((s, i) => s.classList.toggle("active", i === 0)); }
        return;
      }
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { const idx = steps.indexOf(e.target); if (idx > -1) apply(idx); } });
      }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
      steps.forEach((s) => io.observe(s));
      apply(0);
    });
  }

  /* ---------------- tag filters ----------------
     <div data-filter-scope>
       <div class="filter-bar" data-filter-group="news">
         <button class="chip" data-filter="all" aria-pressed="true">All</button> …
       </div>
       <x data-filter-item data-tags="model code">…</x> …
     </div> ---- */
  function initFilters() {
    $$(".filter-bar[data-filter-group]").forEach((bar) => {
      const scope = bar.closest("[data-filter-scope]") || document;
      const chips = $$(".filter-chip", bar);
      const items = $$("[data-filter-item]", scope);
      const countEl = $("[data-filter-count]", scope);
      const apply = (f) => {
        let shown = 0;
        items.forEach((it) => {
          const tags = (it.dataset.tags || "").split(/\s+/);
          const show = f === "all" || tags.indexOf(f) > -1;
          it.classList.toggle("filtered-out", !show);
          if (show) shown++;
        });
        if (countEl) countEl.textContent = shown;
      };
      chips.forEach((c) => c.addEventListener("click", () => {
        chips.forEach((x) => x.setAttribute("aria-pressed", x === c ? "true" : "false"));
        apply(c.dataset.filter);
        Sound.click();
      }));
    });
  }

  /* ---------------- boot ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initMobileNav();
    initSoundToggle();
    initReveals();
    initDrawings();
    initCounters();
    initTerms();
    initCopy();
    initChecklists();
    initRail();
    initMagnetic();
    initOsTabs();
    initScenes();
    initShowcase();
    initFilters();
    initHotspots();
    initSectionSound();
    const y = $("#year"); if (y) y.textContent = new Date().getFullYear();
  });
})();
