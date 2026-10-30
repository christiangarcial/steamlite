import { useEffect, useRef, useState } from 'react';

const TRACK_HEIGHT = 60;
const CAR_WIDTH = 46;
const CAR_HEIGHT = 26;

/**
 * Carrera pixel art con scroll infinito, obstaculos genericos y contador de tiempo.
 */
export const PixelRacerGame = () => {
  const canvasRef = useRef(null);
  const [speed, setSpeed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [gameState, setGameState] = useState('ready'); // ready | playing | over
  const stateRef = useRef({ carX: 200, obstacles: [], scroll: 0, distance: 0, speed: 0 });

  const reset = () => {
    const state = stateRef.current;
    state.carX = 200;
    state.obstacles = [];
    state.scroll = 0;
    state.distance = 0;
    state.speed = 0;
    setSpeed(0);
    setDistance(0);
    setGameState('playing');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;
    const width = canvas.width;
    const height = canvas.height;
    const roadTop = height * 0.22;

    const keys = { left: false, right: false };
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
    };
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationId;
    let lastTime = performance.now();

    const update = (delta) => {
      if (gameState !== 'playing') return;

      // Velocidad creciente
      state.speed = Math.min(9, state.speed + delta * 0.35);
      state.scroll += state.speed;
      state.distance += state.speed * 0.6;

      // Control lateral
      if (keys.left) state.carX -= state.speed * 0.55;
      if (keys.right) state.carX += state.speed * 0.55;
      state.carX = Math.max(60, Math.min(width - 60 - CAR_WIDTH, state.carX));

      // Generar obstaculos
      if (Math.random() < delta * 1.4) {
        state.obstacles.push({ x: 60 + Math.random() * (width - 60 - CAR_WIDTH), y: roadTop - 30 });
      }

      // Mover y colisionar obstaculos
      const carY = height - TRACK_HEIGHT - CAR_HEIGHT;
      state.obstacles = state.obstacles.filter((obstacle) => {
        obstacle.y += state.speed * 2.4;

        const hit =
          obstacle.x < state.carX + CAR_WIDTH &&
          obstacle.x + CAR_WIDTH > state.carX &&
          obstacle.y < carY + CAR_HEIGHT &&
          obstacle.y + CAR_HEIGHT > carY;

        if (hit) {
          setGameState('over');
          return false;
        }
        return obstacle.y < height;
      });

      setSpeed(state.speed);
      setDistance(Math.floor(state.distance));
    };

    const draw = () => {
      // Cielo
      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, '#1a1030');
      sky.addColorStop(0.55, '#3b1a4d');
      sky.addColorStop(1, '#0e1116');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      // Sol/estrellas pixel
      ctx.fillStyle = '#ff9f43';
      ctx.fillRect(width - 120, 40, 44, 44);
      ctx.fillStyle = '#1a1030';
      ctx.fillRect(width - 108, 32, 12, 12);

      // Parallax de torres
      ctx.fillStyle = '#241540';
      for (let i = 0; i < 12; i += 1) {
        const x = (i * 70 - (state.scroll * 0.35) % (12 * 70) + 12 * 70) % (width + 70) - 35;
        const buildingHeight = 40 + ((i * 37) % 90);
        ctx.fillRect(x, roadTop - buildingHeight, 48, buildingHeight);
        // Ventanas
        ctx.fillStyle = 'rgba(255, 200, 100, 0.35)';
        for (let w = 0; w < 4; w += 1) {
          ctx.fillRect(x + 8 + (w % 2) * 20, roadTop - buildingHeight + 12 + Math.floor(w / 2) * 22, 8, 10);
        }
        ctx.fillStyle = '#241540';
      }

      // Asfalto
      ctx.fillStyle = '#1f2430';
      ctx.fillRect(0, roadTop, width, height - roadTop);

      // Bordes de la pista
      ctx.fillStyle = '#e8e8e8';
      ctx.fillRect(40, roadTop, 6, height - roadTop);
      ctx.fillRect(width - 46, roadTop, 6, height - roadTop);

      // Lineas discontinuas en scroll
      ctx.fillStyle = '#f0d060';
      const dashOffset = state.scroll * 2 % 40;
      for (let y = roadTop - dashOffset; y < height; y += 40) {
        ctx.fillRect(width / 2 - 3, y, 6, 20);
      }

      // Coche del jugador (pixel art)
      const carY = height - TRACK_HEIGHT - CAR_HEIGHT;
      ctx.fillStyle = '#66c0f4';
      ctx.fillRect(state.carX, carY + 8, CAR_WIDTH, CAR_HEIGHT - 8);
      ctx.fillStyle = '#1b2838';
      ctx.fillRect(state.carX + 8, carY + 12, CAR_WIDTH - 16, 8);
      ctx.fillStyle = '#0e1116';
      ctx.fillRect(state.carX + 4, carY + CAR_HEIGHT - 4, 10, 6);
      ctx.fillRect(state.carX + CAR_WIDTH - 14, carY + CAR_HEIGHT - 4, 10, 6);
      ctx.fillStyle = '#ff4d4d';
      ctx.fillRect(state.carX + CAR_WIDTH - 6, carY + 12, 4, 6);

      // Obstaculos
      state.obstacles.forEach((obstacle) => {
        ctx.fillStyle = '#e8b44a';
        ctx.fillRect(obstacle.x, obstacle.y, CAR_WIDTH, CAR_HEIGHT - 6);
        ctx.fillStyle = '#8a5f10';
        ctx.fillRect(obstacle.x, obstacle.y + CAR_HEIGHT - 12, CAR_WIDTH, 6);
      });
    };

    const loop = (time) => {
      const delta = Math.min(0.05, (time - lastTime) / 16.67);
      lastTime = time;
      update(delta);
      draw();
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  return (
    <div style={{ textAlign: 'center', color: '#fff' }}>
      <h2 style={{ margin: '0 0 0.35rem' }}>Pixel Racer &apos;89</h2>
      <p style={{ color: '#8f98a0', margin: '0 0 0.75rem', fontSize: '0.88rem' }}>
        Usa ← y → para esquivar. Cuanto mas aguantas, mas rapido vas.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.75rem' }}>
        <span>
          Distancia: <strong style={{ color: '#a4d007' }}>{distance} m</strong>
        </span>
        <span>
          Velocidad: <strong style={{ color: '#66c0f4' }}>{Math.round(speed * 22)} km/h</strong>
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={460}
        height={320}
        style={{
          border: '3px solid #2a475e',
          borderRadius: '8px',
          backgroundColor: '#0e1116',
          maxWidth: '100%',
          imageRendering: 'pixelated',
        }}
      />

      {gameState !== 'playing' && (
        <div style={{ marginTop: '1rem' }}>
          <p style={{ margin: '0 0 0.75rem', fontWeight: 'bold', color: gameState === 'over' ? '#ff6b6b' : '#66c0f4' }}>
            {gameState === 'ready' ? 'Pulsa para salir a pista' : `Crash en ${distance} m`}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '0.6rem 1.4rem',
              backgroundColor: '#66c0f4',
              color: '#0e1116',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {gameState === 'ready' ? 'Jugar' : 'Reiniciar'}
          </button>
        </div>
      )}
    </div>
  );
};
