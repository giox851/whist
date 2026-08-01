import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../services/firebase";
import { getPlayerId } from "../services/player";
import Bidding from "../components/Bidding";
export default function Game() {
  const { tableCode } = useParams();
  const [gameData, setGameData] = useState(null);
  const [mySeat, setMySeat] = useState(null);
  useEffect(() => {
    const playerId = getPlayerId();
    const tableRef = doc(db, "tables", tableCode.toUpperCase());
    const unsubscribe = onSnapshot(tableRef, (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }
      const data = snapshot.data();
      setGameData(data);
      const players = data.players || {};
      if (players.seat1?.id === playerId) {
        setMySeat("seat1");
      } else if (players.seat2?.id === playerId) {
        setMySeat("seat2");
      } else if (players.seat3?.id === playerId) {
        setMySeat("seat3");
      } else if (players.seat4?.id === playerId) {
        setMySeat("seat4");
      }
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
  const phase = gameData.phase || "bidding";
  const players = gameData.players || {};
  const bids = gameData.bids || {};
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
          <b>Fase:</b> {phase}
        </p>
         
        <p>
          <b>Briscola:</b> {gameData.trumpSuit}
        </p>
         
        <p>
          <b>Primo dichiarante:</b> {gameData.firstBidder}
        </p>
         
        <p>
          <b>Turno:</b> {gameData.currentBidder}
        </p>
      </div>
       
      {phase === "bidding" && (
        <Bidding
          tableCode={tableCode.toUpperCase()}
          mySeat={mySeat}
          currentBidder={gameData.currentBidder}
          bids={bids}
          firstBidder={gameData.firstBidder}
        />
      )}
       
      {phase === "playing" && (
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "20px",
            width: "320px",
            textAlign: "center",
          }}
        >
          FASE DI GIOCO
          <br />
          (da implementare)
        </div>
      )}
       
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "15px",
          width: "320px",
        }}
      >
        <h3>Giocatori</h3> <div>seat1: {players.seat1?.name || "-"}</div> 
        <div>seat2: {players.seat2?.name || "-"}</div> 
        <div>seat3: {players.seat3?.name || "-"}</div> 
        <div>seat4: {players.seat4?.name || "-"}</div>
      </div>
    </div>
  );
}