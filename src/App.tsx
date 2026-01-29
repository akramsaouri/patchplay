import { useState } from 'react';
import { InputForm } from './components/InputForm';
import { LoadingState } from './components/LoadingState';
import { VideoModal } from './components/VideoModal';
import { analyzePR } from './lib/api';
import type { VideoScript } from './types';

type AppState = 'input' | 'loading' | 'preview';

// Floating orb component for background decoration
const FloatingOrb = ({
  color,
  size,
  top,
  left,
  delay = 0
}: {
  color: string;
  size: number;
  top: string;
  left: string;
  delay?: number;
}) => (
  <div
    style={{
      position: 'absolute',
      top,
      left,
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
      filter: 'blur(40px)',
      opacity: 0.6,
      animation: `float ${8 + delay}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      pointerEvents: 'none',
    }}
  />
);

function App() {
  const [state, setState] = useState<AppState>('input');
  const [videoData, setVideoData] = useState<VideoScript | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (url: string) => {
    setState('loading');
    setError(null);

    try {
      const data = await analyzePR(url);
      setVideoData(data);
      setState('preview');
      setIsModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setState('input');
    }
  };

  const handleReset = () => {
    setState('input');
    setVideoData(null);
    setError(null);
    setIsModalOpen(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A0A1B 0%, #12122A 50%, #0A0A1B 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating background orbs */}
      <FloatingOrb color="#FF6B6B" size={400} top="-10%" left="-5%" delay={0} />
      <FloatingOrb color="#8B5CF6" size={350} top="60%" left="80%" delay={2} />
      <FloatingOrb color="#FBBF24" size={300} top="70%" left="-10%" delay={4} />
      <FloatingOrb color="#22D3EE" size={250} top="-5%" left="70%" delay={1} />

      {/* Subtle grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      {/* Content container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 1000,
        }}
      >
        {/* Logo / Title */}
        <div
          style={{
            marginBottom: 16,
            animation: 'fade-up 0.8s ease-out forwards',
          }}
        >
          <h1
            style={{
              fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FBBF24 25%, #8B5CF6 50%, #22D3EE 75%, #FF6B6B 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradient-shift 8s ease infinite',
              letterSpacing: '-0.03em',
              textAlign: 'center',
            }}
          >
            PatchPlay
          </h1>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: 'rgba(255, 255, 255, 0.5)',
            marginBottom: 48,
            textAlign: 'center',
            animation: 'fade-up 0.8s ease-out 0.1s forwards',
            opacity: 0,
            animationFillMode: 'forwards',
          }}
        >
          Turn any GitHub PR into a shareable video
        </p>

        {state === 'input' && (
          <div
            style={{
              width: '100%',
              maxWidth: 600,
              animation: 'slide-up 0.6s ease-out forwards',
            }}
          >
            <InputForm onSubmit={handleSubmit} isLoading={false} />
            {error && (
              <div
                style={{
                  marginTop: 20,
                  padding: '16px 20px',
                  background: 'rgba(248, 113, 113, 0.1)',
                  border: '1px solid rgba(248, 113, 113, 0.3)',
                  borderRadius: 12,
                  color: '#f87171',
                  fontSize: 14,
                  textAlign: 'center',
                  animation: 'fade-up 0.4s ease-out',
                }}
              >
                {error}
              </div>
            )}
          </div>
        )}

        {state === 'loading' && <LoadingState />}

        {state === 'preview' && videoData && (
          <>
            <VideoModal
              videoData={videoData}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />

            {/* Video info card - visible when modal is closed */}
            {!isModalOpen && (
              <div
                style={{
                  width: '100%',
                  maxWidth: 500,
                  animation: 'fade-up 0.4s ease-out',
                }}
              >
                <div
                  style={{
                    padding: '24px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 20,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                      src={videoData.meta.authorAvatar}
                      alt={videoData.meta.author}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        border: '2px solid rgba(139, 92, 246, 0.5)',
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                          fontWeight: 600,
                          fontSize: 16,
                          color: 'white',
                        }}
                      >
                        {videoData.meta.repoName}
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          color: 'rgba(255, 255, 255, 0.4)',
                        }}
                      >
                        PR #{videoData.meta.prNumber} by @{videoData.meta.author}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      style={{
                        flex: 1,
                        padding: '12px 20px',
                        fontSize: 14,
                        fontWeight: 600,
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        border: 'none',
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(139, 92, 246, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      Watch again
                    </button>
                    <button
                      onClick={handleReset}
                      style={{
                        flex: 1,
                        padding: '12px 20px',
                        fontSize: 14,
                        fontWeight: 500,
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: 10,
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'rgba(255, 255, 255, 0.7)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                      }}
                    >
                      New PR
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 13,
          color: 'rgba(255, 255, 255, 0.25)',
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      >
        Paste a PR link and watch the magic happen
      </div>
    </div>
  );
}

export default App;
