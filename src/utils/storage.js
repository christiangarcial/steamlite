export const STORAGE_KEYS = {
  LIBRARY: 'steamlite.library',
  CART: 'steamlite.cart',
};

/**
 * Lee un valor de localStorage de forma segura.
 * En modo privado o con el storage bloqueado, devuelve el fallback.
 */
export function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`[steamlite] No se pudo leer "${key}" de localStorage:`, error);
    return fallback;
  }
}

/**
 * Escribe un valor en localStorage de forma segura.
 * @returns {boolean} true si se guardo correctamente.
 */
export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[steamlite] No se pudo escribir "${key}" en localStorage:`, error);
    return false;
  }
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`[steamlite] No se pudo eliminar "${key}" de localStorage:`, error);
    return false;
  }
}
