# Assassination, Coup, and Victory Animation Specs

This document covers the highest-drama moments in the Coup UI.

These animations should feel cinematic, but they still need to be clear and reasonably paced.

## Assassinate

### Purpose

Assassination should feel dangerous, secretive, and personal.

It is not just a target losing influence. It is the moment where the game becomes violent.

### Public Text

```txt
Royyan claims Assassin and targets Sarah.
```

### Visual Sequence

1. Actor receives a narrow red spotlight.
2. Background darkens quickly.
3. Fog rolls into the center stage.
4. Target portrait receives a red dagger mark.
5. A thin red line or shadow trail connects actor to target.
6. Reaction window opens for challenge/block.
7. If unblocked and successful, dagger flash appears.
8. Target enters influence-loss reveal ceremony.
9. Assassination mood clears.

### Challenge/Block Interruption

Assassination can be interrupted by:

- Challenge against Assassin claim.
- Contessa block.
- Challenge against Contessa block.

The animation should therefore have two parts:

```txt
assassination-preview
→ reaction chain
→ assassination-resolution or assassination-cancelled
```

### Successful Resolution

1. Red dagger mark pulses once.
2. Quick blade flash crosses target portrait.
3. Screen shakes lightly.
4. Target card back detaches.
5. Influence reveal ceremony begins.

### Blocked by Contessa

1. Dagger mark freezes.
2. Contessa fan opens in front of the target.
3. Red line breaks.
4. Red lighting fades.
5. Text: `Assassination Blocked`.

### Timing

| Beat | Duration |
| --- | --- |
| Mood shift | 500-800ms |
| Target mark | 200-300ms |
| Reaction window | Game controlled |
| Successful strike | 400-700ms |
| Handoff to influence reveal | 200ms |

## Coup

### Purpose

Coup is the most powerful action in the game. It cannot be blocked or challenged. It should feel inevitable.

### Public Text

```txt
Royyan launches a Coup against Sarah.
```

### Visual Sequence

1. All background ambience drops for a moment.
2. Actor gets a harsh royal spotlight.
3. Target is marked with an execution seal.
4. Giant text appears: `COUP INITIATED`.
5. Royal guards, chains, decree, or banners sweep across the center stage.
6. Target portrait is pulled into the center focus.
7. Target loses influence through reveal ceremony.
8. A permanent scene scar appears: broken statue, torn banner, or execution seal.
9. Theater returns to persistent scene with higher tension.

### Visual Tone

- Heavy.
- Ceremonial.
- Inevitable.
- Less sneaky than assassination.
- More public and political.

### Timing

| Beat | Duration |
| --- | --- |
| Impact intro | 300-500ms |
| Seal mark | 300ms |
| Guard/decree animation | 1000-1800ms |
| Target focus | 500ms |
| Handoff to influence reveal | 200ms |

Total before reveal: 2300-3300ms.

### FX

- Heavy screen shake on decree stamp.
- Banner drop.
- Guard silhouettes.
- Dust particles.
- Royal seal.

### Reduced Motion

- No guard march.
- Use a large static `Coup Initiated` title.
- Fade target portrait to center.
- Start reveal ceremony.

## Final Duel Transition

### Purpose

When only two players remain, the whole room should emotionally shift.

### Trigger

When `alivePlayers === 2` after influence loss resolves.

### Visual Sequence

1. Eliminated player state completes.
2. Event log updates.
3. Ambience becomes quiet.
4. Background elements fade out.
5. Remaining two players become large or more prominent.
6. Two opposing spotlights appear.
7. Text appears: `Final Duel`.
8. Next turn begins.

### Timing

2500-4000ms.

### Notes

This should not happen too early. It should trigger only after the elimination sequence is complete.

## Victory

### Purpose

Victory should feel like the end of a political story.

Do not end the match with only a modal.

### Public Text

```txt
Royyan wins.
```

Optional title:

```txt
Master of Deception
```

### Visual Sequence

1. All running animations stop.
2. Background enters `victory-coronation` scene.
3. Eliminated players fade into wall shadows but remain visible.
4. Winner portrait remains fully lit.
5. Winner moves or scales toward the center throne.
6. Storm clears or fire calms.
7. Gold banner drops from the top.
8. Victory title appears.
9. Match stats appear.
10. Replay/new game controls appear.

### Match Stats Ideas

- Turns survived.
- Coins gained.
- Coins stolen.
- Coups launched.
- Assassinations attempted.
- Blocks claimed.
- Challenges won.
- Challenges lost.
- Revealed cards.
- Final influence remaining.

### Victory Titles

| Condition | Title |
| --- | --- |
| Won after many successful bluffs | Master of Deception |
| Won with many coins | Treasurer of Shadows |
| Won after multiple assassinations | Silent Blade |
| Won after many challenges | Judge of the Court |
| Won without losing influence | Untouched Regent |
| Generic | Last Influence Standing |

### Timing

| Beat | Duration |
| --- | --- |
| Stop active scene | 300ms |
| Winner spotlight | 600ms |
| Background coronation | 1500-2500ms |
| Banner drop | 700-1000ms |
| Stats reveal | 1000-2000ms |

Total: 5000ms+.

## Scene Scars from Major Events

Major events should leave persistent marks.

### Assassination Scar

After successful assassination:

- Add wanted poster of actor.
- Add red scratch mark near target side.
- Increase darkness slightly.

### Coup Scar

After Coup:

- Add broken statue of target or generic court statue.
- Add royal execution seal on floor/wall.
- Add torn banner.

### Victory Scar Summary

At victory, the background can briefly highlight the match scars as a visual recap.

Example:

```txt
The court remembers:
- 3 coups
- 2 assassinations
- 5 challenges
```

## Implementation Notes

Assassination and Coup should reuse shared primitives:

- `focusPlayer`
- `targetPlayer`
- `showDramaTitle`
- `spawnBeam`
- `screenShake`
- `spawnCardReveal`
- `addSceneScar`

Avoid making these animations isolated one-off implementations. They should be composed from shared primitives so future special effects are easier to add.