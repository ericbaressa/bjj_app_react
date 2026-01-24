import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Footer from "../components/Footer";
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

const Layout: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
      <div className="app-viewport">
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
      <h2>Solo disponible en móvil</h2>
      <p style={{ opacity: 0.8 }}>Abre esta aplicación desde tu teléfono.</p>
    </div>
  );
};

export default Layout;
