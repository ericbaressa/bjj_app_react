import React from "react";

const FullscreenModal = ({ open, onClose, children }: any) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.95)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          background: "#111",
          borderRadius: "16px",
          padding: "20px",
          position: "relative",
          overflow: "auto",
          maxHeight: "90vh",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "transparent",
            color: "#fff",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          ✖
        </button>

        {children}
      </div>
    </div>
  );
};

export default FullscreenModal;
