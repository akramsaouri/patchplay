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
