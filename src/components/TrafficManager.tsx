import { useGameStore } from '../store/gameStore.ts';
import { TrafficCar } from './TrafficCar.tsx';

export function TrafficManager() {
  const traffic = useGameStore((s) => s.traffic);

  return (
    <group>
      {traffic.map((t) => (
        <TrafficCar key={t.id} id={t.id} lane={t.lane} color={t.color} />
      ))}
    </group>
  );
}
