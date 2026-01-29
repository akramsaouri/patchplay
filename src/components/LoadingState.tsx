import { useEffect, useState } from 'react';

const messages = [
  'Fetching PR data...',
  'Reading the changes...',
  'Asking AI for insights...',
  'Generating video script...',
  'Almost there...',
];

export const LoadingState: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 30,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: '4px solid rgba(139, 92, 246, 0.3)',
          borderTopColor: '#8b5cf6',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p style={{ fontSize: 20, color: '#888' }}>{messages[messageIndex]}</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
