# Game Mechanics and High-Level UI Flow

This document translates Coup mechanics into high-level UI behavior.

The goal is to make the game understandable from the shared screen while preserving hidden information.

## Core Screen Model

The game should have two conceptual screen types:

1. Shared public screen.
2. Private player screen.

This plan focuses on the shared public screen.

The shared public screen should show:

- Player names and portraits.
- Public coin counts.
- Public influence count using card backs or broken masks.
- Revealed lost influence.
- Current turn.
- Current declared action.
- Target, if any.
- Reaction window: who can block or challenge.
- Resolution result.

The shared screen should never show:

- Hidden cards in a player hand.
- Private exchange choices.
- Any hidden information not already revealed by game rules.

## Main Game Phases

```ts
type GamePhase =
  | 'lobby'
  | 'deal'
  | 'turn-start'
  | 'action-selection'
  | 'target-selection'
  | 'reaction-window'
  | 'challenge-resolution'
  | 'block-resolution'
  | 'action-resolution'
  | 'influence-loss'
  | 'turn-end'
  | 'finished'
```

## Phase-to-UI Mapping

| Phase | Shared UI Behavior |
| --- | --- |
| `lobby` | Show waiting chamber, player seats, join code, readiness state. |
| `deal` | Show cards being dealt face-down to each player. No card faces. |
| `turn-start` | Spotlight current player. Show `Royyan's Turn`. |
| `action-selection` | Current player is highlighted. Other players dim slightly. |
| `target-selection` | Potential targets pulse or outline. Target beam preview appears. |
| `reaction-window` | Action freezes. Challenge/block prompt appears with countdown. |
| `challenge-resolution` | Theater becomes Tribunal mode. Challenger vs challenged. |
| `block-resolution` | Claimed blocker interrupts the action visually. |
| `action-resolution` | Action animation plays and public state changes visually. |
| `influence-loss` | Reveal ceremony plays. Card is shown only after rules say it is revealed. |
| `turn-end` | Scene cleans up. Next player spotlight starts. |
| `finished` | Victory scene plays. Winner is crowned. |

## Lobby UI

The lobby should feel like players are taking seats at a secret council.

Suggested layout:

```txt
┌──────────────────────────────────────┐
│          SECRET COUNCIL ROOM          │
│                                      │
│            Room Code: AB7K            │
│                                      │
│   Seat 1   Seat 2   Seat 3   Seat 4  │
│   Seat 5   Seat 6   Seat 7   Seat 8  │
│                                      │
│              Start Game              │
└──────────────────────────────────────┘
```

Visual behavior:

- Empty seats show silhouettes.
- Joined players get portrait frames.
- Ready players light a candle or seal.
- Start button appears as a royal decree.

## Deal Phase

When the game starts:

1. The room darkens slightly.
2. A dealer hand or shadow appears at center.
3. Two face-down cards fly to each player.
4. Each player portrait shows two influence backs.
5. The Action Theater shows `Influences dealt. Trust no one.`

Important rule:

The shared screen only shows card backs.

## Turn Start

At the start of each turn:

- Camera focus moves to the active player.
- A spotlight lands on their portrait.
- Their nameplate glows.
- The action prompt appears.

Text example:

```txt
Royyan takes the floor.
```

Visual duration should be short: 500-900ms.

## Action Selection

The active player's private device may contain the actual buttons. The shared screen can still show an anticipation state.

Shared screen:

- Current player remains spotlighted.
- Other players are dimmed.
- Background ambient motion slows slightly.
- Timer appears if using timed turns.

When the player declares an action, the shared screen immediately shows the claim.

Example:

```txt
Royyan claims Duke and takes Tax.
```

## Target Selection

For targeted actions, the UI should visually connect actor and target.

Targeted actions:

- Steal.
- Assassinate.
- Coup.

Visual behavior:

1. Actor portrait glows.
2. Valid targets pulse.
3. When selected, an intent beam connects actor to target.
4. Target portrait receives a status mark.

Status marks:

| Action | Target Mark |
| --- | --- |
| Steal | Coin sigil |
| Assassinate | Red dagger mark |
| Coup | Royal execution seal |

## Reaction Window

After an action is declared, the game often enters a reaction window.

Possible reactions:

- Challenge the claimed character.
- Block the action.
- Challenge the block.

Shared screen behavior:

- The declared action freezes mid-animation.
- The actor remains spotlighted.
- Eligible responders get subtle outline.
- Countdown appears.
- Text explains available public reaction.

Example:

```txt
Royyan claims Duke.
Anyone may challenge.
```

Or:

```txt
Royyan requests Foreign Aid.
Duke may block.
```

## Challenge Flow

Challenge is the most important social moment in Coup.

UI sequence:

1. Current action freezes.
2. Screen desaturates.
3. Lightning or impact flash.
4. `CHALLENGE` appears.
5. Theater transforms into Tribunal mode.
6. Challenger moves/appears on the left.
7. Challenged player moves/appears on the right.
8. Claim text appears in the middle.
9. Reveal ceremony resolves truth or lie.
10. Loser loses influence.
11. Theater returns to previous scene.

Public clarity text:

```txt
Sarah challenges Royyan's Duke claim.
```

Then:

```txt
Royyan revealed Duke. Sarah loses influence.
```

Or:

```txt
Royyan failed to reveal Duke. Royyan loses influence.
```

## Block Flow

A block should feel like an interruption.

Examples:

| Block | Visual Metaphor |
| --- | --- |
| Duke blocks Foreign Aid | Royal decree slams onto the screen. |
| Captain blocks Steal | Shield intercepts flying coins. |
| Ambassador blocks Steal | Diplomatic seal appears and coins return. |
| Contessa blocks Assassination | Fan opens and dagger disappears. |

UI sequence:

1. Original action begins or previews.
2. Blocker interrupts.
3. Block claim appears.
4. Reaction window opens for challenging the block.
5. If unchallenged, original action is cancelled or modified.
6. If challenged, Tribunal mode resolves the block claim.

## Influence Loss Flow

Influence loss is a ritual. It should not be reduced to a number decrement.

UI sequence:

1. Player portrait darkens.
2. One influence back separates from the portrait.
3. Card rises to center.
4. Card flips.
5. Revealed card appears with title.
6. Card cracks, burns, or becomes pinned under the player's portrait.
7. If no influence remains, the player portrait turns to stone or ash.

## Elimination Flow

When a player loses their final influence:

- Their portrait frame cracks.
- Coin pile dims or locks.
- Nameplate becomes grey/stone.
- A short elimination label appears.

Example:

```txt
Sarah has fallen from the court.
```

Avoid making eliminated players disappear entirely. They should remain visible as part of the match history.

## Turn End

At turn end:

1. Clear temporary marks.
2. Remove target beams.
3. Return background to persistent scene.
4. Update public state.
5. Move spotlight to the next player.

## Victory Flow

The winner should not just see a modal.

UI sequence:

1. All action stops.
2. Eliminated portraits fade into the background.
3. Winner portrait remains lit.
4. Background transitions from storm/collapse into coronation.
5. Winner moves visually toward throne.
6. Banner drops with victory title.
7. Match stats appear.

Possible titles:

- `Master of Deception`.
- `Last Influence Standing`.
- `Ruler of the Court`.
- `The Final Mask`.

## Public Event Log

Even with cinematic UI, the game still needs a compact event log for clarity.

Recommended location:

- Bottom-left or right side overlay.
- Collapsible.
- Shows last 3-5 public events.

Example:

```txt
Royyan claimed Duke and took Tax.
Sarah challenged Royyan.
Royyan revealed Duke.
Sarah lost one influence: Assassin.
```

The log protects clarity when animations are missed or skipped.