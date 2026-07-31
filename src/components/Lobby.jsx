export default function Lobby({
  tableCode,
  players,
  playerCount,
  message,
  copyInviteLink,
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
        disabled={playerCount < 4}
        style={{
          width: "280px",
          padding: "12px",
          fontSize: "16px",
        }}
      >
        INIZIA PARTITA
      </button>
    </div>
  );
}