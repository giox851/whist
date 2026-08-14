const TEST_MODE = true;
const CARDS_PER_PLAYER = TEST_MODE ? 1 : 13;
export function createDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const ranks = [
    "A",
    "K",
    "Q",
    "J",
    "10",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
  ];
  const deck = [];
  suits.forEach((suit) => {
    ranks.forEach((rank) => {
      deck.push({
        rank,
        suit,
        code: `${rank}${suit}`,
      });
    });
  });
  return deck;
}
export function shuffleDeck(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
export function dealCards(deck) {
  return {
    seat1: deck.slice(0, CARDS_PER_PLAYER),
    seat2: deck.slice(CARDS_PER_PLAYER, CARDS_PER_PLAYER * 2),
    seat3: deck.slice(CARDS_PER_PLAYER * 2, CARDS_PER_PLAYER * 3),
    seat4: deck.slice(CARDS_PER_PLAYER * 3, CARDS_PER_PLAYER * 4),
  };
}