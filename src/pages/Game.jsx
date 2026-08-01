import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../services/firebase";
export default function Game() {
  const { tableCode } = useParams();
  const [gameData, setGameData] = useState(null);
  useEffect(() => {
    const tableRef = doc(db, "tables", tableCode.toUpperCase());
    const unsubscribe = onSnapshot(tableRef, (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }
      setGameData(snapshot.data());
    });
    return () => unsubscribe();
  }, [tableCode]);
  if (!gameData) {
    return (
      <div
        style={{
          padding: "20px",
        }}
      >
        Caricamento...
      </div>
    );
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
        gap: "20px",
        fontFamily: "Arial",
      }}
    >
      <h1>
        PARTITA {gameData.currentGame || 1}
        {" / "}
        {gameData.gamesToPlay || 8}
      </h1>
       <h2>Tavolo {tableCode.toUpperCase()}</h2> 
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "15px",
          width: "320px",
          textAlign: "center",
        }}
      >
        <p>
          <b>Fase:</b> {gameData.phase || "bidding"}
        </p>
         
        <p>
          <b>Briscola:</b> {gameData.trumpSuit || "-"}
        </p>
         
        <p>
          <b>Primo dichiarante:</b> {gameData.firstBidder || "-"}
        </p>
         
        <p>
          <b>Turno:</b> {gameData.currentBidder || "-"}
        </p>
      </div>
       
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "20px",
          width: "320px",
          textAlign: "center",
        }}
      >
        AREA DICHIARAZIONE
      </div>
    </div>
  );
}