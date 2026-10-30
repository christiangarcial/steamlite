import { useEffect, useState } from 'react';

/**
 * Carga asincrona del catálogo (games.json).
 *
 * @param {string} url Ruta del JSON dentro de /public
 * @returns {{ data: any, loading: boolean, error: Error|null, reload: () => void }}
 */
export function useCatalogData(url = '/data/games.json') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} al cargar ${url}`);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('[steamlite] Error al cargar el catálogo:', err);
        setError(err);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url, reloadKey]);

  const reload = () => setReloadKey((key) => key + 1);

  return { data, loading, error, reload };
}
