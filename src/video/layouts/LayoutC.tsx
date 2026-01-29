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
