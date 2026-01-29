# PatchPlay: Turn GitHub PRs into Videos

**Date:** 2026-01-29
**Status:** Ready for implementation

## Overview

A web app that transforms a GitHub PR into a short-form, social media-ready video. User pastes a PR URL, we fetch the data, generate a summary via OpenAI, and render an animated preview using Remotion.

## Goals

- Generate 15-25 second videos summarizing a PR
- Target social media formats (16:9 landscape for YouTube, Twitter, LinkedIn)
- Colorful, playful aesthetic
- No code diffs - summary presentation with title cards and bullet points

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vite + React + TypeScript |
| Video | Remotion + @remotion/player |
| Backend | Vercel Edge Function |
| AI | OpenAI gpt-4o-mini |
| Data | GitHub REST API (public, no auth) |
| Hosting | Vercel |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Vite + React App                     │
│  ┌───────────────┐    ┌─────────────────────────────┐  │
│  │  Input Form   │───▶│  Remotion Player (preview)  │  │
│  │  (PR URL)     │    │  receives structured data   │  │
│  └───────────────┘    └─────────────────────────────┘  │
└───────────┬─────────────────────────────────────────────┘
            │ POST /api/analyze
            ▼
┌─────────────────────────────────────────────────────────┐
│              Vercel Edge Function                       │
│  1. Parse PR URL → owner/repo/number                    │
│  2. Fetch PR from GitHub API (diff, metadata)           │
│  3. Call OpenAI → structured video script               │
│  4. Return JSON to frontend                             │
└─────────────────────────────────────────────────────────┘
```

## Data Model

```typescript
interface VideoScript {
  // Common PR metadata (from GitHub)
  meta: {
    repoName: string;        // "facebook/react"
    prNumber: number;        // 1234
    prTitle: string;         // "Add useFormStatus hook"
    author: string;          // "gaearon"
    authorAvatar: string;    // GitHub avatar URL
    filesChanged: number;    // 12
    additions: number;       // 847
    deletions: number;       // 23
  };

  // AI-generated content
  summary: {
    headline: string;        // "React just got better forms"
    vibe: "feature" | "fix" | "refactor" | "docs" | "chore";
    bullets: string[];       // 3-5 key points, max 10 words each
    emoji: string;           // Suggested emoji for the PR
  };

  // Visual suggestions from AI
  style: {
    accentColor: string;     // Hex color based on vibe/content
    tone: "celebratory" | "relief" | "technical" | "minor";
  };
}
```

## Video Scene Structure

| Scene | Duration | Content |
|-------|----------|---------|
| 1. Intro | 2-3s | Repo name + PR number, author avatar + name, gradient background |
| 2. Headline | 3-4s | summary.headline in bold, emoji animation, vibe-based effects |
| 3-5. Bullets | 2-3s each | One bullet per scene, cycles through layout variants A/B/C/D |
| 6. Outro | 2-3s | Stats (files, +additions, -deletions), animated counters, fade out |

**Total runtime:** 15-22 seconds depending on bullet count (3-5 bullets)

### Bullet Layout Variants

Same data, different visual treatment to avoid monotony:
- **Layout A:** Icon left, text right, slide in from left
- **Layout B:** Centered text, scale up with bounce
- **Layout C:** Text with underline wipe animation
- **Layout D:** Split color background, text contrasts

## Edge Function API

```
POST /api/analyze
Body: { prUrl: "https://github.com/owner/repo/pull/123" }
Returns: VideoScript
```

### Flow

1. Parse URL → extract owner, repo, prNumber (400 if invalid)
2. Fetch GitHub API:
   - `GET /repos/{owner}/{repo}/pulls/{number}` → title, author, avatar
   - `GET /repos/{owner}/{repo}/pulls/{number}/files` → files changed, additions, deletions, patches
3. Call OpenAI (gpt-4o-mini) with PR data → structured summary + style
4. Combine GitHub meta + OpenAI response → return VideoScript

### Error Handling

| Error | Status | Response |
|-------|--------|----------|
| Invalid URL | 400 | `{ error: "Invalid PR URL format" }` |
| PR not found / private | 404 | `{ error: "PR not found or is private" }` |
| OpenAI failure | 500 | Partial data (meta only) so UI can show something |
| Rate limited | 429 | `{ error: "...", retryAfter: 60 }` |

## Frontend UI

Two states, no routing:

### State 1: Input
- Single text input for PR URL
- Submit button
- Colorful gradient background, playful typography

### State 2: Preview
- Remotion Player (16:9)
- Play/pause controls (Remotion built-in)
- "Try another" button to reset

### Loading State
- Playful spinner/animation matching the colorful aesthetic

## UI/Styling

- **Vibe:** Colorful, playful, bold - matches the video output style
- **Approach:** Use `frontend-design` skill during implementation to create a distinctive aesthetic
- **Cohesion:** App feels like a preview of what you'll get

## Project Structure

```
patchplay/
├── src/
│   ├── main.tsx                 # App entry
│   ├── App.tsx                  # Main component (input ↔ preview states)
│   ├── components/
│   │   ├── InputForm.tsx        # PR URL input + submit
│   │   ├── VideoPreview.tsx     # Remotion Player wrapper
│   │   └── LoadingState.tsx     # Fun loading animation
│   ├── video/
│   │   ├── Composition.tsx      # Main Remotion composition
│   │   ├── scenes/
│   │   │   ├── IntroScene.tsx   # Scene 1: repo + author
│   │   │   ├── HeadlineScene.tsx# Scene 2: headline + emoji
│   │   │   ├── BulletScene.tsx  # Scene 3-5: with layout selection
│   │   │   └── OutroScene.tsx   # Scene 6: stats
│   │   └── layouts/             # Bullet layout variants
│   │       ├── LayoutA.tsx
│   │       ├── LayoutB.tsx
│   │       ├── LayoutC.tsx
│   │       └── LayoutD.tsx
│   ├── lib/
│   │   └── api.ts               # fetch wrapper for /api/analyze
│   └── types.ts                 # VideoScript interface
├── api/
│   └── analyze.ts               # Vercel Edge Function
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Out of Scope (Future)

- Video export/download (MVP: screen record)
- 9:16 aspect ratio (portrait for TikTok/Reels)
- User accounts / saved videos
- Custom branding options

## Implementation Notes

- OpenAI API key stored as Vercel environment variable
- GitHub API has rate limits (60 req/hour unauthenticated) - sufficient for MVP
- Remotion Player handles all playback controls
- Truncate large PR diffs before sending to OpenAI to manage token costs
