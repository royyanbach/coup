# Background World System

This document describes how the Action Theater background changes throughout a match.

The background should behave like a living political world. It should reflect the emotional state of the game, not just decorate the screen.

## Background Layers

The background should be built from composable layers instead of one static image.

```txt
BackgroundWorldLayer
├─ BaseRoomLayer
├─ LightingLayer
├─ WeatherLayer
├─ FogLayer
├─ BannerLayer
├─ FireLayer
├─ CrowdShadowLayer
├─ VignetteLayer
└─ CameraTreatmentLayer
```

## Why Layered Backgrounds

A layered background lets the UI evolve without replacing the entire scene.

For example:

- Early game: same chamber, warm sunlight, clean banners, low fog.
- Mid game: same chamber, flickering light, torn banners, more fog.
- Late game: same chamber, broken pillars, fire, storm, heavy vignette.
- Final duel: most layers fade away and only two spotlights remain.

## Persistent Scenes

```ts
type TheaterScene =
  | 'royal-council'
  | 'political-unrest'
  | 'kingdom-collapse'
  | 'final-duel'
  | 'victory-coronation'
```

## Scene 1: Royal Council

Used at the beginning of the match.

Mood:

- Stable.
- Formal.
- Bright.
- Politically tense but not yet violent.

Visuals:

- Warm sunlight through tall windows.
- Clean marble floor.
- Royal banners intact.
- Low fog or no fog.
- Calm candle flicker.
- Subtle gold particles in the air.

CSS variables:

```css
.game-theater[data-scene='royal-council'] {
  --ambient-darkness: 0.05;
  --fog-opacity: 0.05;
  --fire-opacity: 0;
  --rain-opacity: 0;
  --banner-damage: 0;
  --vignette-opacity: 0.15;
}
```

## Scene 2: Political Unrest

Used when the number of alive players starts dropping or coin pressure increases.

Mood:

- Suspicious.
- Less stable.
- Court factions are forming.

Visuals:

- Clouds outside windows.
- Stronger candle flicker.
- Banners slightly torn.
- Fog begins to crawl near the floor.
- Occasional distant thunder.
- Shadows of guards passing in the background.

CSS variables:

```css
.game-theater[data-scene='political-unrest'] {
  --ambient-darkness: 0.22;
  --fog-opacity: 0.25;
  --fire-opacity: 0.05;
  --rain-opacity: 0.15;
  --banner-damage: 0.35;
  --vignette-opacity: 0.3;
}
```

## Scene 3: Kingdom Collapse

Used when only 3-4 players remain or several influence cards have been lost.

Mood:

- Dangerous.
- Violent.
- The kingdom is breaking.

Visuals:

- Broken pillars.
- Heavy rain or storm outside.
- Lightning flashes.
- Fire in corners.
- Torn banners.
- Smoke.
- Strong vignette.
- More aggressive camera shake during large actions.

CSS variables:

```css
.game-theater[data-scene='kingdom-collapse'] {
  --ambient-darkness: 0.48;
  --fog-opacity: 0.55;
  --fire-opacity: 0.4;
  --rain-opacity: 0.5;
  --banner-damage: 0.8;
  --vignette-opacity: 0.55;
}
```

## Scene 4: Final Duel

Used when two players remain.

Mood:

- Quiet.
- Focused.
- Personal.
- No more politics, only survival.

Visuals:

- Most background details fade out.
- One throne or central emblem remains.
- Two opposing spotlights.
- Rain/fire becomes slower and less noisy.
- The room feels larger and emptier.

CSS variables:

```css
.game-theater[data-scene='final-duel'] {
  --ambient-darkness: 0.65;
  --fog-opacity: 0.45;
  --fire-opacity: 0.15;
  --rain-opacity: 0.25;
  --banner-damage: 1;
  --vignette-opacity: 0.75;
}
```

## Scene 5: Victory Coronation

Used when the game ends.

Mood:

- Final.
- Mythic.
- Triumphant or sinister depending on design direction.

Visuals:

- Storm clears.
- Strong spotlight on winner.
- Throne lights up.
- Banners drop.
- Defeated players fade into wall shadows.
- Gold particles return, but with a heavier, final tone.

CSS variables:

```css
.game-theater[data-scene='victory-coronation'] {
  --ambient-darkness: 0.25;
  --fog-opacity: 0.2;
  --fire-opacity: 0.1;
  --rain-opacity: 0;
  --banner-damage: 1;
  --vignette-opacity: 0.35;
}
```

## Tension as a Continuous Value

Scenes are broad stages. Tension adds smooth progression.

```ts
type TensionInput = {
  totalPlayers: number
  alivePlayers: number
  revealedInfluenceCount: number
  coupThreatCount: number
  recentChallengeCount: number
}
```

Suggested calculation:

```ts
function calculateTension(input: TensionInput): number {
  const deadRatio = 1 - input.alivePlayers / input.totalPlayers
  const influencePressure = Math.min(input.revealedInfluenceCount * 0.05, 0.25)
  const coupPressure = Math.min(input.coupThreatCount * 0.1, 0.25)
  const challengePressure = Math.min(input.recentChallengeCount * 0.04, 0.16)

  return clamp(deadRatio * 0.55 + influencePressure + coupPressure + challengePressure, 0, 1)
}
```

Use tension to drive CSS variables:

```tsx
<div
  className="game-theater"
  data-scene={scene}
  style={{
    '--tension': tension,
  } as React.CSSProperties}
/>
```

```css
.bg-fog {
  opacity: calc(0.05 + var(--tension) * 0.55);
}

.bg-vignette {
  opacity: calc(0.15 + var(--tension) * 0.5);
}

.bg-fire {
  opacity: calc(var(--tension) * 0.45);
}
```

## Scene Memory Scars

The background should remember major events.

```ts
type TheaterScar =
  | { id: string; type: 'wanted-poster'; playerId: string; intensity: number }
  | { id: string; type: 'broken-statue'; playerId: string; intensity: number }
  | { id: string; type: 'burn-mark'; x: number; y: number; intensity: number }
  | { id: string; type: 'torn-banner'; faction?: string; intensity: number }
  | { id: string; type: 'guard-presence'; intensity: number }
  | { id: string; type: 'coin-spill'; playerId: string; intensity: number }
```

Examples:

| Event | Scar |
| --- | --- |
| Successful assassination | Wanted poster of actor appears. |
| Coup | Broken statue or execution seal appears. |
| Repeated steals | Coin spill or torn treasury bags appear. |
| Many blocks | More guard silhouettes appear. |
| Failed bluff | Cracked mask appears near liar's side. |
| Final duel | All scars fade except the most important ones. |

## Scar Reducer

```ts
function reduceScars(scars: TheaterScar[], event: TheaterEvent): TheaterScar[] {
  switch (event.type) {
    case 'assassinate':
      return addOrIntensifyScar(scars, {
        type: 'wanted-poster',
        playerId: event.actorId,
        intensity: 0.4,
      })

    case 'coup':
      return addOrIntensifyScar(scars, {
        type: 'broken-statue',
        playerId: event.targetId,
        intensity: 0.6,
      })

    case 'steal':
      return addOrIntensifyScar(scars, {
        type: 'coin-spill',
        playerId: event.actorId,
        intensity: 0.25,
      })

    default:
      return scars
  }
}
```

## Background Transition Rules

Transitions should be slow except during cinematic interruptions.

Recommended durations:

| Transition | Duration |
| --- | --- |
| Royal Council → Political Unrest | 1200-2000ms |
| Political Unrest → Kingdom Collapse | 1500-2500ms |
| Kingdom Collapse → Final Duel | 2500-3500ms |
| Final Duel → Victory Coronation | 4000ms+ |
| Normal → Challenge Tribunal | 500-900ms |
| Normal → Assassination Mood | 500-800ms |
| Normal → Coup Takeover | 300-600ms |

## Reduced-Motion Background

Reduced motion should keep the emotional state but remove distracting movement.

Reduced-motion adjustments:

- Disable looping rain particles.
- Disable lightning flash or replace with a soft brightness pulse.
- Disable screen shake.
- Use opacity fades instead of moving fog.
- Use static scars.
- Keep text descriptions visible.

## Implementation Priority

Phase 1:

- Static layered background.
- Scene resolver.
- Tension CSS variables.

Phase 2:

- Fog, vignette, banner damage, and lighting changes.
- Smooth scene transitions.

Phase 3:

- Scene memory scars.
- Event-driven background changes.

Phase 4:

- Canvas/WebGL weather, fire, lightning, and particle ambience.