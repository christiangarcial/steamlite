import { useEffect, useRef } from 'react';

/**
 * Placeholder animado para los juegos que no tienen una implementacion jugable
 * (los de tipo "external" en el catálogo).
 *
 * Dibuja una escena generica en Canvas que representa la tematica del juego
 * segun su género, para que la vista /play/:id nunca quede vacia.
 */
export const ExternalGamePlaceholder = ({ game }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const palette = {
      Acción: ['#0f2027', '#66c0f4', '#ff6b6b'],
      Estrategia: ['#1a1423', '#a4d007', '#66c0f4'],
      Simulación: ['#14201c', '#47b147', '#e8b44a'],
      Deportivo: ['#1c1c2e', '#e8b44a', '#66c0f4'],
      Puzzle: ['#201a2c', '#c792ea', '#66c0f4'],
      Arcade: ['#141a26', '#66c0f4', '#a4d007'],
    };

    const [bg, primary, secondary] = palette[game.genre] || palette.Arcade;

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1 + Math.random() * 3,
      speedX: (Math.random() - 0.5) * 0.6,
      speedY: -(0.2 + Math.random() * 0.8),
      alpha: 0.2 + Math.random() * 0.6,
    }));

    let frame = 0;
    let animationId;

    const draw = () => {
      frame += 1;

      // Fondo con degradado vertical
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, bg);
      gradient.addColorStop(1, '#0e1116');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Rejilla en perspectiva
      ctx.strokeStyle = 'rgba(102, 192, 244, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 12; i += 1) {
        const y = (height / 12) * i + ((frame * 0.6) % (height / 12));
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Particulas
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        if (particle.y < -5) {
          particle.y = height + 5;
          particle.x = Math.random() * width;
        }
        if (particle.x < -5) particle.x = width + 5;
        if (particle.x > width + 5) particle.x = -5;

        ctx.fillStyle = `rgba(102, 192, 244, ${particle.alpha * 0.6})`;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      });

      // Escena tematica: rejilla de bloques que se ilumina por filas
      const cols = 12;
      const rows = 6;
      const cellW = width / cols;
      const cellH = (height * 0.55) / rows;
      const offsetY = height * 0.22;

      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const wave = Math.sin((frame + c * 6 + r * 10) / 22);
          if (wave > 0.55) {
            ctx.fillStyle = wave > 0.85 ? secondary : primary;
            ctx.globalAlpha = 0.16 + wave * 0.3;
            ctx.fillRect(c * cellW + 2, offsetY + r * cellH + 2, cellW - 4, cellH - 4);
            ctx.globalAlpha = 1;
          }
        }
      }

      // Marco parpadeante
      ctx.strokeStyle = `rgba(164, 208, 7, ${0.25 + Math.sin(frame / 14) * 0.15})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(8, 8, width - 16, height - 16);

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [game.genre, game.id]);

  return (
    <div style={{ textAlign: 'center', color: '#fff', width: '100%' }}>
      <canvas
        ref={canvasRef}
        width={640}
        height={360}
        style={{
          maxWidth: '100%',
          width: '640px',
          height: 'auto',
          borderRadius: '10px',
          border: '1px solid #2a475e',
          backgroundColor: '#0e1116',
        }}
      />

      <div style={{ marginTop: '1.25rem' }}>
        <h2 style={{ margin: '0 0 0.4rem' }}>{game.title}</h2>
        <p style={{ color: '#8f98a0', margin: '0 0 0.85rem', fontSize: '0.9rem', maxWidth: '520px' }}>
          Este juego se encuentra en desarrollo. La pantalla muestra una <strong>simulación visual</strong> del
          género {game.genre} mientras tanto.
        </p>
        <span
          style={{
            display: 'inline-block',
            backgroundColor: 'rgba(232, 180, 74, 0.15)',
            color: '#e8b44a',
            padding: '0.35rem 0.8rem',
            borderRadius: '999px',
            fontSize: '0.78rem',
            border: '1px solid rgba(232, 180, 74, 0.4)',
          }}
        >
          Próximamente
        </span>
      </div>
    </div>
  );
};
