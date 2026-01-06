import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Positions from './pages/Positions';
import PositionDetail from './pages/PositionDetail';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/positions" element={<Positions />} />
        <Route path="/positions/:id" element={<PositionDetail />} />
      </Routes>
    </>
  );
};

export default App;
