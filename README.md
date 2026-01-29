# PatchPlay

Turn any GitHub PR into a shareable short-form video.

## What it does

1. Paste a public GitHub PR URL
2. AI analyzes the PR and generates a catchy summary
3. Remotion renders an animated video preview (15-25 seconds)

## Tech Stack

- **Frontend:** Vite + React + TypeScript
- **Video:** Remotion + @remotion/player
- **Backend:** Vercel Serverless Functions
- **AI:** OpenAI gpt-4o-mini
- **Styling:** Custom CSS with Bricolage Grotesque + DM Sans fonts

## Project Structure

```
patchplay/
├── src/
│   ├── App.tsx                    # Main app with state management
│   ├── components/
│   │   ├── InputForm.tsx          # PR URL input with validation
│   │   └── LoadingState.tsx       # Animated loading with progress
│   ├── video/
│   │   ├── Composition.tsx        # Main Remotion composition
│   │   ├── scenes/
│   │   │   ├── IntroScene.tsx     # Repo name, PR number, author
│   │   │   ├── HeadlineScene.tsx  # AI headline with emoji
│   │   │   ├── BulletScene.tsx    # Key points (4 layout variants)
│   │   │   └── OutroScene.tsx     # Stats with animated counters
│   │   └── layouts/               # Bullet layout variants A-D
│   ├── lib/
│   │   └── api.ts                 # API client
│   ├── types.ts                   # VideoScript interface
│   └── index.css                  # Global styles + animations
├── api/
│   └── analyze.ts                 # Vercel serverless function
├── public/
│   └── favicon.svg
└── docs/plans/                    # Design and implementation docs
```

## Local Development

### Frontend only (no API):
```bash
npm install
npm run dev
```

### Full app with API:
```bash
npm install
echo "OPENAI_API_KEY=sk-your-key" > .env.local
vercel dev
```

## Deploy to Vercel

```bash
vercel
```

Then add `OPENAI_API_KEY` in Vercel dashboard → Project Settings → Environment Variables.

## Video Structure

| Scene | Duration | Content |
|-------|----------|---------|
| Intro | 3s | Repo name, PR number, author avatar |
| Headline | 3.5s | AI-generated headline + emoji |
| Bullets | 2.5s each | 3-5 key points with varying layouts |
| Outro | 3s | Files changed, additions, deletions |

**Total:** 15-22 seconds depending on bullet count.

## Known Issues / TODO

- [ ] Video export/download not yet implemented (screen record for now)
- [ ] Some edge cases in PR URL parsing
- [ ] Rate limiting for GitHub API (60 req/hour unauthenticated)
- [ ] Error handling could be more graceful in some cases

## Design

The UI uses a playful, maximalist aesthetic with:
- Animated gradient title
- Floating colorful orbs in background
- Glowing input field with GitHub icon
- Morphing blob loading animation
- Custom typography (Bricolage Grotesque + DM Sans)

## API Endpoint

```
POST /api/analyze
Body: { "prUrl": "https://github.com/owner/repo/pull/123" }
Returns: VideoScript (meta, summary, style)
```

## License

MIT
