import React, { useState, useEffect } from 'react';
import { CatalogFilter } from '../components/CatalogFilter';
import { GameCard } from '../components/GameCard';

export const CatalogPage = ({ onSelectGame, userLibrary = [] }) => {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [loading, setLoading] = useState(true);

  // Carga inicial del JSON
  useEffect(() => {
    fetch('/data/games.json')
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar juegos:', err);
        setLoading(false);
      });
  }, []);

  // Extraer géneros únicos
  const genres = [...new Set(games.map((g) => g.genre))];

  // Lógica de filtrado en tiempo real
  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'Todos' || game.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  if (loading) return <div style={{ color: '#fff', textAlign: 'center' }}>Cargando catálogo...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#fff', marginBottom: '1.5rem' }}>Explorar Catálogo</h1>

      <CatalogFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        genres={genres}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {filteredGames.map((game) => {
          const isOwned = userLibrary.includes(game.id);
          return (
            <GameCard
              key={game.id}
              game={game}
              onSelectGame={onSelectGame}
              isOwned={isOwned}
            />
          );
        })}
      </div>

      {filteredGames.length === 0 && (
        <p style={{ color: '#c6d4df', textAlign: 'center', marginTop: '3rem' }}>
          No se encontraron juegos que coincidan con la búsqueda.
        </p>
      )}
    </div>
  );
};