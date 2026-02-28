export type GamePhase = 'menu' | 'playing' | 'paused' | 'gameover';

export interface TrafficVehicle {
  id: string;
  lane: number;
  z: number;
  color: string;
  speed: number;
}

export type RoadObstacleKind = 'cone' | 'barrier' | 'duck' | 'crate';

export interface RoadBlock {
  id: string;
  lane: number;
  z: number;
  kind: RoadObstacleKind;
}
