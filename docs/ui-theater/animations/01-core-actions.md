# Core Action Animation Specs

This document describes UI animation mechanics for the common Coup actions.

These animations should be clear, fast, and repeatable. They should not slow the game down too much.

## Income

### Purpose

Income is the smallest action. It should communicate safety and simplicity.

### Public Text

```txt
Royyan takes Income.
```

### Visual Sequence

1. Actor receives a warm spotlight.
2. A single coin appears above the actor portrait.
3. Coin drops into the actor's coin area.
4. Coin counter increments by 1.
5. Spotlight returns to normal turn state.

### Timing

| Beat | Duration |
| --- | --- |
| Spotlight actor | 150ms |
| Coin drop | 300-450ms |
| Counter increment | 150ms |
| Cleanup | 100ms |

Total: 500-800ms.

### FX

- One coin particle.
- Optional tiny sparkle on landing.
- No screen shake.

### Reduced Motion

- Fade `+1 coin` near actor.
- Counter updates after 300ms.

## Foreign Aid

### Purpose

Foreign Aid is public and blockable. It should feel like external help arriving, but vulnerable to interruption.

### Public Text

```txt
Royyan requests Foreign Aid.
```

### Visual Sequence If Unblocked

1. Actor spotlight activates.
2. A small treasury wagon or coin package enters the center stage.
3. Two coins move from center stage to actor.
4. Coin counter increments by 2.
5. Wagon fades out.

### Visual Sequence If Blocked

1. Wagon enters.
2. Duke blocker interrupts.
3. Royal decree slams in front of wagon.
4. Wagon stops or reverses.
5. No coins are awarded.

### Timing

Unblocked total: 900-1400ms.

Blocked total before block transition: 500-800ms, then pass control to block animation.

### FX

- Two coin particles.
- Subtle wagon shadow.
- Optional dust trail.

### Reduced Motion

- Text label says `Foreign Aid: +2 coins`.
- If blocked, text changes to `Foreign Aid blocked by Duke`.

## Tax / Duke

### Purpose

Tax should feel powerful because it is a major coin acceleration action.

### Public Text

```txt
Royyan claims Duke and takes Tax.
```

### Visual Sequence

1. Actor receives gold spotlight.
2. Background dims except actor and center vault.
3. Center-stage treasury vault appears or opens.
4. Gold light spills from the vault.
5. Three coins fly to actor in a staggered rhythm.
6. Coin counter increments one-by-one or in a single `+3` burst.
7. Vault closes and fades.

### Challenge Window Behavior

Tax is challengeable. The UI should support freezing before full resolution.

Potential approach:

1. Show claim: `Royyan claims Duke`.
2. Open reaction window.
3. If no challenge, play full treasury animation.
4. If challenged, freeze the vault light and transition to Tribunal.

### Timing

| Beat | Duration |
| --- | --- |
| Claim display | 300ms |
| Vault open | 400-600ms |
| Coin burst | 600-900ms |
| Counter update | 200ms |
| Cleanup | 200ms |

Total after reaction window: 1200-1800ms.

### FX

- Gold rays.
- Coin shower particles.
- Mild camera push-in.
- No heavy shake.

### Reduced Motion

- Show `Tax: +3 coins`.
- Actor coin counter fades to new value.

## Steal / Captain

### Purpose

Steal is aggressive and directional. The visual should make it very clear who loses coins and who gains coins.

### Public Text

```txt
Royyan claims Captain and steals from Sarah.
```

### Visual Sequence If Successful

1. Actor gets sharp gold/red spotlight.
2. Target receives coin sigil target mark.
3. Target coin area shakes lightly.
4. Up to two coins lift from target.
5. Coins travel along a curved path to actor.
6. Target counter decrements.
7. Actor counter increments.
8. Target mark disappears.

### Block Variants

Steal can be blocked by Captain or Ambassador.

If blocked:

- Coins start to lift or path preview appears.
- Blocker appears with shield/seal.
- Coins bounce back to target.
- No coin counters change.

### Timing

Successful total: 1200-1800ms.

Blocked pre-interruption: 500-800ms.

### FX

- Curved coin trail.
- Quick swipe sound if audio exists.
- Target coin shake.
- Optional beam from actor to target.

### Reduced Motion

- Display plain text.
- Decrement and increment counters with fade.
- Use a static arrow between players.

## Exchange / Ambassador

### Purpose

Exchange is private and mysterious. The shared screen should show that something secret is happening without showing cards.

### Public Text

```txt
Royyan claims Ambassador and exchanges influence.
```

### Visual Sequence

1. Actor receives blue spotlight.
2. Center stage becomes secret archive or diplomatic chamber.
3. Several face-down cards float in a circular motion.
4. Actor portrait gets a blue seal.
5. Text says `Royyan is exchanging influence...`.
6. When done, cards collapse back into shadows.
7. No public card faces are shown.

### Important Privacy Rule

Never show:

- Drawn cards.
- Kept cards.
- Returned cards.
- Any card face unless revealed by challenge/influence loss.

### Challenge Behavior

Exchange is challengeable.

If challenged:

- Floating cards freeze.
- Archive light turns white.
- Tribunal mode starts.

### Timing

Since private interaction may take longer, the animation should become a looping ambient state after the intro.

| Beat | Duration |
| --- | --- |
| Archive open | 500-800ms |
| Floating card loop | Until player finishes |
| Archive close | 300-500ms |

### FX

- Blue mist.
- Face-down card particles.
- Diplomatic seal.

### Reduced Motion

- Static blue seal near actor.
- Text: `Royyan is exchanging influence.`

## Turn Start

### Purpose

Turn start should clearly show who acts next.

### Public Text

```txt
Royyan takes the floor.
```

### Visual Sequence

1. Previous player highlight fades.
2. Spotlight travels to current player.
3. Player portrait lifts or scales slightly.
4. Timer appears if enabled.
5. Action selection prompt appears.

### Timing

500-900ms.

### Reduced Motion

- Highlight switches with fade.
- No traveling spotlight.

## Turn End

### Purpose

Turn end should clean the stage and prepare the next action.

### Visual Sequence

1. Temporary action labels fade.
2. Target marks clear.
3. Beams clear.
4. Background returns to persistent scene.
5. Event log updates.
6. Next turn-start event begins.

### Timing

200-500ms.

## Implementation Notes

Each core action animation should be split into:

- `preview` state.
- `reaction window` state.
- `resolution` animation.
- `cleanup`.

Example for Tax:

```txt
Claim Duke
→ reaction window
→ if no challenge, vault animation
→ update coins
→ cleanup
```

Example for Steal:

```txt
Claim Captain and target Sarah
→ reaction window
→ if no block/challenge, coin transfer
→ update counters
→ cleanup
```