import { ArrowPathIcon, PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { Card, Typography, Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, IconButton } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { DbSelector, DbType } from "../game/components/DbSelector";


const TABLE_HEAD = ["ID", "Joueurs", "Coups", "Date", "Gagnant", "", ""];

export function History({ selectedDb, setSelectedDb }: { selectedDb: DbType, setSelectedDb: (dbName: DbType) => void }) {
    const [gameData, setGameData] = useState<any[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [editingPlayers, setEditingPlayers] = useState<string[]>([]);
    const [editingDate, setEditingDate] = useState<string>("");
    const [editingGameId, setEditingGameId] = useState<string>("");
    const [editingWinner, setEditingWinner] = useState<string>("");
    const [dbPort, setDbPort] = useState<number>();

    const handleOpen = (gameId: string) => {
        setOpen(!open)
        setEditingGameId(gameId)
    };

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

    const fetchGames = (): void => {

        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:${dbPort}/api/games`);
                const data = await response.json();
                if (dbPort != 3000) {
                    data.forEach((game: any) => {
                        game._id = game.id;
                        game.players = game.players.split(", ");
                        delete game.id;
                    });
                }
                setGameData(data);
            } catch (error) {
                console.error("Error fetching game data:", error);
            }
        };

        fetchData();
    };

    const updateGame = async (gameId: string): Promise<void> => {
        try {
            // Utilisez la méthode PUT pour mettre à jour la partie
            const response = await fetch(`http://localhost:${dbPort}/api/games/${gameId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    players: editingPlayers,
                    date: editingDate,
                }),
            });

            if (response.ok && selectedDb) {
                fetchGames();
                setOpen(!open);
            } else {
                console.error("Error updating game:", response.statusText);
            }
        } catch (error) {
            console.error("Error updating game:", error);
        }
    };

    const deleteGame = async (gameId: string): Promise<void> => {
        try {
            // Utilisez la méthode DELETE pour supprimer la partie
            const response = await fetch(`http://localhost:${dbPort}/api/games/${gameId}`, {
                method: "DELETE",
            });

            if (response.ok && selectedDb) {
                // Si la suppression réussit, mettez à jour l'état des données
                fetchGames();
            } else {
                console.error("Error deleting game:", response.statusText);
            }
        } catch (error) {
            console.error("Error deleting game:", error);
        }
    };

    useEffect(() => {
        if (open && gameData.length > 0) {
            const selectedGame = gameData.find((game) => game._id === editingGameId);

            if (selectedGame) {
                setEditingPlayers(selectedGame.players);
                setEditingDate(selectedGame.date);
                setEditingWinner(selectedGame.winner);
            }
        }
    }, [open, editingGameId, gameData, selectedDb]);

    return (
        <div className="flex flex-col items-center gap-4">
            <h1 className="font-poppinslight text-white text-xl">Historique des parties</h1>
            <div className="flex gap-5">
                <DbSelector selectedDb={selectedDb} setSelectedDb={setSelectedDb} />
                <IconButton color="yellow" onClick={() => fetchGames()}>
                    <ArrowPathIcon className="w-5 h-5" />
                </IconButton>
            </div>
            <Card className="h-full w-full overflow-scroll">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                    >
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {gameData.map(({ _id, players, moves, date, winner }, index) => (
                            <tr key={_id} className={index % 2 === 0 ? "bg-blue-gray-50/50" : ""}>
                                <td className="p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {_id}
                                    </Typography>
                                </td>
                                <td className="p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {players.join(", ")}
                                    </Typography>
                                </td>
                                <td className="p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {moves.length}
                                    </Typography>
                                </td>
                                <td className="p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {new Date(date).toLocaleDateString()}
                                    </Typography>
                                </td>
                                <td className="p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {winner}
                                    </Typography>
                                </td>
                                <td className="p-4">
                                    <Typography as="a" href="#" variant="small" color="blue-gray" className="font-medium" onClick={() => handleOpen(_id)}>
                                        <PencilIcon className="w-5 h-5" />
                                    </Typography>
                                </td>
                                <td className="p-4">
                                    <Typography as="a" href="#" variant="small" color="blue-gray" className="font-medium" onClick={() => deleteGame(_id)}>
                                        <TrashIcon className="w-5 h-5 text-red-500" />
                                    </Typography>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Édition</DialogHeader>
                <DialogBody>
                    <Input
                        type="text"
                        color="purple"
                        label="Joueurs"
                        value={editingPlayers.join(", ")}
                        onChange={(e) => setEditingPlayers(e.target.value.split(", "))}
                        crossOrigin={undefined}
                    />
                    <Input
                        type="text"
                        color="purple"
                        label="Date"
                        value={editingDate}
                        onChange={(e) => setEditingDate(e.target.value)}
                        crossOrigin={undefined}
                    />
                    <Input
                        type="text"
                        color="purple"
                        label="Gagnant"
                        value={editingWinner}
                        onChange={(e) => setEditingWinner(e.target.value)}
                        crossOrigin={undefined}
                    />
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={() => setOpen(!open)}
                        className="mr-1"
                    >
                        <span>Annuler</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={() => updateGame(editingGameId)}>
                        <span>Valider</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
}
