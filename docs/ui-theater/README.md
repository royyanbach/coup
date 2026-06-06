# Coup UI Theater Plan

This folder describes a UI-only plan for turning the Coup web game into a theatrical, offsite-friendly social deduction experience.

The goal is not to recreate a physical table exactly. The goal is to make the browser version feel better than carrying cards to an offsite event by using animation, staging, tension, spotlighting, and shared-screen drama.

## Design Direction

The game UI should be treated as a living political theater:

- The shared screen shows the public state, action drama, player portraits, coin counts, visible influence loss, and cinematic reactions.
- Personal devices can eventually show private information and controls, but this document focuses only on the UI layer.
- The center of the screen is an Action Theater, not just an empty board.
- Every game event becomes a staged moment with a clear visual language.
- The background changes based on match tension, surviving players, major actions, and accumulated story scars.

## Documentation Map

Read these documents in order:

1. [Architecture](./01-ui-architecture.md)
2. [Game Mechanics and UI Flow](./02-game-mechanics-and-ui-flow.md)
3. [Background World System](./03-background-world-system.md)
4. [Animation Orchestration](./04-animation-orchestration.md)
5. [Shared Animation Language](./animations/00-shared-animation-language.md)
6. [Core Action Animations](./animations/01-core-actions.md)
7. [Challenge, Block, and Reveal Animations](./animations/02-challenge-block-reveal.md)
8. [Assassination, Coup, and Victory Animations](./animations/03-assassination-coup-victory.md)
9. [Responsive Modes](./05-responsive-modes.md)
10. [Implementation Roadmap](./06-implementation-roadmap.md)

## Product Principles

### 1. The center is a stage

The middle area should always answer this question:

> What is the current political drama?

It should not only show text such as `Royyan took tax`. It should show the treasury opening, coins moving, a spotlight on the actor, and a clear resolution.

### 2. Hidden information stays hidden

The shared UI can be dramatic without leaking information. Card backs, influence counts, reveal ceremonies, and claim text should be public. Actual private hands should not appear on the shared screen unless revealed by the game rules.

### 3. Every action has visual weight

Small actions should be fast and subtle. Major actions should feel like cinematic events.

Example weighting:

| Event | Visual Weight | Expected Duration |
| --- | --- | --- |
| Income | Small | 400-700ms |
| Foreign Aid | Small-medium | 800-1200ms |
| Tax | Medium | 1000-1600ms |
| Steal | Medium | 1200-1800ms |
| Block | Medium interruption | 700-1200ms |
| Challenge | Large | 2500-4500ms |
| Assassinate | Large | 2500-4000ms |
| Coup | Very large | 3500-5500ms |
| Victory | Very large | 5000ms+ |

### 4. Animation should clarify the game state

Animations must be beautiful, but their first job is clarity.

A player should understand:

- Who acted?
- Who was targeted?
- What was claimed?
- Was it blocked?
- Was it challenged?
- Who lost influence?
- What changed after the animation?

### 5. The world remembers the match

The background should accumulate visual scars based on actions. This gives each match a unique visual history.

Examples:

- Repeated assassinations add wanted posters.
- Frequent coups add broken statues and torn banners.
- Many blocks add guard presence in the chamber.
- Late game tension adds fog, lightning, dimmer lighting, and fire.

## Recommended Implementation Style

Use the current React/Vite direction of the project and add a UI-layer architecture around it.

Recommended division:

- React for layout, player portraits, text, controls, and state-driven rendering.
- CSS/Tailwind for persistent visuals and responsive layout.
- Framer Motion or React transition utilities for component enter/exit transitions.
- Anime.js or GSAP for timeline-based cinematic sequences.
- PixiJS or a lightweight canvas layer for particles, coins, fog, beams, rain, fire, and lightning.
- Zustand for UI scene state, animation queue state, and derived visual state.

This plan intentionally avoids backend details.