import { useState } from "react";
import { collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../services/firebase";
import { getPlayerId } from "../services/player";
export default function Home() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState(
    localStorage.getItem("playerName") || "",
  );
  const [joinCode, setJoinCode] = useState("");
  const [gamesToPlay, setGamesToPlay] = useState(8);
  async function createTable() {
    const name = playerName.trim();
    if (name.length < 3) {
      alert("Il nome deve contenere almeno 3 caratteri");
      return;
    }
    if (name.length > 15) {
      alert("Il nome non può superare 15 caratteri");
      return;
    }
    const playerId = getPlayerId();
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    await setDoc(doc(collection(db, "tables"), code), {
      tableId: code,
      status: "waiting",
      gamesToPlay: gamesToPlay,
      createdAt: new Date().toISOString(),
      players: {
        seat1: {
          id: playerId,
          name: name,
        },
      },
    });
    localStorage.setItem("playerName", name);
    localStorage.setItem("seat", "seat1");
    localStorage.setItem("tableCode", code);
    navigate(`/table/${code}`);
  }
  async function joinTable() {
    const name = playerName.trim();
    if (name.length < 3) {
      alert("Il nome deve contenere almeno 3 caratteri");
      return;
    }
    if (!joinCode.trim()) {
      alert("Inserisci il codice tavolo");
      return;
    }
    const playerId = getPlayerId();
    const code = joinCode.toUpperCase();
    const tableRef = doc(db, "tables", code);
    const tableSnap = await getDoc(tableRef);
    if (!tableSnap.exists()) {
      alert("Tavolo non trovato");
      return;
    }
    const data = tableSnap.data();
    const players = data.players || {};
    const nomeEsistente = Object.values(players).some(
      (player) => player.name.toLowerCase().trim() === name.toLowerCase(),
    );
    if (nomeEsistente) {
      alert("Nome già presente nel tavolo");
      return;
    }
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
      id: playerId,
      name: name,
    };
    await updateDoc(tableRef, {
      players,
    });
    localStorage.setItem("playerName", name);
    localStorage.setItem("seat", seat);
    localStorage.setItem("tableCode", code);
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
       
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <b>Numero Partite</b> 
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 60px)",
            gap: "10px",
          }}
        >
          {[4, 8].map((number) => (
            <button
              key={number}
              onClick={() => setGamesToPlay(number)}
              style={{
                height: "50px",
                fontSize: "18px",
                fontWeight: "bold",
                backgroundColor: gamesToPlay === number ? "#1976d2" : "#f0f0f0",
                color: gamesToPlay === number ? "white" : "black",
                border: "1px solid #ccc",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              {number}
            </button>
          ))}
        </div>
         
        <div>
          Partite selezionate: <b>{gamesToPlay}</b>
        </div>
      </div>
       
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