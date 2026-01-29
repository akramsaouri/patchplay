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
