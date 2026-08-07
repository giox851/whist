import Card from "./Card";
export default function TableBoard({
  players,
  bids,
  tricksWon,
  currentPlayer,
  currentTrick,
}) {
  function renderPlayer(seat) {
    const isTurn = currentPlayer === seat;
    return (
      <div
        style={{
          backgroundColor: isTurn ? "#4caf50" : "#2f4858",
          color: "white",
          padding: "10px",
          borderRadius: "12px",
          minWidth: "140px",
          textAlign: "center",
          border: isTurn ? "3px solid gold" : "2px solid #456",
          boxShadow: isTurn ? "0 0 12px gold" : "none",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
          }}
        >
          {players[seat]?.name}
        </div>
         
        <div>
          🎯 {bids[seat] ?? "-"}
          {" | "}✅ {tricksWon[seat] ?? 0}
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        background: "linear-gradient(#0d6230,#084a22)",
        borderRadius: "20px",
        padding: "20px",
        color: "white",
      }}
    >
      {/* NORD */} 
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "30px",
        }}
      >
        {renderPlayer("seat3")}
      </div>
       {/* CENTRO */} 
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: "250px",
        }}
      >
        {/* OVEST */} <div>{renderPlayer("seat2")}</div> {/* TAVOLO */} 
        <div
          style={{
            width: "300px",
            height: "220px",
            position: "relative",
          }}
        >
          {/* Nord */} 
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {currentTrick.seat4 && <Card
              card={currentTrick.seat4}
              tableCard={true}
              disabled            
            />}
          </div>
           {/* Ovest */} 
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {<currentTrick className="seat3"></currentTrick> && <Card
              card={currentTrick.seat3}
              tableCard={true}
              disabled
             />}
          </div>
           {/* Est */} 
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {currentTrick.seat2 && <Card
              card={currentTrick.seat2}
              tableCard={true}
              disabled             
            />}
          </div>
           {/* Sud */} 
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {currentTrick.seat1 && <Card
              card={currentTrick.seat1}
              tableCard={true}
              disabled
             />}
          </div>
        </div>
         {/* EST */} <div>{renderPlayer("seat4")}</div>
      </div>
       {/* SUD */} 
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {renderPlayer("seat1")}
      </div>
    </div>
  );
}