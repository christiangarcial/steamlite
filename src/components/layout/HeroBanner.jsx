import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const HeroBanner = ({ games = [] }) => {
  const featured = games.filter((game) => game.featured);
  const [current, setCurrent] = useState(0);

  // Rotacion automatica del carrusel cada 5 segundos.
  useEffect(() => {
    if (featured.length <= 1) return undefined;
    const timer = setInterval(() => {
      setCurrent((index) => (index + 1) % featured.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const game = featured[current] || featured[0];

  return (
    <section
      style={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '2rem',
        border: '1px solid #2a475e',
      }}
    >
      <img
        src={game.banner || game.image}
        alt={game.title}
        style={{
          width: '100%',
          height: '340px',
          objectFit: 'cover',
          display: 'block',
          filter: 'brightness(0.45)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '0.6rem',
          padding: '2rem',
        }}
      >
        <span
          style={{
            color: '#66c0f4',
            fontWeight: 'bold',
            fontSize: '0.8rem',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}
        >
          Destacado
        </span>
        <h1
          style={{
            margin: 0,
            fontSize: '2.4rem',
            textShadow: '0 2px 12px rgba(0,0,0,0.7)',
          }}
        >
          {game.title}
        </h1>
        <p
          style={{
            margin: 0,
            maxWidth: '560px',
            color: '#d5dde5',
            textShadow: '0 2px 8px rgba(0,0,0,0.7)',
          }}
        >
          {game.description}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          <Link
            to={`/game/${game.id}`}
            style={{
              backgroundColor: '#66c0f4',
              color: '#0e1116',
              padding: '0.65rem 1.5rem',
              borderRadius: '6px',
              fontWeight: 'bold',
              textDecoration: 'none',
            }}
          >
            Ver detalles
          </Link>
          <Link
            to="/"
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#ffffff',
              padding: '0.65rem 1.5rem',
              borderRadius: '6px',
              fontWeight: 'bold',
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            Explorar catálogo
          </Link>
        </div>
      </div>

      {featured.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1.5rem',
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          {featured.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Ver ${item.title}`}
              onClick={() => setCurrent(index)}
              style={{
                width: index === current ? '26px' : '10px',
                height: '10px',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: index === current ? '#66c0f4' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.2s ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};
