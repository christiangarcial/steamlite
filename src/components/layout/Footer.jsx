export const Footer = () => (
  <footer
    style={{
      backgroundColor: '#1b2838',
      borderTop: '1px solid #2a475e',
      marginTop: '3rem',
      padding: '2rem 1.5rem',
      color: '#8f98a0',
      fontSize: '0.9rem',
    }}
  >
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
      }}
    >
      <div>
        <strong style={{ color: '#66c0f4' }}>STEAMLITE</strong> - Proyecto Integrador
        <br />
        Todos los pagos son simulados. Ningun dato real se procesa.
      </div>
      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        <a href="#catalogo" style={{ color: '#c6d4df' }}>
          Catálogo
        </a>
        <a href="#biblioteca" style={{ color: '#c6d4df' }}>
          Biblioteca
        </a>
        <a href="#carrito" style={{ color: '#c6d4df' }}>
          Carrito
        </a>
      </div>
    </div>
  </footer>
);
