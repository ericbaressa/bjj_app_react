import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Footer from "../components/Footer";
import Positions from "./Positions";
import PositionsD from "./PositionDetail";
import Drills from "./Transiciones";
import FullscreenModal from "../components/FullScreenModal";
import "../App.css";

const HEADER_HEIGHT = 40;

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
  width: "100%",
};

const Layout: React.FC = () => {
  // Detecta si es móvil
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detecta orientación (portrait = vertical)
  const [isPortrait, setIsPortrait] = useState(
    window.matchMedia("(orientation: portrait)").matches
  );

  // Mantener la lógica original por si quieres reactivarla
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", onResize);

    const mq = window.matchMedia("(orientation: portrait)");
    const orientationHandler = (e: MediaQueryListEvent) => {
      setIsPortrait(e.matches);
    };
    mq.addEventListener("change", orientationHandler);

    return () => {
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", orientationHandler);
    };
  }, []);

  // Estado del modal
  const [openModal, setOpenModal] = useState<
    null | "home" | "positions" | "drills" | "positions_detail"
  >(null);

  /* =====================
     📱 MOBILE
     ===================== */
  if (isMobile) {
    // 🔒 Bloqueo de rotación: si gira, seguimos mostrando vertical
    if (!isPortrait) {
      return (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#000",
            color: "#fff",
            textAlign: "center",
            padding: "20px"
          }}
        >
          <h2>Por favor, mantén el móvil en vertical</h2>
          <p style={{ opacity: 0.8 }}>La app está optimizada solo para vista vertical.</p>
        </div>
      );
    }

    return (
      <div className="app">
        <div className="content">
          <Outlet />
        </div>

        <div style={footerStyle}>
          <Footer />
        </div>
      </div>
    );
  }

  /* =====================
     💻 DESKTOP BLOQUEADO
     ===================== */
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#000",
        color: "#fff",
        textAlign: "center",
        padding: "20px"
      }}
    >
      <h2 style={{ marginBottom: "10px" }}>Solo disponible en móvil</h2>
      <p style={{ opacity: 0.8 }}>
        Abre esta aplicación desde tu teléfono para continuar.
      </p>
    </div>
  );
};

export default Layout;
