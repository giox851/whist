import { useEffect, useState } from "react";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./services/firebase";
export default function App() {
  const [tableCode, setTableCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [inLobby, setInLobby] = useState(false);
  const [message, setMessage] = useState("");
  const [players, setPlayers] = useState({});
  useEffect(() => {
    if (!tableCode) return;
    const tableRef = doc(db, "tables", tableCode);
    const unsubscribe = onSnapshot(tableRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setPlayers(data.players || {});
      }
    });
    return () => unsubscribe();
  }, [tableCode]);
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
    const code = joinCode.toUpperCase();
    const tableRef = doc(db, "tables", code);
    const tableSnap = await getDoc(tableRef);
    if (!tableSnap.exists()) {
      alert("Tavolo non trovato");
      return;
    }
    const data = tableSnap.data();
    const playersData = data.players || {};
    let seat = null;
    if (!playersData.seat1) seat = "seat1";
    else if (!playersData.seat2) seat = "seat2";
    else if (!playersData.seat3) seat = "seat3";
    else if (!playersData.seat4) seat = "seat4";
    if (!seat) {
      alert("Tavolo pieno");
      return;
    }
    playersData[seat] = {
      name: playerName,
    };
    await updateDoc(tableRef, {
      players: playersData,
    });
    setTableCode(code);
    setMessage(`Entrato come ${seat}`);
    setInLobby(true);
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
        gap: "15px",
        fontFamily: "Arial",
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
              padding: "12px",
              width: "280px",
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
              padding: "12px",
              width: "280px",
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
            <p>1. {players.seat1?.name || "Libero"}</p> 
            <p>2. {players.seat2?.name || "Libero"}</p> 
            <p>3. {players.seat3?.name || "Libero"}</p> 
            <p>4. {players.seat4?.name || "Libero"}</p>
          </div>
           <h2>{tableCode}</h2>
        </>
      )}
    </div>
  );
}