export type GamePhase = 'menu' | 'playing' | 'gameover';

export interface TrafficVehicle {
  id: string;
  lane: number;
  z: number;
  color: string;
  speed: number;
}

export interface RoadBlock {
  id: string;
  lane: number;
  z: number;
}
