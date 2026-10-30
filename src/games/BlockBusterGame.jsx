import { useEffect, useRef, useState } from 'react';

const COLS = 10;
const ROWS = 20;
const CELL = 24;
const TYPES = ['#66c0f4', '#c792ea', '#a4d007', '#e8b44a'];

/**
 * Tetris simplificado: las piezas caen, se apilan y se completan lineas.
 */
const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
};

/**
 * Crea una pieza nueva en posicion aleatoria valida.
 * Vive fuera del componente para que su identidad sea estable.
 */
const spawnPiece = () => {
  const keys = Object.keys(SHAPES);
  const type = keys[Math.floor(Math.random() * keys.length)];
  const shape = SHAPES[type];
  return {
    type,
    shape,
    color: TYPES[keys.indexOf(type) % TYPES.length],
    x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
    y: 0,
  };
};

export const BlockBusterGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameState, setGameState] = useState('ready');
  const stateRef = useRef({ board: [], piece: null, score: 0, lines: 0 });

  const reset = () => {
    const state = stateRef.current;
    state.board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    state.piece = spawnPiece();
    state.score = 0;
    state.lines = 0;
    setScore(0);
    setLines(0);
    setGameState('playing');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;

    const collides = (piece, dx, dy, board) => {
      const test = {
        x: piece.x + dx,
        y: piece.y + dy,
        shape: piece.shape,
      };
      for (let r = 0; r < test.shape.length; r += 1) {
        for (let c = 0; c < test.shape[r].length; c += 1) {
          if (!test.shape[r][c]) continue;
          const nx = test.x + c;
          const ny = test.y + r;
          if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
          if (ny >= 0 && board[ny][nx]) return true;
        }
      }
      return false;
    };

    const lockPiece = () => {
      const { piece, board } = state;
      for (let r = 0; r < piece.shape.length; r += 1) {
        for (let c = 0; c < piece.shape[r].length; c += 1) {
          if (!piece.shape[r][c]) continue;
          const ny = piece.y + r;
          const nx = piece.x + c;
          if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) {
            board[ny][nx] = piece.color;
          }
        }
      }

      // Eliminar lineas completas
      let cleared = 0;
      for (let r = ROWS - 1; r >= 0; r -= 1) {
        if (board[r].every((cell) => cell !== null)) {
          board.splice(r, 1);
          board.unshift(Array(COLS).fill(null));
          cleared += 1;
          r += 1;
        }
      }

      if (cleared > 0) {
        state.score += cleared * 100 * cleared;
        state.lines += cleared;
        setScore(state.score);
        setLines(state.lines);
      }

      state.piece = spawnPiece();
      if (collides(state.piece, 0, 0, state.board)) {
        setGameState('over');
      }
    };

    const handleKeyDown = (e) => {
      if (gameState !== 'playing' || !state.piece) return;
      const board = state.board;

      if (e.key === 'ArrowLeft' && !collides(state.piece, -1, 0, board)) {
        state.piece.x -= 1;
      }
      if (e.key === 'ArrowRight' && !collides(state.piece, 1, 0, board)) {
        state.piece.x += 1;
      }
      if (e.key === 'ArrowDown' && !collides(state.piece, 0, 1, board)) {
        state.piece.y += 1;
        state.score += 1;
        setScore(state.score);
      }
      if (e.key === 'ArrowUp') {
        // Rotacion simple (sin wall kicks)
        const rotated = state.piece.shape[0].map((_, i) => state.piece.shape.map((row) => row[i]).reverse());
        const candidate = { ...state.piece, shape: rotated };
        if (!collides(candidate, 0, 0, board)) {
          state.piece.shape = rotated;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    let animationId;
    let lastDrop = 0;

    const loop = (time) => {
      if (gameState === 'playing' && state.piece) {
        if (time - lastDrop > 620) {
          lastDrop = time;
          if (!collides(state.piece, 0, 1, state.board)) {
            state.piece.y += 1;
          } else {
            lockPiece();
          }
        }
      }

      // Render
      ctx.fillStyle = '#101822';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(42, 71, 94, 0.5)';
      ctx.lineWidth = 1;
      for (let c = 0; c <= COLS; c += 1) {
        ctx.beginPath();
        ctx.moveTo(c * CELL, 0);
        ctx.lineTo(c * CELL, ROWS * CELL);
        ctx.stroke();
      }
      for (let r = 0; r <= ROWS; r += 1) {
        ctx.beginPath();
        ctx.moveTo(0, r * CELL);
        ctx.lineTo(COLS * CELL, r * CELL);
        ctx.stroke();
      }

      // Piezas fijas
      state.board.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (!cell) return;
          ctx.fillStyle = cell;
          ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
        });
      });

      // Pieza activa
      if (state.piece) {
        const { piece } = state;
        piece.shape.forEach((row, r) => {
          row.forEach((cell, c) => {
            if (!cell) return;
            ctx.fillStyle = piece.color;
            ctx.fillRect((piece.x + c) * CELL + 1, (piece.y + r) * CELL + 1, CELL - 2, CELL - 2);
          });
        });
      }

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState]);

  return (
    <div style={{ textAlign: 'center', color: '#fff' }}>
      <h2 style={{ margin: '0 0 0.35rem' }}>Block Buster</h2>
      <p style={{ color: '#8f98a0', margin: '0 0 0.75rem', fontSize: '0.88rem' }}>
        ← → mover · ↑ rotar · ↓ acelerar la caida · Completa lineas
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.75rem' }}>
        <span>
          Puntos: <strong style={{ color: '#a4d007' }}>{score}</strong>
        </span>
        <span>
          Lineas: <strong style={{ color: '#66c0f4' }}>{lines}</strong>
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={COLS * CELL}
        height={ROWS * CELL}
        style={{
          border: '3px solid #2a475e',
          borderRadius: '8px',
          backgroundColor: '#101822',
          maxWidth: '100%',
        }}
      />

      {gameState !== 'playing' && (
        <div style={{ marginTop: '1rem' }}>
          <p style={{ margin: '0 0 0.75rem', fontWeight: 'bold', color: gameState === 'over' ? '#ff6b6b' : '#66c0f4' }}>
            {gameState === 'ready' ? 'Pulsa para empezar' : 'Game over'}
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
