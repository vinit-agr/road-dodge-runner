import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore.ts';

export function GameOverScreen() {
  const score = useGameStore((s) => s.score);
  const bestScore = useGameStore((s) => s.bestScore);
  const startGame = useGameStore((s) => s.startGame);

  const isNewBest = Math.floor(score) >= Math.floor(bestScore) && score > 0;

  return (
    <motion.div
      className="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h1
        className="gameover-title"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        CRASH!
      </motion.h1>

      <div className="score-display">
        <div className="final-score">
          <span className="score-label">SCORE</span>
          <span className="score-number">{Math.floor(score)}</span>
        </div>
        <div className="best-score-display">
          <span className="score-label">BEST</span>
          <span className="score-number">{Math.floor(bestScore)}</span>
        </div>
        {isNewBest && (
          <motion.span
            className="new-best"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            NEW BEST!
          </motion.span>
        )}
      </div>

      <motion.button
        className="start-btn"
        onClick={startGame}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        PLAY AGAIN
      </motion.button>
    </motion.div>
  );
}
