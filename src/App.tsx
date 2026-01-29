import { Player } from '@remotion/player';
import type { ComponentType } from 'react';
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
        component={PatchPlayComposition as unknown as ComponentType<Record<string, unknown>>}
        inputProps={mockData as unknown as Record<string, unknown>}
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
