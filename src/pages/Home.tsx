import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FullscreenModal from "../components/FullscreenModal";

const Home: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      padding: '20px',
      boxSizing: 'border-box' as const,
    },
    header: {
      marginBottom: '20px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: '24px',
      marginBottom: isMobile ? '70px' : '0',
    },
    card: {
      background: '#1a1a1a',
      padding: '24px',
      borderRadius: '16px',
      border: '1px solid #2a2a2a',
    },
    link: {
      display: 'inline-block',
      marginTop: '12px',
      fontWeight: 'bold',
      color: '#646cff',
      textDecoration: 'none',
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Bienvenido a la App</h1>
        <p>Selecciona una sección</p>
      </header>

      <main style={styles.grid}>
        <section style={styles.card}>
          <h2>Posiciones</h2>
          <Link to="/positions" style={styles.link}>
            Ir a posiciones
          </Link>
        </section>

        <section style={styles.card}>
          <h2>Sección 2</h2>
          <p>Contenido futuro</p>
        </section>

        <section style={styles.card}>
          <h2>Sección 3</h2>
          <p>Contenido futuro</p>
        </section>
      </main>
    </div>
  );
};

export default Home;
