import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Footer from "../components/Footer";

import Home from "./Home";
import Positions from "./Positions";
import PositionsD from "./PositionDetail";
import Drills from "./Transiciones";
import SavedCombos from "./SavedCombos";
import FullscreenModal from "../components/FullScreenModal";

const HEADER_HEIGHT = 56;
const FOOTER_HEIGHT = 40;

const footerStyle = {
  position: "fixed" as const,
  bottom: 0,
  left: 0,
  right: 0,
  height: HEADER_HEIGHT,
  background: "#111",
  borderTop: "1px solid #2a2a2a",
  zIndex: 1000
};

const cardStyle = {
  background: "#1a1a1a",
  borderRadius: "16px",
  padding: "20px",
  overflowY: "auto" as const,
  height: "100%",
};

const Layout: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // ✅ ESTADO DEL MODAL
  const [openModal, setOpenModal] = useState<null | "home" | "positions" | "drills">(null);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* =====================
     📱 MOBILE
     ===================== */
     if (isMobile) {
      return (
        
        <div
          className="app"
          style={{
            paddingTop: HEADER_HEIGHT,       // 👈 espacio para Header
            paddingBottom: FOOTER_HEIGHT,    // 👈 espacio para Footer
            minHeight: "100vh",
            boxSizing: "border-box",
          }}
        >
          <div
            className="content"
            style={{
              height: "100%",
              overflowY: "auto",
            }}
          >
            <Outlet />
          </div>
    
          <div style={footerStyle}>
            <Footer />
          </div>
        </div>
      );
    }
    

  /* =====================
     💻 DESKTOP
     ===================== */
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: HEADER_HEIGHT,      // 👈 reserva header
          left: 0,
          right: 0,
          bottom: 0,              // 👈 corta el alto aquí
          display: "grid",
          gridTemplateColumns: "1fr 1.2fr 1fr",
          gap: "20px",
          padding: "20px",
          paddingBottom: "20px",  // 👈 ESTE espacio ahora SÍ se ve
          boxSizing: "border-box",
        }}
      >
        {/* Izquierda: posiciones (fijo) */}
        <div style={cardStyle}>
        <button
            onClick={() => setOpenModal("positions")}
            style={{
              float: "right",
              padding: "6px 10px",
              borderRadius: "8px",
              border: "none",
              background: "#222",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            ⤢
          </button>
          <Positions />
        </div>

        {/* Centro: aquí se carga Home / Positions / Detail */}
        <div style={cardStyle}>
        <button
            onClick={() => setOpenModal("positions_detail")}
            style={{
              float: "right",
              padding: "6px 10px",
              borderRadius: "8px",
              border: "none",
              background: "#222",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            ⤢
          </button>
          <Outlet />
        </div>

        {/* Derecha: sección futura */}
        <div style={cardStyle}>
        <button
            onClick={() => setOpenModal("drills")}
            style={{
              float: "right",
              padding: "6px 10px",
              borderRadius: "8px",
              border: "none",
              background: "#222",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            ⤢
          </button>
          <Drills />
        </div>
      </div>

      {/* MODAL */}
      <FullscreenModal open={!!openModal} onClose={() => setOpenModal(null)}>
        {openModal === "positions_detail" && <PositionsD />}
        {openModal === "positions" && <Positions />}
        {openModal === "transiciones" && <Transiciones />}
      </FullscreenModal>
    </>
  );
};

export default Layout;
