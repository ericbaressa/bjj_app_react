import React from 'react';

interface HeaderProps {
  goTo: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ goTo }) => {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        width: '100%',
        zIndex: 1000,
        display: 'flex',
        flexWrap: 'wrap', // hace que los elementos se ajusten en pantallas pequeñas
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        backgroundColor: '#1a202c',
        color: 'white',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        boxSizing: 'border-box',
      }}
    >
      {/* Logo / título */}
      <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>BJJ App</div>

      {/* Botones de navegación */}
      <nav
        style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          flexGrow: 1, // hace que los botones ocupen el espacio disponible
          margin: '10px 0',
        }}
      >
        <NavButton label="Home" onClick={() => goTo('home')} />
        <NavButton label="Posiciones" onClick={() => goTo('positions')} />
        <NavButton label="Juego" onClick={() => goTo('game')} />
        <NavButton label="Transiciones" onClick={() => goTo('transitions')} />
      </nav>

      {/* Botón de configuración tipo “hamburger” */}
      <button
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '28px',
          cursor: 'pointer',
        }}
        onClick={() => alert('Configuración aún no implementada')}
      >
        ☰
      </button>
    </header>
  );
};

// Botón reutilizable
const NavButton: React.FC<{ label: string; onClick: () => void }> = ({
  label,
  onClick,
}) => (
  <button
    style={{
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      backgroundColor: '#2d3748',
      color: 'white',
      fontWeight: 'bold',
      transition: 'background 0.2s',
      flex: '1 1 auto', // se ajusta automáticamente al espacio disponible
      minWidth: '80px', // mínimo ancho de botón
      textAlign: 'center',
    }}
    onClick={onClick}
    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#4a5568')}
    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2d3748')}
  >
    {label}
  </button>
);

export default Header;
