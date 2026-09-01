import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  // 经典多角度烟花喷射效果
  const count = 160;
  const defaults = {
    origin: { y: 0.75 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 45,
    colors: ['#38bdf8', '#818cf8', '#c084fc'],
  });
  fire(0.2, {
    spread: 60,
    colors: ['#34d399', '#fbbf24', '#f87171'],
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 38,
  });
};
