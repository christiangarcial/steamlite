import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCatalogData } from '../hooks/useCatalogData';
import { useLibrary } from '../context/StoreContext';
import { formatDate, formatPrice } from '../utils/format';

export const LibraryPage = () => {
  const { data, loading } = useCatalogData();
  const { library, isOwned, removeFromLibrary } = useLibrary();

  const ownedGames = useMemo(() => {
    const games = data?.games ?? [];
    return library.map((id) => games.find((game) => game.id === id)).filter(Boolean);
  }, [library, data]);

  const totalSpent = useMemo(
    () => ownedGames.reduce((acc, game) => acc + Number(game.price || 0), 0),
    [ownedGames]
  );

  if (loading) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#c6d4df' }}>
        Cargando biblioteca...
      </div>
    );
  }

  if (ownedGames.length === 0) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', color: '#c6d4df' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎮</div>
        <h1 style={{ marginBottom: '0.5rem' }}>Tu biblioteca está vacía</h1>
        <p style={{ color: '#8f98a0', maxWidth: '480px', margin: '0 auto' }}>
          Los juegos que compres se guardarán aquí automáticamente. Puedes ejecutarlos directamente desde el
          navegador.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            marginTop: '1.5rem',
            backgroundColor: '#66c0f4',
            color: '#0e1116',
            padding: '0.7rem 1.3rem',
            borderRadius: '6px',
            fontWeight: 'bold',
            textDecoration: 'none',
          }}
        >
          Explorar catálogo
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Mi biblioteca</h1>
          <p style={{ color: '#8f98a0', margin: '0.35rem 0 0', fontSize: '0.9rem' }}>
            {ownedGames.length} juego{ownedGames.length === 1 ? '' : 's'} disponible
            {ownedGames.length === 1 ? '' : 's'} para jugar
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.8rem', color: '#8f98a0', display: 'block' }}>Total adquirido</span>
          <strong style={{ color: '#a4d007', fontSize: '1.3rem' }}>{formatPrice(totalSpent)}</strong>
        </div>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {ownedGames.map((game) => (
          <article
            key={game.id}
            style={{
              backgroundColor: '#1b2838',
              border: '1px solid #2a475e',
              borderRadius: '10px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Link to={`/game/${game.id}`}>
              <img
                src={game.image}
                alt={game.title}
                loading="lazy"
                style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }}
              />
            </Link>

            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.35rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#66c0f4', fontWeight: 'bold' }}>{game.genre}</span>
              <Link to={`/game/${game.id}`} style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
                {game.title}
              </Link>
              <div style={{ fontSize: '0.78rem', color: '#8f98a0' }}>
                {game.developer} · {formatDate(game.releaseDate)}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.85rem' }}>
                <Link
                  to={`/play/${game.id}`}
                  style={{
                    flex: 1,
                    padding: '0.55rem 1rem',
                    backgroundColor: '#a4d007',
                    color: '#0e1116',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontSize: '0.88rem',
                  }}
                >
                  Jugar
                </Link>
                <button
                  type="button"
                  onClick={() => removeFromLibrary(game.id)}
                  title="Quitar de la biblioteca"
                  style={{
                    padding: '0.55rem 0.8rem',
                    backgroundColor: 'transparent',
                    border: '1px solid #2a475e',
                    color: '#ff6b6b',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '0.82rem',
                  }}
                >
                  Quitar
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {ownedGames.some((game) => !isOwned(game.id)) && null}
    </div>
  );
};
