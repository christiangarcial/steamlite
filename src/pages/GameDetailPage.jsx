import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCatalogData } from '../hooks/useCatalogData';
import { useLibrary, useStore } from '../context/StoreContext';
import { formatDate, formatPrice } from '../utils/format';

const TABS = [
  { id: 'resenas', label: 'Resenas' },
  { id: 'capturas', label: 'Capturas' },
  { id: 'detalles', label: 'Detalles' },
];

export const GameDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error } = useCatalogData();
  const { addToCart, removeFromCart } = useStore();
  const { isOwned, isInCart } = useLibrary();
  const [activeTab, setActiveTab] = useState('resenas');
  const [showTrailer, setShowTrailer] = useState(false);

  const game = useMemo(() => data?.games?.find((g) => g.id === id), [data, id]);
  const reviews = useMemo(
    () => (data?.reviews ?? []).filter((review) => review.gameId === id),
    [data, id]
  );
  const related = useMemo(() => {
    if (!game) return [];
    return (data?.games ?? []).filter((g) => g.genre === game.genre && g.id !== game.id).slice(0, 4);
  }, [data, game]);

  if (loading) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#c6d4df' }}>
        Cargando juego...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#c6d4df' }}>
        <h2 style={{ color: '#ff6b6b' }}>Error al cargar el catálogo</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#c6d4df' }}>
        <h2 style={{ color: '#fff' }}>Juego no encontrado</h2>
        <p>El juego &quot;{id}&quot; no existe en el catálogo.</p>
        <Link to="/" style={{ color: '#66c0f4' }}>
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const owned = isOwned(game.id);
  const inCart = isInCart(game.id);

  const handlePrimaryAction = () => {
    if (owned) {
      navigate(`/play/${game.id}`);
      return;
    }
    if (inCart) {
      removeFromCart(game.id);
    } else {
      addToCart(game.id);
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Migas de pan */}
      <nav style={{ marginBottom: '1rem', fontSize: '0.85rem', color: '#8f98a0' }}>
        <Link to="/" style={{ color: '#8f98a0' }}>
          Catálogo
        </Link>
        <span> / </span>
        <span style={{ color: '#c6d4df' }}>{game.title}</span>
      </nav>

      {/* Banner superior */}
      <header
        style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #2a475e',
          marginBottom: '1.5rem',
        }}
      >
        <img
          src={game.banner || game.image}
          alt={game.title}
          style={{ width: '100%', height: '300px', objectFit: 'cover', display: 'block', filter: 'brightness(0.5)' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'flex-end',
            padding: '1.75rem',
            gap: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          <img
            src={game.image}
            alt=""
            style={{
              width: '140px',
              height: '96px',
              objectFit: 'cover',
              borderRadius: '8px',
              border: '2px solid #2a475e',
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: '220px' }}>
            <span style={{ color: '#66c0f4', fontSize: '0.78rem', fontWeight: 'bold', letterSpacing: '1px' }}>
              {game.genre.toUpperCase()}
            </span>
            <h1 style={{ margin: '0.25rem 0', fontSize: '2rem', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
              {game.title}
            </h1>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.85rem' }}>
              <span style={{ color: '#a4d007', fontWeight: 'bold' }}>★ {game.rating.toFixed(1)}</span>
              <span style={{ color: '#c6d4df' }}>{game.developer}</span>
              <span style={{ color: '#8f98a0' }}>{formatDate(game.releaseDate)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '190px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#a4d007', textAlign: 'right' }}>
              {formatPrice(game.price)}
            </span>
            <button
              type="button"
              onClick={handlePrimaryAction}
              style={{
                padding: '0.75rem 1.25rem',
                backgroundColor: owned ? '#a4d007' : inCart ? '#2a475e' : '#66c0f4',
                color: owned || !inCart ? '#0e1116' : '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
              }}
            >
              {owned ? 'Jugar ahora' : inCart ? 'Quitar del carrito' : 'Agregar al carrito'}
            </button>
            {!owned && (
              <button
                type="button"
                onClick={() => {
                  if (!inCart) addToCart(game.id);
                  navigate('/cart');
                }}
                style={{
                  padding: '0.6rem 1.25rem',
                  backgroundColor: 'transparent',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.35)',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.85rem',
                }}
              >
                Comprar ahora
              </button>
            )}
          </div>
        </div>
      </header>

      <div
        className="page-two-columns"
        style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(260px, 1fr)', gap: '1.5rem' }}
      >
        {/* Contenido principal con pestanas */}
        <div>
          <p style={{ color: '#c6d4df', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            {game.longDescription || game.description}
          </p>

          <div style={{ display: 'flex', gap: '0.35rem', borderBottom: '1px solid #2a475e', marginBottom: '1.25rem' }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.6rem 1.1rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid #66c0f4' : '2px solid transparent',
                  color: activeTab === tab.id ? '#66c0f4' : '#8f98a0',
                  fontWeight: activeTab === tab.id ? 'bold' : '500',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'resenas' && (
            <section>
              {reviews.length === 0 ? (
                <p style={{ color: '#8f98a0' }}>Todavia no hay resenas para este juego.</p>
              ) : (
                reviews.map((review) => (
                  <article
                    key={review.id}
                    style={{
                      backgroundColor: '#1b2838',
                      border: '1px solid #2a475e',
                      borderRadius: '10px',
                      padding: '1.1rem',
                      marginBottom: '0.85rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#fff' }}>{review.user}</strong>
                      <span style={{ color: '#a4d007', fontSize: '0.85rem' }}>{'★'.repeat(review.rating)}</span>
                    </div>
                    <p style={{ margin: 0, color: '#c6d4df', fontSize: '0.9rem', lineHeight: 1.6 }}>{review.content}</p>
                    <small style={{ color: '#6e7c8c' }}>{formatDate(review.date)}</small>
                  </article>
                ))
              )}
            </section>
          )}

          {activeTab === 'capturas' && (
            <section>
              {showTrailer ? (
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '16 / 9',
                    backgroundColor: '#16202c',
                    border: '1px solid #2a475e',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#8f98a0',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div className="spinner" style={{ width: '32px', height: '32px', border: '3px solid #2a475e', borderTopColor: '#66c0f4', borderRadius: '50%', animation: 'steamlite-spin 0.9s linear infinite' }} />
                  <span>Simulando reproduccion del trailer...</span>
                  <button type="button" onClick={() => setShowTrailer(false)} style={linkButtonStyle}>
                    Cerrar trailer
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowTrailer(true)}
                  style={{
                    width: '100%',
                    aspectRatio: '16 / 9',
                    backgroundColor: '#16202c',
                    border: '1px solid #2a475e',
                    borderRadius: '10px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    marginBottom: '1rem',
                  }}
                >
                  <span style={{ fontSize: '2.2rem' }}>▶</span>
                  <span style={{ fontWeight: 'bold' }}>Reproducir trailer</span>
                  <span style={{ color: '#8f98a0', fontSize: '0.8rem' }}>Simulación, sin video real</span>
                </button>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                {(game.screenshots || []).map((shot, index) => (
                  <img
                    key={shot}
                    src={shot}
                    alt={`Captura ${index + 1} de ${game.title}`}
                    loading="lazy"
                    style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: '8px', border: '1px solid #2a475e' }}
                  />
                ))}
              </div>
            </section>
          )}

          {activeTab === 'detalles' && (
            <section
              style={{
                backgroundColor: '#1b2838',
                border: '1px solid #2a475e',
                borderRadius: '10px',
                padding: '1.25rem',
              }}
            >
              <DetailRow label="Desarrollador" value={game.developer} />
              <DetailRow label="Fecha de lanzamiento" value={formatDate(game.releaseDate)} />
              <DetailRow label="Género" value={game.genre} />
              <DetailRow label="Controles" value={game.screens} />
              <DetailRow label="Tipo" value={game.type === 'canvas' ? 'Minijuego jugable' : 'Experiencia simulada'} />
              <DetailRow label="Etiquetas" value={(game.tags || []).join(', ')} />
              <DetailRow label="Valoracion" value={`${game.rating.toFixed(1)} / 5.0`} />
            </section>
          )}
        </div>

        {/* Columna lateral */}
        <aside>
          <section
            style={{
              backgroundColor: '#1b2838',
              border: '1px solid #2a475e',
              borderRadius: '10px',
              padding: '1.1rem',
              marginBottom: '1rem',
            }}
          >
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>Etiquetas</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {(game.tags || []).map((tag) => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: '#16202c',
                    color: '#8f98a0',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    border: '1px solid #2a475e',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {related.length > 0 && (
            <section
              style={{
                backgroundColor: '#1b2838',
                border: '1px solid #2a475e',
                borderRadius: '10px',
                padding: '1.1rem',
              }}
            >
              <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem' }}>Similares en {game.genre}</h3>
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/game/${item.id}`}
                  style={{
                    display: 'flex',
                    gap: '0.65rem',
                    alignItems: 'center',
                    textDecoration: 'none',
                    padding: '0.45rem 0',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '56px', height: '38px', objectFit: 'cover', borderRadius: '5px' }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '600' }}>{item.title}</div>
                    <div style={{ color: '#a4d007', fontSize: '0.78rem' }}>{formatPrice(item.price)}</div>
                  </div>
                </Link>
              ))}
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.55rem 0',
      borderBottom: '1px solid #2a475e',
      fontSize: '0.88rem',
      gap: '1rem',
    }}
  >
    <span style={{ color: '#8f98a0' }}>{label}</span>
    <span style={{ color: '#c6d4df', textAlign: 'right' }}>{value}</span>
  </div>
);

const linkButtonStyle = {
  backgroundColor: 'transparent',
  border: '1px solid #2a475e',
  color: '#66c0f4',
  borderRadius: '6px',
  padding: '0.4rem 0.9rem',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '0.85rem',
};
