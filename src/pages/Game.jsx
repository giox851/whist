import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../services/firebase";
import { getPlayerId } from "../services/player";
import Bidding from "../components/Bidding";
import Card from "../components/Card";
import TableBoard from "../components/TableBoard";
export default function Game() {
  const { tableCode } = useParams();
  const [gameData, setGameData] = useState(null);
  const [mySeat, setMySeat] = useState(null);
  useEffect(() => {
    const playerId = getPlayerId();
    const tableRef = doc(db, "tables", tableCode.toUpperCase());
    const unsubscribe = onSnapshot(tableRef, (snapshot) => {
      if (!snapshot.exists()) return;
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
    return <div style={{ padding: "20px" }}>Caricamento...</div>;
  }
  const players = gameData.players || {};
  const hands = gameData.hands || {};
  const bids = gameData.bids || {};
  const phase = gameData.phase || "bidding";
  const currentPlayer = gameData.currentPlayer;
  const currentTrick = gameData.currentTrick || {};
  const myCards = hands[mySeat] || [];
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
  async function playCard(card) {
    if (phase !== "playing") return;
    if (currentPlayer !== mySeat) return;
    const tableRef = doc(db, "tables", tableCode.toUpperCase());
    const updatedHand = myCards.filter((c) => c.code !== card.code);
    const updatedHands = {
      ...hands,
      [mySeat]: updatedHand,
    };
    const updatedTrick = {
      ...currentTrick,
      [mySeat]: card,
    };
    const order = ["seat1", "seat2", "seat3", "seat4"];
    const currentIndex = order.indexOf(mySeat);
    const nextPlayer = order[(currentIndex + 1) % 4];
    await updateDoc(tableRef, {
      hands: updatedHands,
      currentTrick: updatedTrick,
      currentPlayer: nextPlayer,
    });
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
        background: "#0f5132",
      }}
    >
      <h1
        style={{
          color: "white",
        }}
      >
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
          background: "white",
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
        <TableBoard
          players={players}
          bids={bids}
          tricksWon={gameData.tricksWon || {}}
          currentPlayer={currentPlayer}
          currentTrick={currentTrick}
        />
      )}
       
      <div
        style={{
          borderRadius: "12px",
          padding: "15px",
          width: "100%",
          maxWidth: "1000px",
          background: "rgba(255,255,255,0.15)",
        }}
      >
        <h3
          style={{
            color: "white",
            textAlign: "center",
          }}
        >
          Le tue carte
        </h3>
         
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            justifyContent: "center",
          }}
        >
          {sortedCards.map((card, index) => (
            <Card
              key={index}
              card={card}
              disabled={phase !== "playing" || currentPlayer !== mySeat}
              onClick={() => playCard(card)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}