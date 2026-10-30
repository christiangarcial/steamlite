import { SnakeGame } from '../games/SnakeGame';
import { PongGame } from '../games/PongGame';
import { BrickBreakerGame } from '../games/BrickBreakerGame';
import { NeonGridGame } from '../games/NeonGridGame';
import { PixelRacerGame } from '../games/PixelRacerGame';
import { BlockBusterGame } from '../games/BlockBusterGame';

/**
 * Registro de minijuegos jugables, indexados por el id del juego del catálogo.
 * Los juegos que no aparecen aqui usan el placeholder animado.
 */
export const GAME_REGISTRY = {
  'snake-retro': SnakeGame,
  'pong-retro': PongGame,
  'brick-breaker': BrickBreakerGame,
  'neon-grid': NeonGridGame,
  'pixel-racer': PixelRacerGame,
  'block-buster': BlockBusterGame,
};
