import { useState } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./services/firebase";
export default function App() {
  const [tableCode, setTableCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  async function createTable() {
    if (!playerName.trim()) {
      alert("Inserisci il nome del giocatore");
      return;
    }
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    await setDoc(doc(collection(db, "tables"), code), {
      tableId: code,
      status: "waiting",
      createdAt: new Date().toISOString(),
      players: {
        seat1: {
          name: playerName,
        },
      },
    });
    setTableCode(code);
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "20px",
        padding: "20px",
      }}
    >
      <h1>WHIST ONLINE</h1>
       
      <input
        type="text"
        placeholder="Nome giocatore"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        style={{
          padding: "10px",
          width: "250px",
          fontSize: "16px",
        }}
      />
       
      <button
        onClick={createTable}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        CREA TAVOLO
      </button>
       
      {tableCode && (
        <div style={{ textAlign: "center" }}>
          <h2>Codice Tavolo</h2>
          <h1>{tableCode}</h1>
          <p>Giocatore 1: {playerName}</p>
        </div>
      )}
    </div>
  );
}