import type { RoadObstacleKind } from '../types/game.ts';
import { useGameStore } from '../store/gameStore.ts';
import { LANE_POSITIONS } from '../config/gameConfig.ts';

function ObstacleMesh({ kind }: { kind: RoadObstacleKind }) {
  if (kind === 'cone') {
    return (
      <>
        <mesh castShadow position={[0, 0.28, 0]}>
          <coneGeometry args={[0.38, 0.9, 12]} />
          <meshStandardMaterial color="#ff8f1f" emissive="#6b2e00" emissiveIntensity={0.65} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.48, 0.48, 0.08, 12]} />
          <meshStandardMaterial color="#ffd28a" />
        </mesh>
      </>
    );
  }

  if (kind === 'barrier') {
    return (
      <>
        <mesh castShadow position={[0, 0.36, 0]}>
          <boxGeometry args={[1.8, 0.65, 0.8]} />
          <meshStandardMaterial color="#ff4d4d" emissive="#6f1010" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 0.48, 0]}>
          <boxGeometry args={[1.9, 0.08, 0.15]} />
          <meshStandardMaterial color="#fff3c4" />
        </mesh>
      </>
    );
  }

  if (kind === 'duck') {
    return (
      <>
        <mesh castShadow position={[0, 0.34, 0]}>
          <sphereGeometry args={[0.42, 18, 14]} />
          <meshStandardMaterial color="#ffd84d" emissive="#7a5a00" emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[0.3, 0.49, 0]}>
          <sphereGeometry args={[0.2, 14, 12]} />
          <meshStandardMaterial color="#ffd84d" emissive="#7a5a00" emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[0.5, 0.45, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.08, 0.18, 10]} />
          <meshStandardMaterial color="#ff8f1f" emissive="#6b2e00" emissiveIntensity={0.45} />
        </mesh>
      </>
    );
  }

  // crate
  return (
    <>
      <mesh castShadow position={[0, 0.34, 0]}>
        <boxGeometry args={[1.05, 0.8, 1.05]} />
        <meshStandardMaterial color="#8b5a2b" emissive="#3b240f" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0, 0.34, 0]}>
        <boxGeometry args={[1.08, 0.06, 1.08]} />
        <meshStandardMaterial color="#c68c53" />
      </mesh>
    </>
  );
}

export function RoadBlockManager() {
  const roadBlocks = useGameStore((s) => s.roadBlocks);

  return (
    <group>
      {roadBlocks.map((b) => (
        <group key={b.id} position={[LANE_POSITIONS[b.lane], 0.06, b.z]}>
          <ObstacleMesh kind={b.kind} />
        </group>
      ))}
    </group>
  );
}
