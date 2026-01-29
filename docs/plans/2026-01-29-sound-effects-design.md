# Sound Effects for PatchPlay Videos

## Overview

Add punchy sound effects synced to scene transitions, giving videos a polished, dynamic feel.

## Sound Mapping

| Scene | Sound | Timing | Description |
|-------|-------|--------|-------------|
| IntroScene | Whoosh | Frame 0 | Rising sweep as intro appears |
| HeadlineScene | Impact | Frame 0 | Bass thud for headline punch |
| BulletScene | Pop | Frame 0 of each | Soft click/bubble per bullet |
| OutroScene | Chime | Frame 0 | Success tone for completion |

## Technical Approach

### Audio Files

Location: `public/audio/`

```
public/audio/
  whoosh.mp3    (~10-20KB)
  impact.mp3    (~10-20KB)
  pop.mp3       (~5-10KB)
  chime.mp3     (~15-25KB)
```

Total bundle size: ~50-70KB

Source: Royalty-free libraries (Pixabay, Freesound.org, or Mixkit) with commercial-use licenses.

### Integration

Use Remotion's `<Audio>` component inside each `<Sequence>`:

```tsx
import { Audio } from 'remotion';

// In Composition.tsx, inside each Sequence:
<Sequence from={0} durationInFrames={INTRO_DURATION}>
  <Audio src="/audio/whoosh.mp3" />
  <IntroScene ... />
</Sequence>
```

The `<Audio>` component auto-syncs to Sequence timing - no manual frame math needed.

### Volume Control

Each `<Audio>` accepts a `volume` prop (0-1) for mix balancing:

```tsx
<Audio src="/audio/pop.mp3" volume={0.7} />
```

## Files to Change

1. **Add `public/audio/`** - 4 SFX files (whoosh, impact, pop, chime)
2. **Update `src/video/Composition.tsx`** - Import `Audio` from remotion, add `<Audio>` to each Sequence

## Out of Scope

- Background music
- Voiceover/TTS
- User-configurable audio settings
- Mute toggle (Remotion Player has built-in controls)
