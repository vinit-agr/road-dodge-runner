import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore.ts';

export function StartScreen() {
  const startGame = useGameStore((s) => s.startGame);

  return (
    <motion.div
      className="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h1
        className="title"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
      >
        ROAD DODGE
      </motion.h1>
      <motion.p
        className="subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Dodge traffic. Survive the night.
      </motion.p>
      <motion.button
        className="start-btn"
        onClick={startGame}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        TAP TO START
      </motion.button>
      <motion.p
        className="controls-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1 }}
      >
        Swipe or Arrow Keys to steer
      </motion.p>
    </motion.div>
  );
}
