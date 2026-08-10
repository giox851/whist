import Card from "./Card";
export default function TableBoard({
  players,
  bids,
  tricksWon,
  currentPlayer,
  currentTrick,
  lastTrickWinner,
}) {
  const isMobile = window.innerWidth < 768;
  function renderPlayer(seat) {
    const isTurn = currentPlayer === seat;
    return (
      <div
        style={{
          backgroundColor: isTurn ? "#4caf50" : "#2f4858",
          color: "white",
          padding: isMobile ? "4px" : "10px",
          borderRadius: isMobile ? "8px" : "12px",
          minWidth: isMobile ? "90px" : "140px",
          border: isTurn ? "2px solid gold" : "2px solid #456",
          boxShadow: isTurn
          ? (isMobile ? "0 0 8px gold" : "0 0 12px gold")
          : "none",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: isMobile ? "12px" : "16px",
          }}
        >
          {players[seat]?.name}
        </div>
        <div
        style={{
        fontSize: isMobile ? "10px" : "16px",
        }}> 
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
        maxWidth: isMobile ? "100%" : "900px",
        background: "linear-gradient(#0d6230,#084a22)",
        padding: isMobile ? "8px" : "20px",
        borderRadius: isMobile ? "10px" : "20px",
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
          marginBottom: isMobile ? "10px" : "30px",
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
          minHeight: isMobile ? "160px" : "280px",
        }}
      >
        {/* OVEST */}<div>{renderPlayer("seat2")}</div>{/* TAVOLO */}
        <div
          style={{
            width: isMobile ? "210px" : "360px",
            height: isMobile ? "150px" : "260px",
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
                padding: isMobile ? "6px 10px" : "12px 18px",
                borderRadius: "999px",
                fontWeight: "bold",
                fontSize: isMobile ? "12px" : "20px",
                zIndex: 1000,
                boxShadow: isMobile
                  ? "0 0 8px rgba(255,215,0,0.8)"
                  : "0 0 18px rgba(255,215,0,0.8)",
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
        {/* EST */}<div>{renderPlayer("seat4")}</div>
      </div>
      {/* SUD */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: isMobile ? "10px" : "20px",
        }}
      >
        {renderPlayer("seat1")}
      </div>
    </div>
  );
}