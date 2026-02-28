import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { MathUtils } from 'three';
import {
  CAR_DIMENSIONS,
  COLORS,
  LANE_POSITIONS,
  LANE_SWITCH_SPEED,
  PLAYER_Z,
} from '../config/gameConfig.ts';
import { useGameStore } from '../store/gameStore.ts';

export function PlayerCar() {
  const groupRef = useRef<Group>(null);
  const currentXRef = useRef(LANE_POSITIONS[1]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const { targetLane, phase } = useGameStore.getState();
    if (phase !== 'playing') return;

    const targetX = LANE_POSITIONS[targetLane];
    currentXRef.current = MathUtils.lerp(
      currentXRef.current,
      targetX,
      1 - Math.exp(-LANE_SWITCH_SPEED * delta)
    );
    groupRef.current.position.x = currentXRef.current;

    // Slight tilt during lane change
    const diff = targetX - currentXRef.current;
    groupRef.current.rotation.z = MathUtils.lerp(
      groupRef.current.rotation.z,
      -diff * 0.15,
      1 - Math.exp(-8 * delta)
    );

    // Update currentLane when close enough
    if (Math.abs(currentXRef.current - targetX) < 0.1) {
      useGameStore.setState({ currentLane: targetLane });
    }
  });

  const { width, height, length } = CAR_DIMENSIONS;

  return (
    <group ref={groupRef} position={[LANE_POSITIONS[1], height / 2 + 0.01, PLAYER_Z]}>
      {/* Main body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width, height * 0.5, length]} />
        <meshStandardMaterial color={COLORS.player} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Cabin */}
      <mesh position={[0, height * 0.35, -0.1]}>
        <boxGeometry args={[width * 0.8, height * 0.4, length * 0.5]} />
        <meshStandardMaterial color={COLORS.playerAccent} metalness={0.4} roughness={0.4} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, height * 0.35, -length * 0.25 + 0.3]}>
        <boxGeometry args={[width * 0.75, height * 0.35, 0.05]} />
        <meshStandardMaterial
          color={COLORS.playerWindshield}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Headlights */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * width * 0.35, -0.05, -length / 2]}>
          <boxGeometry args={[0.25, 0.15, 0.1]} />
          <meshStandardMaterial
            color={COLORS.headlight}
            emissive={COLORS.headlight}
            emissiveIntensity={2}
          />
        </mesh>
      ))}

      {/* Tail lights */}
      {[-1, 1].map((side) => (
        <mesh key={`tail-${side}`} position={[side * width * 0.35, -0.05, length / 2]}>
          <boxGeometry args={[0.25, 0.15, 0.1]} />
          <meshStandardMaterial
            color="#ff2200"
            emissive="#ff2200"
            emissiveIntensity={1.5}
          />
        </mesh>
      ))}

      {/* Headlight beams */}
      <pointLight position={[0, 0.2, -length / 2 - 1]} color={COLORS.headlight} intensity={3} distance={15} />
    </group>
  );
}
