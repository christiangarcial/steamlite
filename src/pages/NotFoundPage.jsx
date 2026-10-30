import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <div style={{ padding: '5rem 1.5rem', textAlign: 'center', color: '#c6d4df' }}>
    <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>404</div>
    <h1 style={{ marginBottom: '0.5rem' }}>Página no encontrada</h1>
    <p style={{ color: '#8f98a0', marginBottom: '1.5rem' }}>
      La ruta que buscas no existe en SteamLite.
    </p>
    <Link
      to="/"
      style={{
        display: 'inline-block',
        backgroundColor: '#66c0f4',
        color: '#0e1116',
        padding: '0.7rem 1.3rem',
        borderRadius: '6px',
        fontWeight: 'bold',
        textDecoration: 'none',
      }}
    >
      Volver al inicio
    </Link>
  </div>
);
