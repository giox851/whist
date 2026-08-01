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
  if (!gameData || !mySeat) {
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
  const players = gameData.players || {};
  const hands = gameData.hands || {};
  const myCards = hands[mySeat] || [];
  const bids = gameData.bids || {};
  const phase = gameData.phase || "bidding";
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
       
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "15px",
          width: "340px",
          textAlign: "center",
        }}
      >
        <p>
          <b>Briscola:</b> {gameData.trumpSuit}
        </p>
         
        <p>
          <b>Fase:</b> {phase}
        </p>
         
        <p>
          <b>Il tuo posto:</b> {mySeat}
        </p>
      </div>
       
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "15px",
          width: "340px",
        }}
      >
        <h3>Giocatori</h3> <div>Seat1: {players.seat1?.name}</div> 
        <div>Seat2: {players.seat2?.name}</div> 
        <div>Seat3: {players.seat3?.name}</div> 
        <div>Seat4: {players.seat4?.name}</div>
      </div>
       
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "15px",
          width: "340px",
        }}
      >
        <h3>Le tue 13 carte</h3> 
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {myCards.map((card, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #999",
                borderRadius: "6px",
                padding: "8px 12px",
                minWidth: "45px",
                textAlign: "center",
                backgroundColor: "white",
              }}
            >
              {card.code}
            </div>
          ))}
        </div>
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
            border: "2px solid green",
            borderRadius: "10px",
            padding: "20px",
            width: "340px",
            textAlign: "center",
          }}
        >
          FASE DI GIOCO  
          <br />
          <br />  (da implementare)
        </div>
      )}
    </div>
  );
}