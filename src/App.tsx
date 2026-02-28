import { Canvas } from '@react-three/fiber';
import { AnimatePresence } from 'framer-motion';
import { GameScene } from './components/GameScene.tsx';
import { useGameStore } from './store/gameStore.ts';
import { useInput } from './systems/useInput.ts';
import { useGameSfx } from './systems/useGameSfx.ts';
import { HUD } from './ui/HUD.tsx';
import { StartScreen } from './ui/StartScreen.tsx';
import { GameOverScreen } from './ui/GameOverScreen.tsx';
import { COLORS } from './config/gameConfig.ts';

function App() {
  useInput();
  useGameSfx();
  const phase = useGameStore((s) => s.phase);
  const resumeGame = useGameStore((s) => s.resumeGame);

  return (
    <div className="game-container">
      <Canvas
        camera={{
          position: [0, 5.5, 8],
          fov: 65,
          near: 0.1,
          far: 200,
          rotation: [-0.5, 0, 0],
        }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: COLORS.sky }}
        dpr={[1, 1.5]}
      >
        <GameScene />
      </Canvas>

      <AnimatePresence mode="wait">
        {phase === 'menu' && <StartScreen key="start" />}
        {phase === 'gameover' && <GameOverScreen key="gameover" />}
      </AnimatePresence>

      {phase === 'paused' && (
        <div className="overlay">
          <h2 className="title" style={{ fontSize: 'clamp(2rem, 7vw, 4rem)' }}>PAUSED</h2>
          <p className="subtitle">Press P / ESC or tap Resume</p>
          <button className="start-btn" onPointerDown={(e) => { e.preventDefault(); resumeGame(); }}>
            Resume ▶
          </button>
        </div>
      )}

      {(phase === 'playing' || phase === 'paused') && <HUD />}
    </div>
  );
}

export default App;
