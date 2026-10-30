import { useEffect, useRef, useState } from 'react';

const TARGET_SCORE = 11;

export const PongGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [gameState, setGameState] = useState('ready'); // ready | playing | over

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 4;
    let ballSpeedY = 4;

    let playerY = 150;
    let aiY = 150;
    const paddleHeight = 80;
    const paddleWidth = 10;

    let playerScore = 0;
    let aiScore = 0;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleY = canvas.height / rect.height;
      playerY = (e.clientY - rect.top) * scaleY - paddleHeight / 2;
      playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      ctx.fillStyle = '#101822';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Linea central
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.setLineDash([8, 12]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Marcador
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 30px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${playerScore}`, canvas.width / 2 - 50, 40);
      ctx.fillText(`${aiScore}`, canvas.width / 2 + 50, 40);

      // Raquetas
      ctx.fillStyle = '#66c0f4';
      ctx.fillRect(0, playerY, paddleWidth, paddleHeight);
      ctx.fillStyle = '#ff6b6b';
      ctx.fillRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight);

      // Pelota
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ballX, ballY, 8, 0, Math.PI * 2);
      ctx.fill();
    };

    const loop = setInterval(() => {
      if (gameState === 'playing') {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        // Rebote Superior/Inferior
        if (ballY <= 8 || ballY >= canvas.height - 8) ballSpeedY = -ballSpeedY;

        // IA Simple
        if (aiY + paddleHeight / 2 < ballY) aiY += 3;
        else aiY -= 3;
        aiY = Math.max(0, Math.min(canvas.height - paddleHeight, aiY));

        // Colisiones Raquetas
        if (
          ballX <= paddleWidth + 8 &&
          ballY > playerY &&
          ballY < playerY + paddleHeight &&
          ballSpeedX < 0
        ) {
          ballSpeedX = -ballSpeedX;
          // Angulo segun posicion de impacto
          const relative = (ballY - (playerY + paddleHeight / 2)) / (paddleHeight / 2);
          ballSpeedY = relative * 5;
        }

        if (
          ballX >= canvas.width - paddleWidth - 8 &&
          ballY > aiY &&
          ballY < aiY + paddleHeight &&
          ballSpeedX > 0
        ) {
          ballSpeedX = -ballSpeedX;
          const relative = (ballY - (aiY + paddleHeight / 2)) / (paddleHeight / 2);
          ballSpeedY = relative * 5;
        }

        // Incremento del marcador
        if (ballX < 0) {
          aiScore += 1;
          setScore({ player: playerScore, ai: aiScore });
          ballX = canvas.width / 2;
          ballY = canvas.height / 2;
          ballSpeedX = 4;
          ballSpeedY = 4;
        }
        if (ballX > canvas.width) {
          playerScore += 1;
          setScore({ player: playerScore, ai: aiScore });
          ballX = canvas.width / 2;
          ballY = canvas.height / 2;
          ballSpeedX = -4;
          ballSpeedY = 4;
        }

        // Fin de la partida
        if (playerScore >= TARGET_SCORE || aiScore >= TARGET_SCORE) {
          setGameState('over');
          clearInterval(loop);
        }
      }

      draw();
    }, 1000 / 60);

    draw();

    return () => {
      clearInterval(loop);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gameState]);

  const startGame = () => {
    setScore({ player: 0, ai: 0 });
    setGameState('playing');
  };

  const winner =
    score.player >= TARGET_SCORE ? 'Has ganado' : score.ai >= TARGET_SCORE ? 'Gana la IA' : null;

  return (
    <div style={{ textAlign: 'center', color: '#fff' }}>
      <h2 style={{ margin: '0 0 0.35rem' }}>Retro Pong 2D</h2>
      <p style={{ color: '#8f98a0', margin: '0 0 0.75rem', fontSize: '0.88rem' }}>
        Mueve el raton para controlar tu raqueta izquierda · Gana {TARGET_SCORE} puntos
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.75rem' }}>
        <span>
          Tu: <strong style={{ color: '#66c0f4' }}>{score.player}</strong>
        </span>
        <span>
          IA: <strong style={{ color: '#ff6b6b' }}>{score.ai}</strong>
        </span>
      </div>

      <canvas
        ref={canvasRef}
        width={500}
        height={350}
        style={{
          border: '3px solid #2a475e',
          borderRadius: '8px',
          backgroundColor: '#101822',
          maxWidth: '100%',
        }}
      />

      {gameState !== 'playing' && (
        <div style={{ marginTop: '1rem' }}>
          <p
            style={{
              margin: '0 0 0.75rem',
              fontWeight: 'bold',
              color: gameState === 'over' ? '#a4d007' : '#66c0f4',
            }}
          >
            {gameState === 'ready' ? 'Pulsa para empezar la partida' : winner}
          </p>
          <button
            type="button"
            onClick={startGame}
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
            {gameState === 'over' ? 'Revancha' : 'Empezar'}
          </button>
        </div>
      )}
    </div>
  );
};
