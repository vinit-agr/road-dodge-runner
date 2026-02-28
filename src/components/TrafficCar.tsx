import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { LANE_POSITIONS, TRAFFIC_DIMENSIONS } from '../config/gameConfig.ts';
import { useGameStore } from '../store/gameStore.ts';

interface TrafficCarProps {
  id: string;
  lane: number;
  color: string;
}

export function TrafficCar({ id, lane, color }: TrafficCarProps) {
  const groupRef = useRef<Group>(null);
  const { width, height, length } = TRAFFIC_DIMENSIONS;

  useFrame(() => {
    if (!groupRef.current) return;
    const vehicle = useGameStore.getState().traffic.find((t) => t.id === id);
    if (!vehicle) return;
    groupRef.current.position.z = vehicle.z;
    groupRef.current.position.x = LANE_POSITIONS[lane];
  });

  return (
    <group ref={groupRef} position={[LANE_POSITIONS[lane], height / 2 + 0.01, -60]}>
      {/* Body */}
      <mesh>
        <boxGeometry args={[width, height * 0.55, length]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Cabin */}
      <mesh position={[0, height * 0.35, 0.1]}>
        <boxGeometry args={[width * 0.78, height * 0.4, length * 0.45]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Rear lights */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * width * 0.35, -0.05, length / 2]}>
          <boxGeometry args={[0.2, 0.15, 0.08]} />
          <meshStandardMaterial color="#ff2200" emissive="#ff2200" emissiveIntensity={1} />
        </mesh>
      ))}
    </group>
  );
}
