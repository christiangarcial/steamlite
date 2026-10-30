import { useState } from 'react';
import { CatalogPage } from './pages/CatalogPage';
import { SnakeGame } from './games/SnakeGame';
import { PongGame } from './games/PongGame';

const GAME_COMPONENTS = {
  'snake-retro': SnakeGame,
  'pong-retro': PongGame,
};

const App = () => {
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [userLibrary, setUserLibrary] = useState([]);

  const ActiveGame = selectedGameId ? GAME_COMPONENTS[selectedGameId] : null;

  const handleSelectGame = (gameId) => {
    setSelectedGameId(gameId);
    setUserLibrary((prev) =>
      prev.includes(gameId) ? prev : [...prev, gameId]
    );
  };

  const handleBack = () => setSelectedGameId(null);

  if (ActiveGame) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <button
          onClick={handleBack}
          style={{
            marginBottom: '1.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#2a475e',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Volver al catálogo
        </button>
        <ActiveGame />
      </div>
    );
  }

  return <CatalogPage onSelectGame={handleSelectGame} userLibrary={userLibrary} />;
};

export default App;
