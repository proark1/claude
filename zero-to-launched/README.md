# Zero to Launched

An interactive, scroll-driven tutorial website that teaches complete beginners how to use the
**Claude Code desktop app** — from install to a website live on the internet.

- `index.html` — landing page: hero + route picker
- `starter.html` — **Starter route**, complete (9 chapters)
- `builder.html` — **Builder route**, complete (10 chapters): build and deploy Gather with PostgreSQL
- `max.html` — **Max route**, complete (12 chapters): agents, skills, browser tests, hooks, connectors, routines, and release practice
- `commands.html` — **Commands cheat sheet** (bonus tab): powerful, underused slash commands and gestures, grouped by intent; uses `body.route-commands` (green theme) plus the `.cmd-palette` / `.cmd-card` / `.gesture` components. Anchored on the honesty rule: it tells readers to type `/` or `/help` for their live, version-specific list.
- `shared/styles.css` — the whole design system (light, warm, editorial)
- `shared/app.js` — animation engine: reveals, SVG drawing, progress rail, sound,
  confetti, checklists, glossary tooltips, and the **scene player**
- No build step, no external dependencies. Open `index.html` or drop the folder on any static host.

## Authoring a mock-window scene (for Builder/Max chapters)

Every simulated Claude Code window is a `.cc-window` with a `data-scene="name"` attribute.
Scenes are registered on the page **before** `app.js` loads:

```html
<script>
window.ZTL_SCENES = {
  myScene: [
    { u: "A user message — typed character by character, then sent." },
    { u: "With an image attached.", attach: "screenshot.png" },
    { think: "Claude is thinking…", ms: 1200 },          // spinner row, removed after ms
    { c: "A Claude reply. <strong>HTML allowed.</strong>" },
    { perm: { title: "Claude wants to …", desc: "Plain-language explanation.",
              allow: "Accept", ms: 1500 } },              // auto-approves after ms
    { plan: { title: "Build plan", items: ["step one", "step two"],
              approve: "Approve plan", ms: 1800 } },      // auto-approves after ms
    { files: [ { name: "index.html", add: "82" } ] },     // file chips with +N badges
    { preview: "<div>mini page HTML</div>", url: "localhost:3000" },
    { cue: "anything" },   // dispatches a 'scenecue' CustomEvent on the window element
    { wait: 800 },         // pause
    { clear: true },       // wipe the chat
  ],
};
</script>
<script src="shared/app.js"></script>
```

Every step also accepts `gap: <ms>` — the pause *after* the step (default 500).

Behavior you get for free: playback starts when the window scrolls into view, pauses when
it scrolls out, a Replay button appears when the scene finishes, and
`prefers-reduced-motion` collapses all delays. Use `cue` steps plus a
`win.addEventListener("scenecue", …)` listener to drive animations outside the window
(see the hero on `index.html`).

## Other reusable components

- **Checklists**: a `.try-card` with `data-checklist="unique-id"` persists check state in
  `localStorage` and fires confetti + a chime when completed.
- **Glossary terms**: `<button class="term" data-def="plain-language definition"
  data-word="label">word</button>` shows a friendly tooltip on hover/tap/focus.
- **Copyable prompts**: a `.prompt-card` (or any element) with `data-copy-root` containing a
  `.pc-text`/`.out-text` and a `.copy-btn`.
- **Progress rail**: add `<div class="rail">…</div>` plus `data-chapter="Label"` on each
  `<section class="chapter">`; stops and fill are generated automatically.
- **OS tabs**: `.os-tabs` buttons with `data-os` + panels with `data-os-panel` inside a
  `data-os-scope` container; auto-detects the visitor's OS.
- **Sound**: off by default, toggled by `#sound-toggle`, generated with the Web Audio API.

## Accuracy

App facts (UI names, permission modes, checkpoints/rewind, Browser pane, install steps,
plan requirements) were verified against https://code.claude.com/docs in July 2026, and
Railway/GitHub steps against their official docs. Flows change — re-verify before major
content updates.
