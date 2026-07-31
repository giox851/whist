import { useState } from "react";
import { collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
export default function Home() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");
  const [joinCode, setJoinCode] = useState("");
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
    localStorage.setItem("playerName", playerName);
    navigate(`/table/${code}`);
  }
  async function joinTable() {
    if (!playerName.trim()) {
      alert("Inserisci il nome del giocatore");
      return;
    }
    if (!joinCode.trim()) {
      alert("Inserisci il codice tavolo");
      return;
    }
    const code = joinCode.toUpperCase();
    const tableRef = doc(db, "tables", code);
    const tableSnap = await getDoc(tableRef);
    if (!tableSnap.exists()) {
      alert("Tavolo non trovato");
      return;
    }
    const data = tableSnap.data();
    const players = data.players || {};
    let seat = null;
    if (!players.seat1) seat = "seat1";
    else if (!players.seat2) seat = "seat2";
    else if (!players.seat3) seat = "seat3";
    else if (!players.seat4) seat = "seat4";
    if (!seat) {
      alert("Tavolo pieno");
      return;
    }
    players[seat] = {
      name: playerName,
    };
    await updateDoc(tableRef, {
      players,
    });
    localStorage.setItem("playerName", playerName);
    localStorage.setItem("seat", seat);
    navigate(`/table/${code}`);
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "15px",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <h1>WHIST ONLINE</h1>
       
      <input
        type="text"
        placeholder="Nome giocatore"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        style={{
          width: "280px",
          padding: "12px",
          fontSize: "16px",
        }}
      />
       
      <button
        onClick={createTable}
        style={{
          width: "280px",
          padding: "12px",
          fontSize: "16px",
        }}
      >
        CREA TAVOLO
      </button>
       
      <hr style={{ width: "280px" }} />
       
      <input
        type="text"
        placeholder="Codice tavolo"
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
        style={{
          width: "280px",
          padding: "12px",
          fontSize: "16px",
        }}
      />
       
      <button
        onClick={joinTable}
        style={{
          width: "280px",
          padding: "12px",
          fontSize: "16px",
        }}
      >
        ENTRA NEL TAVOLO
      </button>
    </div>
  );
}