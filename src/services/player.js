export function getPlayerId() {
  let playerId = localStorage.getItem("playerId");
  if (!playerId) {
    playerId = crypto.randomUUID();
    localStorage.setItem("playerId", playerId);
  }
  return playerId;
}