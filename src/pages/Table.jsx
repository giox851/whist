import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router-dom";
import Lobby from "../components/Lobby";
import { db } from "../services/firebase";
export default function Table() {
  const { tableCode } = useParams();
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
      setMessage(`Entrato come ${seat}`);
    } else {
      setMessage("Creatore del tavolo");
    }
  }, []);
  async function copyInviteLink() {
    const inviteLink = window.location.href;
    try {
      await navigator.clipboard.writeText(inviteLink);
      alert("Link copiato");
    } catch (error) {
      alert("Errore nella copia del link");
    }
  }
  const playerCount = Object.keys(players).length;
  return (
    <Lobby
      tableCode={tableCode.toUpperCase()}
      players={players}
      playerCount={playerCount}
      message={message}
      copyInviteLink={copyInviteLink}
    />
  );
}