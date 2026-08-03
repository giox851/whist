import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../services/firebase";
import { getPlayerId } from "../services/player";
import Bidding from "../components/Bidding";
import Card from "../components/Card";
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
  const suitOrder = {
    "♠": 0,
    "♥": 1,
    "♦": 2,
    "♣": 3,
  };
  const rankOrder = {
    A: 13,
    K: 12,
    Q: 11,
    J: 10,
    10: 9,
    9: 8,
    8: 7,
    7: 6,
    6: 5,
    5: 4,
    4: 3,
    3: 2,
    2: 1,
  };
  const sortedCards = [...myCards].sort((a, b) => {
    if (a.suit !== b.suit) {
      return suitOrder[a.suit] - suitOrder[b.suit];
    }
    return rankOrder[b.rank] - rankOrder[a.rank];
  });
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
          border: "3px solid orange",
          borderRadius: "12px",
          padding: "15px",
          width: "340px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "42px",
          }}
        >
          {gameData.trumpSuit}
        </div>
         
        <div
          style={{
            fontWeight: "bold",
          }}
        >
          BRISCOLA
        </div>
         
        <br /> 
        <div>
          <b>Fase:</b> {phase}
        </div>
         
        <div>
          <b>Il tuo posto:</b> {mySeat}
        </div>
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
        <h3>Le tue carte</h3> 
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            justifyContent: "center",
          }}
        >
          {sortedCards.map((card, index) => (
            <Card key={index} card={card} />
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
          players={players}
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
          <br />
          (da implementare)
        </div>
      )}
    </div>
  );
}