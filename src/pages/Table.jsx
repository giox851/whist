import { useEffect, useState } from "react";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import Lobby from "../components/Lobby";
import { db } from "../services/firebase";
export default function Table() {
  const { tableCode } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState({});
  const [message, setMessage] = useState("");
  useEffect(() => {
    const tableRef = doc(db, "tables", tableCode.toUpperCase());
    const unsubscribe = onSnapshot(tableRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setPlayers(data.players || {});
      }
    });
    return () => unsubscribe();
  }, [tableCode]);
  useEffect(() => {
    const seat = localStorage.getItem("seat");
    if (seat) {
      setMessage(`Connesso come ${seat}`);
    }
  }, []);
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