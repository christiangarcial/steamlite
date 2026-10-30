import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

const NAV_LINKS = [
  { to: '/', label: 'Tienda' },
  { to: '/library', label: 'Biblioteca' },
];

export const Navbar = () => {
  const { cartCount, library } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const linkStyle = ({ isActive }) => ({
    color: isActive ? '#ffffff' : '#c6d4df',
    textDecoration: 'none',
    fontWeight: isActive ? 'bold' : '500',
    padding: '0.4rem 0.75rem',
    borderRadius: '6px',
    backgroundColor: isActive ? '#2a475e' : 'transparent',
    transition: 'background-color 0.2s ease',
  });

  return (
    <header
      style={{
        backgroundColor: '#1b2838',
        borderBottom: '1px solid #2a475e',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <nav
        className="navbar-inner"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          style={{
            color: '#66c0f4',
            textDecoration: 'none',
            fontSize: '1.4rem',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
          }}
        >
          STEAM<span style={{ color: '#ffffff' }}>LITE</span>
        </Link>

        <div
          className="navbar-links"
          style={{
            display: 'flex',
            gap: '0.35rem',
            flex: 1,
            minWidth: '200px',
          }}
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              style={linkStyle}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            className="navbar-library-count"
            title="Juegos en tu biblioteca"
            style={{ color: '#a4d007', fontWeight: 'bold', fontSize: '0.9rem' }}
          >
            Biblioteca: {library.length}
          </span>

          <Link
            to="/cart"
            onClick={() => setMenuOpen(false)}
            style={{
              backgroundColor: '#66c0f4',
              color: '#0e1116',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontWeight: 'bold',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            Carrito
            <span
              style={{
                backgroundColor: '#0e1116',
                color: '#66c0f4',
                borderRadius: '999px',
                padding: '0.05rem 0.5rem',
                fontSize: '0.8rem',
              }}
            >
              {cartCount}
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            style={{
              display: 'none',
              backgroundColor: 'transparent',
              border: '1px solid #2a475e',
              color: '#ffffff',
              borderRadius: '6px',
              padding: '0.4rem 0.6rem',
              cursor: 'pointer',
            }}
            className="navbar-toggle"
          >
            ☰
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          style={{
            display: 'none',
            padding: '0.75rem 1.5rem',
            borderTop: '1px solid #2a475e',
          }}
          className="navbar-mobile-menu"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              style={linkStyle}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/cart"
            style={{ ...linkStyle({ isActive: location.pathname === '/cart' }) }}
            onClick={() => setMenuOpen(false)}
          >
            Carrito ({cartCount})
          </Link>
        </div>
      )}
    </header>
  );
};
