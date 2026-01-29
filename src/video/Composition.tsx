import { AbsoluteFill, Sequence } from 'remotion';
import type { VideoScript } from '../types';
import { IntroScene } from './scenes/IntroScene';
import { HeadlineScene } from './scenes/HeadlineScene';
import { BulletScene } from './scenes/BulletScene';
import { OutroScene } from './scenes/OutroScene';
import {
  INTRO_DURATION,
  HEADLINE_DURATION,
  BULLET_DURATION,
  OUTRO_DURATION,
} from './durations';

export const PatchPlayComposition: React.FC<VideoScript> = (props) => {
  const { meta, summary, style } = props;

  const bulletStart = INTRO_DURATION + HEADLINE_DURATION;
  const outroStart = bulletStart + summary.bullets.length * BULLET_DURATION;

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

      <Sequence from={outroStart} durationInFrames={OUTRO_DURATION}>
        <OutroScene
          repoName={meta.repoName}
          filesChanged={meta.filesChanged}
          additions={meta.additions}
          deletions={meta.deletions}
          accentColor={style.accentColor}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
