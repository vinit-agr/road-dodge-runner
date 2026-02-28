import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import {
  COLORS,
  LANE_POSITIONS,
  ROAD_SEGMENT_LENGTH,
  ROAD_SEGMENTS,
  ROAD_WIDTH,
  WORLD_SPEED_MULTIPLIER,
} from '../config/gameConfig.ts';
import { useGameStore } from '../store/gameStore.ts';

export function Road() {
  const totalLength = ROAD_SEGMENT_LENGTH * ROAD_SEGMENTS;
  const offsetRef = useRef(0);
  const roadRef = useRef<Mesh>(null);

  // Dashed lane lines
  const dashCount = 40;
  const dashLength = 1.2;
  const dashGap = 1.8;
  const dashPositions = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < dashCount; i++) {
      positions.push(-totalLength / 2 + i * (dashLength + dashGap));
    }
    return positions;
  }, [totalLength]);

  useFrame((_, delta) => {
    const speed = useGameStore.getState().speed;
    const phase = useGameStore.getState().phase;
    if (phase !== 'playing') return;
    offsetRef.current = (offsetRef.current + speed * WORLD_SPEED_MULTIPLIER * delta) % (dashLength + dashGap);
  });

  return (
    <group>
      {/* Road surface */}
      <mesh
        ref={roadRef}
        rotation-x={-Math.PI / 2}
        position={[0, -0.01, -totalLength / 2 + 10]}
      >
        <planeGeometry args={[ROAD_WIDTH, totalLength]} />
        <meshStandardMaterial color={COLORS.road} roughness={0.9} />
      </mesh>

      {/* Road edges (red stripes) */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          rotation-x={-Math.PI / 2}
          position={[side * (ROAD_WIDTH / 2 + 0.15), 0, -totalLength / 2 + 10]}
        >
          <planeGeometry args={[0.3, totalLength]} />
          <meshStandardMaterial
            color={COLORS.roadEdge}
            emissive={COLORS.roadEdge}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Lane dashes */}
      {[LANE_POSITIONS[0] + (LANE_POSITIONS[1] - LANE_POSITIONS[0]) / 2,
        LANE_POSITIONS[1] + (LANE_POSITIONS[2] - LANE_POSITIONS[1]) / 2,
      ].map((x, li) => (
        <group key={li}>
          {dashPositions.map((baseZ, i) => (
            <mesh
              key={i}
              rotation-x={-Math.PI / 2}
              position={[x, 0.005, baseZ]}
            >
              <planeGeometry args={[0.12, dashLength]} />
              <meshStandardMaterial
                color={COLORS.roadLine}
                emissive={COLORS.roadLine}
                emissiveIntensity={0.2}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Ground planes beside road */}
      {[-1, 1].map((side) => (
        <mesh
          key={`ground-${side}`}
          rotation-x={-Math.PI / 2}
          position={[side * (ROAD_WIDTH / 2 + 15), -0.02, -totalLength / 2 + 10]}
        >
          <planeGeometry args={[30, totalLength]} />
          <meshStandardMaterial color="#1a1830" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}
