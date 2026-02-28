import { useFrame } from '@react-three/fiber';
import { COLORS } from '../config/gameConfig.ts';
import { useGameStore } from '../store/gameStore.ts';
import { PlayerCar } from './PlayerCar.tsx';
import { Road } from './Road.tsx';
import { TrafficManager } from './TrafficManager.tsx';
import { RoadBlockManager } from './RoadBlockManager.tsx';

export function GameScene() {
  useFrame((_, delta) => {
    const clamped = Math.min(delta, 0.05); // cap to avoid physics jumps
    useGameStore.getState().tick(clamped);
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight color={COLORS.ambient} intensity={0.9} />
      <hemisphereLight
        color="#a8c8ff"
        groundColor="#2f1f3d"
        intensity={0.75}
      />
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.9}
        color="#9cc0ff"
      />
      <directionalLight
        position={[-6, 6, 10]}
        intensity={0.55}
        color="#ffb56a"
      />

      {/* Fog for depth / nostalgic feel */}
      <fog attach="fog" args={[COLORS.fog, 20, 80]} />

      {/* Camera is set via Canvas camera prop */}

      <Road />
      <PlayerCar />
      <TrafficManager />
      <RoadBlockManager />

      {/* Distant glow strips (decorative) */}
      {[-1, 1].map((side) =>
        Array.from({ length: 8 }).map((_, i) => (
          <pointLight
            key={`light-${side}-${i}`}
            position={[side * 7, 3, -i * 15 - 10]}
            color="#ff8800"
            intensity={0.9}
            distance={14}
          />
        ))
      )}
    </>
  );
}
