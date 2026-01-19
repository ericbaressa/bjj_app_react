import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Drills from './pages/Drills';
import Positions from './pages/Positions';
import PositionDetail from './pages/PositionDetail';

const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/positions" element={<Positions />} />
        <Route path="/positions/:id" element={<PositionDetail />} />
        <Route path="/Drills" element={<Drills />} />
      </Route>
    </Routes>
  );
};

export default App;
