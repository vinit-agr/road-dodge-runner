import { useGameStore } from '../store/gameStore.ts';
import { LANE_POSITIONS } from '../config/gameConfig.ts';

export function RoadBlockManager() {
  const roadBlocks = useGameStore((s) => s.roadBlocks);

  return (
    <group>
      {roadBlocks.map((b) => (
        <group key={b.id} position={[LANE_POSITIONS[b.lane], 0.45, b.z]}>
          <mesh castShadow>
            <boxGeometry args={[1.6, 0.9, 1.6]} />
            <meshStandardMaterial color="#ff7a1a" emissive="#5a1f00" emissiveIntensity={0.7} />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <boxGeometry args={[1.1, 0.25, 1.1]} />
            <meshStandardMaterial color="#ffd166" emissive="#7a5200" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
