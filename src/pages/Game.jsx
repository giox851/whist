import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../services/firebase";
import { getPlayerId } from "../services/player";
import { getTrickWinner } from "../services/trickWinner";
import Bidding from "../components/Bidding";
import Card from "../components/Card";
import TableBoard from "../components/TableBoard";
import { calculateScores } from "../services/scoring";
import { createDeck, shuffleDeck, dealCards } from "../services/cards";
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
  const leadSeat = gameData.leadSeat;
  const trickResolving = gameData.trickResolving || false;
  const lastTrickWinner = gameData.lastTrickWinner || null;
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
  function isPlayable(card) {
    if (phase !== "playing") {
      return true;
    }
    if (trickResolving) {
      return true;
    }
    if (currentPlayer !== mySeat) {
      return true;
    }
    const playedSeats = Object.keys(currentTrick);
    if (playedSeats.length === 0) {
      return true;
    }
    if (playedSeats.length === 4) {
      return true;
    }
    const leadCard = currentTrick[leadSeat];
    if (!leadCard) {
      return true;
    }
    const leadSuit = leadCard.suit;
    const hasLeadSuit = myCards.some(
      (cardInHand) => cardInHand.suit === leadSuit,
    );
    if (!hasLeadSuit) {
      return true;
    }
    return card.suit === leadSuit;
  }
  async function playCard(card) {
    if (trickResolving) {
      return;
    }
    if (!isPlayable(card)) {
      return;
    }
    if (phase !== "playing") {
      return;
    }
    if (currentPlayer !== mySeat) {
      return;
    }
    const tableRef = doc(db, "tables", tableCode.toUpperCase());
    const updatedHand = myCards.filter(
      (cardInHand) => cardInHand.code !== card.code,
    );
    const updatedHands = {
      ...hands,
      [mySeat]: updatedHand,
    };
    const updatedTrick = {
      ...currentTrick,
      [mySeat]: card,
    };
    const trickSeats = Object.keys(updatedTrick);
    const order = ["seat1", "seat2", "seat3", "seat4"];
    const currentIndex = order.indexOf(mySeat);
    const nextPlayer = order[(currentIndex + 1) % 4];
    if (trickSeats.length === 4) {
      await updateDoc(tableRef, {
        hands: updatedHands,
        currentTrick: updatedTrick,
        trickResolving: true,
      });
      setTimeout(async () => {
        const winnerSeat = getTrickWinner(
          updatedTrick,
          gameData.trumpSuit,
          leadSeat,
        );
        const updatedTricksWon = {
          ...(gameData.tricksWon || {}),
        };

        updatedTricksWon[winnerSeat] = (updatedTricksWon[winnerSeat] || 0) + 1;

        const handFinished = Object.values(updatedHands).every(
          (hand) => hand.length === 0,
        );
        let updatedScores = gameData.scores || {};
        if (handFinished) {
          updatedScores = calculateScores(
            bids,
            updatedTricksWon,
            gameData.scores || {},
          );
        }

        const updateData = {
          lastTrickWinner: winnerSeat,
          currentPlayer: winnerSeat,
          leadSeat: winnerSeat,
          tricksWon: updatedTricksWon,
          trickResolving: false,
        };
        if (handFinished) {
          updateData.phase = "roundEnd";
          updateData.scores = updatedScores;
        }
        await updateDoc(tableRef, updateData);

        setTimeout(async () => {
          await updateDoc(tableRef, {
            currentTrick: {},
            lastTrickWinner: null,
          });
        }, 1200);
      }, 1500);
      return;
    }
    await updateDoc(tableRef, {
      hands: updatedHands,
      currentTrick: updatedTrick,
      currentPlayer: nextPlayer,
    });
  }
async function startNextRound() {
  const order = ["seat1", "seat2", "seat3", "seat4"];
  const currentFirst = gameData.firstBidder;
  const currentIndex = order.indexOf(currentFirst);
  const nextFirstBidder = order[(currentIndex + 1) % 4];
  const deck = shuffleDeck(createDeck());
  const hands = dealCards(deck);
  const nextGame = (gameData.currentGame || 1) + 1;
  const trumpCard = deck[deck.length - 1];
  const tableRef = doc(db, "tables", tableCode.toUpperCase());
  await updateDoc(tableRef, {
    currentGame: nextGame,
    phase: "bidding",
    hands,
    bids: {},
    currentTrick: {},
    tricksWon: {
      seat1: 0,
      seat2: 0,
      seat3: 0,
      seat4: 0,
    },
    firstBidder: nextFirstBidder,
    currentBidder: nextFirstBidder,
    currentPlayer: null,
    leadSeat: null,
    lastTrickWinner: null,
    trickResolving: false,
    trumpSuit: trumpCard.suit,
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
        
        {trickResolving && (
          <div
            style={{
              marginTop: "8px",
              color: "#b45309",
              fontWeight: "bold",
            }}
          >
            Presa in valutazione...
          </div>
        )}
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
          lastTrickWinner={lastTrickWinner}
        />
      )}

      {phase === "roundEnd" && (
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            minWidth: "600px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            🏁 Fine Mano
          </h2>
          
          {["seat1", "seat2", "seat3", "seat4"].map((seat) => {
            const bid = bids[seat] || 0;
            const tricks = gameData.tricksWon?.[seat] || 0;
            const roundPoints = tricks === bid ? tricks + 10 : tricks;
          
            return (
              <div
                key={seat}
                style={{
                  padding: "10px 0",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <strong>{players[seat]?.name}</strong>{" | "}
                Dichiarato: {bid}{" | "}
                Prese: {tricks}{" | "}
                Punti Mano: +{roundPoints}{" | "}
                Totale: {gameData.scores?.[seat] || 0}
              </div>
            );
          })}
          {
            mySeat === "seat1" ? (
          <button
            onClick={startNextRound}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "18px",
              cursor: "pointer",
              background: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "8px",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            ▶ Prossima Mano
          </button>
            ) : (
              <div
                style={{
                  marginTop: "20px",
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#666",
                }}
              >
                In attesa dell'avvio della mano successiva...
              </div>
            )
          }
        </div>
      )}
    
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          marginTop: "-80px",
          zIndex: 50,
          overflow: "visible",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            height: "260px",
            overflow: "visible",
          }}
        >
          {sortedCards.map((card, index) => {
            const totalCards = sortedCards.length;
            const center = (totalCards - 1) / 2;
            const distance = index - center;
            const rotation = distance * 6;
            const translateY = Math.abs(distance) * 5;
            const playable = isPlayable(card);
            const shouldDisable =
              phase !== "playing" ||
              trickResolving ||
              currentPlayer !== mySeat ||
              !playable;
            return (
              <div
                key={card.code}
                style={{
                  marginLeft: index === 0 ? 0 : -62,
                  transform: `
rotate(${rotation}deg)
translateY(${translateY}px)
`,
                  transformOrigin: "bottom center",
                  zIndex: index + 1,
                  transition: "all 0.25s ease",
                  opacity: playable ? 1 : 0.35,
                  filter: playable ? "none" : "grayscale(100%)",
                  overflow: "visible",
                }}
                onMouseEnter={(event) => {
                  if (shouldDisable) return;
                  event.currentTarget.style.transform = `
rotate(${rotation}deg)
translateY(${translateY - 25}px)
scale(1.06)
`;
                  event.currentTarget.style.zIndex = "999";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform = `
rotate(${rotation}deg)
translateY(${translateY}px)
`;
                  event.currentTarget.style.zIndex = index + 1;
                }}
              >
                <Card
                  card={card}
                  playable={playable}
                  disabled={shouldDisable}
                  onClick={() => playCard(card)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}