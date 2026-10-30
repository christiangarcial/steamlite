const inputStyle = {
  padding: '0.7rem 0.9rem',
  borderRadius: '8px',
  border: '1px solid #2a475e',
  backgroundColor: '#1b2838',
  color: '#ffffff',
  fontFamily: 'inherit',
  fontSize: '0.9rem',
};

export const CatalogFilter = ({
  searchTerm,
  setSearchTerm,
  selectedGenre,
  setSelectedGenre,
  genres,
  categories = [],
  onlyFree,
  setOnlyFree,
  sortBy,
  setSortBy,
  onReset,
}) => {
  const genreOptions = genres && genres.length > 0 ? genres : categories.map((c) => c.id);

  return (
    <section
      className="catalog-filters"
      style={{
        backgroundColor: '#1b2838',
        border: '1px solid #2a475e',
        borderRadius: '10px',
        padding: '1.1rem',
        marginBottom: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.9rem',
      }}
    >
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Campo de busqueda en tiempo real */}
        <input
          type="search"
          placeholder="Buscar juego por título, género o etiqueta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Buscar juego"
          style={{ ...inputStyle, flex: '1 1 280px' }}
        />

        {/* Filtro por géneros */}
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          aria-label="Filtrar por género"
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          <option value="Todos">Todos los Géneros</option>
          {genreOptions.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        {/* Orden por */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Ordenar catálogo"
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          <option value="featured">Destacados</option>
          <option value="title">Título (A-Z)</option>
          <option value="rating">Mejor valorados</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <label
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            cursor: 'pointer',
            fontSize: '0.85rem',
            color: '#c6d4df',
          }}
        >
          <input
            type="checkbox"
            checked={onlyFree}
            onChange={(e) => setOnlyFree(e.target.checked)}
            style={{ accentColor: '#66c0f4', width: '16px', height: '16px' }}
          />
          Solo juegos gratis
        </label>

        <button
          type="button"
          onClick={onReset}
          style={{
            marginLeft: 'auto',
            backgroundColor: 'transparent',
            color: '#66c0f4',
            border: '1px solid #2a475e',
            borderRadius: '6px',
            padding: '0.45rem 0.9rem',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: '0.85rem',
          }}
        >
          Limpiar filtros
        </button>
      </div>
    </section>
  );
};
