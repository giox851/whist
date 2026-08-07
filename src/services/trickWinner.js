const rankValue = {
  A: 13,
  K: 12,
  Q: 11,
  J: 10,
  10: 9,
  9: 8,
  8: 7,
  7: 6,
  6: 5,
  5: 4,
  4: 3,
  3: 2,
  2: 1,
};
export function getTrickWinner(currentTrick, trumpSuit) {
  const seats = Object.keys(currentTrick);
  const leadSuit = currentTrick[seats[0]].suit;
  let winnerSeat = seats[0];
  let winningCard = currentTrick[winnerSeat];
  for (const seat of seats.slice(1)) {
    const card = currentTrick[seat];
    const challengerTrump = card.suit === trumpSuit;
    const winnerTrump = winningCard.suit === trumpSuit;
    if (challengerTrump && !winnerTrump) {
      winnerSeat = seat;
      winningCard = card;
      continue;
    }
    if (challengerTrump && winnerTrump) {
      if (rankValue[card.rank] > rankValue[winningCard.rank]) {
        winnerSeat = seat;
        winningCard = card;
      }
      continue;
    }
    if (winnerTrump && !challengerTrump) {
      continue;
    }
    if (card.suit === leadSuit && winningCard.suit === leadSuit) {
      if (rankValue[card.rank] > rankValue[winningCard.rank]) {
        winnerSeat = seat;
        winningCard = card;
      }
    }
  }
  return winnerSeat;
}