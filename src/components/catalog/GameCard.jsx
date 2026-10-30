import { Link } from 'react-router-dom';
import { useLibrary, useStore } from '../../context/StoreContext';
import { formatPrice } from '../../utils/format';

export const GameCard = ({ game, onSelectGame }) => {
  const { addToCart, removeFromCart } = useStore();
  const { isOwned, isInCart } = useLibrary();

  const owned = isOwned(game.id);
  const inCart = isInCart(game.id);

  const handleCartClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (inCart) {
      removeFromCart(game.id);
    } else {
      addToCart(game.id);
    }
  };

  return (
    <article
      className="game-card"
      style={{
        backgroundColor: '#1b2838',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #2a475e',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      <Link to={`/game/${game.id}`} style={{ display: 'block', position: 'relative' }}>
        <img
          src={game.image}
          alt={game.title}
          loading="lazy"
          style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
        />
        {owned && (
          <span
            style={{
              position: 'absolute',
              top: '0.6rem',
              left: '0.6rem',
              backgroundColor: '#a4d007',
              color: '#0e1116',
              fontWeight: 'bold',
              fontSize: '0.7rem',
              padding: '0.25rem 0.55rem',
              borderRadius: '4px',
              letterSpacing: '0.5px',
            }}
          >
            EN TU BIBLIOTECA
          </span>
        )}
        {game.isFree && !owned && (
          <span
            style={{
              position: 'absolute',
              top: '0.6rem',
              left: '0.6rem',
              backgroundColor: 'rgba(14,17,22,0.85)',
              color: '#a4d007',
              fontWeight: 'bold',
              fontSize: '0.7rem',
              padding: '0.25rem 0.55rem',
              borderRadius: '4px',
            }}
          >
            GRATIS
          </span>
        )}
      </Link>

      <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.35rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#66c0f4', fontWeight: 'bold', letterSpacing: '0.5px' }}>
          {game.genre}
        </span>

        <Link
          to={`/game/${game.id}`}
          style={{ textDecoration: 'none' }}
          onClick={(event) => {
            event.preventDefault();
            onSelectGame?.(game.id);
          }}
        >
          <h3 style={{ margin: 0, color: '#fff', fontSize: '1.05rem' }}>{game.title}</h3>
        </Link>

        <p
          style={{
            color: '#c6d4df',
            fontSize: '0.85rem',
            flex: 1,
            margin: 0,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {game.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#8f98a0' }}>
          <span style={{ color: '#a4d007' }}>★ {game.rating.toFixed(1)}</span>
          <span>·</span>
          <span>{game.screens}</span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.85rem',
            gap: '0.5rem',
          }}
        >
          <span style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#a4d007' }}>
            {formatPrice(game.price)}
          </span>

          {owned ? (
            <Link
              to={`/play/${game.id}`}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#a4d007',
                color: '#0e1116',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                textDecoration: 'none',
                fontSize: '0.85rem',
              }}
            >
              Jugar
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleCartClick}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: inCart ? '#2a475e' : '#66c0f4',
                color: inCart ? '#ffffff' : '#0e1116',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.85rem',
              }}
            >
              {inCart ? 'En el carrito' : 'Comprar'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
