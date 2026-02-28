import { create } from 'zustand';
import type { GamePhase, TrafficVehicle } from '../types/game.ts';
import {
  BASE_SPEED,
  COLORS,
  DESPAWN_Z,
  LANE_POSITIONS,
  MAX_SPEED,
  MAX_TRAFFIC,
  PLAYER_START_LANE,
  SPAWN_INTERVAL_BASE,
  SPAWN_INTERVAL_MIN,
  SPAWN_Z_OFFSET,
  SPEED_RAMP_RATE,
} from '../config/gameConfig.ts';

interface GameState {
  phase: GamePhase;
  score: number;
  bestScore: number;
  speed: number;
  currentLane: number;
  targetLane: number;
  traffic: TrafficVehicle[];
  spawnTimer: number;

  startGame: () => void;
  gameOver: () => void;
  returnToMenu: () => void;
  switchLane: (dir: -1 | 1) => void;
  tick: (delta: number) => void;
}

let nextId = 0;

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'menu',
  score: 0,
  bestScore: parseFloat(localStorage.getItem('rdr_best') ?? '0'),
  speed: BASE_SPEED,
  currentLane: PLAYER_START_LANE,
  targetLane: PLAYER_START_LANE,
  traffic: [],
  spawnTimer: 0,

  startGame: () =>
    set({
      phase: 'playing',
      score: 0,
      speed: BASE_SPEED,
      currentLane: PLAYER_START_LANE,
      targetLane: PLAYER_START_LANE,
      traffic: [],
      spawnTimer: 0,
    }),

  gameOver: () => {
    const { score, bestScore } = get();
    const newBest = Math.max(score, bestScore);
    localStorage.setItem('rdr_best', String(newBest));
    set({ phase: 'gameover', bestScore: newBest });
  },

  returnToMenu: () => set({ phase: 'menu' }),

  switchLane: (dir) => {
    const { targetLane } = get();
    const newLane = Math.max(0, Math.min(2, targetLane + dir));
    set({ targetLane: newLane });
  },

  tick: (delta) => {
    const state = get();
    if (state.phase !== 'playing') return;

    const newSpeed = Math.min(MAX_SPEED, state.speed + SPEED_RAMP_RATE * delta);
    const newScore = state.score + delta * newSpeed;

    // Move traffic forward (towards player) and despawn
    const movedTraffic = state.traffic
      .map((t) => ({ ...t, z: t.z + (newSpeed - t.speed * 0.3) * delta }))
      .filter((t) => t.z < DESPAWN_Z);

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

    // Collision detection (simple lane + z proximity)
    const playerX = LANE_POSITIONS[state.currentLane];
    for (const t of spawned) {
      const tX = LANE_POSITIONS[t.lane];
      if (Math.abs(playerX - tX) < 1.8 && t.z > -2.5 && t.z < 2.0) {
        state.gameOver();
        return;
      }
    }

    set({
      speed: newSpeed,
      score: newScore,
      traffic: spawned,
      spawnTimer: newTimer,
    });
  },
}));
