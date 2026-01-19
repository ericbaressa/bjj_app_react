import React from 'react';
import { FaList, FaSearch, FaDumbbell } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <div style={headerStyle}>
      <Link to="/SavedCombos" style={buttonStyle}>
        <FaList size={20} />
        <span style={labelStyle}>Listas</span>
      </Link>

      <Link to="/Positions" style={buttonStyle}>
        <FaSearch size={20} />
        <span style={labelStyle}>Buscar</span>
      </Link>

      <Link to="/Transiciones" style={buttonStyle}>
        <FaDumbbell size={20} />
        <span style={labelStyle}>Transiciones</span>
      </Link>
    </div>
  );
};

const headerStyle = {
  position: 'fixed' as const,
  bottom: 0,
  left: 0,
  right: 0,
  height: 60,
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  background: 'rgba(18, 18, 18, 0.75)',
  backdropFilter: 'blur(6px)',
  borderTop: '1px solid rgba(255,255,255,0.1)',
  zIndex: 1000,
};

const buttonStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  textDecoration: 'none',
};

const labelStyle = {
  fontSize: 12,
  marginTop: 4,
};

export default Header;
