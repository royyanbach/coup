# UI Implementation Roadmap

This document breaks the UI Theater plan into practical implementation phases.

The roadmap is intentionally UI-only. It assumes game state and backend can exist separately.

## Phase 0: Documentation and Alignment

### Goal

Agree on the intended UI direction before implementation.

### Deliverables

- UI Theater documentation folder.
- Architecture plan.
- Animation specs.
- Background world system plan.
- Responsive mode plan.

### Success Criteria

- The team understands that the shared screen is an Action Theater.
- The team agrees that hidden information must not appear on the shared screen.
- The team agrees that animations should be event-driven.

## Phase 1: Static Theater Foundation

### Goal

Create the basic theater layout without complex animation.

### Deliverables

- `GameTheater` component.
- `BackgroundWorldLayer` with static Royal Council scene.
- `PlayerStageLayer` with player portraits.
- `PlayerPortrait` component.
- Coin counter display.
- Influence back display.
- Current turn spotlight.
- Basic event log.

### Components

```txt
GameTheater
├─ BackgroundWorldLayer
├─ PlayerStageLayer
└─ UILayer
```

### Success Criteria

- 4-8 players can be displayed clearly.
- The current player is obvious.
- Coin counts are readable.
- Hidden cards are not shown.
- The layout works on laptop and projector sizes.

## Phase 2: Player Anchors and Simple Animation Queue

### Goal

Prepare the UI for event-driven animation.

### Deliverables

- Player anchor registry.
- `TheaterEvent` type.
- `TheaterQueue`.
- `AnimationContext`.
- Animation registry.
- Debug panel for triggering animation events.

### First Events to Support

- `turn-start`.
- `income`.
- `tax`.
- `turn-end`.

### Success Criteria

- Debug panel can trigger events manually.
- Events play in order.
- UI returns to normal state after each event.
- Coin counters update at visually understandable moments.

## Phase 3: Core Action Animations

### Goal

Make the common actions feel alive.

### Deliverables

- Income animation.
- Foreign Aid animation.
- Tax animation.
- Steal animation.
- Exchange public animation.
- Target beam/mark system.
- Simple FX layer for coin movement.

### Success Criteria

- Each action clearly communicates actor and target.
- Steal clearly shows coin direction.
- Exchange does not reveal private cards.
- Animations are short enough for repeated gameplay.

## Phase 4: Reaction Window, Blocks, and Challenges

### Goal

Support Coup's core social drama.

### Deliverables

- Reaction window UI.
- Freeze-frame animation state.
- Block animation system.
- Challenge Tribunal mode.
- Reveal ceremony.
- Influence loss animation.

### Events to Support

- `block`.
- `challenge`.
- `reveal`.
- `lose-influence`.

### Success Criteria

- Challenge feels like a major accusation.
- Truth vs lie result is instantly understandable.
- Blocks feel like interruptions.
- Influence loss is clear and dramatic.
- Eliminated players remain visible but inactive.

## Phase 5: High-Drama Actions

### Goal

Make assassination, coup, final duel, and victory memorable.

### Deliverables

- Assassination preview and resolution.
- Contessa block visual support.
- Coup cinematic.
- Final duel transition.
- Victory coronation.
- Basic match stats panel.

### Success Criteria

- Coup feels irreversible and heavy.
- Assassination feels dangerous and targeted.
- Final duel changes the mood of the whole stage.
- Victory does not feel abrupt.

## Phase 6: Background World System

### Goal

Make the stage evolve with the game.

### Deliverables

- Scene resolver.
- Tension resolver.
- CSS variable based background intensity.
- Royal Council scene.
- Political Unrest scene.
- Kingdom Collapse scene.
- Final Duel scene.
- Victory Coronation scene.

### Success Criteria

- Background changes as players are eliminated.
- Tension increases when multiple players have 7+ coins.
- Late game feels visually different from early game.
- Scene changes are smooth and not distracting.

## Phase 7: Scene Memory Scars

### Goal

Make each match leave a visual history.

### Deliverables

- Scene scar type system.
- Scar reducer.
- Wanted poster scar.
- Broken statue scar.
- Torn banner scar.
- Coin spill scar.
- Burn mark/scorch scar.

### Success Criteria

- Major actions leave persistent visual marks.
- Scars do not hide important game information.
- Endgame background feels shaped by player actions.

## Phase 8: Canvas/WebGL FX Upgrade

### Goal

Improve visual richness with a dedicated FX layer.

### Deliverables

- Canvas or PixiJS FX layer.
- Coin particles.
- Fog field.
- Lightning.
- Fire/smoke.
- Beam effects.
- Screen shake helper.

### Success Criteria

- FX are visually rich but do not hurt readability.
- FX can be disabled in low-power mode.
- FX can be skipped in reduced-motion mode.

## Phase 9: Responsive and Device Modes

### Goal

Polish shared-screen and personal-device experiences.

### Deliverables

- Shared-screen layout.
- Player-device layout.
- Spectator layout, if desired.
- Debug layout.
- Large-screen optimizations.
- Phone-safe controls.

### Success Criteria

- Projector mode is readable from a distance.
- Phone mode is functional and not overloaded with cinematic effects.
- Shared screen never shows hidden information.

## Phase 10: Polish and Tuning

### Goal

Make the game feel smooth in real play.

### Deliverables

- Animation duration tuning.
- Event log refinement.
- Reduced-motion polish.
- Low-power mode.
- Sound cue toggle.
- UI debug tools.
- Visual regression snapshots if useful.

### Success Criteria

- Players do not feel animations are slowing the game down.
- Important moments still feel dramatic.
- Reduced-motion users can play comfortably.
- The game is clear even when players are laughing/talking in the same room.

## Suggested Build Order

The most practical first implementation order:

1. Static `GameTheater`.
2. Player portraits and anchors.
3. Turn spotlight.
4. Animation queue.
5. Income and Tax animations.
6. Steal with coin movement.
7. Challenge Tribunal.
8. Reveal ceremony.
9. Influence loss and elimination.
10. Coup animation.
11. Background tension.
12. Scene scars.
13. Victory scene.

## Risk Areas

### Risk: Animations slow the game down

Mitigation:

- Keep common actions short.
- Add skip/fast mode.
- Make heavy cinematics only for major events.

### Risk: UI becomes unclear

Mitigation:

- Always show plain-language event text.
- Keep event log visible.
- Do not let particles cover names/counters.

### Risk: Hidden information leaks

Mitigation:

- Strictly separate shared-screen and private-device components.
- Add a shared-screen privacy checklist.
- Never render card faces unless event type explicitly allows reveal.

### Risk: Animation code becomes hard to maintain

Mitigation:

- Use a queue.
- Use animation context.
- Use shared primitives.
- Keep game state separate from UI state.

## Definition of Done for UI Theater MVP

The UI Theater MVP is done when:

- The shared screen can show a full game using public information only.
- Turn spotlight is clear.
- Income, Foreign Aid, Tax, Steal, Exchange, Assassinate, Coup, Block, Challenge, Reveal, Influence Loss, and Victory have at least basic animations.
- Challenge and reveal moments are understandable without reading the full log.
- Background has at least 3 states: early, late, final duel.
- Reduced-motion mode exists.
- Debug panel can trigger every major animation manually.