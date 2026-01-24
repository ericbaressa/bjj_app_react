import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Transiciones from "./pages/Transiciones";
import Positions from "./pages/Positions";
import PositionDetail from "./pages/PositionDetail";
import SavedCombos from "./pages/SavedCombos";

import { AuthContext } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";


const App: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <>
      {user && <Header />}

      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<SavedCombos />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/positions/:id" element={<PositionDetail />} />
          <Route path="/Transiciones" element={<Transiciones />} />
          <Route path="/SavedCombos" element={<SavedCombos />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};
export default App;