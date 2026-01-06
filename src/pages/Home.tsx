// pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Bienvenido a la App</h1>
      <p>Desde aquí puedes navegar a las diferentes secciones:</p>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          marginTop: '20px',
          display: 'flex',
          gap: '20px',
        }}
      >
        <li>
          <Link
            to="/positions"
            style={{
              textDecoration: 'none',
              padding: '10px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              borderRadius: '6px',
              fontWeight: 'bold',
            }}
          >
            Posiciones
          </Link>
        </li>
        {/* Puedes agregar más secciones aquí */}
      </ul>
    </div>
  );
};

export default Home;
