# UI Theater Architecture

This document describes the UI-only architecture for turning the Coup web game into a theatrical shared-screen experience.

The main architectural idea is to treat the game screen as a presentation engine, not as a normal dashboard.

## Goals

The UI architecture should support:

- A shared projector screen that never leaks hidden information.
- Player portraits, coin counts, public influence state, and turn focus.
- A central Action Theater for cinematic action resolution.
- A background world that changes as the match becomes more dangerous.
- A queue-based animation system so actions, blocks, challenges, reveals, and eliminations are visually ordered.
- A future split between shared-screen mode and personal-device mode.

## Main Layout

```txt
GameShell
└─ GameTheater
   ├─ BackgroundWorldLayer
   ├─ SceneMemoryLayer
   ├─ PlayerStageLayer
   ├─ ActionDramaLayer
   ├─ FXLayer
   ├─ UILayer
   └─ AudioCueLayer
```

## Layer Responsibilities

| Layer | Responsibility |
| --- | --- |
| `BackgroundWorldLayer` | Persistent world mood: council chamber, unrest, collapse, final duel, lighting, fog, rain, fire. |
| `SceneMemoryLayer` | Persistent marks caused by previous actions: wanted posters, broken statues, torn banners, scorch marks. |
| `PlayerStageLayer` | Public player information: portrait, name, coin count, influence backs, alive/eliminated state. |
| `ActionDramaLayer` | Temporary event staging: Tax, Steal, Assassinate, Coup, Challenge, Block, Reveal. |
| `FXLayer` | Particle/canvas effects: coins, fog, lightning, smoke, beams, screen shake. |
| `UILayer` | Timers, prompts, current action label, accessibility text, reduced-motion fallback. |
| `AudioCueLayer` | Optional sound cue orchestration. Should be easy to disable. |

## Suggested Folder Structure

```txt
src/
  game-ui/
    theater/
      GameTheater.tsx
      BackgroundWorldLayer.tsx
      SceneMemoryLayer.tsx
      PlayerStageLayer.tsx
      ActionDramaLayer.tsx
      FXLayer.tsx
      UILayer.tsx
      AudioCueLayer.tsx

    players/
      PlayerPortrait.tsx
      PlayerNameplate.tsx
      CoinCounter.tsx
      InfluenceBacks.tsx
      PlayerStatusBadges.tsx
      PlayerAnchorProvider.tsx

    animations/
      theaterQueue.ts
      animationRegistry.ts
      animationContext.ts
      timelines/
        playIncome.ts
        playForeignAid.ts
        playTax.ts
        playSteal.ts
        playExchange.ts
        playBlock.ts
        playChallenge.ts
        playReveal.ts
        playLoseInfluence.ts
        playAssassinate.ts
        playCoup.ts
        playVictory.ts

    fx/
      PixiStage.tsx
      coinParticles.ts
      fogField.ts
      spotlight.ts
      lightning.ts
      projectileBeam.ts
      cardFlip.ts
      screenShake.ts

    state/
      useGameUIStore.ts
      selectors.ts
      sceneResolver.ts
      tensionResolver.ts
      scarsReducer.ts

    types/
      game.ts
      theater.ts
      animation.ts
```

## Separate Game State from UI State

Game rules should not know about fog, spotlights, particles, or cinematic scenes.

Game state answers:

- Who is alive?
- Whose turn is it?
- How many coins does each player have?
- How many hidden or revealed influences does each player have?
- Which action was declared?
- Which block, challenge, reveal, or influence loss happened?

UI state answers:

- Which theater mode is active?
- Which player is focused?
- Which player is targeted?
- What is the current tension level?
- What scars exist in the background?
- Which animation is currently playing?
- Is reduced-motion mode enabled?

Example:

```ts
type GameState = {
  players: Player[]
  currentTurnPlayerId: string
  phase: GamePhase
  pendingReaction?: PendingReaction
  lastResolvedEvent?: GameEvent
}

type GameUIState = {
  theaterMode: TheaterMode
  activeTheaterEvent: TheaterEvent | null
  focusedPlayerId: string | null
  targetPlayerId: string | null
  tension: number
  scene: TheaterScene
  scars: TheaterScar[]
  reducedMotion: boolean
}
```

## Theater Modes

```ts
type TheaterMode =
  | 'normal'
  | 'action-preview'
  | 'cinematic'
  | 'tribunal'
  | 'influence-reveal'
  | 'victory'
```

### Normal

Default screen. Shows the background, players, coin counts, turn spotlight, and public prompts.

### Action Preview

Used while a player is selecting an action or target. This mode can show preview beams, target outlines, and intent labels.

### Cinematic

Used when an action resolves. The UI can temporarily dim other elements and stage the actor/target.

### Tribunal

Used for challenges. The scene becomes a courtroom-like confrontation between challenger and challenged player.

### Influence Reveal

Used when a card is revealed or a player loses influence. This mode prioritizes card flip clarity.

### Victory

Used when the match ends. This mode transitions into a coronation/final result scene.

## Scene Resolver

The persistent background should be derived from game state.

```ts
type TheaterScene =
  | 'royal-council'
  | 'political-unrest'
  | 'kingdom-collapse'
  | 'final-duel'
  | 'victory-coronation'

function resolveTheaterScene(gameState: GameState): TheaterScene {
  const alivePlayers = gameState.players.filter((player) => player.alive).length

  if (gameState.phase === 'finished') return 'victory-coronation'
  if (alivePlayers === 2) return 'final-duel'
  if (alivePlayers <= 4) return 'kingdom-collapse'
  if (alivePlayers <= 6) return 'political-unrest'

  return 'royal-council'
}
```

## Tension Resolver

The background should not only jump between scenes. It should also have a continuous tension value from `0` to `1`.

```ts
function resolveTension(gameState: GameState): number {
  const totalPlayers = gameState.players.length
  const alivePlayers = gameState.players.filter((player) => player.alive).length
  const deadRatio = 1 - alivePlayers / totalPlayers
  const coupThreatCount = gameState.players.filter((player) => player.coins >= 7).length
  const coupThreatPressure = Math.min(coupThreatCount * 0.1, 0.3)

  return clamp(deadRatio * 0.7 + coupThreatPressure, 0, 1)
}
```

The tension value should control:

- Fog opacity.
- Ambient darkness.
- Lightning frequency.
- Fire intensity.
- Banner damage.
- Camera shake strength for large events.

## Player Anchors

Every player portrait should expose its screen position.

```tsx
<div data-player-anchor={player.id} ref={setAnchorRef(player.id)}>
  <PlayerPortrait player={player} />
</div>
```

The animation layer can then do this:

```ts
const actorRect = getPlayerAnchorRect(actorId)
const targetRect = getPlayerAnchorRect(targetId)
```

This is needed for:

- Coins moving between players.
- Targeting beams.
- Spotlight positioning.
- Challenge confrontation staging.
- Assassination marks.
- Influence loss effects.

## DOM vs Canvas/WebGL

Use DOM for layout and public information. Use canvas/WebGL for visual effects.

| DOM | Canvas/WebGL |
| --- | --- |
| Player portraits | Coin particles |
| Player names | Fog |
| Coin counters | Fire |
| Influence backs | Rain |
| Timers | Lightning |
| Buttons | Beams |
| Action labels | Smoke |

This hybrid approach keeps the UI easy to maintain while allowing dramatic visual effects.

## Design Rule

Adding a new animation should require:

1. Adding a new `TheaterEvent` type if needed.
2. Adding a timeline function.
3. Registering that function in the animation registry.
4. Optionally adding new FX helpers.

It should not require rewriting player components, background components, or game logic.