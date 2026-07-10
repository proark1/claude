# Gather Builder and Max Routes — Design Specification

## Goal

Replace the Builder and Max syllabus previews with complete, interactive tutorial routes. Both routes follow one relatable project, **Gather**, an event planner for birthdays, dinners, and group outings.

Builder creates a useful data-backed version of Gather. Max continues from that finished app and teaches advanced Claude Code workflows by turning Gather into a polished, tested, and maintainable product.

## Audience and teaching principles

The routes serve people who completed Starter and are comfortable describing what they want but may not identify as programmers.

Every chapter must:

- introduce one primary Claude Code capability;
- produce a visible improvement to Gather;
- explain technical concepts in plain language before naming them;
- include a practical action, adaptable prompt, or completion check;
- demonstrate safe recovery when the lesson involves meaningful risk;
- avoid requiring business, startup, or professional software experience.

Instructions that depend on current Claude Code, Railway, or third-party behavior must be checked against current official documentation before publication.

## Project progression

The routes form one continuous project. Builder begins with a fresh Gather project. Max assumes the completed Builder project and improves it rather than rebuilding it.

Gather's core data model contains:

- an event with a name, description, location, and candidate dates;
- guests and their RSVP status;
- date votes;
- shared preparation tasks and completion state.

The tutorial may show representative implementation details, but users interact primarily through Claude Code prompts and visible app behavior rather than hand-writing code.

## Builder route

Builder uses the existing slate-blue route identity. Its narrative is “build an app that remembers.” Its signature visual is a living Gather event-board preview that gains functionality as the reader advances.

### Chapters

1. **The event** — choose an approachable gathering, define who will use the planner, and create the fresh project folder.
2. **Plan first** — use Plan Mode to turn the idea into a scoped build plan before files change.
3. **The event page** — create the initial responsive Gather interface and learn the prompt-build-review loop.
4. **What the app remembers** — model events, guests, RSVPs, date choices, votes, and tasks in plain language.
5. **A real database** — provision and connect a Railway database, explain persistence and environment variables, and avoid exposing secrets.
6. **Forms that save** — add guests, submit RSVPs, vote on dates, and create shared tasks with clear success and failure feedback.
7. **Change existing data** — filter, edit, complete, and delete records with confirmations and safe empty states.
8. **Test and recover** — test validation and edge cases, use checkpoints or version control to recover from a bad change, and verify that data survives a restart.
9. **Teach Claude the project** — create a concise `CLAUDE.md` containing project commands, architecture, constraints, and quality expectations.
10. **Launch Gather** — deploy the complete app, configure production variables, verify the public URL, and run a final readiness checklist.

### Builder completion state

The reader finishes with a deployed Gather app that can store an event, guests, date votes, RSVPs, and tasks. The route ends with a celebratory summary and a clear transition to Max.

## Max route

Max uses the existing gold route identity. Its narrative is “not one builder, but a coordinated crew.” Its signature visual is an operations map showing specialized agents moving through research, implementation, testing, and release, then reporting back to a single coordinating thread.

### Chapters

1. **Audit Gather** — inspect the Builder result, identify risks and opportunities, and create a prioritized improvement brief.
2. **Meet the crew** — explain subagents and delegate bounded research, design, and testing tasks with explicit outputs.
3. **Parallel work** — run independent work concurrently, recognize unsafe overlap, and integrate results deliberately.
4. **A reusable Gather skill** — package repeatable project guidance into a focused skill and show when a skill is preferable to a one-off prompt.
5. **Test in the browser** — verify the real interface, mobile behavior, forms, empty states, and navigation through browser-driven testing.
6. **Connected planning** — demonstrate how calendar and communication connectors can support invitations and coordination while keeping connector-dependent steps optional.
7. **Hooks and guardrails** — add narrowly scoped quality checks that catch common mistakes without creating confusing automation.
8. **Reminders and follow-ups** — design automations for RSVP reminders and preparation follow-ups, with clear review and cancellation controls.
9. **Quality audit** — coordinate accessibility, privacy, security, performance, and responsive-layout reviews; distinguish findings from verified defects.
10. **Release room** — assemble a release plan, resolve conflicting changes, run final tests, and publish an intentional version.
11. **Watch and improve** — inspect the live app, collect useful feedback, prioritize fixes, and make a small evidence-based improvement.
12. **Host a real gathering** — use Gather for an actual low-stakes event and complete an end-to-end operating checklist.

### Max completion state

The reader finishes with an improved Gather app and a reusable workflow for coordinating agents, browser testing, project skills, quality checks, optional connectors, and reviewed automations.

## Interaction system

Both routes reuse the existing components in `shared/styles.css` and `shared/app.js`:

- chapter progress rail;
- reveal and drawing animations;
- simulated Claude Code scenes;
- copyable prompts;
- persistent checklists;
- glossary tooltips;
- OS-aware instructions where relevant;
- sound and completion effects.

New shared components may be added only when both routes benefit or when a route's signature visual needs behavior that cannot be expressed cleanly with existing components. Route-specific content and scene registrations remain in `builder.html` and `max.html`.

Simulated conversations must include user intent, Claude's plan or response, relevant permission moments, changed-file summaries, and visible app results. Scenes must not imply that risky actions happen without review.

## Failure and recovery teaching

Failure scenes are instructional, not decorative. The curriculum must cover:

- invalid or incomplete form input;
- a database connection or environment-variable problem;
- an attempted destructive action that needs confirmation;
- conflicting changes from parallel work;
- a browser test that exposes a genuine usability defect;
- a safe rollback or checkpoint recovery.

Each failure includes a recognizable symptom, a plain-language diagnosis, a bounded corrective prompt, and a verification step.

## Accessibility and responsive behavior

The finished routes must:

- retain keyboard-visible focus states;
- use semantic headings in chapter order;
- preserve readable contrast for slate and gold accents;
- remain usable on narrow mobile screens;
- provide labels for interactive controls;
- respect `prefers-reduced-motion`;
- avoid making sound necessary for comprehension;
- keep simulated windows readable without horizontal page scrolling.

## Verification

Before deployment:

1. Check internal navigation and all route links.
2. Verify every registered scene has a matching window and completes without JavaScript errors.
3. Test copy buttons, checklists, glossary terms, progress rails, replay controls, and OS tabs where present.
4. Review desktop and mobile screenshots for layout regressions.
5. Check keyboard navigation, heading order, control labels, and reduced-motion behavior.
6. Validate that current product instructions match official documentation.
7. Deploy with the Railway CLI and confirm successful HTTP responses for `/`, `/builder.html`, `/max.html`, and shared assets.

## Out of scope

- Replacing the existing site-wide visual identity.
- Converting the static tutorial site to a framework.
- Shipping Gather itself as a separate repository or production application.
- Requiring paid connectors or accounts to complete the core routes.
- Teaching hand-written application code as the primary workflow.

