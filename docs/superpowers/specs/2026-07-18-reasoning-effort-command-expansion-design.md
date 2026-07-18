# Reasoning effort and command-reference expansion

Date: 18 July 2026  
Status: Approved design, awaiting written-spec review

## Objective

Extend the Claude versus Codex comparison and both product command references so readers can understand what changes when they choose a higher reasoning level. Explain the separate effects on subscription usage, API token billing, latency, tool use, and result quality without inventing a universal cost multiplier. Add more high-value commands to both product references while keeping the pages curated rather than exhaustive.

## Scope

This change updates three existing routes:

- `compare.html`: add a prominent Reasoning & cost chapter after the model comparison.
- `codex-commands.html`: add a Codex-specific effort guide and a compact working-session command shelf.
- `commands.html`: add a Claude-specific effort guide and a compact working-session command shelf.

No new route, framework, package, backend, or persistence layer is introduced.

## Information architecture

### Comparison page

Add `Reasoning` to the sticky comparison navigation. The new chapter appears immediately after Current models because effort changes how a selected model spends time and output tokens; it does not select a different model or subscription plan.

The chapter contains four units:

1. **The invariant:** higher effort can improve difficult work but generally increases latency and token or plan usage. There is no fixed multiplier such as “High always costs three times Low.”
2. **Product ladders:** separate Claude and Codex scales, preserving each product's terminology and special modes.
3. **Subscription versus API:** two panels that prevent readers from treating subscription usage as per-token billing.
4. **Reasoning receipts:** worked API calculations and task examples that show how to choose a level.

### Claude command page

Add a chapter between the existing route map and command chapters. It explains Claude effort controls, how to choose an effort level, and why High is not automatically better for routine edits. A compact command shelf later in the page covers the added working-session commands without duplicating the existing large lesson cards.

### Codex command page

Add a Reasoning & model choice section before the reference grid. It distinguishes model choice, reasoning effort, Fast mode, Max, and Ultra. A compact command shelf follows the existing detailed reference cards.

## Reasoning model

### Shared guidance

Use the lowest effort that reliably produces the result. Increase effort when the task requires more planning, cross-file reasoning, uncertainty reduction, edge-case analysis, security review, or trade-off evaluation.

The same task can consume different reasoning tokens across runs because usage depends on the model, prompt, repository state, context, tools, and decisions made during execution. Effort is a behavioral control, not a strict token allocation.

### Claude terminology

Present the current supported effort spectrum as Low, Medium, High, XHigh, and Max, with model-availability caveats. High is the API default on the supported current models documented by Anthropic. Claude Code provides `/effort`, a model picker that can adjust effort, and a `--effort` CLI flag.

Treat Claude Code's Ultracode mode separately. It is not another Anthropic API effort value; it combines XHigh effort with standing permission for multiagent workflows.

### Codex terminology

Present Light/Low, Medium, High/Extra High, and Max as the single-task effort ladder exposed across Codex surfaces. Note that names vary by surface and model support. Max gives one selected model more time to reason.

Treat Ultra separately. Ultra uses subagents to divide a complex task into parallel parts, so it is an orchestration mode rather than merely a larger single-model reasoning budget.

For API readers, mention model-dependent values such as none, minimal, low, medium, high, and xhigh. Reasoning mode (`standard` or `pro` on supported GPT-5.6 models) remains separate from reasoning effort.

## Cost explanation

### Subscription usage

Claude and ChatGPT/Codex subscriptions are not itemized per-token API bills. Higher effort commonly takes longer and consumes plan usage faster, but the page must not convert subscription limits into a fictional dollar cost per message. Plan limits, credits, model availability, and reset periods can vary by plan and surface.

### API billing

For both providers, internal reasoning or thinking tokens are billed at the selected model's output-token rate. The cost display uses this formula:

`input cost + (reasoning/thinking tokens + visible output tokens) × output rate`

Tool-heavy agent work can produce additional requests. Those later calls may add input tokens from retained context or tool results and additional reasoning and visible output. The receipt examples explain this without pretending a single response covers every agent loop.

### Reasoning receipts

Use three clearly labeled illustrative scenarios:

1. **Rename a button:** Low effort. One clear file and acceptance criterion; additional depth is unlikely to justify the latency or usage.
2. **Diagnose an intermittent test:** Medium or High. Requires evidence gathering, competing hypotheses, and verification.
3. **Plan an authentication migration:** High, XHigh, or Max. Cross-system trade-offs, failure modes, security, rollout, and rollback justify deeper analysis.

At least one receipt shows explicit arithmetic for a current Claude model and one for a current OpenAI model. Token counts are hypothetical and visually labeled “illustrative,” while rates come from the official model tables. A nearby warning states that the example demonstrates the formula, not a promised Low-to-High ratio.

## Command additions

### Claude curated shelf

- `/effort`: choose reasoning depth for the current session.
- `/context`: inspect what consumes the context window.
- `/diff`: review file changes before shipping.
- `/branch`: fork an earlier conversation into a new path.
- `/resume`: continue a saved session.
- `/btw`: ask a short aside without adding it to the main history.
- `/agents`: manage available subagents.
- `/tasks`: inspect background tasks.
- `/background`: detach the current session to continue running.
- `/batch`: decompose a large change into isolated worktree tasks.
- `/doctor`: diagnose installation and runtime problems.

Each row contains the command, a one-sentence purpose, a concrete when-to-use cue, and a surface or availability note when needed.

### Codex curated shelf

- `/model`: choose a model and, in supported clients, its reasoning effort.
- `/status`: inspect model, permissions, context, and session configuration.
- `/usage`: inspect account token activity and applicable limits.
- `/mention`: attach a file or folder to the next turn.
- `/diff`: inspect tracked and untracked changes.
- `/compact`: summarize a long chat to free context.
- `/fork`: branch the current conversation.
- `/resume`: reopen a saved conversation.
- `/new`: start a clean conversation in the same CLI session.
- `/ps`: inspect background terminals.
- `/stop`: stop background terminal work.
- `/side` or `/btw`: ask an ephemeral follow-up without disrupting the main transcript.

The existing detailed cards remain unchanged except where current documentation requires a factual correction. The shelf is a practical extension, not a complete command catalog.

## Visual design

Continue the site's single editorial system and product accent colors. The signature component is a **reasoning receipt**: a narrow ledger that makes input, thinking, visible output, and total cost legible as separate line items.

The effort ladders use progressively denser rules and annotations, not a generic colorful slider. Structural labels encode the actual progression from quick scoped work to deep or parallel work. Product-specific ladders sit side by side on desktop and stack on mobile.

Command shelves use compact rows rather than more large cards. This preserves scanability and keeps the existing detailed lesson cards visually dominant. Copyable command text follows the existing copy-button pattern.

Dark and light themes reuse the current tokens. Any new styles must maintain visible focus states, adequate contrast, reduced-motion behavior, and no horizontal page overflow at 390px.

## Source contract

Use only current official documentation for product facts and command availability:

- Anthropic effort: `https://platform.claude.com/docs/en/build-with-claude/effort`
- Anthropic adaptive thinking and billing: `https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking`
- Claude Code commands: `https://code.claude.com/docs/en/commands`
- OpenAI reasoning and API billing: `https://developers.openai.com/api/docs/guides/reasoning`
- Codex models and effort: `https://learn.chatgpt.com/docs/models`
- Codex CLI commands: `https://learn.chatgpt.com/docs/developer-commands?surface=cli`

Every factual section links to the most relevant primary source and retains a visible verification date. If the official documents do not publish a fixed numerical relationship between effort levels, the site must say so rather than estimate one.

## Error and edge-case handling

- Unsupported effort levels are described as model- and surface-dependent.
- Ultra and Ultracode are visually separated from ordinary effort levels to avoid false equivalence.
- Worked examples remain valid if token rates later change because the formula and date are visible; published rates still require periodic review.
- Copy controls keep a text fallback and do not make the command inaccessible when clipboard permission fails.
- Long command labels wrap without forcing horizontal page overflow.

## Verification

Before delivery:

- Run JavaScript syntax checks and `git diff --check`.
- Validate all local HTML routes and internal anchors.
- Verify the new source links point to official domains.
- Test copy controls for both compact command shelves.
- Test sticky reasoning navigation and keyboard access.
- Inspect Compare, Claude Commands & Use, and Codex Commands & Use at desktop and 390px mobile widths.
- Test light and dark themes and reduced-motion behavior.
- Confirm no browser console warnings or errors.
- After deployment, verify the new asset version, reasoning chapter, command rows, and copy actions on the Railway production routes.

## Out of scope

- A live API request or benchmark runner.
- A universal Low-to-High cost multiplier.
- A promise of fixed subscription messages or tokens.
- An exhaustive command encyclopedia.
- New pricing plans, model replacements, or unrelated navigation changes.
