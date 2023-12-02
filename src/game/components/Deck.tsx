import { Card, CardType } from "./Card";

enum Colors {
    red = "red",
    blue = "blue",
    green = "green",
    yellow = "yellow",
}

export type DeckType = {
    player: number,
    cards: CardType[],
    color: Colors,
}

const revealCard = () => {

}

export function Deck({ player, colors, count }: DeckType) {
    return (
        <Card color={newCard.color} number={newCard.number} onClick={() => revealCard} row={null} col={null} canBePlayed={null} isCard={true} />
    )

}