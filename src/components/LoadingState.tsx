import { useEffect, useState } from 'react';

const messages = [
  { text: 'Fetching PR data...', emoji: '🔍' },
  { text: 'Reading the changes...', emoji: '📖' },
  { text: 'Asking AI for insights...', emoji: '🤖' },
  { text: 'Crafting your story...', emoji: '✨' },
  { text: 'Almost ready...', emoji: '🎬' },
];

// Morphing blob component
const MorphingBlob = ({ color, size, delay }: { color: string; size: number; delay: number }) => (
  <div
    style={{
      position: 'absolute',
      width: size,
      height: size,
      background: `radial-gradient(circle at 30% 30%, ${color}, transparent 60%)`,
      filter: 'blur(30px)',
      opacity: 0.7,
      animation: `morph 8s ease-in-out infinite, pulse-glow 4s ease-in-out infinite`,
      animationDelay: `${delay}s`,
    }}
  />
);

export const LoadingState: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % messages.length);
    }, 2500);

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 1, 95));
    }, 150);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const currentMessage = messages[messageIndex];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 40,
        animation: 'fade-up 0.5s ease-out',
      }}
    >
      {/* Animated loader container */}
      <div
        style={{
          position: 'relative',
          width: 160,
          height: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Background blobs */}
        <MorphingBlob color="#FF6B6B" size={120} delay={0} />
        <MorphingBlob color="#8B5CF6" size={100} delay={1} />
        <MorphingBlob color="#FBBF24" size={80} delay={2} />

        {/* Spinning ring */}
        <div
          style={{
            position: 'absolute',
            width: 120,
            height: 120,
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: '#FF6B6B',
            borderRightColor: '#FBBF24',
            animation: 'spin-slow 1.5s linear infinite',
          }}
        />

        {/* Inner spinning ring (opposite direction) */}
        <div
          style={{
            position: 'absolute',
            width: 90,
            height: 90,
            borderRadius: '50%',
            border: '2px solid transparent',
            borderBottomColor: '#8B5CF6',
            borderLeftColor: '#22D3EE',
            animation: 'spin-slow 2s linear infinite reverse',
          }}
        />

        {/* Center emoji */}
        <div
          style={{
            position: 'relative',
            fontSize: 40,
            animation: 'bounce-in 0.5s ease-out',
            zIndex: 10,
          }}
          key={messageIndex}
        >
          {currentMessage.emoji}
        </div>
      </div>

      {/* Message */}
      <div style={{ textAlign: 'center' }}>
        <p
          key={messageIndex}
          style={{
            fontSize: 20,
            fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
            fontWeight: 600,
            color: 'white',
            marginBottom: 8,
            animation: 'fade-up 0.4s ease-out',
          }}
        >
          {currentMessage.text}
        </p>

        {/* Progress bar */}
        <div
          style={{
            width: 200,
            height: 4,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            overflow: 'hidden',
            margin: '16px auto 0',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #8B5CF6, #FF6B6B, #FBBF24)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s linear infinite',
              borderRadius: 2,
              transition: 'width 0.15s ease-out',
            }}
          />
        </div>

        <p
          style={{
            marginTop: 12,
            fontSize: 13,
            color: 'rgba(255, 255, 255, 0.4)',
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
        >
          This usually takes 5-10 seconds
        </p>
      </div>
    </div>
  );
};
