export default function Card({
  card,
  onClick,
  disabled = false,
  playable = true,
  highlightMode = false,
  tableCard = false,
}) {
  const isRed = card.suit === "♥" || card.suit === "♦";
  const isMobile = window.innerWidth < 768;
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        position: "relative",
        width: tableCard
        ? (isMobile ? "58px" : "95px")
        : (isMobile ? "42px" : "85px"),

        height: tableCard
        ? (isMobile ? "90px" : "140px")
        : (isMobile ? "65px" : "125px"),
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
        ? (playable ? 1 : 0.70)
        : 1,
        filter: highlightMode && !playable ? "grayscale(70%)" : "none",
        boxShadow: playable
          ? "0 4px 10px rgba(0,0,0,0.35)"
          : "0 2px 4px rgba(0,0,0,0.2)",
        transition:
          "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
        overflow: "hidden",
      }}
    >
      {/* Angolo alto */} 
      <div
        style={{
          fontSize: isMobile ? "12px" : "24px",
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
          fontSize: isMobile ? "16px" : "26px",
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
          fontSize: isMobile ? "11px" : "18px",
        }}
      >
        <div>{card.rank}</div>
        <div>{card.suit}</div>
      </div>
    </div>
  );
}