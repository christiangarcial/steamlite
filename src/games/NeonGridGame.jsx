import { useCallback, useEffect, useState } from 'react';

const SIZE = 7;
const PALETTE = ['#66c0f4', '#c792ea', '#a4d007', '#e8b44a'];

/**
 * Rompecabezas de logique: ilumina la cuadrícula sin repetir color
 * en la misma fila ni columna.
 *
 * Cada celda es un boton; al pulsarla rota su color de forma ciclica.
 * Nunca se permite quedar un conflicto con los vecinos inmediatos.
 */
export const NeonGridGame = () => {
  const [level, setLevel] = useState(1);
  const [solved, setSolved] = useState(false);
  const [moves, setMoves] = useState(0);
  const [grid, setGrid] = useState([]);
  const [solution, setSolution] = useState([]);

  /**
   * Genera un tablero resoluble: primero construye una solucion consistente
   * (sin repetir color en fila ni columna) y luego la "desordena" para que
   * el jugador tenga que arreglarla.
   */
  const generateBoard = useCallback((currentLevel) => {
    const size = Math.min(SIZE, 4 + currentLevel);

    const solvedGrid = [];
    for (let r = 0; r < size; r += 1) {
      const row = [];
      for (let c = 0; c < size; c += 1) {
        const used = new Set([...solvedGrid.map((prev) => prev[c]), ...row]);
        const available = PALETTE.filter((color) => !used.has(color));
        row.push(available[Math.floor(Math.random() * available.length)]);
      }
      solvedGrid.push(row);
    }

    // Desordena respetando las restricciones de vecinos.
    const mixed = solvedGrid.map((row) => [...row]);
    for (let r = 0; r < size; r += 1) {
      for (let c = 0; c < size; c += 1) {
        if (Math.random() < 0.55) {
          const options = PALETTE.filter(
            (color) =>
              color !== mixed[r][c] &&
              (c === 0 || mixed[r][c - 1] !== color) &&
              (r === 0 || mixed[r - 1][c] !== color)
          );
          if (options.length > 0) {
            mixed[r][c] = options[Math.floor(Math.random() * options.length)];
          }
        }
      }
    }

    setGrid(mixed);
    setSolution(solvedGrid);
    setSolved(false);
    setMoves(0);
  }, []);

  useEffect(() => {
    generateBoard(level);
  }, [level, generateBoard]);

  const handleClick = (row, col) => {
    const current = grid[row][col];
    const index = PALETTE.indexOf(current);
    const next = PALETTE[(index + 1) % PALETTE.length];

    // Evita crear conflictos con los vecinos inmediatos.
    const conflicts =
      (col > 0 && grid[row][col - 1] === next) ||
      (row > 0 && grid[row - 1][col] === next);
    if (conflicts) return;

    const updated = grid.map((r) => [...r]);
    updated[row][col] = next;
    setGrid(updated);
    setMoves((m) => m + 1);

    const isSolved = updated.every((r, ri) =>
      r.every((cell, ci) => cell === solution[ri][ci])
    );
    if (isSolved) {
      setSolved(true);
    }
  };

  const size = grid.length;
  const cellSize = Math.min(42, 440 / Math.max(size, 1));

  return (
    <div style={{ textAlign: 'center', color: '#fff' }}>
      <h2 style={{ margin: '0 0 0.35rem' }}>Neon Grid</h2>
      <p style={{ color: '#8f98a0', margin: '0 0 0.75rem', fontSize: '0.88rem' }}>
        Pulsa una celda para rotar su color. Nunca puedes repetir color en la misma fila o columna.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.75rem' }}>
        <span>
          Nivel: <strong style={{ color: '#66c0f4' }}>{level}</strong>
        </span>
        <span>
          Movimientos: <strong style={{ color: '#a4d007' }}>{moves}</strong>
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, ${cellSize}px)`,
          gap: '4px',
          justifyContent: 'center',
          margin: '0 auto',
          backgroundColor: '#16202c',
          padding: '0.75rem',
          borderRadius: '10px',
          border: '1px solid #2a475e',
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              type="button"
              onClick={() => handleClick(r, c)}
              aria-label={`Celda ${r + 1}, ${c + 1}`}
              style={{
                width: `${cellSize - 8}px`,
                height: `${cellSize - 8}px`,
                backgroundColor: cell,
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '6px',
                cursor: 'pointer',
                padding: 0,
                transition: 'transform 0.12s ease',
              }}
            />
          ))
        )}
      </div>

      {solved && (
        <div style={{ marginTop: '1rem' }}>
          <p style={{ color: '#a4d007', fontWeight: 'bold', margin: '0 0 0.75rem' }}>
            ¡Nivel {level} completado en {moves} movimientos!
          </p>
          <button
            type="button"
            onClick={() => setLevel((l) => l + 1)}
            style={{
              padding: '0.6rem 1.4rem',
              backgroundColor: '#a4d007',
              color: '#0e1116',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Siguiente nivel
          </button>
        </div>
      )}
    </div>
  );
};
