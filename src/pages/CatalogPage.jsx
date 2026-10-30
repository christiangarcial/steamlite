import { useMemo, useState } from 'react';
import { CatalogFilter } from '../components/catalog/CatalogFilter';
import { GameCard } from '../components/catalog/GameCard';
import { GameCarousel } from '../components/catalog/GameCarousel';
import { HeroBanner } from '../components/layout/HeroBanner';
import { useCatalogData } from '../hooks/useCatalogData';
import { useFilteredGames } from '../hooks/useFilteredGames';

export const CatalogPage = () => {
  const { data, loading, error, reload } = useCatalogData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [onlyFree, setOnlyFree] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  const games = useMemo(() => data?.games ?? [], [data]);
  const categories = useMemo(() => data?.categories ?? [], [data]);

  const genres = useMemo(() => [...new Set(games.map((game) => game.genre))], [games]);

  const filteredGames = useFilteredGames(games, {
    searchTerm,
    genre: selectedGenre,
    onlyFree,
    sortBy,
  });

  // Los carruseles usan el catálogo completo, no el filtrado.
  const carouselGroups = useMemo(() => {
    const featured = games.filter((game) => game.featured);
    const free = games.filter((game) => game.isFree);
    const topRated = [...games].sort((a, b) => b.rating - a.rating).slice(0, 8);

    return [
      { id: 'destacados', title: 'Destacados de la temporada', games: featured },
      { id: 'gratis', title: 'Juegos gratis para jugar ahora', games: free },
      { id: 'valorados', title: 'Mejor valorados por la comunidad', games: topRated },
    ];
  }, [games]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGenre('Todos');
    setOnlyFree(false);
    setSortBy('featured');
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#c6d4df' }}>
        <div className="spinner" style={spinnerStyle} />
        <p>Cargando catálogo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#c6d4df' }}>
        <h2 style={{ color: '#ff6b6b' }}>No se pudo cargar el catálogo</h2>
        <p>{error.message}</p>
        <button type="button" onClick={reload} style={retryStyle}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <HeroBanner games={games} />

      {carouselGroups.map(
        (group) => group.games.length > 0 && <GameCarousel key={group.id} title={group.title} games={group.games} />
      )}

      <section id="catálogo">
        <h2 style={{ marginBottom: '1.2rem' }}>Explorar catálogo</h2>

        <CatalogFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          genres={genres}
          categories={categories}
          onlyFree={onlyFree}
          setOnlyFree={setOnlyFree}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onReset={resetFilters}
        />

        <p style={{ color: '#8f98a0', fontSize: '0.85rem', marginBottom: '1rem' }}>
          {filteredGames.length} juego{filteredGames.length === 1 ? '' : 's'} encontrado
          {filteredGames.length === 1 ? '' : 's'}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '3rem', color: '#c6d4df' }}>
            <p>No se encontraron juegos que coincidan con la busqueda.</p>
            <button type="button" onClick={resetFilters} style={retryStyle}>
              Limpiar filtros
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

const spinnerStyle = {
  width: '38px',
  height: '38px',
  margin: '0 auto 1rem',
  border: '3px solid #2a475e',
  borderTopColor: '#66c0f4',
  borderRadius: '50%',
  animation: 'steamlite-spin 0.9s linear infinite',
};

const retryStyle = {
  marginTop: '1rem',
  padding: '0.6rem 1.3rem',
  backgroundColor: '#66c0f4',
  color: '#0e1116',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontFamily: 'inherit',
};
