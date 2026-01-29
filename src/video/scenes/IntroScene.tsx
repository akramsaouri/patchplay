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
