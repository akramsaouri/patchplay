import { useState } from 'react';
import type { ComponentType } from 'react';
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
            component={PatchPlayComposition as unknown as ComponentType<Record<string, unknown>>}
            inputProps={videoData as unknown as Record<string, unknown>}
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
