export default function Card({ card, onClick, disabled = false }) {
  const isRed = card.suit === "♥" || card.suit === "♦";
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        width: "60px",
        height: "90px",
        backgroundColor: "white",
        border: "2px solid #333",
        borderRadius: "10px",
        padding: "4px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontWeight: "bold",
        color: isRed ? "#d32f2f" : "#000",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.8 : 1,
      }}
    >
      <div
        style={{
          lineHeight: "16px",
        }}
      >
        <div>{card.rank}</div>
        <div>{card.suit}</div>
      </div>
       
      <div
        style={{
          textAlign: "center",
          fontSize: "28px",
        }}
      >
        {card.suit}
      </div>
       
      <div
        style={{
          lineHeight: "16px",
          transform: "rotate(180deg)",
          textAlign: "right",
        }}
      >
        <div>{card.rank}</div>
        <div>{card.suit}</div>
      </div>
    </div>
  );
}