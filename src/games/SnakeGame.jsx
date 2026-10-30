import { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;
const TILE_COUNT = CANVAS_SIZE / GRID_SIZE;
const STEP_MS = 120;

export const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem('steamlite.snake.best') || 0));
  const [gameState, setGameState] = useState('ready'); // ready | playing | over

  // El estado interno del juego vive en un ref para que reiniciar la
  // partida no requiera recrear los listeners ni el bucle de render.
  const gameRef = useRef({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    dx: 1,
    dy: 0,
    score: 0,
    accumulator: 0,
    lastTime: 0,
  });

  const resetGame = () => {
    const game = gameRef.current;
    game.snake = [{ x: 10, y: 10 }];
    game.food = { x: 15, y: 15 };
    game.dx = 1;
    game.dy = 0;
    game.score = 0;
    game.accumulator = 0;
    game.lastTime = 0;
    setScore(0);
    setGameState('playing');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const game = gameRef.current;

    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowUp' && game.dy === 0) { game.dx = 0; game.dy = -1; }
      if (e.key === 'ArrowDown' && game.dy === 0) { game.dx = 0; game.dy = 1; }
      if (e.key === 'ArrowLeft' && game.dx === 0) { game.dx = -1; game.dy = 0; }
      if (e.key === 'ArrowRight' && game.dx === 0) { game.dx = 1; game.dy = 0; }
    };

    window.addEventListener('keydown', handleKeyDown);

    const placeFood = () => {
      let next;
      do {
        next = {
          x: Math.floor(Math.random() * TILE_COUNT),
          y: Math.floor(Math.random() * TILE_COUNT),
        };
      } while (game.snake.some((segment) => segment.x === next.x && segment.y === next.y));
      game.food = next;
    };

    const step = () => {
      const head = { x: game.snake[0].x + game.dx, y: game.snake[0].y + game.dy };

      // Deteccion de colision con bordes o con el propio cuerpo
      if (
        head.x < 0 || head.x >= TILE_COUNT ||
        head.y < 0 || head.y >= TILE_COUNT ||
        game.snake.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setGameState('over');
        setBest((prev) => {
          const next = Math.max(prev, game.score);
          localStorage.setItem('steamlite.snake.best', String(next));
          return next;
        });
        return;
      }

      game.snake.unshift(head);

      if (head.x === game.food.x && head.y === game.food.y) {
        game.score += 10;
        setScore(game.score);
        placeFood();
      } else {
        game.snake.pop();
      }
    };

    const draw = () => {
      ctx.fillStyle = '#171a21';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Rejilla
      ctx.strokeStyle = 'rgba(42, 71, 94, 0.35)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= TILE_COUNT; i += 1) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(canvas.width, i * GRID_SIZE);
        ctx.stroke();
      }

      // Comida
      ctx.fillStyle = '#ff4d4d';
      ctx.fillRect(game.food.x * GRID_SIZE, game.food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);

      // Cuerpo
      ctx.fillStyle = '#66c0f4';
      game.snake.forEach((segment) => {
        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
      });

      // Cabeza
      ctx.fillStyle = '#a4d007';
      ctx.fillRect(game.snake[0].x * GRID_SIZE, game.snake[0].y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    };

    let animationId;

    const loop = (time) => {
      if (gameState === 'playing') {
        if (!game.lastTime) game.lastTime = time;
        game.accumulator += time - game.lastTime;
        game.lastTime = time;

        while (game.accumulator >= STEP_MS) {
          game.accumulator -= STEP_MS;
          step();
        }
      } else {
        game.lastTime = time;
      }

      draw();
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState]);

  const handleCanvasClick = () => {
    if (gameState !== 'playing') resetGame();
  };

  return (
    <div style={{ textAlign: 'center', color: '#fff' }}>
      <h2 style={{ margin: '0 0 0.35rem' }}>Snake Classic</h2>
      <p style={{ color: '#8f98a0', margin: '0 0 0.75rem', fontSize: '0.88rem' }}>
        Usa las flechas del teclado para moverte
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.75rem' }}>
        <span>
          Puntos: <strong style={{ color: '#a4d007' }}>{score}</strong>
        </span>
        <span>
          Record: <strong style={{ color: '#66c0f4' }}>{best}</strong>
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        onClick={handleCanvasClick}
        style={{
          border: '3px solid #2a475e',
          borderRadius: '8px',
          backgroundColor: '#171a21',
          maxWidth: '100%',
          cursor: gameState === 'playing' ? 'default' : 'pointer',
        }}
      />

      {gameState !== 'playing' && (
        <div style={{ marginTop: '1rem' }}>
          <p
            style={{
              margin: '0 0 0.75rem',
              fontWeight: 'bold',
              color: gameState === 'over' ? '#ff4d4d' : '#66c0f4',
            }}
          >
            {gameState === 'ready'
              ? 'Pulsa el tablero o el boton para empezar'
              : `¡Juego terminado! Puntuación: ${score}`}
          </p>
          <button
            type="button"
            onClick={resetGame}
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
            {gameState === 'over' ? 'Jugar de nuevo' : 'Empezar partida'}
          </button>
        </div>
      )}
    </div>
  );
};
