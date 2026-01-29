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
  tone: _tone,
}) => {
  // Reserved for future tone-based styling variations
  void _tone;

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
