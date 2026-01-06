import React, { useState } from 'react';
import Home from './pages/Home';
import Positions from './pages/Positions';
import Header from './components/Header';

const App: React.FC = () => {
  const [page, setPage] = useState('home');

  return (
    <div>
      {/* Header fijo arriba */}
      <Header goTo={setPage} />

      {/* Páginas */}
      {page === 'home' && <Home goTo={setPage} />}
      {page === 'positions' && <Positions />}
      {/* ... otras páginas */}
    </div>
  );
};

export default App;
