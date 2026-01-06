import React from 'react';

const Home: React.FC<{ goTo: (page: string) => void }> = ({ goTo }) => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Bienvenido a tu App BJJ</h1>
      <p>Selecciona a dónde quieres ir:</p>
      <div style={{ marginTop: '20px' }}>
        <button
          style={{ marginRight: '10px', padding: '10px 20px' }}
          onClick={() => goTo('positions')}
        >
          Posiciones
        </button>
        <button
          style={{ marginRight: '10px', padding: '10px 20px' }}
          onClick={() => goTo('game')}
        >
          Juego
        </button>
        <button
          style={{ padding: '10px 20px' }}
          onClick={() => goTo('transitions')}
        >
          Transiciones
        </button>
      </div>
    </div>
  );
};

export default Home;
