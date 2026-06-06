# Responsive Modes

This document describes how the Coup UI should adapt between shared screens and personal devices.

The original product idea is especially strong for offsite events where everyone is physically together. That means the UI should not only be responsive in the normal web sense. It should support different roles for different screens.

## Screen Modes

```ts
type ScreenMode =
  | 'shared-screen'
  | 'player-device'
  | 'spectator'
  | 'debug'
```

## Shared-Screen Mode

Shared-screen mode is for projector, TV, large monitor, or a laptop placed in the middle of the group.

### Purpose

The shared screen is the theatrical public state.

It should prioritize:

- Drama.
- Readability from a distance.
- Public information.
- Turn ownership.
- Action resolution.
- Reaction clarity.

### Should Show

- Room code.
- Player list.
- Player portraits.
- Public coin counts.
- Public influence backs.
- Revealed influence cards.
- Current turn.
- Declared action.
- Targeted player.
- Reaction window.
- Challenge/block/reveal/victory cinematics.
- Event log.

### Should Not Show

- Hidden cards.
- Exchange choices.
- Private player prompts.
- Anything that should only exist on one player's device.

### Layout

```txt
┌──────────────────────────────────────────────┐
│                 ACTION THEATER               │
│                                              │
│      Cinematic action, challenge, reveal      │
│                                              │
├──────────────────────────────────────────────┤
│ P1      P2      P3      P4      P5      P6   │
└──────────────────────────────────────────────┘
```

For 7-8 players, use two rows or smaller portraits.

## Player-Device Mode

Player-device mode is for phones or individual laptops.

### Purpose

The player device is the private control surface.

It should prioritize:

- Current private hand.
- Available actions.
- Target selection.
- Challenge/block buttons.
- Confirm/cancel.
- Private exchange flow.

### Should Show

- Own hidden cards.
- Own coins.
- Action buttons.
- Eligible target list.
- Reaction buttons when available.
- Private prompts.
- Compact public state.

### Should Not Overdo

- Heavy cinematic effects.
- Large background motion.
- Long blocking animations.

The player device should remain functional and fast.

## Spectator Mode

Spectator mode is optional, but useful for offsites.

It can be similar to shared-screen mode but with additional entertainment overlays.

Possible spectator-only features:

- Public event log expanded.
- Player timeline.
- Bluff probability parody meter.
- Match stats.
- Commentary-style labels.

Important: spectator mode must not show actual hidden information unless the spectator is intended to be an omniscient observer after the match.

## Debug Mode

Debug mode is for development.

It should allow triggering animations without playing a full game.

Useful controls:

- Set scene: Royal Council, Unrest, Collapse, Final Duel, Victory.
- Tension slider.
- Add/remove scene scars.
- Trigger Income.
- Trigger Tax.
- Trigger Steal.
- Trigger Exchange.
- Trigger Assassinate.
- Trigger Coup.
- Trigger Challenge Truth.
- Trigger Challenge Lie.
- Trigger Influence Loss.
- Trigger Victory.
- Toggle reduced motion.

## Breakpoints

Suggested breakpoints:

| Size | Behavior |
| --- | --- |
| `< 640px` | Player-device layout. Avoid shared theater complexity. |
| `640px - 1024px` | Compact shared layout or tablet controls. |
| `1024px - 1440px` | Standard shared-screen layout. |
| `> 1440px` | Projector/TV layout with larger theater and bigger portraits. |

## Shared-Screen Layout Rules

### 4 players

Use large portraits in one row.

```txt
P1        P2        P3        P4
```

### 5-6 players

Use one row with medium portraits.

```txt
P1    P2    P3    P4    P5    P6
```

### 7-8 players

Use two rows or a curved council layout.

```txt
P1    P2    P3    P4
P5    P6    P7    P8
```

or:

```txt
      P2      P3
  P1              P4
  P8              P5
      P7      P6
```

The bottom-row layout is easier to implement and better for projected readability.

## Player Portrait Scaling

Portraits need minimum readable information:

- Name.
- Coin count.
- Influence backs/revealed cards.
- Current status mark.

If space is tight, prioritize:

1. Name.
2. Coin count.
3. Influence count.
4. Revealed card icons.
5. Avatar art.

## Action Theater Safe Zones

The Action Theater needs safe zones so effects do not cover important information.

```txt
┌──────────────────────────────────────┐
│ Top safe zone: titles/timers          │
│                                      │
│ Center drama zone                     │
│                                      │
│ Bottom safe zone: player portraits    │
└──────────────────────────────────────┘
```

FX like fog, rain, lightning, and beams can cross the whole screen, but important text and counters should remain readable.

## Reduced Motion and Low Power Mode

For phones or older laptops, provide low-power mode.

Low-power mode:

- Disable WebGL particles.
- Reduce background animation.
- Use CSS fades.
- Skip screen shake.
- Shorten animations.

This can be separate from accessibility reduced-motion, but both can share many behaviors.

## Practical Recommendation

Build shared-screen mode first because it defines the personality of the game.

Then build player-device mode as a separate functional UI that connects to the same public game state.

Do not try to force one layout to serve both modes perfectly. The shared screen is theater. The phone screen is control.