import { create } from 'zustand';
import type { GamePhase, RoadBlock, RoadObstacleKind, TrafficVehicle } from '../types/game.ts';
import {
  BASE_SPEED,
  COLORS,
  DESPAWN_Z,
  LANE_POSITIONS,
  MAX_SPEED,
  MAX_TRAFFIC,
  MAX_BLOCKS,
  PLAYER_START_LANE,
  SPAWN_INTERVAL_BASE,
  SPAWN_INTERVAL_MIN,
  BLOCK_SPAWN_INTERVAL_BASE,
  BLOCK_SPAWN_INTERVAL_MIN,
  SPAWN_Z_OFFSET,
  SPEED_RAMP_RATE,
  WORLD_SPEED_MULTIPLIER,
} from '../config/gameConfig.ts';

interface GameState {
  phase: GamePhase;
  score: number;
  bestScore: number;
  speed: number;
  currentLane: number;
  targetLane: number;
  playerX: number;
  traffic: TrafficVehicle[];
  roadBlocks: RoadBlock[];
  spawnTimer: number;
  blockSpawnTimer: number;
  nearAlertCooldown: number;

  laneChangeTick: number;
  nearAlertTick: number;
  crashTick: number;

  startGame: () => void;
  gameOver: () => void;
  returnToMenu: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  togglePause: () => void;
  switchLane: (dir: -1 | 1) => void;
  tick: (delta: number) => void;
}

let nextId = 0;
const ROAD_OBSTACLE_KINDS: RoadObstacleKind[] = ['cone', 'barrier', 'duck', 'crate'];

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'menu',
  score: 0,
  bestScore: parseFloat(localStorage.getItem('rdr_best') ?? '0'),
  speed: BASE_SPEED,
  currentLane: PLAYER_START_LANE,
  targetLane: PLAYER_START_LANE,
  playerX: LANE_POSITIONS[PLAYER_START_LANE],
  traffic: [],
  roadBlocks: [],
  spawnTimer: 0,
  blockSpawnTimer: 0,
  nearAlertCooldown: 0,

  laneChangeTick: 0,
  nearAlertTick: 0,
  crashTick: 0,

  startGame: () =>
    set({
      phase: 'playing',
      score: 0,
      speed: BASE_SPEED,
      currentLane: PLAYER_START_LANE,
      targetLane: PLAYER_START_LANE,
      playerX: LANE_POSITIONS[PLAYER_START_LANE],
      traffic: [],
      roadBlocks: [],
      spawnTimer: 0,
      blockSpawnTimer: 0,
      nearAlertCooldown: 0,
    }),

  gameOver: () => {
    const { score, bestScore, crashTick } = get();
    const newBest = Math.max(score, bestScore);
    localStorage.setItem('rdr_best', String(newBest));
    set({ phase: 'gameover', bestScore: newBest, crashTick: crashTick + 1 });
  },

  returnToMenu: () => set({ phase: 'menu' }),

  pauseGame: () => {
    const { phase } = get();
    if (phase === 'playing') set({ phase: 'paused' });
  },

  resumeGame: () => {
    const { phase } = get();
    if (phase === 'paused') set({ phase: 'playing' });
  },

  togglePause: () => {
    const { phase } = get();
    if (phase === 'playing') set({ phase: 'paused' });
    else if (phase === 'paused') set({ phase: 'playing' });
  },

  switchLane: (dir) => {
    const { targetLane, laneChangeTick } = get();
    const newLane = Math.max(0, Math.min(2, targetLane + dir));
    if (newLane !== targetLane) {
      set({ targetLane: newLane, laneChangeTick: laneChangeTick + 1 });
    }
  },

  tick: (delta) => {
    const state = get();
    if (state.phase !== 'playing') return;

    const newSpeed = Math.min(MAX_SPEED, state.speed + SPEED_RAMP_RATE * delta);
    const newScore = state.score + delta * newSpeed;

    // Keep speed value readable in HUD, but move world faster for gameplay feel.
    const worldSpeed = newSpeed * WORLD_SPEED_MULTIPLIER;

    // Move traffic forward (towards player) and despawn
    const movedTraffic = state.traffic
      .map((t) => ({ ...t, z: t.z + (worldSpeed - t.speed * 0.3) * delta }))
      .filter((t) => t.z < DESPAWN_Z);

    // Move road blocks forward (static obstacle style)
    const movedBlocks = state.roadBlocks
      .map((b) => ({ ...b, z: b.z + worldSpeed * delta }))
      .filter((b) => b.z < DESPAWN_Z);

    // Spawn new traffic
    let newTimer = state.spawnTimer - delta;
    let spawned = movedTraffic;
    if (newTimer <= 0 && spawned.length < MAX_TRAFFIC) {
      const speedFactor = (newSpeed - BASE_SPEED) / (MAX_SPEED - BASE_SPEED);
      const interval = SPAWN_INTERVAL_BASE - speedFactor * (SPAWN_INTERVAL_BASE - SPAWN_INTERVAL_MIN);
      newTimer = interval;

      const lane = Math.floor(Math.random() * 3);
      // Avoid spawning on top of existing far traffic
      const tooClose = spawned.some(
        (t) => t.lane === lane && Math.abs(t.z - SPAWN_Z_OFFSET) < 8
      );
      if (!tooClose) {
        const colorIdx = Math.floor(Math.random() * COLORS.traffic.length);
        spawned = [
          ...spawned,
          {
            id: `t${nextId++}`,
            lane,
            z: SPAWN_Z_OFFSET,
            color: COLORS.traffic[colorIdx],
            speed: newSpeed * (0.3 + Math.random() * 0.4),
          },
        ];
      }
    }

    // Spawn new road blocks
    let newBlockTimer = state.blockSpawnTimer - delta;
    let spawnedBlocks = movedBlocks;
    if (newBlockTimer <= 0 && spawnedBlocks.length < MAX_BLOCKS) {
      const speedFactor = (newSpeed - BASE_SPEED) / (MAX_SPEED - BASE_SPEED);
      const interval = BLOCK_SPAWN_INTERVAL_BASE - speedFactor * (BLOCK_SPAWN_INTERVAL_BASE - BLOCK_SPAWN_INTERVAL_MIN);
      newBlockTimer = interval;

      const lane = Math.floor(Math.random() * 3);
      const tooCloseToBlock = spawnedBlocks.some(
        (b) => b.lane === lane && Math.abs(b.z - SPAWN_Z_OFFSET) < 10
      );
      const tooCloseToTraffic = spawned.some(
        (t) => t.lane === lane && Math.abs(t.z - SPAWN_Z_OFFSET) < 10
      );

      if (!tooCloseToBlock && !tooCloseToTraffic) {
        spawnedBlocks = [
          ...spawnedBlocks,
          {
            id: `b${nextId++}`,
            lane,
            z: SPAWN_Z_OFFSET,
            kind: ROAD_OBSTACLE_KINDS[Math.floor(Math.random() * ROAD_OBSTACLE_KINDS.length)],
          },
        ];
      }
    }

    // Near-miss proximity cue (same lane + close z, but not collision)
    let nearAlertTick = state.nearAlertTick;
    let nearAlertCooldown = Math.max(0, state.nearAlertCooldown - delta);

    // Collision detection (tuned for narrower bike silhouette)
    const playerX = state.playerX;
    const laneHitThreshold = 1.05;
    for (const t of spawned) {
      const tX = LANE_POSITIONS[t.lane];
      if (Math.abs(playerX - tX) < laneHitThreshold && t.z > -1.75 && t.z < 1.35) {
        state.gameOver();
        return;
      }

      // Subtle "nearby traffic" sound trigger (near pass / side whoosh)
      if (
        nearAlertCooldown <= 0 &&
        Math.abs(playerX - tX) < 3.0 &&
        t.z > -0.8 &&
        t.z < 4.6
      ) {
        nearAlertTick += 1;
        nearAlertCooldown = 0.2;
      }
    }

    for (const b of spawnedBlocks) {
      const bX = LANE_POSITIONS[b.lane];
      if (Math.abs(playerX - bX) < laneHitThreshold && b.z > -1.7 && b.z < 1.25) {
        state.gameOver();
        return;
      }
    }

    set({
      speed: newSpeed,
      score: newScore,
      traffic: spawned,
      roadBlocks: spawnedBlocks,
      spawnTimer: newTimer,
      blockSpawnTimer: newBlockTimer,
      nearAlertTick,
      nearAlertCooldown,
    });
  },
}));
