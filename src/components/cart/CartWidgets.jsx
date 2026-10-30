import { Link } from 'react-router-dom';
import { formatPrice, taxName } from '../../utils/format';

export const CartItem = ({ game, onRemove }) => (
  <div
    className="cart-item"
    style={{
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      padding: '0.9rem 0',
      borderBottom: '1px solid #2a475e',
    }}
  >
    <img
      src={game.image}
      alt={game.title}
      style={{ width: '90px', height: '62px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
    />

    <div style={{ flex: 1, minWidth: 0 }}>
      <Link to={`/game/${game.id}`} style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
        {game.title}
      </Link>
      <div style={{ fontSize: '0.8rem', color: '#8f98a0' }}>
        {game.genre} · {game.screens}
      </div>
    </div>

    <span style={{ fontWeight: 'bold', color: '#a4d007' }}>{formatPrice(game.price)}</span>

    <button
      type="button"
      onClick={() => onRemove(game.id)}
      aria-label={`Quitar ${game.title} del carrito`}
      style={{
        backgroundColor: 'transparent',
        border: '1px solid #2a475e',
        color: '#ff6b6b',
        borderRadius: '5px',
        padding: '0.35rem 0.6rem',
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      Quitar
    </button>
  </div>
);

export const CartSummary = ({ totals, itemCount, children }) => (
  <aside
    style={{
      backgroundColor: '#1b2838',
      border: '1px solid #2a475e',
      borderRadius: '10px',
      padding: '1.25rem',
      position: 'sticky',
      top: '90px',
    }}
  >
    <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Resumen del pedido</h3>

    <Row label="Juegos" value={`${itemCount}`} />
    <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
    <Row label={`${taxName} (${Math.round(totals.taxRate * 100)}%)`} value={formatPrice(totals.tax)} />

    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        borderTop: '1px solid #2a475e',
        marginTop: '0.75rem',
        paddingTop: '0.75rem',
        fontSize: '1.15rem',
      }}
    >
      <strong style={{ color: '#fff' }}>Total</strong>
      <strong style={{ color: '#a4d007' }}>{formatPrice(totals.total)}</strong>
    </div>

    <div style={{ marginTop: '1.1rem' }}>{children}</div>
  </aside>
);

const Row = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
    <span style={{ color: '#8f98a0' }}>{label}</span>
    <span style={{ color: '#c6d4df' }}>{value}</span>
  </div>
);
