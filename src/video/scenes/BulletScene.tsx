import { AbsoluteFill } from 'remotion';
import { LayoutA } from '../layouts/LayoutA';
import { LayoutB } from '../layouts/LayoutB';
import { LayoutC } from '../layouts/LayoutC';
import { LayoutD } from '../layouts/LayoutD';

interface BulletSceneProps {
  text: string;
  index: number;
  accentColor: string;
}

const layouts = [LayoutA, LayoutB, LayoutC, LayoutD];

export const BulletScene: React.FC<BulletSceneProps> = ({
  text,
  index,
  accentColor,
}) => {
  const Layout = layouts[index % layouts.length];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#1a1a2e',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      <Layout text={text} accentColor={accentColor} />
    </AbsoluteFill>
  );
};
