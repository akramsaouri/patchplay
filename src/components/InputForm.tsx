import { useState, useRef } from 'react';

interface InputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  const isValid = url.trim().includes('github.com') && url.includes('/pull/');

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      {/* Input container with glow effect */}
      <div
        style={{
          position: 'relative',
          borderRadius: 20,
          padding: 3,
          background: isFocused
            ? 'linear-gradient(135deg, #FF6B6B, #FBBF24, #8B5CF6, #22D3EE)'
            : 'linear-gradient(135deg, rgba(255, 107, 107, 0.3), rgba(139, 92, 246, 0.3))',
          backgroundSize: '200% 200%',
          animation: isFocused ? 'gradient-shift 3s ease infinite' : 'none',
          transition: 'all 0.3s ease',
          boxShadow: isFocused
            ? '0 0 40px rgba(139, 92, 246, 0.3), 0 0 80px rgba(255, 107, 107, 0.2)'
            : '0 0 20px rgba(139, 92, 246, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '6px 8px 6px 24px',
            background: '#0A0A1B',
            borderRadius: 17,
          }}
        >
          {/* GitHub icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            style={{
              flexShrink: 0,
              opacity: isFocused ? 1 : 0.4,
              transition: 'opacity 0.3s ease',
            }}
          >
            <path
              d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"
              fill="currentColor"
              style={{ color: isFocused ? '#8B5CF6' : 'rgba(255, 255, 255, 0.5)' }}
            />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="github.com/owner/repo/pull/123"
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '16px 0',
              fontSize: 17,
              fontFamily: "'DM Sans', system-ui, sans-serif",
              border: 'none',
              background: 'transparent',
              color: 'white',
              outline: 'none',
              letterSpacing: '-0.01em',
            }}
          />

          {/* Submit button inside input */}
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            style={{
              padding: '14px 28px',
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
              border: 'none',
              borderRadius: 12,
              background: url.trim()
                ? 'linear-gradient(135deg, #8B5CF6 0%, #FF6B6B 100%)'
                : 'rgba(255, 255, 255, 0.1)',
              color: url.trim() ? 'white' : 'rgba(255, 255, 255, 0.4)',
              cursor: isLoading || !url.trim() ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              transform: url.trim() ? 'scale(1)' : 'scale(0.98)',
              boxShadow: url.trim()
                ? '0 4px 20px rgba(139, 92, 246, 0.4)'
                : 'none',
            }}
            onMouseEnter={(e) => {
              if (url.trim() && !isLoading) {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 6px 30px rgba(139, 92, 246, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = url.trim() ? 'scale(1)' : 'scale(0.98)';
              e.currentTarget.style.boxShadow = url.trim()
                ? '0 4px 20px rgba(139, 92, 246, 0.4)'
                : 'none';
            }}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin-slow 0.8s linear infinite',
                  }}
                />
                Generating...
              </span>
            ) : (
              'Generate'
            )}
          </button>
        </div>
      </div>

      {/* Validation hint */}
      {url.trim() && !isValid && (
        <p
          style={{
            marginTop: 12,
            fontSize: 13,
            color: 'rgba(251, 191, 36, 0.8)',
            textAlign: 'center',
            animation: 'fade-up 0.3s ease-out',
          }}
        >
          Enter a valid GitHub PR URL (e.g., github.com/owner/repo/pull/123)
        </p>
      )}

      {/* Example PRs */}
      <div
        style={{
          marginTop: 24,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.3)' }}>
          Try:
        </span>
        {[
          { label: 'The icons we all love - remixicon', url: 'https://github.com/shadcn-ui/ui/pull/9156' },
          { label: 'feat: Bun shell', url: 'https://github.com/oven-sh/bun/pull/7748' },
          { label: 'feat: bun patch', url: 'https://github.com/oven-sh/bun/pull/11470' },
          { label: 'Add support for server-side tools', url: 'https://github.com/anthropics/anthropic-sdk-python/pull/1086' },
        ].map((example) => (
          <button
            key={example.label}
            type="button"
            onClick={() => setUrl(example.url)}
            style={{
              padding: '4px 12px',
              fontSize: 12,
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 500,
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: 20,
              background: 'rgba(139, 92, 246, 0.1)',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
            }}
          >
            {example.label}
          </button>
        ))}
      </div>
    </form>
  );
};
