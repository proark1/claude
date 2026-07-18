# Claude and Codex navigation, landing pages, and comparison

Date: 2026-07-18
Status: Approved design

## Purpose

Reorganize Zero to Launched around two clearly separated product paths: Claude and Codex. Each product receives its own concise landing page and product-specific learning routes. A top-level comparison page helps visitors choose between Claude and Codex using verified pricing, context limits, model availability, workflows, and use cases.

The experience must remain approachable for beginners while being precise enough for visitors comparing paid plans and technical capabilities.

## Approved decisions

- Use two compact global menu groups, **Claude** and **Codex**.
- Give Claude and Codex separate landing pages.
- Keep **Compare** visible as an independent top-level navigation item.
- Give Codex a dedicated **Commands & Use** page because its workflow and commands differ from Claude Code.
- Use one shared editorial visual system for both product landing pages.
- Use a direct, parallel-specifications layout for the comparison page.
- Preserve existing public page URLs wherever possible.

## Information architecture

### Claude

- **Claude overview** — `index.html`
- **Start Up** — `starter.html`
- **Build** — `builder.html`
- **Max** — `max.html`
- **Commands & Use** — `commands.html`

The Claude overview will clearly distinguish the general Claude assistant from Claude Code. It will explain that this site's learning routes focus on using Claude Code to create and ship software.

### Codex

- **Codex overview** — `codex-home.html` (new)
- **Software Playbook** — `codex.html`
- **Commands & Use** — `codex-commands.html` (new)

The existing long Codex page remains the Software Playbook. It will not be overloaded with the responsibilities of a short product landing page.

### Shared

- **Claude vs. Codex** — `compare.html` (new)
- **News** — remains available through page-level supporting links and the footer; it is not part of either product's primary learning path.

Existing route filenames remain valid. No redirect layer is needed.

## Global navigation

Every page will use the same semantic header structure:

1. Zero to Launched brand link
2. Claude menu
3. Codex menu
4. Compare link
5. Existing theme and sound controls where applicable

On desktop, Claude and Codex are compact dropdown menus. Each dropdown begins with the relevant overview, followed by its learning routes. The active product and active page are visibly indicated.

On mobile, the menu becomes a single panel with two labeled accordion groups. Opening one group does not hide the other group's label. The comparison route remains easy to reach without drilling into a product group.

Required interaction behavior:

- Menus work with mouse, touch, and keyboard.
- Enter and Space open a menu; arrow keys move between its links.
- Escape closes the current menu and restores focus to its trigger.
- Clicking outside closes an open menu.
- Focus states are clearly visible in light and dark themes.
- `aria-expanded`, `aria-controls`, `aria-current`, and appropriate menu labeling reflect the visible state.
- With JavaScript unavailable, the page still exposes usable navigation links.

Navigation markup remains in each static HTML document for progressive rendering. Shared CSS controls appearance, while shared JavaScript adds dropdown and mobile behaviors.

## Landing pages

The two landing pages use the approved **one editorial system** direction. They share typography, spacing, grid logic, card construction, motion restraint, dark-mode behavior, and interaction patterns. Their content—not unrelated visual themes—establishes the product distinction.

### Claude overview

The rebuilt `index.html` is concise and contains:

1. A plain-language explanation of Claude and Claude Code
2. A short statement about the kinds of work Claude supports
3. Four route cards: Start Up, Build, Max, and Commands & Use
4. A small “Claude may fit you if…” decision summary
5. A prominent link to the comparison page

The four route cards communicate progression without implying that experienced users must complete every earlier route.

### Codex overview

The new `codex-home.html` contains:

1. A plain-language explanation of Codex as a software-engineering agent
2. A concise plan → delegate → implement → verify → ship workflow preview
3. Two route cards: Software Playbook and Commands & Use
4. A small “Codex may fit you if…” decision summary
5. A prominent link to the comparison page

Both landing pages avoid long feature inventories. Their single job is to orient visitors and send them into the right route.

## Codex Commands & Use

The new `codex-commands.html` is a practical reference rather than a second playbook. It contains concise sections that can be scanned independently:

1. Start and resume repository work
2. Give Codex durable repository context with `AGENTS.md`
3. Inspect and plan before editing
4. Delegate bounded work to agents and use worktrees where appropriate
5. Use skills, plugins, and connectors
6. Run commands with appropriate sandbox and approval boundaries
7. Review diffs, tests, screenshots, and other evidence
8. Commit, push, and prepare delivery
9. Recover from a wrong direction without destructive resets

Each section includes:

- A one-sentence explanation
- A copyable prompt or command-shaped example
- A short “use this when” note
- A safety or common-pitfall note where relevant

Examples must be Codex-specific. Claude slash commands or Claude Code behaviors must not be presented as Codex features.

## Claude vs. Codex comparison

The new `compare.html` uses the approved **parallel specifications** direction. Claude and Codex remain in persistent left and right columns on wide screens. The comparison is organized by rows so visitors can scan one decision axis at a time.

### Comparison categories

- Product definition
- Best-fit work
- Conversation and execution style
- Current pricing and access
- Context-window limits
- Available model versions
- Parallel-agent and delegation capabilities
- Repository and tool access
- Integrations and extensibility
- Permission and safety model
- Recommended scenarios

The page concludes with short recommendations for common needs, including research and writing, interactive product development, parallel repository work, beginner learning, and large existing codebases.

### Pricing treatment

Pricing will be shown using each provider's actual billing structure. Included plan access, subscription prices, usage-based charges, and regional or tax caveats will not be collapsed into a misleading single number.

Each pricing block includes:

- Plan or access tier
- Published price and billing period when officially available
- What product access is included
- Material usage limitations stated by the provider
- Direct official source link
- A page-level “last verified” date

### Context treatment

The page separates three concepts that are often conflated:

- A model's documented maximum context window
- The product's practical session or task behavior
- Compaction, summarization, or repository retrieval behavior

Exact limits are included only when an official source documents them. Undocumented or variable limits are labeled as such rather than inferred.

### Model versions

Each product receives compact model cards showing the current officially documented model lineup relevant to the product. Cards include provider, intended strength, relative speed where documented, availability, and context limit where documented.

Codex and Claude are not forced into artificial one-to-one model pairings. The UI makes asymmetry visible and compares suitability rather than implying equivalence.

### Responsive behavior

On phones, each comparison category becomes a labeled block containing Claude and Codex values one after the other. The page must not require horizontal table scrolling to understand a comparison. A compact sticky category navigator may be used if it does not obscure content or keyboard focus.

## Content accuracy and sourcing

Prices, model names, context limits, and plan availability are temporally unstable. Before implementation is considered complete, these values must be checked against current official Anthropic and OpenAI documentation.

Requirements:

- Use primary, official sources only for factual comparison data.
- Place source links beside the claims they support.
- Show the verification date near the comparison introduction.
- Do not present undocumented inferences as provider facts.
- Use neutral language and avoid declaring a universal winner.
- Explain that the comparison focuses on software work, while Claude also serves broader conversational use cases.

## Visual system

The landing and comparison pages extend the current Zero to Launched design system rather than introducing a separate microsite.

- Retain the existing editorial typography and spacing character.
- Preserve light and dark themes.
- Use structural labels and rules to encode product, category, and route relationships.
- Keep the landing pages visually quiet so the route choices dominate.
- Give the comparison page one memorable device: the persistent paired Claude/Codex columns.
- Use motion only for menu transitions, restrained entrance sequencing, and state changes.
- Respect `prefers-reduced-motion`.

The design must remain distinct through clear information hierarchy and product-aware writing, not decorative gradients or excessive animation.

## Error and edge handling

- A missing comparison value displays “Not publicly documented” with a short explanation.
- If a plan is unavailable in some regions, the copy directs visitors to the provider's regional pricing page.
- Long model names and prices wrap without breaking the comparison grid.
- Dropdowns remain within the viewport at narrow desktop widths.
- An open dropdown closes before the mobile layout breakpoint changes.
- Copy actions provide visible success and failure feedback.
- External links open safely and are clearly distinguishable from internal routes.

## Verification

Functional checks:

- Every internal route returns successfully.
- Every header and footer link points to the intended page.
- Desktop dropdowns and mobile accordion groups behave correctly.
- Keyboard navigation and focus restoration work.
- Copyable Codex prompts and commands work in secure and local contexts.
- Theme selection persists and all new components support both themes.

Visual checks:

- No horizontal overflow at common phone, tablet, and desktop widths.
- Comparison pairs remain easy to associate on all screen sizes.
- Dropdowns do not cover their trigger or leave the viewport.
- Text contrast meets WCAG AA for normal text.
- Reduced-motion mode removes nonessential animation.

Content checks:

- Claude examples contain no Codex-only instructions.
- Codex examples contain no Claude-only slash commands or behaviors.
- Prices, model versions, context limits, and sources match current official documentation on the verification date.

## Out of scope

- Live pricing APIs or automated provider-data ingestion
- User accounts or personalized recommendations
- A universal benchmark ranking of model quality
- Renaming existing route files
- Redesigning the News page beyond adopting the global navigation

## Acceptance criteria

The design is complete when visitors can:

1. Enter a clearly labeled Claude or Codex path from every page.
2. Understand what each product is from a concise landing page.
3. Reach product-specific commands and usage guidance without ambiguity.
4. Compare current prices, context limits, models, workflows, and use cases from one accessible page.
5. Use the entire experience on desktop or mobile, with mouse, touch, or keyboard, in light or dark mode.
