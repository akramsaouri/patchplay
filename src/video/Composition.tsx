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
