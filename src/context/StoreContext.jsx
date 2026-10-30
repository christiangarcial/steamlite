import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { STORAGE_KEYS, readStorage, writeStorage } from '../utils/storage';
import { calculateTotals } from '../utils/format';

/**
 * Estado global de SteamLite: carrito de compras y biblioteca del usuario.
 *
 * Se implementa con Context + useReducer (sin dependencias extra) para que
 * cualquier vista pueda leer y despachar acciones sobre el mismo estado.
 */

const StoreContext = createContext(null);

const initialState = {
  // Carrito: array de ids de juegos (un juego = una unidad, no hay duplicados)
  cart: [],
  // Biblioteca: array de ids de juegos adquiridos
  library: [],
  // Ultima compra completada (para mostrar el resumen en /cart)
  lastOrder: null,
};

function storeReducer(state, action) {
  switch (action.type) {
    case 'CART/ADD': {
      if (state.cart.includes(action.gameId)) return state;
      return { ...state, cart: [...state.cart, action.gameId] };
    }

    case 'CART/REMOVE': {
      return { ...state, cart: state.cart.filter((id) => id !== action.gameId) };
    }

    case 'CART/CLEAR': {
      return { ...state, cart: [], lastOrder: null };
    }

    case 'LIBRARY/ADD': {
      if (state.library.includes(action.gameId)) return state;
      return { ...state, library: [...state.library, action.gameId] };
    }

    case 'LIBRARY/REMOVE': {
      return { ...state, library: state.library.filter((id) => id !== action.gameId) };
    }

    case 'ORDER/COMPLETE': {
      const purchased = action.gameIds;
      const library = [...state.library];
      purchased.forEach((id) => {
        if (!library.includes(id)) library.push(id);
      });
      return {
        ...state,
        library,
        cart: state.cart.filter((id) => !purchased.includes(id)),
        lastOrder: {
          gameIds: purchased,
          total: action.total,
          date: new Date().toISOString(),
        },
      };
    }

    case 'ORDER/CLEAR': {
      return { ...state, lastOrder: null };
    }

    default:
      return state;
  }
}

function initState() {
  const persistedCart = readStorage(STORAGE_KEYS.CART, []);
  const persistedLibrary = readStorage(STORAGE_KEYS.LIBRARY, []);

  return {
    ...initialState,
    cart: Array.isArray(persistedCart) ? persistedCart : [],
    library: Array.isArray(persistedLibrary) ? persistedLibrary : [],
  };
}

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, undefined, initState);

  // Persistencia: cada cambio de carrito o biblioteca se refleja en localStorage.
  useEffect(() => {
    writeStorage(STORAGE_KEYS.CART, state.cart);
  }, [state.cart]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.LIBRARY, state.library);
  }, [state.library]);

  const actions = useMemo(
    () => ({
      addToCart: (gameId) => dispatch({ type: 'CART/ADD', gameId }),
      removeFromCart: (gameId) => dispatch({ type: 'CART/REMOVE', gameId }),
      clearCart: () => dispatch({ type: 'CART/CLEAR' }),
      addToLibrary: (gameId) => dispatch({ type: 'LIBRARY/ADD', gameId }),
      removeFromLibrary: (gameId) => dispatch({ type: 'LIBRARY/REMOVE', gameId }),
      completeOrder: (gameIds, total) => dispatch({ type: 'ORDER/COMPLETE', gameIds, total }),
      clearOrder: () => dispatch({ type: 'ORDER/CLEAR' }),
    }),
    []
  );

  const value = useMemo(
    () => ({
      cart: state.cart,
      library: state.library,
      lastOrder: state.lastOrder,
      cartCount: state.cart.length,
      ...actions,
    }),
    [state.cart, state.library, state.lastOrder, actions]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore debe usarse dentro de <StoreProvider>.');
  }
  return context;
};

/**
 * Hook de conveniencia: resuelve los juegos del carrito con sus datos
 * completos y calcula los totales.
 */
export const useCart = (games = []) => {
  const { cart, cartCount, addToCart, removeFromCart, clearCart } = useStore();

  const cartGames = useMemo(
    () => cart.map((id) => games.find((game) => game.id === id)).filter(Boolean),
    [cart, games]
  );

  const totals = useMemo(() => calculateTotals(cartGames), [cartGames]);

  const isInCart = useCallback((gameId) => cart.includes(gameId), [cart]);

  return {
    cart,
    cartGames,
    cartCount,
    totals,
    isInCart,
    addToCart,
    removeFromCart,
    clearCart,
  };
};

/**
 * Hook de conveniencia: consulta si un juego ya esta en la biblioteca
 * o en el carrito.
 */
export const useLibrary = () => {
  const { library, cart, addToLibrary, removeFromLibrary } = useStore();

  const isOwned = useCallback((gameId) => library.includes(gameId), [library]);
  const isInCart = useCallback((gameId) => cart.includes(gameId), [cart]);
  const ownedCount = library.length;

  return { library, ownedCount, isOwned, isInCart, addToLibrary, removeFromLibrary };
};
