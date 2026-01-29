import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface LayoutProps {
  text: string;
  accentColor: string;
}

export const LayoutD: React.FC<LayoutProps> = ({ text, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideSpring = spring({ frame, fps, config: { damping: 200 } });
  const clipPath = interpolate(slideSpring, [0, 1], [0, 50]);
  const textOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: accentColor,
          clipPath: `inset(0 ${100 - clipPath}% 0 0)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: textOpacity,
        }}
      >
        <span
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: 'white',
            mixBlendMode: 'difference',
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
