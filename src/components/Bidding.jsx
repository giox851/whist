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
  const bidOrder = ["seat1", "seat2", "seat3", "seat4"];
  const firstIndex = bidOrder.indexOf(firstBidder);
  const orderedSeats = [];
  for (let i = 0; i < 4; i++) {
    orderedSeats.push(bidOrder[(firstIndex + i) % 4]);
  }
  const isMyTurn = currentBidder === mySeat;
  const bidsCount = Object.keys(bids).length;
  let forbiddenValue = null;
  if (bidsCount === 3) {
    const totalDeclared = Object.values(bids).reduce(
      (sum, value) => sum + value,
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
      value,
    };
    const currentIndex = orderedSeats.indexOf(mySeat);
    const isLastPlayer = currentIndex === 3;
    if (isLastPlayer) {
      await updateDoc(tableRef, {
        bids: newBids,
        phase: "playing",
      });
      return;
    }
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
          padding: "15px",
          width: "340px",
        }}
      >
        <h3>Dichiarazioni</h3> 
        {orderedSeats.map((seat) => (
          <div key={seat}>
            <b>{players[seat]?.name}</b> {" : "} 
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
              gridTemplateColumns: "repeat(4, 60px)",
              gap: "10px",
            }}
          >
            {availableValues.map((value) => (
              <button
                key={value}
                onClick={() => declareBid(value)}
                style={{
                  height: "50px",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                {value}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}