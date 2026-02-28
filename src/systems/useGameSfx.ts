import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore.ts';

function createBeep(
  ctx: AudioContext,
  {
    freq,
    duration,
    type = 'sine',
    volume = 0.08,
    sweepTo,
  }: {
    freq: number;
    duration: number;
    type?: OscillatorType;
    volume?: number;
    sweepTo?: number;
  }
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  if (sweepTo) {
    osc.frequency.exponentialRampToValueAtTime(sweepTo, ctx.currentTime + duration);
  }

  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration + 0.02);
}

export function useGameSfx() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const bgmAvailableRef = useRef(true);

  const laneChangeTick = useGameStore((s) => s.laneChangeTick);
  const nearAlertTick = useGameStore((s) => s.nearAlertTick);
  const crashTick = useGameStore((s) => s.crashTick);
  const phase = useGameStore((s) => s.phase);

  useEffect(() => {
    const init = () => {
      if (!audioCtxRef.current) {
        const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (Ctx) audioCtxRef.current = new Ctx();
      }
      void audioCtxRef.current?.resume();

      // Optional BGM loop. Works if /bg-music.mp3 exists; silently degrades if missing.
      if (!bgmRef.current) {
        const bgm = new Audio('/bg-music.mp3');
        bgm.loop = true;
        bgm.volume = 0.25;
        bgm.preload = 'auto';
        bgm.addEventListener('error', () => {
          bgmAvailableRef.current = false;
        });
        bgmRef.current = bgm;
      }
    };

    window.addEventListener('pointerdown', init, { once: true });
    window.addEventListener('keydown', init, { once: true });

    return () => {
      window.removeEventListener('pointerdown', init);
      window.removeEventListener('keydown', init);
      if (bgmRef.current) {
        bgmRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    createBeep(ctx, { freq: 620, sweepTo: 780, duration: 0.08, type: 'triangle', volume: 0.035 });
  }, [laneChangeTick]);

  useEffect(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    // Slightly more audible near-pass whoosh (still subtle)
    createBeep(ctx, { freq: 420, sweepTo: 260, duration: 0.09, type: 'triangle', volume: 0.03 });
    createBeep(ctx, { freq: 230, sweepTo: 170, duration: 0.07, type: 'sawtooth', volume: 0.018 });
  }, [nearAlertTick]);

  useEffect(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    createBeep(ctx, { freq: 220, sweepTo: 80, duration: 0.22, type: 'square', volume: 0.09 });

    if (navigator.vibrate) {
      navigator.vibrate(70);
    }
  }, [crashTick]);

  useEffect(() => {
    const bgm = bgmRef.current;
    if (!bgm || !bgmAvailableRef.current) return;

    if (phase === 'playing') {
      void bgm.play().catch(() => {
        // autoplay can still be blocked until user gesture; ignore safely
      });
    } else {
      bgm.pause();
    }
  }, [phase]);
}
