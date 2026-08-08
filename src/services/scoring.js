export function calculateScores(bids, tricksWon, currentScores = {}) {
  const updatedScores = {
    ...currentScores,
  };
  const seats = ["seat1", "seat2", "seat3", "seat4"];
  seats.forEach((seat) => {
    const bid = bids[seat] || 0;
    const tricks = tricksWon[seat] || 0;
    const points = tricks === bid ? tricks + 10 : tricks;
    updatedScores[seat] = (updatedScores[seat] || 0) + points;
  });
  return updatedScores;
}