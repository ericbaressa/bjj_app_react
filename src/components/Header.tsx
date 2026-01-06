// components/Header.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Posiciones', path: '/positions' },
    // Puedes agregar más links aquí
  ];

  return (
    <header
      style={{
        backgroundColor: '#1e1e2f',
        padding: '12px 24px',
        color: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      }}
    >
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Logo / Nombre de la app */}
        <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#ff7f50' }}>
          MyApp
        </div>

        {/* Links de navegación */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  textDecoration: 'none',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontWeight: 500,
                  backgroundColor: isActive ? '#ff7f50' : 'transparent',
                  color: isActive ? 'white' : '#ccc',
                  transition: 'all 0.2s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    isActive ? '#ff7f50' : '#333';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    isActive ? '#ff7f50' : 'transparent';
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    isActive ? 'white' : '#ccc';
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export default Header;
