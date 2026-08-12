import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
export default function Bidding({
  tableCode,
  mySeat,
  currentBidder,
  bids,
  firstBidder,
  players,
}) {
  const isMobile = window.innerWidth < 768;
  const validSeats = ["seat1", "seat2", "seat3", "seat4"];
  const firstIndex = validSeats.indexOf(firstBidder);
  const orderedSeats = [];
  for (let i = 0; i < 4; i++) {
    orderedSeats.push(validSeats[(firstIndex + i) % 4]);
  }
  const isMyTurn = currentBidder === mySeat;
  const bidsCount = validSeats.filter(
    (seat) => bids[seat] !== undefined,
  ).length;
  let forbiddenValue = null;
  if (bidsCount === 3) {
    const totalDeclared = validSeats.reduce(
      (sum, seat) => sum + (bids[seat] || 0),
      0,
    );
    forbiddenValue = 13 - totalDeclared;
  }
  let availableValues = Array.from({ length: 14 }, (_, i) => i);
  if (forbiddenValue !== null) {
    availableValues = availableValues.filter(
      (value) => value !== forbiddenValue,
    );
  }
  async function declareBid(value) {
    if (!isMyTurn) return;
    const tableRef = doc(db, "tables", tableCode);
    const newBids = {
      ...bids,
      [mySeat]: value,
    };
    const totalBids = validSeats.filter(
      (seat) => newBids[seat] !== undefined,
    ).length;
    if (totalBids === 4) {
      await updateDoc(tableRef, {
        bids: newBids,
        phase: "playing",
        currentBidder: null,
        currentPlayer: firstBidder,
        leadSeat: firstBidder,
        currentTrick: {},
      });
      return;
    }
    const currentIndex = orderedSeats.indexOf(mySeat);
    await updateDoc(tableRef, {
      bids: newBids,
      currentBidder: orderedSeats[currentIndex + 1],
    });
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        width: "100%",
      }}
    >
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: isMobile ? "8px" : "15px",
          width: isMobile ? "180px" : "340px",
        }}
      >
        <h3
        style={{
        fontSize: isMobile ? "18px" : "24px",
        margin: "5px 0",
        }}
        >
        Dichiarazioni
        </h3>
        {orderedSeats.map((seat) => (
          <div key={seat}
          style={{
            fontSize: isMobile ? "14px" : "20px",
            lineHeight: isMobile ? "20px" : "32px",
            }}>
            <b>{players[seat]?.name || seat}</b>
            {" : "}
            {bids[seat] !== undefined ? bids[seat] : "-"}
          </div>
        ))}
      </div>
       
      {!isMyTurn && (
        <div>
          In attesa della dichiarazione di <b>{players[currentBidder]?.name}</b>
        </div>
      )}
      
      {isMyTurn && (
        <>
          <h3>Tocca a te dichiarare</h3> 
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
              isMobile
              ? "repeat(4, 42px)"
              : "repeat(4, 60px)",
              gap: isMobile ? "6px" : "10px",
            }}
          >
            {availableValues.map((value) => (
              <button
                key={value}
                onClick={() => declareBid(value)}
                style={{
                  height: isMobile ? "38px" : "50px",
                  fontSize: isMobile ? "14px" : "18px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {value}
              </button>
            ))}
          </div>
           
          {forbiddenValue !== null && (
            <div>
              Valore non disponibile: <b>{forbiddenValue}</b>
            </div>
          )}
        </>
      )}
    </div>
  );
}