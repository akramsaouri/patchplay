# PatchPlay Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a web app that transforms GitHub PRs into short-form social media videos.

**Architecture:** Vite + React frontend with Remotion Player for video preview. Vercel Edge Function handles GitHub API fetching and OpenAI summarization. Single-page app with input → loading → preview states.

**Tech Stack:** Vite, React, TypeScript, Remotion, Vercel Edge Functions, OpenAI gpt-4o-mini

---

## Task 1: Project Setup

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/types.ts`

**Step 1: Initialize the project with Vite**

```bash
npm create vite@latest . -- --template react-ts
```

When prompted, select current directory and overwrite.

**Step 2: Install dependencies**

```bash
npm install
npm install @remotion/player remotion
npm install -D @vercel/node
```

**Step 3: Create the VideoScript type**

Create `src/types.ts`:

```typescript
export interface VideoScript {
  meta: {
    repoName: string;
    prNumber: number;
    prTitle: string;
    author: string;
    authorAvatar: string;
    filesChanged: number;
    additions: number;
    deletions: number;
  };
  summary: {
    headline: string;
    vibe: 'feature' | 'fix' | 'refactor' | 'docs' | 'chore';
    bullets: string[];
    emoji: string;
  };
  style: {
    accentColor: string;
    tone: 'celebratory' | 'relief' | 'technical' | 'minor';
  };
}
```

**Step 4: Verify setup works**

```bash
npm run dev
```

Expected: Vite dev server starts, default React page loads at localhost:5173

**Step 5: Commit**

```bash
git add .
git commit -m "feat: initialize Vite + React + TypeScript project with Remotion"
```

---

## Task 2: Basic Remotion Composition

**Files:**
- Create: `src/video/Composition.tsx`
- Modify: `src/App.tsx`

**Step 1: Create the main composition component**

Create `src/video/Composition.tsx`:

```tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { VideoScript } from '../types';

export const PatchPlayComposition: React.FC<VideoScript> = (props) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#1a1a2e',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <h1 style={{ color: 'white', fontSize: 48 }}>
        {props.meta.repoName} #{props.meta.prNumber}
      </h1>
      <p style={{ color: '#888', fontSize: 24 }}>
        Frame {frame} / {durationInFrames} @ {fps}fps
      </p>
    </AbsoluteFill>
  );
};
```

**Step 2: Add Player to App.tsx**

Replace `src/App.tsx`:

```tsx
import { Player } from '@remotion/player';
import { PatchPlayComposition } from './video/Composition';
import type { VideoScript } from './types';

const mockData: VideoScript = {
  meta: {
    repoName: 'facebook/react',
    prNumber: 1234,
    prTitle: 'Add useFormStatus hook',
    author: 'gaearon',
    authorAvatar: 'https://github.com/gaearon.png',
    filesChanged: 12,
    additions: 847,
    deletions: 23,
  },
  summary: {
    headline: 'React just got better forms',
    vibe: 'feature',
    bullets: [
      'New useFormStatus hook for form state',
      'Works with React Server Components',
      'Reduces boilerplate by 40%',
    ],
    emoji: '🚀',
  },
  style: {
    accentColor: '#61dafb',
    tone: 'celebratory',
  },
};

function App() {
  return (
    <div style={{ padding: 40 }}>
      <h1>PatchPlay</h1>
      <Player
        component={PatchPlayComposition}
        inputProps={mockData}
        durationInFrames={450}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={30}
        style={{ width: '100%', maxWidth: 960 }}
        controls
      />
    </div>
  );
}

export default App;
```

**Step 3: Verify Remotion Player renders**

```bash
npm run dev
```

Expected: Page shows "PatchPlay" title with a video player showing "facebook/react #1234" and frame counter

**Step 4: Commit**

```bash
git add src/video/Composition.tsx src/App.tsx
git commit -m "feat: add basic Remotion Player with mock data"
```

---

## Task 3: Intro Scene

**Files:**
- Create: `src/video/scenes/IntroScene.tsx`
- Modify: `src/video/Composition.tsx`

**Step 1: Create IntroScene component**

Create `src/video/scenes/IntroScene.tsx`:

```tsx
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from 'remotion';

interface IntroSceneProps {
  repoName: string;
  prNumber: number;
  author: string;
  authorAvatar: string;
  accentColor: string;
}

export const IntroScene: React.FC<IntroSceneProps> = ({
  repoName,
  prNumber,
  author,
  authorAvatar,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 200 } });
  const titleY = interpolate(titleSpring, [0, 1], [100, 0]);
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const avatarSpring = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  const avatarScale = interpolate(avatarSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${accentColor}22 0%, #1a1a2e 50%, ${accentColor}11 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 30,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
        }}
      >
        <span style={{ fontSize: 72, fontWeight: 800, color: 'white' }}>
          {repoName}
        </span>
        <span
          style={{
            fontSize: 48,
            fontWeight: 600,
            color: accentColor,
            opacity: 0.8,
          }}
        >
          #{prNumber}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          transform: `scale(${avatarScale})`,
        }}
      >
        <Img
          src={authorAvatar}
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            border: `3px solid ${accentColor}`,
          }}
        />
        <span style={{ fontSize: 32, color: '#ccc' }}>@{author}</span>
      </div>
    </AbsoluteFill>
  );
};
```

**Step 2: Add Sequence to Composition**

Update `src/video/Composition.tsx`:

```tsx
import { AbsoluteFill, Sequence } from 'remotion';
import type { VideoScript } from '../types';
import { IntroScene } from './scenes/IntroScene';

export const PatchPlayComposition: React.FC<VideoScript> = (props) => {
  const { meta, style } = props;

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={90}>
        <IntroScene
          repoName={meta.repoName}
          prNumber={meta.prNumber}
          author={meta.author}
          authorAvatar={meta.authorAvatar}
          accentColor={style.accentColor}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
```

**Step 3: Verify intro scene animates**

```bash
npm run dev
```

Expected: Video shows animated repo name, PR number, and author avatar with spring animations

**Step 4: Commit**

```bash
git add src/video/scenes/IntroScene.tsx src/video/Composition.tsx
git commit -m "feat: add animated IntroScene with spring animations"
```

---

## Task 4: Headline Scene

**Files:**
- Create: `src/video/scenes/HeadlineScene.tsx`
- Modify: `src/video/Composition.tsx`

**Step 1: Create HeadlineScene component**

Create `src/video/scenes/HeadlineScene.tsx`:

```tsx
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface HeadlineSceneProps {
  headline: string;
  emoji: string;
  accentColor: string;
  tone: 'celebratory' | 'relief' | 'technical' | 'minor';
}

export const HeadlineScene: React.FC<HeadlineSceneProps> = ({
  headline,
  emoji,
  accentColor,
  tone,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textSpring = spring({ frame, fps, config: { damping: 200, stiffness: 100 } });
  const textScale = interpolate(textSpring, [0, 1], [0.8, 1]);
  const textOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const emojiSpring = spring({ frame: frame - 15, fps, config: { damping: 100, stiffness: 200 } });
  const emojiScale = interpolate(emojiSpring, [0, 1], [0, 1.2]);
  const emojiRotate = interpolate(emojiSpring, [0, 1], [-30, 0]);

  // Subtle floating animation for emoji
  const emojiFloat = Math.sin(frame * 0.1) * 5;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 50%, ${accentColor}33 0%, #1a1a2e 70%)`,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 40,
      }}
    >
      <div
        style={{
          fontSize: 160,
          transform: `scale(${emojiScale}) rotate(${emojiRotate}deg) translateY(${emojiFloat}px)`,
        }}
      >
        {emoji}
      </div>

      <h1
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: 'white',
          textAlign: 'center',
          maxWidth: 1400,
          lineHeight: 1.2,
          transform: `scale(${textScale})`,
          opacity: textOpacity,
          textShadow: `0 0 60px ${accentColor}66`,
        }}
      >
        {headline}
      </h1>
    </AbsoluteFill>
  );
};
```

**Step 2: Add HeadlineScene to Composition**

Update `src/video/Composition.tsx`:

```tsx
import { AbsoluteFill, Sequence } from 'remotion';
import type { VideoScript } from '../types';
import { IntroScene } from './scenes/IntroScene';
import { HeadlineScene } from './scenes/HeadlineScene';

export const PatchPlayComposition: React.FC<VideoScript> = (props) => {
  const { meta, summary, style } = props;

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={90}>
        <IntroScene
          repoName={meta.repoName}
          prNumber={meta.prNumber}
          author={meta.author}
          authorAvatar={meta.authorAvatar}
          accentColor={style.accentColor}
        />
      </Sequence>

      <Sequence from={90} durationInFrames={105}>
        <HeadlineScene
          headline={summary.headline}
          emoji={summary.emoji}
          accentColor={style.accentColor}
          tone={style.tone}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
```

**Step 3: Verify headline scene**

```bash
npm run dev
```

Expected: After intro, headline scene shows with animated emoji and text

**Step 4: Commit**

```bash
git add src/video/scenes/HeadlineScene.tsx src/video/Composition.tsx
git commit -m "feat: add HeadlineScene with emoji and text animations"
```

---

## Task 5: Bullet Scene with Layout Variants

**Files:**
- Create: `src/video/scenes/BulletScene.tsx`
- Create: `src/video/layouts/LayoutA.tsx`
- Create: `src/video/layouts/LayoutB.tsx`
- Create: `src/video/layouts/LayoutC.tsx`
- Create: `src/video/layouts/LayoutD.tsx`
- Modify: `src/video/Composition.tsx`

**Step 1: Create Layout A (Icon left, slide from left)**

Create `src/video/layouts/LayoutA.tsx`:

```tsx
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface LayoutProps {
  text: string;
  accentColor: string;
}

export const LayoutA: React.FC<LayoutProps> = ({ text, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideSpring = spring({ frame, fps, config: { damping: 200 } });
  const x = interpolate(slideSpring, [0, 1], [-400, 0]);
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 30,
        transform: `translateX(${x}px)`,
        opacity,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          backgroundColor: accentColor,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 40,
        }}
      >
        ✦
      </div>
      <span style={{ fontSize: 48, fontWeight: 600, color: 'white' }}>{text}</span>
    </div>
  );
};
```

**Step 2: Create Layout B (Centered, scale bounce)**

Create `src/video/layouts/LayoutB.tsx`:

```tsx
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface LayoutProps {
  text: string;
  accentColor: string;
}

export const LayoutB: React.FC<LayoutProps> = ({ text, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleSpring = spring({ frame, fps, config: { damping: 100, stiffness: 200 } });
  const scale = interpolate(scaleSpring, [0, 1], [0.5, 1]);
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        textAlign: 'center',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <span
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: 'white',
          textShadow: `0 0 40px ${accentColor}`,
        }}
      >
        {text}
      </span>
    </div>
  );
};
```

**Step 3: Create Layout C (Underline wipe)**

Create `src/video/layouts/LayoutC.tsx`:

```tsx
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface LayoutProps {
  text: string;
  accentColor: string;
}

export const LayoutC: React.FC<LayoutProps> = ({ text, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textSpring = spring({ frame, fps, config: { damping: 200 } });
  const y = interpolate(textSpring, [0, 1], [50, 0]);
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  const underlineWidth = interpolate(frame, [15, 40], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 15,
        transform: `translateY(${y}px)`,
        opacity,
      }}
    >
      <span style={{ fontSize: 52, fontWeight: 600, color: 'white' }}>{text}</span>
      <div
        style={{
          height: 6,
          width: `${underlineWidth}%`,
          backgroundColor: accentColor,
          borderRadius: 3,
          maxWidth: 600,
        }}
      />
    </div>
  );
};
```

**Step 4: Create Layout D (Split background)**

Create `src/video/layouts/LayoutD.tsx`:

```tsx
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface LayoutProps {
  text: string;
  accentColor: string;
}

export const LayoutD: React.FC<LayoutProps> = ({ text, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideSpring = spring({ frame, fps, config: { damping: 200 } });
  const clipPath = interpolate(slideSpring, [0, 1], [0, 50]);
  const textOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: accentColor,
          clipPath: `inset(0 ${100 - clipPath}% 0 0)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: textOpacity,
        }}
      >
        <span
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: 'white',
            mixBlendMode: 'difference',
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
```

**Step 5: Create BulletScene that cycles layouts**

Create `src/video/scenes/BulletScene.tsx`:

```tsx
import { AbsoluteFill } from 'remotion';
import { LayoutA } from '../layouts/LayoutA';
import { LayoutB } from '../layouts/LayoutB';
import { LayoutC } from '../layouts/LayoutC';
import { LayoutD } from '../layouts/LayoutD';

interface BulletSceneProps {
  text: string;
  index: number;
  accentColor: string;
}

const layouts = [LayoutA, LayoutB, LayoutC, LayoutD];

export const BulletScene: React.FC<BulletSceneProps> = ({
  text,
  index,
  accentColor,
}) => {
  const Layout = layouts[index % layouts.length];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#1a1a2e',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      <Layout text={text} accentColor={accentColor} />
    </AbsoluteFill>
  );
};
```

**Step 6: Add BulletScenes to Composition**

Update `src/video/Composition.tsx`:

```tsx
import { AbsoluteFill, Sequence } from 'remotion';
import type { VideoScript } from '../types';
import { IntroScene } from './scenes/IntroScene';
import { HeadlineScene } from './scenes/HeadlineScene';
import { BulletScene } from './scenes/BulletScene';

const INTRO_DURATION = 90; // 3s at 30fps
const HEADLINE_DURATION = 105; // 3.5s
const BULLET_DURATION = 75; // 2.5s each

export const PatchPlayComposition: React.FC<VideoScript> = (props) => {
  const { meta, summary, style } = props;

  const bulletStart = INTRO_DURATION + HEADLINE_DURATION;

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={INTRO_DURATION}>
        <IntroScene
          repoName={meta.repoName}
          prNumber={meta.prNumber}
          author={meta.author}
          authorAvatar={meta.authorAvatar}
          accentColor={style.accentColor}
        />
      </Sequence>

      <Sequence from={INTRO_DURATION} durationInFrames={HEADLINE_DURATION}>
        <HeadlineScene
          headline={summary.headline}
          emoji={summary.emoji}
          accentColor={style.accentColor}
          tone={style.tone}
        />
      </Sequence>

      {summary.bullets.map((bullet, i) => (
        <Sequence
          key={i}
          from={bulletStart + i * BULLET_DURATION}
          durationInFrames={BULLET_DURATION}
        >
          <BulletScene text={bullet} index={i} accentColor={style.accentColor} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
```

**Step 7: Verify bullet scenes with different layouts**

```bash
npm run dev
```

Expected: After headline, each bullet shows with a different layout variant

**Step 8: Commit**

```bash
git add src/video/scenes/BulletScene.tsx src/video/layouts src/video/Composition.tsx
git commit -m "feat: add BulletScene with 4 layout variants"
```

---

## Task 6: Outro Scene

**Files:**
- Create: `src/video/scenes/OutroScene.tsx`
- Modify: `src/video/Composition.tsx`

**Step 1: Create OutroScene with animated counters**

Create `src/video/scenes/OutroScene.tsx`:

```tsx
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

interface OutroSceneProps {
  repoName: string;
  filesChanged: number;
  additions: number;
  deletions: number;
  accentColor: string;
}

export const OutroScene: React.FC<OutroSceneProps> = ({
  repoName,
  filesChanged,
  additions,
  deletions,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const statsSpring = spring({ frame, fps, config: { damping: 200 } });
  const statsScale = interpolate(statsSpring, [0, 1], [0.8, 1]);
  const statsOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Animated counters
  const filesCount = Math.round(interpolate(frame, [0, 30], [0, filesChanged], {
    extrapolateRight: 'clamp',
  }));
  const addCount = Math.round(interpolate(frame, [5, 35], [0, additions], {
    extrapolateRight: 'clamp',
  }));
  const delCount = Math.round(interpolate(frame, [10, 40], [0, deletions], {
    extrapolateRight: 'clamp',
  }));

  // Fade out at end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, #1a1a2e 0%, ${accentColor}22 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 50,
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 60,
          transform: `scale(${statsScale})`,
          opacity: statsOpacity,
        }}
      >
        <StatBox label="Files" value={filesCount} color="#888" />
        <StatBox label="Additions" value={`+${addCount}`} color="#4ade80" />
        <StatBox label="Deletions" value={`-${delCount}`} color="#f87171" />
      </div>

      <span
        style={{
          fontSize: 36,
          color: '#666',
          opacity: statsOpacity,
        }}
      >
        {repoName}
      </span>
    </AbsoluteFill>
  );
};

const StatBox: React.FC<{ label: string; value: string | number; color: string }> = ({
  label,
  value,
  color,
}) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 72, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums' }}>
      {value}
    </div>
    <div style={{ fontSize: 24, color: '#666', marginTop: 8 }}>{label}</div>
  </div>
);
```

**Step 2: Add OutroScene to Composition and calculate total duration**

Update `src/video/Composition.tsx`:

```tsx
import { AbsoluteFill, Sequence } from 'remotion';
import type { VideoScript } from '../types';
import { IntroScene } from './scenes/IntroScene';
import { HeadlineScene } from './scenes/HeadlineScene';
import { BulletScene } from './scenes/BulletScene';
import { OutroScene } from './scenes/OutroScene';

const INTRO_DURATION = 90; // 3s at 30fps
const HEADLINE_DURATION = 105; // 3.5s
const BULLET_DURATION = 75; // 2.5s each
const OUTRO_DURATION = 90; // 3s

export const calculateDuration = (bulletCount: number): number => {
  return INTRO_DURATION + HEADLINE_DURATION + bulletCount * BULLET_DURATION + OUTRO_DURATION;
};

export const PatchPlayComposition: React.FC<VideoScript> = (props) => {
  const { meta, summary, style } = props;

  const bulletStart = INTRO_DURATION + HEADLINE_DURATION;
  const outroStart = bulletStart + summary.bullets.length * BULLET_DURATION;

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={INTRO_DURATION}>
        <IntroScene
          repoName={meta.repoName}
          prNumber={meta.prNumber}
          author={meta.author}
          authorAvatar={meta.authorAvatar}
          accentColor={style.accentColor}
        />
      </Sequence>

      <Sequence from={INTRO_DURATION} durationInFrames={HEADLINE_DURATION}>
        <HeadlineScene
          headline={summary.headline}
          emoji={summary.emoji}
          accentColor={style.accentColor}
          tone={style.tone}
        />
      </Sequence>

      {summary.bullets.map((bullet, i) => (
        <Sequence
          key={i}
          from={bulletStart + i * BULLET_DURATION}
          durationInFrames={BULLET_DURATION}
        >
          <BulletScene text={bullet} index={i} accentColor={style.accentColor} />
        </Sequence>
      ))}

      <Sequence from={outroStart} durationInFrames={OUTRO_DURATION}>
        <OutroScene
          repoName={meta.repoName}
          filesChanged={meta.filesChanged}
          additions={meta.additions}
          deletions={meta.deletions}
          accentColor={style.accentColor}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
```

**Step 3: Update App.tsx to use calculated duration**

Update `src/App.tsx`:

```tsx
import { Player } from '@remotion/player';
import { PatchPlayComposition, calculateDuration } from './video/Composition';
import type { VideoScript } from './types';

const mockData: VideoScript = {
  meta: {
    repoName: 'facebook/react',
    prNumber: 1234,
    prTitle: 'Add useFormStatus hook',
    author: 'gaearon',
    authorAvatar: 'https://github.com/gaearon.png',
    filesChanged: 12,
    additions: 847,
    deletions: 23,
  },
  summary: {
    headline: 'React just got better forms',
    vibe: 'feature',
    bullets: [
      'New useFormStatus hook for form state',
      'Works with React Server Components',
      'Reduces boilerplate by 40%',
    ],
    emoji: '🚀',
  },
  style: {
    accentColor: '#61dafb',
    tone: 'celebratory',
  },
};

function App() {
  const duration = calculateDuration(mockData.summary.bullets.length);

  return (
    <div style={{ padding: 40 }}>
      <h1>PatchPlay</h1>
      <Player
        component={PatchPlayComposition}
        inputProps={mockData}
        durationInFrames={duration}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={30}
        style={{ width: '100%', maxWidth: 960 }}
        controls
      />
    </div>
  );
}

export default App;
```

**Step 4: Verify full video plays through all scenes**

```bash
npm run dev
```

Expected: Video plays intro → headline → 3 bullets → outro with animated counters and fade out

**Step 5: Commit**

```bash
git add src/video/scenes/OutroScene.tsx src/video/Composition.tsx src/App.tsx
git commit -m "feat: add OutroScene with animated stats counters"
```

---

## Task 7: Vercel Edge Function - GitHub Fetching

**Files:**
- Create: `api/analyze.ts`
- Create: `vercel.json`

**Step 1: Create vercel.json config**

Create `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ]
}
```

**Step 2: Create the edge function with GitHub fetching**

Create `api/analyze.ts`:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface GitHubPR {
  title: string;
  user: { login: string; avatar_url: string };
  additions: number;
  deletions: number;
  changed_files: number;
  body: string | null;
}

interface GitHubFile {
  filename: string;
  additions: number;
  deletions: number;
  patch?: string;
}

function parsePrUrl(url: string): { owner: string; repo: string; number: number } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2], number: parseInt(match[3], 10) };
}

async function fetchGitHubPR(owner: string, repo: string, number: number) {
  const [prRes, filesRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${number}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${number}/files`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    }),
  ]);

  if (!prRes.ok) {
    if (prRes.status === 404) return { error: 'PR not found or is private', status: 404 };
    return { error: 'Failed to fetch PR', status: prRes.status };
  }

  const pr: GitHubPR = await prRes.json();
  const files: GitHubFile[] = await filesRes.json();

  return {
    pr,
    files,
    meta: {
      repoName: `${owner}/${repo}`,
      prNumber: number,
      prTitle: pr.title,
      author: pr.user.login,
      authorAvatar: pr.user.avatar_url,
      filesChanged: pr.changed_files,
      additions: pr.additions,
      deletions: pr.deletions,
    },
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prUrl } = req.body;

  if (!prUrl || typeof prUrl !== 'string') {
    return res.status(400).json({ error: 'prUrl is required' });
  }

  const parsed = parsePrUrl(prUrl);
  if (!parsed) {
    return res.status(400).json({ error: 'Invalid PR URL format' });
  }

  const result = await fetchGitHubPR(parsed.owner, parsed.repo, parsed.number);

  if ('error' in result) {
    return res.status(result.status).json({ error: result.error });
  }

  // For now, return just the meta - we'll add OpenAI in the next task
  return res.status(200).json({
    meta: result.meta,
    // Placeholder until OpenAI is added
    summary: {
      headline: result.pr.title,
      vibe: 'feature',
      bullets: ['Placeholder bullet 1', 'Placeholder bullet 2', 'Placeholder bullet 3'],
      emoji: '✨',
    },
    style: {
      accentColor: '#8b5cf6',
      tone: 'celebratory',
    },
  });
}
```

**Step 3: Test locally with Vercel CLI**

```bash
npm install -g vercel
vercel dev
```

In another terminal, test the endpoint:

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"prUrl": "https://github.com/facebook/react/pull/25774"}'
```

Expected: JSON response with meta data from the PR

**Step 4: Commit**

```bash
git add api/analyze.ts vercel.json
git commit -m "feat: add Vercel edge function with GitHub PR fetching"
```

---

## Task 8: Add OpenAI Integration

**Files:**
- Modify: `api/analyze.ts`

**Step 1: Update edge function with OpenAI call**

Update `api/analyze.ts`:

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface GitHubPR {
  title: string;
  user: { login: string; avatar_url: string };
  additions: number;
  deletions: number;
  changed_files: number;
  body: string | null;
}

interface GitHubFile {
  filename: string;
  additions: number;
  deletions: number;
  patch?: string;
}

interface OpenAISummary {
  headline: string;
  vibe: 'feature' | 'fix' | 'refactor' | 'docs' | 'chore';
  bullets: string[];
  emoji: string;
  accentColor: string;
  tone: 'celebratory' | 'relief' | 'technical' | 'minor';
}

function parsePrUrl(url: string): { owner: string; repo: string; number: number } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2], number: parseInt(match[3], 10) };
}

async function fetchGitHubPR(owner: string, repo: string, number: number) {
  const [prRes, filesRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${number}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${number}/files`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    }),
  ]);

  if (!prRes.ok) {
    if (prRes.status === 404) return { error: 'PR not found or is private', status: 404 };
    return { error: 'Failed to fetch PR', status: prRes.status };
  }

  const pr: GitHubPR = await prRes.json();
  const files: GitHubFile[] = await filesRes.json();

  return { pr, files };
}

async function generateSummary(pr: GitHubPR, files: GitHubFile[]): Promise<OpenAISummary> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  // Truncate patches to manage tokens
  const truncatedFiles = files.slice(0, 10).map((f) => ({
    filename: f.filename,
    additions: f.additions,
    deletions: f.deletions,
    patch: f.patch?.slice(0, 500),
  }));

  const prompt = `Analyze this GitHub PR and generate a social media video summary.

PR Title: ${pr.title}
PR Description: ${pr.body?.slice(0, 1000) || 'No description'}
Files Changed: ${files.length}
Total Additions: ${pr.additions}
Total Deletions: ${pr.deletions}

Changed files:
${truncatedFiles.map((f) => `- ${f.filename} (+${f.additions}/-${f.deletions})`).join('\n')}

Generate a JSON response with:
- headline: A catchy, short headline (max 10 words) that captures the essence of this PR
- vibe: One of "feature", "fix", "refactor", "docs", "chore"
- bullets: Array of 3-5 key points (max 10 words each) explaining what changed
- emoji: A single emoji that represents this PR
- accentColor: A hex color that matches the vibe (bright, playful colors work best)
- tone: One of "celebratory" (new features), "relief" (bug fixes), "technical" (refactors), "minor" (small changes)

Respond with ONLY valid JSON, no markdown.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No content in OpenAI response');
  }

  return JSON.parse(content);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prUrl } = req.body;

  if (!prUrl || typeof prUrl !== 'string') {
    return res.status(400).json({ error: 'prUrl is required' });
  }

  const parsed = parsePrUrl(prUrl);
  if (!parsed) {
    return res.status(400).json({ error: 'Invalid PR URL format' });
  }

  const result = await fetchGitHubPR(parsed.owner, parsed.repo, parsed.number);

  if ('error' in result) {
    return res.status(result.status).json({ error: result.error });
  }

  const { pr, files } = result;

  const meta = {
    repoName: `${parsed.owner}/${parsed.repo}`,
    prNumber: parsed.number,
    prTitle: pr.title,
    author: pr.user.login,
    authorAvatar: pr.user.avatar_url,
    filesChanged: pr.changed_files,
    additions: pr.additions,
    deletions: pr.deletions,
  };

  try {
    const aiSummary = await generateSummary(pr, files);

    return res.status(200).json({
      meta,
      summary: {
        headline: aiSummary.headline,
        vibe: aiSummary.vibe,
        bullets: aiSummary.bullets,
        emoji: aiSummary.emoji,
      },
      style: {
        accentColor: aiSummary.accentColor,
        tone: aiSummary.tone,
      },
    });
  } catch (error) {
    // Return partial data if OpenAI fails
    console.error('OpenAI error:', error);
    return res.status(200).json({
      meta,
      summary: {
        headline: pr.title,
        vibe: 'feature',
        bullets: ['Check out this pull request', 'See the changes for details'],
        emoji: '📝',
      },
      style: {
        accentColor: '#8b5cf6',
        tone: 'technical',
      },
    });
  }
}
```

**Step 2: Create .env.local for local development**

Create `.env.local` (do not commit):

```
OPENAI_API_KEY=your-api-key-here
```

**Step 3: Add .env.local to .gitignore**

```bash
echo ".env.local" >> .gitignore
```

**Step 4: Test with OpenAI**

```bash
vercel dev
```

Test endpoint - should now return AI-generated summaries.

**Step 5: Commit**

```bash
git add api/analyze.ts .gitignore
git commit -m "feat: add OpenAI integration for PR summarization"
```

---

## Task 9: Frontend - Input Form and Loading State

**Files:**
- Create: `src/components/InputForm.tsx`
- Create: `src/components/LoadingState.tsx`
- Create: `src/lib/api.ts`
- Modify: `src/App.tsx`

**Step 1: Create API wrapper**

Create `src/lib/api.ts`:

```typescript
import type { VideoScript } from '../types';

export async function analyzePR(prUrl: string): Promise<VideoScript> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prUrl }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to analyze PR');
  }

  return response.json();
}
```

**Step 2: Create InputForm component**

Create `src/components/InputForm.tsx`:

```tsx
import { useState } from 'react';

interface InputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 600 }}>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste a GitHub PR link..."
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '20px 24px',
          fontSize: 18,
          border: 'none',
          borderRadius: 16,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          outline: 'none',
        }}
      />
      <button
        type="submit"
        disabled={isLoading || !url.trim()}
        style={{
          marginTop: 20,
          width: '100%',
          padding: '16px 24px',
          fontSize: 18,
          fontWeight: 600,
          border: 'none',
          borderRadius: 12,
          backgroundColor: '#8b5cf6',
          color: 'white',
          cursor: isLoading || !url.trim() ? 'not-allowed' : 'pointer',
          opacity: isLoading || !url.trim() ? 0.5 : 1,
        }}
      >
        {isLoading ? 'Generating...' : 'Generate Video'}
      </button>
    </form>
  );
};
```

**Step 3: Create LoadingState component**

Create `src/components/LoadingState.tsx`:

```tsx
import { useEffect, useState } from 'react';

const messages = [
  'Fetching PR data...',
  'Reading the changes...',
  'Asking AI for insights...',
  'Generating video script...',
  'Almost there...',
];

export const LoadingState: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 30,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: '4px solid rgba(139, 92, 246, 0.3)',
          borderTopColor: '#8b5cf6',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p style={{ fontSize: 20, color: '#888' }}>{messages[messageIndex]}</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
```

**Step 4: Update App.tsx with state management**

Update `src/App.tsx`:

```tsx
import { useState } from 'react';
import { Player } from '@remotion/player';
import { PatchPlayComposition, calculateDuration } from './video/Composition';
import { InputForm } from './components/InputForm';
import { LoadingState } from './components/LoadingState';
import { analyzePR } from './lib/api';
import type { VideoScript } from './types';

type AppState = 'input' | 'loading' | 'preview';

function App() {
  const [state, setState] = useState<AppState>('input');
  const [videoData, setVideoData] = useState<VideoScript | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (url: string) => {
    setState('loading');
    setError(null);

    try {
      const data = await analyzePR(url);
      setVideoData(data);
      setState('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setState('input');
    }
  };

  const handleReset = () => {
    setState('input');
    setVideoData(null);
    setError(null);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f0f1a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
      }}
    >
      <h1
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: 'white',
          marginBottom: 40,
        }}
      >
        PatchPlay
      </h1>

      {state === 'input' && (
        <>
          <InputForm onSubmit={handleSubmit} isLoading={false} />
          {error && (
            <p style={{ color: '#f87171', marginTop: 20 }}>{error}</p>
          )}
        </>
      )}

      {state === 'loading' && <LoadingState />}

      {state === 'preview' && videoData && (
        <div style={{ width: '100%', maxWidth: 960 }}>
          <Player
            component={PatchPlayComposition}
            inputProps={videoData}
            durationInFrames={calculateDuration(videoData.summary.bullets.length)}
            compositionWidth={1920}
            compositionHeight={1080}
            fps={30}
            style={{ width: '100%' }}
            controls
          />
          <button
            onClick={handleReset}
            style={{
              marginTop: 20,
              padding: '12px 24px',
              fontSize: 16,
              border: '1px solid #444',
              borderRadius: 8,
              backgroundColor: 'transparent',
              color: '#888',
              cursor: 'pointer',
            }}
          >
            ← Try another
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
```

**Step 5: Verify full flow works**

```bash
vercel dev
```

Expected: Can enter a PR URL, see loading state, then video preview

**Step 6: Commit**

```bash
git add src/components src/lib/api.ts src/App.tsx
git commit -m "feat: add InputForm, LoadingState, and full app flow"
```

---

## Task 10: Apply Frontend Design Skill

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/InputForm.tsx`
- Modify: `src/components/LoadingState.tsx`
- Create: `src/index.css`

**Context:** Use the `frontend-design` skill to create a distinctive, colorful, playful aesthetic that matches the video output style. The current UI is functional but plain - it needs personality.

**Step 1: Invoke frontend-design skill**

Use `frontend-design` skill to redesign the UI with:
- Colorful gradient backgrounds
- Bold, playful typography
- Fun animations and micro-interactions
- Cohesive feel with the video preview

**Step 2: Update styles based on skill output**

Apply the generated styles to components.

**Step 3: Verify the design**

```bash
npm run dev
```

Expected: App has a distinctive, colorful aesthetic

**Step 4: Commit**

```bash
git add .
git commit -m "feat: apply playful, colorful UI design"
```

---

## Task 11: Final Polish and Deploy

**Files:**
- Modify: `index.html` (title, favicon)
- Create: `public/favicon.svg`

**Step 1: Update page title and add favicon**

Update `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PatchPlay - Turn PRs into Videos</title>
    <meta name="description" content="Transform GitHub pull requests into short-form social media videos" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Step 2: Create a simple SVG favicon**

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#8b5cf6"/>
  <text x="50" y="70" text-anchor="middle" font-size="60" fill="white">▶</text>
</svg>
```

**Step 3: Deploy to Vercel**

```bash
vercel
```

Follow prompts. Set the `OPENAI_API_KEY` environment variable in Vercel dashboard.

**Step 4: Commit**

```bash
git add index.html public/favicon.svg
git commit -m "feat: add page metadata and favicon"
```

**Step 5: Push to main**

```bash
git push origin main
```

---

## Summary

After completing all tasks, you will have:

1. ✅ Vite + React + TypeScript project with Remotion Player
2. ✅ Full video composition with 4 scenes (intro, headline, bullets, outro)
3. ✅ 4 different bullet layout variants for visual variety
4. ✅ Vercel Edge Function fetching GitHub PR data
5. ✅ OpenAI integration for intelligent summarization
6. ✅ Complete UI flow (input → loading → preview)
7. ✅ Playful, colorful design matching the video aesthetic
8. ✅ Deployed to Vercel

**Total tasks:** 11
**Estimated commits:** 11
