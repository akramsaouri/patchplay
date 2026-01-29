import { AbsoluteFill, Sequence } from 'remotion';
import type { VideoScript } from '../types';
import { IntroScene } from './scenes/IntroScene';
import { HeadlineScene } from './scenes/HeadlineScene';

export const PatchPlayComposition: React.FC<VideoScript> = (props) => {
  const { meta, summary, style } = props;

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a2e' }}>
      <Sequence from={0} durationInFrames={90}>
        <IntroScene
          repoName={meta.repoName}
          prNumber={meta.prNumber}
          author={meta.author}
          authorAvatar={meta.authorAvatar}
          accentColor={style.accentColor}
        />
      </Sequence>

      <Sequence from={90} durationInFrames={105}>
        <HeadlineScene
          headline={summary.headline}
          emoji={summary.emoji}
          accentColor={style.accentColor}
          tone={style.tone}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
