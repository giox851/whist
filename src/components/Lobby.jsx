export default function Lobby({
  tableCode,
  players,
  playerCount,
  message,
  copyInviteLink,
  leaveTable,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
        gap: "15px",
        fontFamily: "Arial",
      }}
    >
      <h1>TAVOLO {tableCode}</h1> <p>{message}</p> 
      <p>Giocatori presenti: {playerCount}/4</p> 
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "20px",
          width: "280px",
        }}
      >
        <p>1. {players.seat1?.name || "Libero"}</p> 
        <p>2. {players.seat2?.name || "Libero"}</p> 
        <p>3. {players.seat3?.name || "Libero"}</p> 
        <p>4. {players.seat4?.name || "Libero"}</p>
      </div>
       
      <button
        onClick={copyInviteLink}
        style={{
          width: "280px",
          padding: "12px",
          fontSize: "16px",
        }}
      >
        COPIA LINK INVITO
      </button>
       
      <button
        onClick={leaveTable}
        style={{
          width: "280px",
          padding: "12px",
          fontSize: "16px",
          backgroundColor: "#d32f2f",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ESCI DAL TAVOLO
      </button>
       
      <button
        disabled={playerCount < 4}
        style={{
          width: "280px",
          padding: "12px",
          fontSize: "16px",
          opacity: playerCount < 4 ? 0.5 : 1,
          cursor: playerCount < 4 ? "not-allowed" : "pointer",
        }}
      >
        INIZIA PARTITA
      </button>
    </div>
  );
}