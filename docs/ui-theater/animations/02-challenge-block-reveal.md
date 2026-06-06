# Challenge, Block, and Reveal Animation Specs

This document describes the most important social moments in Coup: challenges, blocks, and reveal ceremonies.

These animations deserve more visual weight than basic actions because they are where bluffing becomes visible.

## Challenge

### Purpose

Challenge is the core emotional mechanic of Coup.

The UI should make a challenge feel like a public accusation.

### Public Text

```txt
Sarah challenges Royyan's Duke claim.
```

### Visual Sequence

1. Current action freezes.
2. Background desaturates.
3. A sharp impact flash appears.
4. `CHALLENGE` appears in large text.
5. Theater transitions into Tribunal mode.
6. Challenger is staged on the left.
7. Challenged player is staged on the right.
8. Claim appears between them.
9. Reveal ceremony starts.
10. Result appears: `Claim Verified` or `Bluff Exposed`.
11. Losing player enters influence-loss sequence.
12. Theater exits Tribunal mode.

### Tribunal Layout

```txt
┌──────────────────────────────────────┐
│              TRIBUNAL                │
│                                      │
│   Challenger      Claim      Accused │
│    Sarah          Duke       Royyan  │
│                                      │
│            Reveal Ceremony           │
└──────────────────────────────────────┘
```

### Truth Result

If challenged player reveals the claimed card:

1. Card rises.
2. Card flips.
3. Gold-white light confirms truth.
4. `CLAIM VERIFIED` appears.
5. Challenger loses influence.
6. Challenged player replacement-card action should remain private if implemented later.

Visual tone:

- Gold.
- White light.
- Tribunal seal closes.

### Lie Result

If challenged player cannot reveal the claimed card:

1. Card rise may be skipped or replaced with a cracked mask.
2. Red lightning breaks the claim text.
3. `BLUFF EXPOSED` appears.
4. Challenged player loses influence.

Visual tone:

- Red.
- Cracked glass.
- Harsh shadow.

### Timing

| Beat | Duration |
| --- | --- |
| Freeze action | 200ms |
| Challenge impact | 300-500ms |
| Tribunal transition | 600-900ms |
| Card reveal | 1200-2000ms |
| Result display | 700-1000ms |
| Influence-loss handoff | 300ms |

Total: 3000-5000ms depending on pacing.

### Reduced Motion

- Fade into Tribunal layout.
- No flash or shake.
- Show text clearly.
- Card reveal uses a simple flip or fade.

## Block

### Purpose

A block is an interruption. It should visually say:

> No. This action does not pass uncontested.

### Public Text

```txt
Sarah claims Contessa and blocks the assassination.
```

or:

```txt
Dimas claims Duke and blocks Foreign Aid.
```

### Generic Block Sequence

1. Original action starts or is shown as intent.
2. Blocker spotlight appears abruptly.
3. Defensive object appears between actor and target/action.
4. Block claim text appears.
5. Reaction window opens for challenging the block.
6. If not challenged, original action is cancelled or modified.
7. If challenged, enter Tribunal mode.

### Block Visuals by Claimed Card

| Claimed Card | Blocked Action | Visual Metaphor |
| --- | --- | --- |
| Duke | Foreign Aid | Royal decree slams down. |
| Captain | Steal | Shield catches the coin trail. |
| Ambassador | Steal | Diplomatic seal redirects coins. |
| Contessa | Assassinate | Fan opens and dagger dissolves. |

## Duke Blocks Foreign Aid

Sequence:

1. Foreign Aid wagon enters.
2. Duke blocker portrait flashes gold.
3. A royal decree slams in front of the wagon.
4. Wagon stops.
5. Text: `Foreign Aid Blocked`.
6. Challenge window starts.

If unchallenged:

- Wagon reverses and fades.
- Actor receives no coins.

If challenged:

- Decree freezes.
- Tribunal starts.

## Captain Blocks Steal

Sequence:

1. Coin trail begins from target to stealer.
2. Captain blocker emits a shield flash.
3. Coin trail hits shield.
4. Coins bounce back to owner.
5. Text: `Steal Blocked`.

If the blocker is the target, the shield appears over the target portrait.

## Ambassador Blocks Steal

Sequence:

1. Coin trail begins.
2. Blue diplomatic seal appears.
3. Coin path bends away and returns.
4. Text: `Steal Blocked`.

This should feel less militaristic than Captain.

## Contessa Blocks Assassination

Sequence:

1. Dagger mark appears over target.
2. Contessa blocker is spotlighted.
3. A fan opens in front of the target.
4. Dagger reflection disappears.
5. Red atmosphere fades slightly.
6. Text: `Assassination Blocked`.

This should feel elegant and dramatic.

## Reveal Ceremony

### Purpose

Reveal is the most important information moment. It should feel like a card being judged in front of the court.

Reveal happens during:

- Successful challenge defense.
- Failed challenge defense.
- Influence loss.
- Elimination.

### Public Text Examples

```txt
Royyan reveals Duke.
```

```txt
Sarah loses influence: Assassin.
```

### Visual Sequence

1. Player portrait darkens.
2. One influence card back separates from the portrait.
3. Card moves to center stage.
4. Background audio/ambience lowers if audio exists.
5. Card slowly rotates.
6. Card face is revealed.
7. Card title appears.
8. Result state applies.

### Card Reveal Layout

```txt
┌──────────────────────────────────────┐
│                                      │
│                DUKE                  │
│            [large card]              │
│                                      │
│        Royyan reveals Duke           │
└──────────────────────────────────────┘
```

### Influence Loss Reveal

When the card is lost:

1. Card reveals.
2. Card burns, cracks, or becomes sealed.
3. The revealed card moves under the player's portrait.
4. Player influence count decreases.
5. If eliminated, portrait elimination sequence starts.

### Verified Claim Reveal

When a player proves a claim:

1. Card reveals.
2. Gold light confirms the claim.
3. Card returns or fades into private replacement flow.
4. Challenger loses influence.

Important: if the rules require drawing a replacement card, the replacement must remain private.

## Influence Loss

### Purpose

Influence loss should feel like losing political power, not only losing a card.

### Visual Sequence

1. Player portrait receives a crack effect.
2. One mask/card back detaches.
3. Reveal ceremony plays.
4. Revealed influence becomes pinned/visible under that player.
5. Player frame gets darker.
6. If eliminated, frame turns to stone/ash.

### Eliminated Player State

Eliminated players should remain visible.

Recommended styling:

- Portrait desaturated.
- Frame cracked.
- Nameplate grey.
- Coin counter dimmed.
- Revealed cards remain visible.
- Small label: `Eliminated` or `Fallen`.

## Counter-Challenge Flow

Coup can create nested drama:

```txt
Assassinate Sarah
→ Sarah claims Contessa block
→ Royyan challenges Contessa
→ Sarah reveals or fails to reveal Contessa
```

UI handling:

1. Assassination mood begins.
2. Contessa block interrupts.
3. Block claim appears.
4. Challenge interrupts the block.
5. Tribunal judges the block claim.
6. If block verified, assassination fails and challenger loses influence.
7. If block exposed as lie, blocker loses influence and assassination may continue.

The animation queue should handle this as separate events, not one giant animation.

Example queue:

```txt
assassinate-preview
block
challenge
reveal
lose-influence
assassinate-resolution or action-cancelled
```

## Implementation Notes

Challenge and block animations should be implemented as interruptible state transitions.

Do not hardcode one giant path for every possible action chain.

Instead:

- Action animation exposes a preview/frozen state.
- Block animation can interrupt and cancel it.
- Challenge animation can interrupt either the original action or the block.
- Reveal animation is shared.
- Influence loss animation is shared.

This keeps the system composable.