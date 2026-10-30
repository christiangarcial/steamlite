import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart, useStore } from '../context/StoreContext';
import { useCatalogData } from '../hooks/useCatalogData';
import { CartItem, CartSummary } from '../components/cart/CartWidgets';
import { CheckoutForm } from '../components/cart/CheckoutForm';
import { formatPrice } from '../utils/format';

export const CartPage = () => {
  const { data, loading } = useCatalogData();
  const games = useMemo(() => data?.games ?? [], [data]);
  const { cartGames, cartCount, totals, removeFromCart, clearCart } = useCart(games);
  const { completeOrder, lastOrder } = useStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handleSuccess = (values) => {
    completeOrder(
      cartGames.map((game) => game.id),
      totals.total
    );
    setCheckoutOpen(false);
    window.alert(
      `¡Compra simulada completada!\n\nJuegos: ${cartGames.map((g) => g.title).join(', ')}\nTotal: ${formatPrice(
        totals.total
      )}\nTitular: ${values.cardName}\n\nYa estan disponibles en tu Biblioteca.`
    );
  };

  if (loading) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#c6d4df' }}>
        Cargando carrito...
      </div>
    );
  }

  // Confirmacion de compra
  if (lastOrder && cartCount === 0) {
    return (
      <div style={{ padding: '3rem 1.5rem', maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
        <div
          style={{
            backgroundColor: '#1b2838',
            border: '1px solid #a4d007',
            borderRadius: '12px',
            padding: '2.5rem 2rem',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✓</div>
          <h1 style={{ margin: '0 0 0.5rem' }}>¡Compra realizada!</h1>
          <p style={{ color: '#c6d4df', marginTop: 0 }}>
            Total simulado: <strong style={{ color: '#a4d007' }}>{formatPrice(lastOrder.total)}</strong>
          </p>
          <p style={{ color: '#8f98a0', fontSize: '0.88rem' }}>
            Los juegos se han añadido a tu biblioteca y ya puedes jugarlos desde la interfaz.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
            <Link to="/library" style={primaryButtonStyle}>
              Ir a mi biblioteca
            </Link>
            <Link to="/" style={secondaryButtonStyle}>
              Seguir explorando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Carrito vacio
  if (cartCount === 0) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', color: '#c6d4df' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Tu carrito está vacío</h1>
        <p style={{ color: '#8f98a0' }}>Explora el catálogo y agrega los juegos que te gusten.</p>
        <Link to="/" style={{ ...primaryButtonStyle, display: 'inline-block', marginTop: '1.5rem' }}>
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Carrito de compras</h1>

      <div
        className="page-two-columns"
        style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(280px, 1fr)', gap: '1.5rem' }}
      >
        <div>
          <section
            style={{
              backgroundColor: '#1b2838',
              border: '1px solid #2a475e',
              borderRadius: '10px',
              padding: '1.25rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}
            >
              <h2 style={{ margin: 0, fontSize: '1.15rem' }}>
                {cartCount} juego{cartCount === 1 ? '' : 's'}
              </h2>
              <button
                type="button"
                onClick={clearCart}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#ff6b6b',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.82rem',
                  textDecoration: 'underline',
                }}
              >
                Vaciar carrito
              </button>
            </div>

            {cartGames.map((game) => (
              <CartItem key={game.id} game={game} onRemove={removeFromCart} />
            ))}
          </section>

          {checkoutOpen && (
            <div style={{ marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setCheckoutOpen(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#66c0f4',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.85rem',
                  marginBottom: '0.85rem',
                  padding: 0,
                }}
              >
                ← Volver al resumen
              </button>
              <CheckoutForm totals={totals} onSubmitSuccess={handleSuccess} />
            </div>
          )}
        </div>

        <div>
          <CartSummary totals={totals} itemCount={cartCount}>
            {!checkoutOpen ? (
              <button
                type="button"
                onClick={() => setCheckoutOpen(true)}
                style={{ ...primaryButtonStyle, width: '100%', fontSize: '1rem' }}
              >
                Proceder al pago
              </button>
            ) : (
              <p style={{ color: '#8f98a0', fontSize: '0.82rem', margin: 0, textAlign: 'center' }}>
                Completa el formulario para finalizar la compra simulada.
              </p>
            )}
            <p style={{ color: '#6e7c8c', fontSize: '0.75rem', textAlign: 'center', marginTop: '0.75rem' }}>
              Pago 100% simulado. No se procesa información real.
            </p>
          </CartSummary>
        </div>
      </div>
    </div>
  );
};

const primaryButtonStyle = {
  backgroundColor: '#66c0f4',
  color: '#0e1116',
  padding: '0.7rem 1.3rem',
  borderRadius: '6px',
  fontWeight: 'bold',
  textDecoration: 'none',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  display: 'inline-block',
};

const secondaryButtonStyle = {
  backgroundColor: 'transparent',
  color: '#ffffff',
  padding: '0.7rem 1.3rem',
  borderRadius: '6px',
  fontWeight: 'bold',
  textDecoration: 'none',
  border: '1px solid rgba(255,255,255,0.35)',
  cursor: 'pointer',
  fontFamily: 'inherit',
  display: 'inline-block',
};
