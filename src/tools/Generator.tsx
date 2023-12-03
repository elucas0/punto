import { useEffect, useState } from "react";
import { DbSelector, DbType } from "../game/components/DbSelector";
import { Move } from "../game/components/Game";

export function Generator({ selectedDb, setSelectedDb }: { selectedDb: DbType, setSelectedDb: (dbName: DbType) => void }) {
    const [players, setPlayers] = useState<number>(2);
    const [numberOfGames, setNumberOfGames] = useState<number>(1);
    const [numberOfMoves, setNumberOfMoves] = useState<number>(1);
    const [dbPort, setDbPort] = useState<number>(3000);

    useEffect(() => {
        if (!selectedDb) {
            return;
        } else {
            switch (selectedDb) {
                case "MongoDB":
                    setDbPort(3000);
                    break;
                case "MySQL":
                    setDbPort(3001);
                    break;
                case "SQLite":
                    setDbPort(3002);
                    break;
            }
        }
    }, [selectedDb]);

    const generateRandomGameMongo = () => {
        const playersList = Array.from({ length: players }, (_, index) => `Joueur ${index + 1}`);
        const movesList: Move[] = Array.from({ length: numberOfMoves }, (_, index) => ({
            player: playersList[Math.floor(Math.random() * players)],
            coordinates: { row: Math.floor(Math.random() * 5) + 1, col: Math.floor(Math.random() * 5) + 1 },
            color: ["red", "blue", "green", "yellow"][Math.floor(Math.random() * 4)],
            number: Math.floor(Math.random() * 9) + 1,
            round: index + 1,
        }));

        return {
            players: playersList,
            moves: movesList,
        };
    };

    const generateRandomGameMySQL = () => {
    }

    const sendRandomGamesMongo = async () => {
        try {
            const gamesData = generateRandomGameMongo();
            const response = await fetch(`http://localhost:${dbPort}/api/games`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(gamesData),
            });

            if (response.ok) {
                console.log("Random games generated successfully!");
            } else {
                console.error("Error generating random games:", response.statusText);
            }
        } catch (error) {
            console.error("Error generating random games:", error);
        }
    };

    const sendRandomGamesMySQL = async () => {
    }

    const handleClick = () => {
        switch (selectedDb) {
            case "MongoDB":
                sendRandomGamesMongo();
                break;
            case "MySQL":
                sendRandomGamesMySQL();
                break;
        }
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <h1 className="font-poppinslight text-white text-xl">Générateur de parties</h1>
            <DbSelector selectedDb={selectedDb} setSelectedDb={setSelectedDb} />
            <p>Nombre de parties</p>
            <input
                type="number"
                className="w-1/2 h-10 rounded-lg bg-blue-gray-50/50 text-white text-center"
                placeholder="Nombre de parties à générer"
                min={1}
                value={numberOfGames}
                onChange={(e) => setNumberOfGames(parseInt(e.target.value))}
            />
            <p>Nombre de joueurs</p>
            <input
                type="number"
                className="w-1/2 h-10 rounded-lg bg-blue-gray-50/50 text-white text-center"
                placeholder="Nombre de joueurs"
                min={2}
                max={4}
                value={players}
                onChange={(e) => setPlayers(parseInt(e.target.value))}
            />
            <p>Nombre de mouvements</p>
            <input
                type="number"
                className="w-1/2 h-10 rounded-lg bg-blue-gray-50/50 text-white text-center"
                placeholder="Nombre de mouvements"
                min={5}
                max={10}
                value={numberOfMoves}
                onChange={(e) => setNumberOfMoves(parseInt(e.target.value))}
            />
            <button
                className="w-1/2 h-10 bg-gradient-to-r from-blue-500 to-blue-800 text-white rounded-lg"
                onClick={handleClick}
            >
                Générer
            </button>
        </div>
    );
}
