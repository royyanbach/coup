# Shared Animation Language

This document defines the common visual language for all Coup UI animations.

The purpose is consistency. Each action can have its own personality, but players should quickly understand what the UI is communicating.

## Core Visual Concepts

| Concept | Meaning |
| --- | --- |
| Spotlight | This player currently has attention or responsibility. |
| Target mark | This player is being affected by an action. |
| Beam/path | Something is moving from one player to another. |
| Freeze frame | A reaction window, challenge, or interruption is happening. |
| Tribunal transform | A truth claim is being judged. |
| Card rise | Influence is about to be revealed. |
| Crack/burn/shatter | Influence is lost or reputation is damaged. |
| Vignette increase | Tension is rising. |
| Screen shake | Major irreversible event. |

## Spotlight Rules

Spotlight should be used for:

- Current turn player.
- Declared action actor.
- Challenger.
- Challenged player.
- Blocker.
- Winner.

Spotlight should not be overused. If every player glows, no one is focused.

### Spotlight Variants

| Variant | Use Case |
| --- | --- |
| Warm gold spotlight | Normal turn, Income, Tax, successful reveal. |
| Cold blue spotlight | Exchange, Ambassador-related actions. |
| Red spotlight | Assassinate, Coup target, failed bluff. |
| White tribunal spotlight | Challenge confrontation. |
| Dim funeral spotlight | Influence loss or elimination. |

## Target Marks

Target marks should appear above or over the target portrait.

| Action | Mark |
| --- | --- |
| Steal | Coin sigil or cut purse icon. |
| Assassinate | Red dagger mark. |
| Coup | Royal execution seal. |
| Challenge | Lightning crack or tribunal seal. |
| Block | Shield/seal mark over blocker. |

Target marks should be temporary and cleared after the event resolves.

## Beams and Paths

A beam/path communicates direction.

Use it when:

- Coins move from target to actor.
- Actor selects target.
- A challenge is aimed at a player.
- An assassination attempt targets someone.

Beam style by event:

| Event | Beam Style |
| --- | --- |
| Steal | Curved gold coin trail. |
| Assassinate | Thin red slash line. |
| Coup | Heavy royal decree line or execution chain. |
| Challenge | White lightning crack from challenger to challenged. |
| Block | Defensive barrier between action and target. |

## Timing Guidelines

Animations should be short enough to keep the game moving.

| Animation Type | Duration |
| --- | --- |
| Tiny state change | 200-400ms |
| Simple action | 400-900ms |
| Standard action | 900-1600ms |
| Reaction interruption | 700-1300ms |
| Challenge reveal | 2500-4500ms |
| Coup/assassination | 2500-5500ms |
| Victory | 5000ms+ |

## Easing Guidelines

Suggested easing language:

| Motion | Easing Feel |
| --- | --- |
| Coin landing | Fast out, soft bounce. |
| Card flip | Slow suspense into quick snap. |
| Spotlight move | Smooth cinematic pan. |
| Challenge impact | Sharp ease-out. |
| Coup seal slam | Heavy ease-in impact. |
| Elimination burn | Slow dissolve. |

## Text Treatment

The UI should use short cinematic phrases.

Examples:

- `Treasury Opens`
- `Foreign Aid Requested`
- `Steal Attempt`
- `Assassination Contract`
- `Coup Initiated`
- `Challenge`
- `Claim Verified`
- `Bluff Exposed`
- `Influence Lost`
- `Final Duel`

Avoid long paragraphs inside the theater. Use the event log for details.

## Public Clarity Labels

Every cinematic should have a plain-language label somewhere in the UI.

Examples:

```txt
Royyan claims Duke and takes Tax.
Sarah challenges Royyan's Duke claim.
Royyan reveals Duke. Sarah loses influence.
```

This protects clarity if the player misses the animation.

## Color and Mood Semantics

The specific palette can be changed later, but the semantic mapping should stay stable.

| Mood | Suggested Treatment |
| --- | --- |
| Gold | Authority, treasury, verified truth. |
| Red | Violence, assassination, coup, exposed lie. |
| Blue | Secrets, exchange, ambassador, hidden movement. |
| White | Judgment, challenge, tribunal, truth testing. |
| Grey | Elimination, death, inactive player. |
| Purple | Deception, bluff aura, late-game mystery. |

## Sound Cue Semantics

Sound is optional, but if added later, it should follow the same hierarchy.

| Event | Sound Feel |
| --- | --- |
| Income | Small coin tick. |
| Tax | Vault opening, coin shower. |
| Steal | Quick swipe and coin trail. |
| Block | Shield hit, decree stamp, fan snap. |
| Challenge | Thunder crack, courtroom hit. |
| Reveal truth | Warm confirmation chord. |
| Reveal lie | Sharp rupture. |
| Assassinate | Low sting, blade flash. |
| Coup | Drum hit, marching guards. |
| Victory | Coronation chord. |

## Motion Safety

Avoid:

- Rapid repeated flashing.
- Excessive screen shake.
- Long animations after every small action.
- Effects that obscure player names or coin counts for too long.
- Animations that imply wrong state changes.

## Reduced-Motion Standard

Every animation must have a reduced-motion version.

Reduced-motion version should:

- Keep the same text.
- Use fades instead of movement.
- Avoid shake.
- Avoid flashing.
- Shorten long sequences.
- Still show final state clearly.

Example:

Full animation:

```txt
Vault opens → gold particles → coins fly → coin counter increments.
```

Reduced motion:

```txt
Text: Royyan takes Tax and receives 3 coins.
Coin counter fades from 2 to 5.
```