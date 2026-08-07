export default function Card({
  card,
  onClick,
  disabled = false,
  playable = true,
  highlightMode = false,
  tableCard = false,
}) {
  const isRed = card.suit === "♥" || card.suit === "♦";
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        position: "relative",
        width: tableCard
        ? "95px"
        : "85px",

        height: tableCard
        ? "140px"
        : "125px",
       background: "linear-gradient(to bottom, #ffffff, #f2f2f2)",
        border: "2px solid #333",
        borderRadius: "10px",
        padding: "4px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontWeight: "bold",
        color: isRed ? "#d32f2f" : "#000",
        cursor: disabled ? "default" : "pointer",
        userSelect: "none",
        opacity: highlightMode
        ? (playable ? 1 : 0.35)
        : 1,
        filter: disabled ? "grayscale(100%)" : "none",
        boxShadow: playable
          ? "0 4px 8px rgba(0,0,0,0.3)"
          : "0 2px 4px rgba(0,0,0,0.2)",
        transition:
          "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
        overflow: "hidden",
      }}
    >
      {/* Angolo alto */} 
      <div
        style={{
          fontSize: "24px",
          lineHeight: "21px",
          paddingLeft: "3px",
          textAlign: "left",
        }}
      >
        <div>{card.rank}</div>
        <div>{card.suit}</div>
      </div>
       {/* Seme decorativo */} 
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          right: "8px",
          fontSize: "26px",
          opacity: 0.25,
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
        <div>{card.rank}</div>
        <div>{card.suit}</div>
      </div>
    </div>
  );
}