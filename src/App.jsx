import * as React from "react";
export default function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>WHIST ONLINE</h1> 
      <button
        style={{
          padding: "12px 24px",
          fontSize: "18px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          backgroundColor: "#1976d2",
          color: "#fff",
        }}
      >
        CREA TAVOLO
      </button>
    </div>
  );
}