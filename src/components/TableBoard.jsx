import Card from "./Card";
export default function TableBoard({
  players,
  bids,
  tricksWon,
  currentPlayer,
  currentTrick,
  lastTrickWinner,
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
  function renderTableCard(seat) {
    if (!currentTrick[seat]) {
      return null;
    }
    return (
      <Card
        card={currentTrick[seat]}
        playable={true}
        highlightMode={false}
        tableCard={true}
        disabled
      />
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
        boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
        border: "2px solid rgba(255,255,255,0.15)",
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
          minHeight: "280px",
        }}
      >
        {/* OVEST */} <div>{renderPlayer("seat2")}</div> {/* TAVOLO */} 
        <div
          style={{
            width: "360px",
            height: "260px",
            position: "relative",
          }}
        >
          {lastTrickWinner && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "rgba(0,0,0,0.75)",
                color: "white",
                padding: "12px 18px",
                borderRadius: "999px",
                fontWeight: "bold",
                fontSize: "20px",
                zIndex: 1000,
                boxShadow: "0 0 18px rgba(255,215,0,0.8)",
                border: "2px solid gold",
                whiteSpace: "nowrap",
              }}
            >
              🏆 Presa a {players[lastTrickWinner]?.name}
            </div>
          )}
           {/* Nord */} 
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
            }}
          >
            {renderTableCard("seat3")}
          </div>
           {/* Ovest */} 
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
            }}
          >
            {renderTableCard("seat2")}
          </div>
           {/* Est */} 
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
            }}
          >
            {renderTableCard("seat4")}
          </div>
           {/* Sud */} 
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
            }}
          >
            {renderTableCard("seat1")}
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