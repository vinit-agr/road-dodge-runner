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

  // Sports bike proportions (derived from existing car size so gameplay stays balanced)
  const bikeWidth = width * 0.42;
  const bikeHeight = height * 0.95;
  const bikeLength = length * 1.05;
  const wheelRadius = bikeHeight * 0.28;
  const wheelTube = bikeWidth * 0.22;

  return (
    <group ref={groupRef} position={[LANE_POSITIONS[1], wheelRadius + 0.02, PLAYER_Z]}>
      {/* Wheels */}
      {[-1, 1].map((front, i) => (
        <group key={`wheel-${i}`} position={[0, 0, front * (bikeLength * 0.33)]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[wheelRadius, wheelTube, 12, 24]} />
            <meshStandardMaterial color="#0d101a" roughness={0.95} metalness={0.15} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[wheelRadius * 0.22, wheelRadius * 0.22, bikeWidth * 0.7, 12]} />
            <meshStandardMaterial color="#9aaad0" roughness={0.25} metalness={0.85} />
          </mesh>
        </group>
      ))}

      {/* Chassis spine */}
      <mesh position={[0, bikeHeight * 0.2, 0]}>
        <boxGeometry args={[bikeWidth * 0.35, bikeHeight * 0.22, bikeLength * 0.9]} />
        <meshStandardMaterial color="#6f86c9" roughness={0.35} metalness={0.75} />
      </mesh>

      {/* Front fairing */}
      <mesh position={[0, bikeHeight * 0.45, -bikeLength * 0.22]}>
        <boxGeometry args={[bikeWidth, bikeHeight * 0.42, bikeLength * 0.36]} />
        <meshStandardMaterial color={COLORS.player} roughness={0.28} metalness={0.72} />
      </mesh>

      {/* Side sporty panels */}
      {[-1, 1].map((side) => (
        <mesh key={`panel-${side}`} position={[side * bikeWidth * 0.42, bikeHeight * 0.26, -bikeLength * 0.05]}>
          <boxGeometry args={[bikeWidth * 0.18, bikeHeight * 0.34, bikeLength * 0.52]} />
          <meshStandardMaterial color={COLORS.playerAccent} roughness={0.35} metalness={0.62} />
        </mesh>
      ))}

      {/* Fuel tank */}
      <mesh position={[0, bikeHeight * 0.5, bikeLength * 0.02]}>
        <boxGeometry args={[bikeWidth * 0.78, bikeHeight * 0.28, bikeLength * 0.34]} />
        <meshStandardMaterial color="#00b3d8" roughness={0.25} metalness={0.8} />
      </mesh>

      {/* Seat + tail */}
      <mesh position={[0, bikeHeight * 0.48, bikeLength * 0.31]}>
        <boxGeometry args={[bikeWidth * 0.56, bikeHeight * 0.2, bikeLength * 0.3]} />
        <meshStandardMaterial color="#10131d" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, bikeHeight * 0.63, -bikeLength * 0.32]}>
        <boxGeometry args={[bikeWidth * 0.62, bikeHeight * 0.25, 0.05]} />
        <meshStandardMaterial
          color={COLORS.playerWindshield}
          metalness={0.9}
          roughness={0.08}
          transparent
          opacity={0.72}
        />
      </mesh>

      {/* Handle bar */}
      <mesh position={[0, bikeHeight * 0.62, -bikeLength * 0.2]}>
        <boxGeometry args={[bikeWidth * 0.95, bikeHeight * 0.06, bikeLength * 0.08]} />
        <meshStandardMaterial color="#c0d4ff" roughness={0.3} metalness={0.85} />
      </mesh>

      {/* Front light */}
      <mesh position={[0, bikeHeight * 0.46, -bikeLength * 0.42]}>
        <boxGeometry args={[bikeWidth * 0.38, bikeHeight * 0.14, 0.08]} />
        <meshStandardMaterial color={COLORS.headlight} emissive={COLORS.headlight} emissiveIntensity={2.4} />
      </mesh>

      {/* Tail light */}
      <mesh position={[0, bikeHeight * 0.45, bikeLength * 0.47]}>
        <boxGeometry args={[bikeWidth * 0.32, bikeHeight * 0.12, 0.07]} />
        <meshStandardMaterial color="#ff2b2b" emissive="#ff2b2b" emissiveIntensity={1.7} />
      </mesh>

      {/* Headlight beam */}
      <pointLight
        position={[0, bikeHeight * 0.45, -bikeLength * 0.75]}
        color={COLORS.headlight}
        intensity={3.2}
        distance={16}
      />
    </group>
  );
}
