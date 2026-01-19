import React from 'react';
import FullscreenModal from "../components/FullscreenModal";

const Positions: React.FC = () => {
  return (
    <div style={pageStyle}>
      <h1>Posiciones</h1>
      <p>Lista de posiciones aquí.</p>
    </div>
  );
};

const pageStyle = {
  padding: '20px',
};

export default Positions;
