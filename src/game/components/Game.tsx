import { useState } from 'react';
import { Card } from './Card';
import { Case } from './Case';

export type CaseType = {
    row: number | null,
    col: number | null,
    color: Colors | "slate",
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

const deck: CaseType[] = [];
const moves: Move[] = [];
const maxSideSize = 6;

const revealCard = () => {

}

// Fonction pour générer la grille initiale en fonction de la taille donnée
const generateInitialGrid = (size: number): CaseType[][] => {
    const initialGrid: CaseType[][] = [];
    for (let i = 0; i < size; i++) {
        initialGrid[i] = [];
        for (let j = 0; j < size; j++) {
            initialGrid[i][j] = { row: i, col: j, color: "slate", number: 0, canBePlayed: false, isCard: false };
        }
    }
    initialGrid[Math.floor(size / 2)][Math.floor(size / 2)] = { row: Math.floor(size / 2), col: Math.floor(size / 2), color: "slate", number: 0, canBePlayed: true, isCard: false };
    return initialGrid;
};

export function Game() {
    const [gridSize, setGridSize] = useState(9);
    const [grid, setGrid] = useState<CaseType[][]>(generateInitialGrid(gridSize));
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
        console.log(card, i, j)
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
                    console.log(`Case adjacente à la case placée : ${newGrid[row][col]}`);
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

    return (
        <><div>
            <p>Nombre de joueurs:</p>
            <input name="playerCount" type='number' min={2} max={4} placeholder='Nombre de joueurs' value={playerCount} onChange={e => setPlayerCount(parseInt(e.target.value))}></input>
            <p>Tour {round}</p>
            <p>Au tour du joueur {round % playerCount + 1}</p>
        </div><main className='flex justify-center items-center'>
                <div className="flex">
                    {grid.map((row, i) => (
                        <div key={i}>
                            {row.map((column, j) => (
                                <div key={j}>
                                    {!grid[i][j].isCard ? <Case row={i} col={j} color='slate' number={grid[i][j].number} onClick={() => playCard(newCard, i, j)} canBePlayed={grid[i][j].canBePlayed} isCard={false} /> :
                                        <Card color={grid[i][j].color} number={grid[i][j].number} onClick={() => playCard(newCard, i, j)} row={i} col={j} canBePlayed={grid[i][j].canBePlayed} isCard={true} />}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </main><div>
                <button className='bg-gray-400' onClick={generateNewCard}>Get new card</button>
                <Card color={newCard.color} number={newCard.number} onClick={() => revealCard} row={null} col={null} canBePlayed={null} isCard={true} />
            </div><div className='border-red-500'></div><div className='border-green-500'></div><div className='border-blue-500'></div><div className='border-yellow-500'></div><div className='border-slate-800'></div><div className='bg-slate-200'></div></>
    );
}