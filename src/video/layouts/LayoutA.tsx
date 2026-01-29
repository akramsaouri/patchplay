import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface LayoutProps {
  text: string;
  accentColor: string;
}

export const LayoutA: React.FC<LayoutProps> = ({ text, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideSpring = spring({ frame, fps, config: { damping: 200 } });
  const x = interpolate(slideSpring, [0, 1], [-400, 0]);
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 30,
        transform: `translateX(${x}px)`,
        opacity,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 20,
          backgroundColor: accentColor,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 40,
        }}
      >
        ✦
      </div>
      <span style={{ fontSize: 48, fontWeight: 600, color: 'white' }}>{text}</span>
    </div>
  );
};
