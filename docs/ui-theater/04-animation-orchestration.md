# Animation Orchestration

This document describes the UI animation system for Coup.

The main rule is simple:

> Game events should not directly animate UI components. Game events should be converted into theater events, then played through a queue.

## Why Use an Animation Queue

Coup has many chained events:

```txt
Action declared
→ Challenge window
→ Block declared
→ Challenge block
→ Reveal card
→ Lose influence
→ Resolve or cancel action
→ End turn
```

If every component animates independently, the UI becomes hard to reason about.

The animation queue gives control over:

- Order.
- Timing.
- Interruptions.
- Cleanup.
- Reduced-motion variants.
- Replay/debugging.

## Theater Event Type

```ts
type TheaterEvent =
  | { type: 'turn-start'; playerId: string }
  | { type: 'income'; actorId: string }
  | { type: 'foreign-aid'; actorId: string }
  | { type: 'tax'; actorId: string }
  | { type: 'steal'; actorId: string; targetId: string; amount: number }
  | { type: 'exchange'; actorId: string }
  | { type: 'assassinate'; actorId: string; targetId: string }
  | { type: 'coup'; actorId: string; targetId: string }
  | { type: 'block'; blockerId: string; blockedAction: string; cardClaim: string }
  | { type: 'challenge'; challengerId: string; challengedId: string; claim: string }
  | { type: 'reveal'; playerId: string; card: CoupCard; result: 'truth' | 'lie' }
  | { type: 'lose-influence'; playerId: string; card: CoupCard; eliminated: boolean }
  | { type: 'turn-end'; playerId: string }
  | { type: 'victory'; winnerId: string }
```

## Animation Context

Every animation should receive a context object instead of importing stores directly.

```ts
type AnimationContext = {
  getPlayerRect: (playerId: string) => DOMRect
  setTheaterMode: (mode: TheaterMode) => void
  setDramaText: (text: string | null) => void
  focusPlayer: (playerId: string | null) => void
  targetPlayer: (playerId: string | null) => void
  setClaimText: (text: string | null) => void
  spawnCoins: (input: CoinParticleInput) => Promise<void>
  spawnBeam: (input: BeamInput) => Promise<void>
  spawnFog: (input: FogInput) => Promise<void>
  spawnCardReveal: (input: CardRevealInput) => Promise<void>
  screenShake: (strength: number, duration: number) => Promise<void>
  wait: (ms: number) => Promise<void>
  cleanup: () => void
  reducedMotion: boolean
}
```

This makes animations easier to test and replace.

## Animation Registry

```ts
const animationRegistry: Record<TheaterEvent['type'], AnimationHandler> = {
  'turn-start': playTurnStart,
  income: playIncome,
  'foreign-aid': playForeignAid,
  tax: playTax,
  steal: playSteal,
  exchange: playExchange,
  assassinate: playAssassinate,
  coup: playCoup,
  block: playBlock,
  challenge: playChallenge,
  reveal: playReveal,
  'lose-influence': playLoseInfluence,
  'turn-end': playTurnEnd,
  victory: playVictory,
}
```

## Queue Behavior

Pseudo-code:

```ts
class TheaterQueue {
  private queue: TheaterEvent[] = []
  private playing = false
  private activeController: AbortController | null = null

  enqueue(event: TheaterEvent) {
    this.queue.push(event)
    this.playNext()
  }

  async playNext() {
    if (this.playing) return

    const event = this.queue.shift()
    if (!event) return

    this.playing = true
    this.activeController = new AbortController()

    try {
      const handler = animationRegistry[event.type]
      await handler(event, createAnimationContext(this.activeController.signal))
    } finally {
      this.playing = false
      this.activeController = null
      this.playNext()
    }
  }

  interrupt(event: TheaterEvent) {
    this.activeController?.abort()
    this.queue.unshift(event)
  }

  clear() {
    this.activeController?.abort()
    this.queue = []
  }
}
```

## Interruptions

Some events interrupt other events.

Examples:

- Challenge interrupts action animation.
- Block interrupts action animation.
- Reveal interrupts challenge/block resolution.
- Victory interrupts everything.

Interruption rules:

| Current Event | Incoming Event | Behavior |
| --- | --- | --- |
| Action preview | Challenge | Freeze or cancel preview, enter Tribunal. |
| Action preview | Block | Freeze preview, play block interruption. |
| Coin movement | Block | Stop coins mid-path or reverse them. |
| Assassination | Contessa block | Stop dagger/mark, clear red mark. |
| Any event | Victory | Clear queue and play victory. |

## Cleanup Discipline

Every animation must clean up after itself.

Cleanup includes:

- Remove temporary text.
- Remove beams.
- Clear target marks.
- Reset spotlight if needed.
- Kill timelines.
- Remove temporary DOM nodes.
- Resolve particle promises.

Example:

```ts
async function playTax(event: TaxEvent, ctx: AnimationContext) {
  try {
    ctx.setTheaterMode('cinematic')
    ctx.focusPlayer(event.actorId)
    ctx.setDramaText('Treasury Opens')
    await ctx.spawnCoins({ amount: 3, toPlayerId: event.actorId })
  } finally {
    ctx.cleanup()
    ctx.setTheaterMode('normal')
  }
}
```

## Timeline Composition

Each cinematic should be built from small reusable timeline actions.

Reusable actions:

- `dimBackground()`
- `focusPlayer(playerId)`
- `targetPlayer(playerId)`
- `showDramaTitle(text)`
- `moveCoins(from, to, amount)`
- `showClaimBadge(playerId, card)`
- `screenShake(strength)`
- `flipCard(card)`
- `burnCard()`
- `clearStage()`

This allows a readable sequence:

```ts
await timeline(ctx)
  .mode('cinematic')
  .focus(event.actorId)
  .title('Treasury Opens')
  .fx('vault-open')
  .coins({ amount: 3, to: event.actorId })
  .wait(300)
  .clear()
```

## State Update Timing

For clarity, some visual changes should happen before state update, and some after.

### Update immediately

Use immediate updates when the change is the premise of the animation.

Examples:

- Current player spotlight.
- Declared action text.
- Reaction window prompt.

### Update after animation beat

Use delayed updates when the animation explains the change.

Examples:

- Coin count increment after coins land.
- Influence count decrement after reveal.
- Player eliminated after portrait burn/crack.

## Reduced Motion Variant

Every animation handler should support reduced motion.

Example:

```ts
if (ctx.reducedMotion) {
  ctx.setDramaText('Royyan takes Tax and receives 3 coins.')
  await ctx.wait(500)
  return
}
```

Reduced motion should:

- Skip screen shake.
- Skip flashing.
- Replace long particle sequences with fades.
- Reduce duration.
- Keep text summaries.

## Debug Mode

Add a UI-only debug panel during development.

Useful controls:

- Play Income.
- Play Tax.
- Play Steal.
- Play Challenge.
- Play Reveal Truth.
- Play Reveal Lie.
- Play Coup.
- Play Victory.
- Set scene: Royal, Unrest, Collapse, Duel.
- Set tension slider.
- Toggle reduced motion.

This lets you tune animation without playing full games.

## Recommended First Milestone

Build the queue and registry before building complex visuals.

Milestone output:

- `TheaterQueue` exists.
- `AnimationContext` exists.
- `playTurnStart`, `playIncome`, and `playTax` exist.
- Debug panel can manually enqueue those events.
- The UI can finish each animation and return to normal mode.

Once this works, the rest of the cinematic system becomes easier to add safely.