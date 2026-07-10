# Build "Zero to Launched" — an immersive, animated tutorial website that teaches complete beginners how to use Claude Code

## What you are building

A beautiful, scroll-driven tutorial website that teaches people who have **never written a line of code** and **never used Claude Code** how to go from "I have an idea" to "my project is live on the internet" — using the **Claude Code desktop app** (never the terminal).

The site itself must feel like a product demo from a top-tier design studio: when someone lands on it, their first reaction should be "wow." As they scroll, the page comes alive — mock app windows type by themselves, UI elements slide and glow, diagrams draw themselves, and the visitor is pulled through the story. This is not a documentation page with animations sprinkled on top; the animation IS the teaching method.

## Audience — hold this in mind for every sentence

- Has never coded. Doesn't know what a "repository", "deploy", "terminal", or "commit" is.
- May be on Windows or Mac.
- Is smart but easily intimidated by jargon. Every technical word must be either avoided or explained inline in plain language (use hover/tap tooltips with friendly one-line explanations, e.g. *repository → "a folder for your project that also remembers every version of it"*).
- Wants to build something real, not read theory.
- Uses the **Claude Code desktop app** with buttons and panels — all instructions must say where to click, never what to type into a terminal.

## The three routes

The site has a gorgeous route picker (three cards with animated previews on hover) leading to three tutorials:

1. **Starter** — "Your first project, live on the internet." Build this one **fully and completely** now.
2. **Builder** (medium) — more features, a project with real data. Build the route card, its landing/syllabus page, and the page skeleton with section placeholders — content marked "coming soon" with an elegant teaser.
3. **Max** — every power feature Claude Code has. Same: card + syllabus page + skeleton, content "coming soon."

Structure the codebase so routes 2 and 3 can be filled in later without redesign: shared components (mock app window, step cards, glossary tooltips, progress rail), one page per route, shared CSS.

---

## Design direction

- **Light theme only.** Airy, warm, premium. Off-white/cream backgrounds (#FAFAF7-ish), soft shadows, generous whitespace, large friendly type. One warm accent color (coral/terracotta family, in the spirit of Anthropic's branding) plus one calm secondary (soft slate/blue). No dark mode needed, but respect it gracefully if the OS forces it (still render light).
- Modern editorial typography: a distinctive display font for headlines, a highly readable font for body. Self-host or system-stack — the site must be fully self-contained (no CDN dependencies).
- Rounded cards, subtle grain or gradient washes, soft depth. Never sterile, never corporate-boring, never neon/techy.
- Mobile-first responsive. The scroll experience must be just as delightful on a phone.

## Animation & interactivity requirements

- **Scroll-driven storytelling**: use IntersectionObserver + CSS transitions/keyframes (and optionally a small self-hosted animation helper — no external CDNs, no build step required; plain HTML/CSS/JS preferred). Sections reveal, illustrations draw in (animated SVG strokes), numbers count up, mock windows begin "typing" when they scroll into view, and pause when they scroll out.
- **The star component — a simulated Claude Code desktop app window.** Recreate the app's look in HTML/CSS (title bar, sidebar with sessions, the chat/composer area, permission prompts, diff/file views). It must support scripted "scenes": a prompt types itself character by character with a blinking cursor, Claude "responds," a permission dialog pops in and gets approved, files appear, a preview pane shows the result. Every teaching step in the tutorial replays as a scene in this component. Add replay buttons. This component is used dozens of times — build it well and reuse it.
- **A sticky progress rail** showing the journey (e.g., Install → Set up → Idea → Prompt → Build → Test → Launch) that fills as the user scrolls, with clickable waypoints.
- **"You try it" checkpoints**: after each teaching scene, a card with a literal checklist ("Open Claude Code → click New Session → paste this") and a satisfying check-off interaction that persists in localStorage, so returning visitors see their progress.
- **An interactive Prompt Builder widget** (see Chapter 4 below) — the centerpiece interactive element.
- Micro-interactions everywhere: magnetic buttons, hover lifts, copy-to-clipboard buttons on every prompt with a "Copied!" burst, subtle parallax on hero art.
- **Sound, optional and OFF by default**: a small toggle enables soft UI sounds (gentle click on check-off, soft whoosh on section transitions, a warm chime at completion) generated with the Web Audio API — no audio files.
- Confetti (or similar celebration) when the visitor completes the final chapter.
- **Accessibility**: respect `prefers-reduced-motion` (swap animations for gentle fades), semantic HTML, keyboard navigable, alt text, WCAG AA contrast on the light palette.
- **Performance**: no heavy libraries, lazy-init animations, target instant load. Everything self-contained so it can be dropped onto any static host.

---

## STARTER ROUTE — full content (build all of this)

The Starter route tells one continuous story: *together, we'll build your own personal mini-website (your name, a short bio, your photo placeholder, and your links) and put it live on the internet — without writing any code.* Every chapter advances that same project so the visitor always knows where they are. Structure it as scrolling chapters:

### Chapter 0 — Hero: "You can build software now."
Full-screen hero. A mock Claude Code window types a plain-English prompt ("Build me a personal website with my name, a short bio and my links…") and a small website assembles itself piece by piece beside it. Tagline in plain language: no code, no jargon, roughly an afternoon. A scroll hint pulls the visitor down. Route picker follows (Starter glows as "start here").

### Chapter 1 — What is Claude Code? (60 seconds, zero jargon)
Explain it with an analogy: a skilled builder who lives on your computer — you describe what you want in normal language, it does the technical work, and it asks permission before doing anything important. An animated diagram draws itself: You (idea, words) → Claude Code (does the work, asks before acting) → Your project (real files on your computer, then a real website). Reassure explicitly: **you can't break your computer, and everything it does can be undone** — this fear is the #1 blocker for beginners, address it head-on.

### Chapter 2 — Get it on your computer
- OS auto-detection shows the right path first (with a toggle: Mac / Windows).
- Step-by-step install with an animated illustration per step: download the Claude Code desktop app, install, open, sign in with a Claude account (explain plans in one honest sentence: it needs a paid Claude plan; link where to get one).
- **Verify the current official download page and exact install steps for Mac and Windows via web research before writing this chapter — do not invent URLs or steps.** Same rule for everything in this tutorial: base every instruction, button name, and screen description on Claude Code's current official documentation (code.claude.com/docs and claude.com), and recreate screens faithfully in the mock-window component rather than using screenshots.
- End with a first-launch tour: an annotated interactive mock of the app's home screen — hotspots the visitor can tap to learn what each area is (where you type, where your projects/sessions live, where files show up). Keep labels friendly ("This is where you talk to Claude").

### Chapter 3 — Two free accounts that make you unstoppable
Plain-language intro of the supporting cast, each with an animated card:
- **GitHub** — "a safe home for your project that remembers every version, so nothing is ever lost." Walk through creating a free account (verify current signup flow). Explain that Claude Code can save ("push") your project there for you when you ask — you never do it manually.
- **Railway** — "the service that puts your project on the real internet, and gives it a database if it ever needs to remember things." Free-tier honest note (verify current pricing/trial). For the Starter project we only host a simple site; databases are teased as a Builder-route topic.
Frame both as "create the accounts now, Claude Code will handle the technical connection later when we ask it to."

### Chapter 4 — From idea to a great prompt (the most important skill)
This is the heart of the tutorial. Teach that the quality of what you get depends on how you ask, and that **you don't have to write the perfect prompt alone — Claude helps you write it**.
- Show the two-step pattern in a mock-window scene: first ask Claude Code to *research and interview you* ("I want a personal website. Ask me questions one at a time about what it should include and how it should look, then write me a complete build plan"). Claude asks questions, the user answers in plain words, and Claude produces a clear plan/prompt.
- **Interactive Prompt Builder widget**: the visitor fills friendly fields (What are you building? Who is it for? What must it include? Pick a style — with visual style swatches) and watches a well-structured prompt assemble live in a styled prompt card, with a copy button. Include 3 example presets they can load (personal site, hobby club page, small business card site).
- Teach the anatomy of a good prompt with an annotated example: goal, audience, must-haves, look & feel, and "ask me questions if anything is unclear."

### Chapter 5 — Watch it build (and stay in control)
A long, rich mock-window scene: the visitor's prompt is pasted, and Claude Code starts working. Teach, as it happens:
- What the "working" state looks like — Claude narrates what it's doing; you can just watch.
- **Permission prompts**: when the app asks "Claude wants to create files / run something — Allow?", what that means and why it's a safety feature, not a problem. Show one being approved.
- Plan-then-build: for bigger asks, Claude may propose a plan first — you read it in normal language and approve it.
- **How to ask for changes**: the golden loop. Show three rounds of plain-English iteration in the scene ("Make the header bigger", "I don't like the green — try something warmer", "Add a section for my photography"). Message: you never need to touch the code — you just keep talking.
- Reassurance again, now concrete: every step can be rewound to an earlier checkpoint if you don't like where it went (verify the current name and location of the rewind/checkpoint feature in the app and show it accurately).

### Chapter 6 — Test it like a pro (without being technical)
- How to open/preview the site Claude built and actually click through it.
- A friendly QA checklist the visitor can check off: every link works, looks good when the window is small (phone-sized), no weird placeholder text ("lorem ipsum"), your name is spelled right.
- Teach the killer move: **when something looks wrong, screenshot it and paste the image into Claude Code with "this looks wrong, fix it."** Show that exact scene in the mock window — beginners don't know they can paste images; this is a superpower moment.
- Teach describing bugs in plain words: what you did, what you expected, what happened.

### Chapter 7 — Put it on the internet
The payoff chapter. Walk through, as mock-window scenes:
1. Ask Claude Code to save the project to GitHub ("Save this project to my GitHub account") — show the permission prompts and what success looks like.
2. Ask Claude Code to put it live on Railway ("Help me publish this website on Railway") — Claude does the setup, the visitor follows any sign-in confirmations.
3. The moment: a real URL. Animate this big — the mock browser loads THEIR site, celebration plays.
**Verify the current, genuinely easiest beginner path for deploying a static site via Railway with Claude Code's help, and write the steps from that research** — accuracy here matters more than anywhere; a beginner who fails at deploy abandons everything. If Railway's flow requires steps Claude Code can't do for them, show those honestly with annotated mock screens.

### Chapter 8 — Your habits going forward
Close with "the five habits," each as an animated card:
1. Talk to it like a smart colleague — context and plain language beat technical words.
2. Small steps, then look — ask, check, ask again; don't order everything at once.
3. When in doubt, ask Claude to explain — "explain what you just did like I'm new to this" is always allowed.
4. Nothing is ever ruined — checkpoints and GitHub mean you can always go back.
5. Save to GitHub after every session you're happy with.
Then a completion moment (celebration + optional chime), a "you built and launched a real website" recap of everything they learned, and a beautiful teaser panel for the Builder route.

---

## BUILDER ROUTE — syllabus page to build now (content later)

Landing page with animated syllabus cards for: the project ("build a small app that remembers things — e.g., a guest book or simple habit tracker — with a real database on Railway"); Plan Mode for bigger features; pasting screenshots and design references; checkpoints & rewind in depth; connecting GitHub properly and understanding versions; adding a database via Railway; slash commands and skills (what /commands are and the most useful ones); asking Claude to write and run tests; CLAUDE.md — teaching Claude your project's rules; managing multiple sessions; when things go wrong — a beginner's debugging playbook.

## MAX ROUTE — syllabus page to build now (content later)

Landing page with animated syllabus cards for: subagents and running work in parallel; background tasks and longer autonomous runs; custom skills and slash commands you create yourself; hooks and automations; connecting outside tools (MCP connectors — Slack, browsers, databases, design tools); Claude reviewing its own code (code review features); scheduled/recurring tasks; letting Claude use a browser to test your app; memory across sessions; permission modes and safety controls in depth; multi-repo and bigger-project workflows; a capstone: shipping a real product end to end.

**Verify every feature name on both syllabus pages against current official Claude Code documentation before writing the cards — list only features that actually exist today, under their real names.**

---

## Accuracy rules (non-negotiable)

1. Before writing any chapter, research the current Claude Code desktop app, its UI, and its official docs (code.claude.com/docs, claude.com) with web search/fetch. Never invent buttons, menus, URLs, prices, or feature names.
2. All app visuals are faithful HTML/CSS recreations in the mock-window component — cleaner and stylized is fine, wrong is not.
3. Instructions are desktop-app only. If something genuinely cannot be done in the app UI, find the app-native alternative or say honestly "ask Claude Code to do this for you" — never send a beginner to a terminal.
4. Where flows change often (install, Railway deploy), add a graceful note: "Screens update sometimes — if yours looks different, the idea is the same" plus the tip that they can always ask Claude Code itself "how do I…".

## Technical requirements for the site

- Plain HTML/CSS/JS, no build step, no external network dependencies (fonts, libraries, images all local; illustrations as inline SVG). It must work by opening the files locally and deploy to any static host.
- Clean structure: `index.html` (hero + route picker), one page per route, `/shared` for CSS/JS/components. Comment the scene-scripting format so new mock-window scenes are easy to author for routes 2–3.
- localStorage for checklist progress and sound preference.
- Favicon, OpenGraph tags, a nice 404.

## Definition of done

- Starter route is complete, accurate, and delightful end-to-end; Builder and Max have polished landing/syllabus pages with "coming soon" content.
- Open it in a browser and actually test: scroll the entire Starter route, click every interactive element, replay scenes, toggle sound, complete the checklist flow, resize to phone width, and enable reduced-motion — fix everything that isn't smooth.
- A first-time visitor with zero coding knowledge could genuinely follow it and end with a live website.
- The first five seconds make people say "wow."

Work in phases: (1) research the facts, (2) design system + the mock app window component + route picker shell, (3) Starter route chapter by chapter, (4) Builder/Max syllabus pages, (5) full browser QA pass. Show me the result after phase 2 so I can react to the design direction before you build all the content.
