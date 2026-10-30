import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/format';

/**
 * Carrusel horizontal de juegos destacados por categoria.
 */
export const GameCarousel = ({ title, games = [] }) => {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = () => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollLeft(track.scrollLeft > 4);
    setCanScrollRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    const track = trackRef.current;
    if (!track) return undefined;

    track.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    return () => {
      track.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [games.length]);

  const scrollBy = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * (track.clientWidth * 0.8), behavior: 'smooth' });
  };

  if (games.length === 0) return null;

  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.9rem',
          gap: '1rem',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{title}</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={!canScrollLeft}
            aria-label="Anterior"
            style={arrowStyle(!canScrollLeft)}
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={!canScrollRight}
            aria-label="Siguiente"
            style={arrowStyle(!canScrollRight)}
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="game-carousel-track"
        style={{
          display: 'flex',
          gap: '1rem',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          paddingBottom: '0.75rem',
          scrollbarWidth: 'thin',
        }}
      >
        {games.map((game) => (
          <Link
            key={game.id}
            to={`/game/${game.id}`}
            style={{
              minWidth: '240px',
              maxWidth: '240px',
              flex: '0 0 240px',
              backgroundColor: '#1b2838',
              border: '1px solid #2a475e',
              borderRadius: '10px',
              overflow: 'hidden',
              textDecoration: 'none',
              transition: 'transform 0.2s ease',
            }}
          >
            <img
              src={game.image}
              alt={game.title}
              loading="lazy"
              style={{ width: '100%', height: '130px', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ padding: '0.8rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#66c0f4', fontWeight: 'bold' }}>
                {game.genre}
              </span>
              <h3 style={{ margin: '0.25rem 0 0.4rem', color: '#fff', fontSize: '0.95rem' }}>
                {game.title}
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#a4d007', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  {formatPrice(game.price)}
                </span>
                <span style={{ color: '#8f98a0', fontSize: '0.75rem' }}>★ {game.rating.toFixed(1)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

const arrowStyle = (disabled) => ({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  border: '1px solid #2a475e',
  backgroundColor: disabled ? '#16202c' : '#1b2838',
  color: disabled ? '#4a5b6b' : '#ffffff',
  fontSize: '1.2rem',
  cursor: disabled ? 'not-allowed' : 'pointer',
  lineHeight: 1,
  padding: 0,
});
