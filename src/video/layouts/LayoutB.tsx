import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface LayoutProps {
  text: string;
  accentColor: string;
}

export const LayoutB: React.FC<LayoutProps> = ({ text, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleSpring = spring({ frame, fps, config: { damping: 100, stiffness: 200 } });
  const scale = interpolate(scaleSpring, [0, 1], [0.5, 1]);
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        textAlign: 'center',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <span
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: 'white',
          textShadow: `0 0 40px ${accentColor}`,
        }}
      >
        {text}
      </span>
    </div>
  );
};
