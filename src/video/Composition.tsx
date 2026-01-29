import { AbsoluteFill, Sequence } from 'remotion';
import type { VideoScript } from '../types';
import { IntroScene } from './scenes/IntroScene';
import { HeadlineScene } from './scenes/HeadlineScene';
import { BulletScene } from './scenes/BulletScene';

const INTRO_DURATION = 90; // 3s at 30fps
const HEADLINE_DURATION = 105; // 3.5s
const BULLET_DURATION = 75; // 2.5s each

export const PatchPlayComposition: React.FC<VideoScript> = (props) => {
  const { meta, summary, style } = props;

  const bulletStart = INTRO_DURATION + HEADLINE_DURATION;

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={INTRO_DURATION}>
        <IntroScene
          repoName={meta.repoName}
          prNumber={meta.prNumber}
          author={meta.author}
          authorAvatar={meta.authorAvatar}
          accentColor={style.accentColor}
        />
      </Sequence>

      <Sequence from={INTRO_DURATION} durationInFrames={HEADLINE_DURATION}>
        <HeadlineScene
          headline={summary.headline}
          emoji={summary.emoji}
          accentColor={style.accentColor}
          tone={style.tone}
        />
      </Sequence>

      {summary.bullets.map((bullet, i) => (
        <Sequence
          key={i}
          from={bulletStart + i * BULLET_DURATION}
          durationInFrames={BULLET_DURATION}
        >
          <BulletScene text={bullet} index={i} accentColor={style.accentColor} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
