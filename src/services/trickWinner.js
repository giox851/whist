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
export function getTrickWinner(currentTrick, trumpSuit, leadSeat) {
  const leadCard = currentTrick[leadSeat];
  if (!leadCard) {
    return leadSeat;
  }
  const leadSuit = leadCard.suit;
  let winnerSeat = leadSeat;
  let winningCard = leadCard;
  const seats = ["seat1", "seat2", "seat3", "seat4"];
  for (const seat of seats) {
    const card = currentTrick[seat];
    if (!card) {
      continue;
    }
    if (seat === leadSeat) {
      continue;
    }
    const cardIsTrump = card.suit === trumpSuit;
    const winnerIsTrump = winningCard.suit === trumpSuit;
    if (cardIsTrump && !winnerIsTrump) {
      winnerSeat = seat;
      winningCard = card;
      continue;
    }
    if (cardIsTrump && winnerIsTrump) {
      if (rankValue[card.rank] > rankValue[winningCard.rank]) {
        winnerSeat = seat;
        winningCard = card;
      }
      continue;
    }
    if (winnerIsTrump && !cardIsTrump) {
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