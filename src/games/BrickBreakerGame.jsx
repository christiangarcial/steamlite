import { useEffect, useRef, useState } from 'react';

const BRICK_COLORS = ['#66c0f4', '#a4d007', '#e8b44a', '#ff6b6b', '#c792ea'];

export const BrickBreakerGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState('ready'); // ready | playing | over
  const stateRef = useRef({ score: 0, lives: 3, bricks: [], ball: null, paddle: null });

  const reset = () => {
    const state = stateRef.current;
    state.score = 0;
    state.lives = 3;
    state.bricks = [];

    const rows = 5;
    const cols = 9;
    const brickW = 64;
    const brickH = 22;
    const gap = 4;
    const offsetX = 12;

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        state.bricks.push({
          x: offsetX + c * (brickW + gap),
          y: 40 + r * (brickH + gap),
          w: brickW,
          h: brickH,
          color: BRICK_COLORS[r % BRICK_COLORS.length],
          alive: true,
          points: (rows - r) * 10,
        });
      }
    }

    state.paddle = { x: 220, y: 320, w: 90, h: 12 };
    state.ball = { x: 260, y: 300, dx: 3, dy: -3, radius: 7 };
    setScore(0);
    setLives(3);
    setGameState('playing');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;

    const keys = { left: false, right: false };
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') keys.left = true;
      if (e.key === 'ArrowRight') keys.right = true;
    };
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft') keys.left = false;
      if (e.key === 'ArrowRight') keys.right = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationId;

    const update = () => {
      if (state.ball && gameState === 'playing') {
        // Raqueta
        if (keys.left) state.paddle.x = Math.max(0, state.paddle.x - 8);
        if (keys.right) state.paddle.x = Math.min(canvas.width - state.paddle.w, state.paddle.x + 8);

        // Pelota
        state.ball.x += state.ball.dx;
        state.ball.y += state.ball.dy;

        if (state.ball.x - state.ball.radius < 0 || state.ball.x + state.ball.radius > canvas.width) {
          state.ball.dx *= -1;
        }
        if (state.ball.y - state.ball.radius < 0) {
          state.ball.dy *= -1;
        }

        // Rebote en la raqueta con angulo variable
        const paddle = state.paddle;
        if (
          state.ball.y + state.ball.radius >= paddle.y &&
          state.ball.y - state.ball.radius <= paddle.y + paddle.h &&
          state.ball.x >= paddle.x &&
          state.ball.x <= paddle.x + paddle.w &&
          state.ball.dy > 0
        ) {
          const relative = (state.ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
          const angle = relative * (Math.PI / 3);
          const speed = Math.hypot(state.ball.dx, state.ball.dy);
          state.ball.dx = speed * Math.sin(angle);
          state.ball.dy = -speed * Math.cos(angle);
          state.ball.y = paddle.y - state.ball.radius;
        }

        // Ladrillos
        let allCleared = true;
        state.bricks.forEach((brick) => {
          if (!brick.alive) return;
          allCleared = false;

          const collides =
            state.ball.x + state.ball.radius > brick.x &&
            state.ball.x - state.ball.radius < brick.x + brick.w &&
            state.ball.y + state.ball.radius > brick.y &&
            state.ball.y - state.ball.radius < brick.y + brick.h;

          if (collides) {
            brick.alive = false;
            state.ball.dy *= -1;
            state.score += brick.points;
            setScore(state.score);
          }
        });

        if (allCleared) {
          setGameState('won');
          return;
        }

        // Bola perdida
        if (state.ball.y - state.ball.radius > canvas.height) {
          state.lives -= 1;
          setLives(state.lives);
          if (state.lives <= 0) {
            setGameState('over');
            return;
          }
          state.ball = { x: 260, y: 300, dx: 3, dy: -3, radius: 7 };
        }
      }

      // Render
      ctx.fillStyle = '#101822';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      state.bricks.forEach((brick) => {
        if (!brick.alive) return;
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(brick.x, brick.y + brick.h - 4, brick.w, 4);
      });

      if (state.paddle) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(state.paddle.x, state.paddle.y, state.paddle.w, state.paddle.h);
      }

      if (state.ball) {
        ctx.fillStyle = '#66c0f4';
        ctx.beginPath();
        ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      update();
      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  return (
    <div style={{ textAlign: 'center', color: '#fff' }}>
      <h2 style={{ margin: '0 0 0.35rem' }}>Brick Breaker X</h2>
      <p style={{ color: '#8f98a0', margin: '0 0 0.75rem', fontSize: '0.88rem' }}>
        Mueve la raqueta con ← y → · Rompe todos los ladrillos
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.75rem' }}>
        <span>
          Puntos: <strong style={{ color: '#a4d007' }}>{score}</strong>
        </span>
        <span>
          Vidas: <strong style={{ color: '#ff6b6b' }}>{'♥'.repeat(Math.max(0, lives))}</strong>
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={520}
        height={340}
        style={{ border: '3px solid #2a475e', borderRadius: '8px', backgroundColor: '#101822', maxWidth: '100%' }}
      />

      {(gameState === 'ready' || gameState === 'over' || gameState === 'won') && (
        <div style={{ marginTop: '1rem' }}>
          <p style={{ margin: '0 0 0.75rem', fontWeight: 'bold', color: gameState === 'won' ? '#a4d007' : '#ff6b6b' }}>
            {gameState === 'ready' && 'Pulsa para empezar'}
            {gameState === 'over' && 'Game over'}
            {gameState === 'won' && '¡Has ganado la partida!'}
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
