import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCatalogData } from '../hooks/useCatalogData';
import { useLibrary } from '../context/StoreContext';
import { GAME_REGISTRY } from '../data/gameRegistry';
import { ExternalGamePlaceholder } from '../components/games/ExternalGamePlaceholder';

const PlayPage = () => {
  const { id } = useParams();
  const { data, loading } = useCatalogData();
  const { isOwned } = useLibrary();

  const game = useMemo(() => data?.games?.find((g) => g.id === id), [data, id]);
  const GameComponent = GAME_REGISTRY[id];

  if (loading) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#c6d4df' }}>
        Cargando juego...
      </div>
    );
  }

  if (!game) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#c6d4df' }}>
        <h2 style={{ color: '#fff' }}>Juego no encontrado</h2>
        <Link to="/library" style={{ color: '#66c0f4' }}>
          Volver a la biblioteca
        </Link>
      </div>
    );
  }

  const owned = isOwned(game.id);

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{game.title}</h1>
          <span style={{ color: '#8f98a0', fontSize: '0.85rem' }}>
            {game.genre} · {game.developer}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {!owned && (
            <span
              style={{
                backgroundColor: 'rgba(255,107,107,0.15)',
                color: '#ff6b6b',
                padding: '0.35rem 0.7rem',
                borderRadius: '5px',
                fontSize: '0.8rem',
                border: '1px solid rgba(255,107,107,0.35)',
              }}
            >
              Demo: no lo posees todavia
            </span>
          )}
          <Link
            to={`/game/${game.id}`}
            style={{
              padding: '0.55rem 1rem',
              backgroundColor: 'transparent',
              border: '1px solid #2a475e',
              color: '#ffffff',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 'bold',
            }}
          >
            Página del juego
          </Link>
          <Link
            to="/library"
            style={{
              padding: '0.55rem 1rem',
              backgroundColor: 'transparent',
              border: '1px solid #2a475e',
              color: '#ffffff',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 'bold',
            }}
          >
            Mi biblioteca
          </Link>
        </div>
      </div>

      <section
        style={{
          backgroundColor: '#1b2838',
          border: '1px solid #2a475e',
          borderRadius: '12px',
          padding: '1.5rem',
          minHeight: '460px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {GameComponent ? (
          <GameComponent />
        ) : (
          <ExternalGamePlaceholder game={game} />
        )}
      </section>
    </div>
  );
};

export default PlayPage;
