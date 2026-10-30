import { useMemo } from 'react';

/**
 * Filtrado y ordenacion del catálogo.
 *
 * @param {Array} games Catálogo completo
 * @param {Object} filters { searchTerm, genre, onlyFree, sortBy }
 */
export function useFilteredGames(games = [], filters = {}) {
  const { searchTerm = '', genre = 'Todos', onlyFree = false, sortBy = 'featured' } = filters;

  return useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    let result = games.filter((game) => {
      const matchesSearch =
        term === '' ||
        game.title.toLowerCase().includes(term) ||
        game.description.toLowerCase().includes(term) ||
        game.genre.toLowerCase().includes(term) ||
        (game.tags || []).some((tag) => tag.toLowerCase().includes(term));

      const matchesGenre = genre === 'Todos' || game.genre === genre;
      const matchesFree = !onlyFree || game.isFree;

      return matchesSearch && matchesGenre && matchesFree;
    });

    const sorted = [...result];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title, 'es'));
        break;
      case 'featured':
      default:
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
    }

    return sorted;
  }, [games, searchTerm, genre, onlyFree, sortBy]);
}
