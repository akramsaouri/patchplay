import { useEffect, useCallback } from 'react';
import type { ComponentType } from 'react';
import { Player } from '@remotion/player';
import { PatchPlayComposition } from '../video/Composition';
import { calculateDuration } from '../video/durations';
import type { VideoScript } from '../types';

interface VideoModalProps {
  videoData: VideoScript;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModal({ videoData, isOpen, onClose }: VideoModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fade-in 0.3s ease-out',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
        }}
      />

      {/* Modal content */}
      <div
        style={{
          position: 'relative',
          width: '90vw',
          maxWidth: 1200,
          animation: 'scale-in 0.3s ease-out',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: -48,
            right: 0,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            color: 'white',
            fontSize: 20,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ✕
        </button>

        {/* Video container */}
        <div
          style={{
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: `
              0 0 0 1px rgba(139, 92, 246, 0.3),
              0 25px 80px -10px rgba(0, 0, 0, 0.7),
              0 0 120px -20px rgba(139, 92, 246, 0.4)
            `,
          }}
        >
          <Player
            component={PatchPlayComposition as unknown as ComponentType<Record<string, unknown>>}
            inputProps={videoData as unknown as Record<string, unknown>}
            durationInFrames={calculateDuration(videoData.summary.bullets.length)}
            compositionWidth={1920}
            compositionHeight={1080}
            fps={30}
            autoPlay
            style={{
              width: '100%',
              borderRadius: 20,
            }}
            controls
          />
        </div>
      </div>
    </div>
  );
}
