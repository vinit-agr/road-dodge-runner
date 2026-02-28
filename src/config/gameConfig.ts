export const LANE_WIDTH = 2.5;
export const LANE_POSITIONS: readonly number[] = [-LANE_WIDTH, 0, LANE_WIDTH];
export const ROAD_WIDTH = LANE_WIDTH * 4;
export const ROAD_SEGMENT_LENGTH = 40;
export const ROAD_SEGMENTS = 4;

export const PLAYER_START_LANE = 1; // center
export const PLAYER_Z = 0;
export const LANE_SWITCH_SPEED = 12;

export const BASE_SPEED = 8;
export const MAX_SPEED = 30;
export const SPEED_RAMP_RATE = 0.15; // per second

// Keep HUD speed values the same, but scale world movement feel.
export const WORLD_SPEED_MULTIPLIER = 3.5;

export const SPAWN_INTERVAL_BASE = 1.2; // seconds
export const SPAWN_INTERVAL_MIN = 0.4;
export const SPAWN_Z_OFFSET = -80;
export const DESPAWN_Z = 20;
export const MAX_TRAFFIC = 12;

export const CAR_DIMENSIONS = { width: 1.4, height: 0.8, length: 2.4 };
export const TRAFFIC_DIMENSIONS = { width: 1.4, height: 0.9, length: 2.8 };

export const COLORS = {
  road: '#1a1a2e',
  roadLine: '#ffcc00',
  roadEdge: '#ff4444',
  player: '#00d4ff',
  playerAccent: '#0088aa',
  playerWindshield: '#003344',
  fog: '#0a0a1a',
  ambient: '#334466',
  headlight: '#ffeecc',
  sky: '#050510',
  hud: '#00ff88',
  hudWarn: '#ff4444',
  traffic: ['#ff3366', '#ff6633', '#ffcc00', '#33ff66', '#9933ff', '#ff33cc'],
} as const;
