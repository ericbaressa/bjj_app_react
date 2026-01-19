import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Transiciones from './pages/Transiciones';
import Positions from './pages/Positions';
import PositionDetail from './pages/PositionDetail';
import SavedCombos from './pages/SavedCombos';

const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<SavedCombos />} />
        <Route path="/positions" element={<Positions />} />
        <Route path="/positions/:id" element={<PositionDetail />} />
        <Route path="/Transiciones" element={<Transiciones />} />
        <Route path="/SavedCombos" element={<SavedCombos />} />
      </Route>
    </Routes>
  );
};

export default App;
