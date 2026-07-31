import { useState } from "react";
import { collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./services/firebase";
export default function App() {
  const [tableCode, setTableCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [inLobby, setInLobby] = useState(false);
  const [message, setMessage] = useState("");
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
    setMessage("Creatore del tavolo - Seat 1");
    setInLobby(true);
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
    const tableRef = doc(db, "tables", joinCode.toUpperCase());
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
    setTableCode(joinCode.toUpperCase());
    setMessage(`Entrato come ${seat}`);
    setInLobby(true);
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
      {!inLobby && (
        <>
          <h1>WHIST ONLINE</h1>
           
          <input
            type="text"
            placeholder="Nome giocatore"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            style={{
              padding: "10px",
              width: "280px",
              fontSize: "16px",
            }}
          />
           
          <button
            onClick={createTable}
            style={{
              padding: "12px 20px",
              width: "280px",
              fontSize: "16px",
            }}
          >
            CREA TAVOLO
          </button>
           
          <hr
            style={{
              width: "280px",
            }}
          />
           
          <input
            type="text"
            placeholder="Codice tavolo"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            style={{
              padding: "10px",
              width: "280px",
              fontSize: "16px",
            }}
          />
           
          <button
            onClick={joinTable}
            style={{
              padding: "12px 20px",
              width: "280px",
              fontSize: "16px",
            }}
          >
            ENTRA NEL TAVOLO
          </button>
        </>
      )}
       
      {inLobby && (
        <>
          <h1>TAVOLO {tableCode}</h1> <p>{message}</p> 
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "20px",
              width: "280px",
            }}
          >
            <p>1. Occupato o libero</p>
            <p>2. Occupato o libero</p>
            <p>3. Occupato o libero</p>
            <p>4. Occupato o libero</p>
          </div>
           <h2>{tableCode}</h2> 
          <p>Comunica questo codice agli altri giocatori</p>
        </>
      )}
    </div>
  );
}