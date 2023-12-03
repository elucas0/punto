import { Card, CardType } from "./Card";

enum Colors {
    red = "red",
    blue = "blue",
    green = "green",
    yellow = "yellow",
}

export type DeckType = {
    player: number;
    color: Colors;
    cards: CardType[];
};

const revealCard = () => {
    // Logique pour révéler la première carte
    console.log("Card revealed!");
};

export function Deck({ player, color, cards }: DeckType) {
    // Vérifiez si le deck a des cartes
    if (cards.length === 0) {
        return <p>No cards in the deck</p>;
    }

    // Prenez la première carte du deck
    const firstCard = cards[0];

    return (
        <div>
            <h2>
                Player {player}'s {color} Deck
            </h2>
            <div>
                <p>First Card:</p>
                <Card {...firstCard} />
                <button onClick={revealCard}>Reveal Card</button>
            </div>
        </div>
    );
}
