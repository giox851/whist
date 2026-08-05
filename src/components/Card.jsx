export default function Card({ card, onClick, disabled = false }) {
  const isRed = card.suit === "♥" || card.suit === "♦";
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        width: "85px",
        height: "125px",
        backgroundColor: "white",
        border: "2px solid #333",
        borderRadius: "10px",
        padding: "4px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontWeight: "bold",
        color: isRed ? "#d32f2f" : "#000",
        boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.9 : 1,
        userSelect: "none",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        background: "linear-gradient(to bottom, #ffffff, #f2f2f2)",
      }}
    >
      {/* Angolo alto */} 
      <div
        style={{
          lineHeight: "16px",
          fontSize: "18px",
        }}
      >
        <div>{card.rank}</div> <div>{card.suit}</div>
      </div>
       {/* Centro */} 
      <div
        style={{
          textAlign: "center",
          fontSize: "34px",
        }}
      >
        {card.suit}
      </div>
       {/* Angolo basso */} 
      <div
        style={{
          lineHeight: "16px",
          transform: "rotate(180deg)",
          textAlign: "right",
          fontSize: "18px",
        }}
      >
        <div>{card.rank}</div> <div>{card.suit}</div>
      </div>
    </div>
  );
}