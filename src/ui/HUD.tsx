import { useGameStore } from '../store/gameStore.ts';

export function HUD() {
  const score = useGameStore((s) => s.score);
  const bestScore = useGameStore((s) => s.bestScore);
  const speed = useGameStore((s) => s.speed);
  const switchLane = useGameStore((s) => s.switchLane);

  return (
    <div className="hud">
      <div className="hud-top">
        <div className="hud-score">
          <span className="hud-label">SCORE</span>
          <span className="hud-value">{Math.floor(score)}</span>
        </div>
        <div className="hud-speed">
          <span className="hud-label">SPEED</span>
          <span className="hud-value">{Math.floor(speed * 10)} km/h</span>
        </div>
        <div className="hud-best">
          <span className="hud-label">BEST</span>
          <span className="hud-value">{Math.floor(bestScore)}</span>
        </div>
      </div>

      {/* Mobile on-screen buttons */}
      <div className="hud-mobile-controls">
        <button
          className="hud-btn hud-btn-left"
          onPointerDown={(e) => { e.preventDefault(); switchLane(-1); }}
        >
          ◀
        </button>
        <button
          className="hud-btn hud-btn-right"
          onPointerDown={(e) => { e.preventDefault(); switchLane(1); }}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
