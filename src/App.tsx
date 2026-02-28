import { Canvas } from '@react-three/fiber';
import { AnimatePresence } from 'framer-motion';
import { GameScene } from './components/GameScene.tsx';
import { useGameStore } from './store/gameStore.ts';
import { useInput } from './systems/useInput.ts';
import { HUD } from './ui/HUD.tsx';
import { StartScreen } from './ui/StartScreen.tsx';
import { GameOverScreen } from './ui/GameOverScreen.tsx';
import { COLORS } from './config/gameConfig.ts';

function App() {
  useInput();
  const phase = useGameStore((s) => s.phase);

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

      {phase === 'playing' && <HUD />}
    </div>
  );
}

export default App;
