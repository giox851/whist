import { useEffect, useState } from "react";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import Lobby from "../components/Lobby";
import { db } from "../services/firebase";
import { getPlayerId } from "../services/player";
export default function Table() {
  const { tableCode } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState({});
  const [message, setMessage] = useState("");
  const [registered, setRegistered] = useState(false);
  const [playerName, setPlayerName] = useState("");
  useEffect(() => {
    const playerId = getPlayerId();
    const tableRef = doc(db, "tables", tableCode.toUpperCase());
    const unsubscribe = onSnapshot(tableRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const data = snapshot.data();
      const currentPlayers = data.players || {};
      setPlayers(currentPlayers);
      const alreadyPresent = Object.values(currentPlayers).some(
        (player) => player.id === playerId,
      );
      setRegistered(alreadyPresent);
    });
    return () => unsubscribe();
  }, [tableCode]);
  async function enterTable() {
    const name = playerName.trim();
    if (name.length < 3) {
      alert("Il nome deve contenere almeno 3 caratteri");
      return;
    }
    const tableRef = doc(db, "tables", tableCode.toUpperCase());
    const snapshot = await getDoc(tableRef);
    if (!snapshot.exists()) {
      alert("Tavolo non trovato");
      return;
    }
    const data = snapshot.data();
    const currentPlayers = data.players || {};
    const nomeEsistente = Object.values(currentPlayers).some(
      (player) => player.name.toLowerCase() === name.toLowerCase(),
    );
    if (nomeEsistente) {
      alert("Nome già presente nel tavolo");
      return;
    }
    let seat = null;
    if (!currentPlayers.seat1) seat = "seat1";
    else if (!currentPlayers.seat2) seat = "seat2";
    else if (!currentPlayers.seat3) seat = "seat3";
    else if (!currentPlayers.seat4) seat = "seat4";
    if (!seat) {
      alert("Tavolo pieno");
      return;
    }
    currentPlayers[seat] = {
      id: getPlayerId(),
      name: name,
    };
    await updateDoc(tableRef, {
      players: currentPlayers,
    });
    localStorage.setItem("playerName", name);
    localStorage.setItem("seat", seat);
    localStorage.setItem("tableCode", tableCode.toUpperCase());
    setMessage(`Connesso come ${seat}`);
    setRegistered(true);
  }
  async function copyInviteLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copiato");
    } catch {
      alert("Errore nella copia");
    }
  }
  async function leaveTable() {
    const seat = localStorage.getItem("seat");
    if (!seat) {
      navigate("/");
      return;
    }
    const tableRef = doc(db, "tables", tableCode.toUpperCase());
    const snapshot = await getDoc(tableRef);
    if (!snapshot.exists()) {
      navigate("/");
      return;
    }
    const data = snapshot.data();
    const updatedPlayers = {
      ...(data.players || {}),
    };
    delete updatedPlayers[seat];
    await updateDoc(tableRef, {
      players: updatedPlayers,
    });
    localStorage.removeItem("seat");
    localStorage.removeItem("tableCode");
    navigate("/");
  }
  const playerCount = Object.keys(players).length;
  if (!registered) {
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
        }}
      >
        <h1>TAVOLO {tableCode.toUpperCase()}</h1>
         
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
          onClick={enterTable}
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
  return (
    <Lobby
      tableCode={tableCode.toUpperCase()}
      players={players}
      playerCount={playerCount}
      message={message}
      copyInviteLink={copyInviteLink}
      leaveTable={leaveTable}
    />
  );
}