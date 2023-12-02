import { useEffect, useState } from 'react';
import { Card, CardType } from './Card';
import { Case } from './Case';
import { DeckSection } from './DeckSection';
import { DeckType } from './Deck';

export type CaseType = {
    row: number | null,
    col: number | null,
    color: Colors | "gray",
    number: number,
    canBePlayed: boolean | null,
    isCard: boolean,
}

type Move = {
    row: number,
    col: number,
    color: Colors,
    player: number,
    round: number,
}

enum Colors {
    red = "red",
    blue = "blue",
    green = "green",
    yellow = "yellow",
}

const mainDeck: CardType[] = [];
const moves: Move[] = [];
const maxSideSize = 6;

// Fonction pour générer les cartes du jeu : 72 cartes de 4 couleurs différentes (2 séries de 1-9 par couleur)
const generateDeck = () => {
    for (let i = 0; i < 2; i++) {
        for (const color of Object.values(Colors)) {
            for (let j = 1; j <= 9; j++) {
                mainDeck.push({ row: null, col: null, color, number: j, canBePlayed: null, isCard: true, onClick: () => { } });
            }
        }
    }
    return mainDeck;
}

// Fonction pour générer la grille initiale en fonction de la taille donnée
const generateInitialGrid = (size: number): CaseType[][] => {
    const initialGrid: CaseType[][] = [];
    for (let i = 0; i < size; i++) {
        initialGrid[i] = [];
        for (let j = 0; j < size; j++) {
            initialGrid[i][j] = { row: i, col: j, color: "gray", number: 0, canBePlayed: false, isCard: false };
        }
    }
    initialGrid[Math.floor(size / 2)][Math.floor(size / 2)] = { row: Math.floor(size / 2), col: Math.floor(size / 2), color: "gray", number: 0, canBePlayed: true, isCard: false };
    return initialGrid;
};

export function Game() {
    const [gridSize, setGridSize] = useState(9);
    const [grid, setGrid] = useState<CaseType[][]>(generateInitialGrid(gridSize));
    const [mainDeck, setMainDeck] = useState<CardType[]>(generateDeck());
    const [round, setRound] = useState<number>(0);
    const [playerCount, setPlayerCount] = useState<number>(2);

    const isWon = (row: number, col: number, card: CaseType) => {
        const directions = [
            [0, 1],  // Horizontal
            [1, 0],  // Vertical
            [1, 1],  // Diagonale principale
            [1, -1], // Diagonale inverse
        ];
        for (const [dx, dy] of directions) {
            let count = 1; // Compteur initialisé à 1 pour inclure la dernière carte jouée
            // Vérification dans une direction positive (vers le bas ou vers la droite)
            for (let i = 1; i < 6; i++) {
                const newRow = row + i * dx;
                const newCol = col + i * dy;
                // Vérifier que les coordonnées sont valides
                if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 6) {
                    if (grid[newRow][newCol].color === card.color) {
                        count++; // Incrémenter le compteur si la carte suivante a la même couleur
                    } else {
                        break; // Sortir de la boucle si une carte de couleur différente est trouvée
                    }
                } else {
                    break; // Sortir de la boucle si les coordonnées sont hors limites du tableau
                }
            }
            // Vérification dans une direction négative (vers le haut ou vers la gauche)
            for (let i = 1; i < 6; i++) {
                const newRow = row - i * dx;
                const newCol = col - i * dy;
                // Vérifier que les coordonnées sont valides
                if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 6) {
                    if (grid[newRow][newCol].color === card.color) {
                        count++; // Incrémenter le compteur si la carte précédente a la même couleur
                    } else {
                        break; // Sortir de la boucle si une carte de couleur différente est trouvée
                    }
                } else {
                    break; // Sortir de la boucle si les coordonnées sont hors limites du tableau
                }
            }

            if (count >= 4) {
                return true; // Gagnant trouvé si au moins 4 cartes de même couleur sont alignées
            }
        }

        return false; // Aucun gagnant trouvé dans les directions spécifiées
    };

    const playCard = (card: CaseType, i: number, j: number) => {
        if (card.number > grid[i][j].number) {
            const newGrid = [...grid];
            newGrid[i][j] = card;

            // Vérifie les cases adjacentes pour chaque case
            const directions = [
                { row: i - 1, col: j }, // case à gauche
                { row: i + 1, col: j }, // case à droite
                { row: i, col: j - 1 }, // case au-dessus
                { row: i, col: j + 1 }, // case en-dessous
                { row: i - 1, col: j - 1 }, // diagonale haut-gauche
                { row: i - 1, col: j + 1 }, // diagonale haut-droite
                { row: i + 1, col: j - 1 }, // diagonale bas-gauche
                { row: i + 1, col: j + 1 }, // diagonale bas-droite
            ];

            for (const dir of directions) {
                const { row, col } = dir;
                if (row >= 0 && row < gridSize && col >= 0 && col < gridSize && !newGrid[row][col].isCard) {
                    newGrid[row][col].canBePlayed = true;
                }
            }

            setGrid(newGrid);
            generateNewCard();
            setRound(round + 1);
            if (isWon(i, j, card)) {
                alert(`Player ${round % playerCount + 1} won!`);
            }
        }
    }

    const generateNewCard = (() => {
        const color = Object.values(Colors)[Math.floor(Math.random() * 4)];
        const number = Math.floor(Math.random() * 9) + 1;
        setNewCard({ color, number, row: null, col: null, canBePlayed: null, isCard: true });
    });

    const color = Object.values(Colors)[Math.floor(Math.random() * 4)];
    const number = Math.floor(Math.random() * 9) + 1;
    const [newCard, setNewCard] = useState<CaseType>({ color, number, row: null, col: null, canBePlayed: null, isCard: true });

    const distributeDeck = (mainDeck: CardType[], colorsPerPlayer: number, neutralCount?: number): DeckType[] => {
        const playersDecks: DeckType[] = Array.from({ length: playerCount }, (_, index) => ({
            player: index + 1,
            cards: [],
            color: "gray",
        }));

        // Distribuer les cartes de chaque couleur aux joueurs
        const nonNeutralColors = Object.values(Colors).filter(color => color !== DefaultColor.white);
        for (const color of nonNeutralColors) {
            for (let i = 0; i < playerCount; i++) {
                const playerDeck = playersDecks[i];
                const cardsToDistribute = mainDeck.filter((card) => card.color === color);
                playerDeck.cards.push(...cardsToDistribute);
                playerDeck.color = color;
                mainDeck = mainDeck.filter((card) => !cardsToDistribute.includes(card));
            }
        }

        // Distribuer les cartes de la couleur neutre (le cas échéant)
        if (neutralCount !== undefined) {
            const neutralCards = mainDeck.filter((card) => card.color === DefaultColor.white);
            for (let i = 0; i < playerCount; i++) {
                const playerDeck = playersDecks[i];
                playerDeck.cards.push(...neutralCards.slice(i * neutralCount, (i + 1) * neutralCount));
                playerDeck.color = DefaultColor.white;
            }
        }
        return playersDecks;
    };

    const shuffleDeck = () => {
        switch (playerCount) {
            // chaque joueur reçoit toutes les cartes de 2 couleurs.
            case 2:
                return distributeDeck(mainDeck, 2);
            // chaque joueur reçoit toutes les cartes d’une couleur et 6 cartes de la quatrième couleur, la couleur neutre
            case 3:
                return distributeDeck(mainDeck, 1, 6);
            // chaque joueur reçoit toutes les cartes d’une couleur.
            case 4:
                return distributeDeck(mainDeck, 1);
            default:
                throw new Error("Nombre de joueurs non pris en charge");
        }
    };


    return (
        <>
            <div className='flex justify-center text-lg font-poppins text-white gap-10'>
                <p>Tour {round}</p>
                <p>Au tour du joueur {round % playerCount + 1}</p>
            </div><main className='flex justify-center items-center'>
                <div className="flex">
                    {grid.map((row, i) => (
                        <div key={i}>
                            {row.map((column, j) => (
                                <div key={j}>
                                    {!grid[i][j].isCard ? <Case row={i} col={j} color='gray' number={grid[i][j].number} onClick={() => playCard(newCard, i, j)} canBePlayed={grid[i][j].canBePlayed} isCard={false} /> :
                                        <Card color={grid[i][j].color} number={grid[i][j].number} onClick={() => playCard(newCard, i, j)} row={i} col={j} canBePlayed={grid[i][j].canBePlayed} isCard={true} />}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </main>
            <div>
                <button className='bg-gray-400' onClick={generateNewCard}>Get new card</button>
                {/* <Card color={newCard.color} number={newCard.number} onClick={() => revealCard} row={null} col={null} canBePlayed={null} isCard={true} /> */}
                <DeckSection decks={shuffleDeck()} />
            </div>
            <div className='border-red-500'></div>
            <div className='border-green-500'></div>
            <div className='border-blue-500'></div>
            <div className='border-yellow-500'></div>
            <div className='border-gray-800'></div>
            <div className='bg-gray-700'></div></>
    );
}