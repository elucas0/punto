import { Deck, DeckType } from "./Deck"

type DeckSectionProps = {
    decks: DeckType[]
}

export function DeckSection({ decks }: DeckSectionProps) {
    return (         
        <section className="deck-section">
            {decks.map((deck, index) => (
                <Deck key={index} player={deck.player} color={deck.color} cards={deck.cards} />
            ))}
        </section>
    );
}