import { Button, ButtonGroup, Input } from '@material-tailwind/react';
import { useState } from 'react';
import { Game, Move } from './components/Game';
import { DbSelector, DbType } from './components/DbSelector';

export type GameState = 'menu' | 'game' | 'end';

export type GameData = {
    players: string[],
    moves: Move[]
    winner?: string;
    date?: Date;
}

export function MainMenu({ selectedDb, setSelectedDb }: { selectedDb: DbType, setSelectedDb: (dbName: DbType) => void }) {
    const [gameState, setGameState] = useState<GameState>('menu')
    const [playerCount, setPlayerCount] = useState<number>(2)
    const [gameData, setGameData] = useState<GameData>({
        players: [],
        moves: [],
    })
    const [dbPort, setDbPort] = useState<number>(3000);

    const handleStartGame = () => {
        for (let i = 0; i < playerCount; i++) {
            if (!gameData.players[i]) {
                alert(`Veuillez renseigner le nom du joueur ${i + 1}`);
                return;
            }
        }
        setGameState('game');
    };

    const handlePlayerNameChange = (index: number, newName: string) => {
        setGameData((prevGameData) => {
            const newPlayers = [...prevGameData.players];
            newPlayers[index] = newName;
            return { ...prevGameData, players: newPlayers };
        });
    };

    const handleSendToAPI = () => {
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
        fetch(`http://localhost:${dbPort}/api/games`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(gameData),
        })
            .then(response => response.json())
            .then(data => console.log('API Response:', data))
            .catch(error => console.error('Error sending data to API:', error));
    };

    return (
        <>
            {gameState == 'menu' && (
                <div className='flex flex-col items-center gap-3'>
                    <p className='text-xl font-poppinslight text-white'>Choisissez le nombre de joueurs</p>
                    <ButtonGroup color="purple" variant="gradient">
                        <Button className='text-lg font-poppinslight' onClick={() => setPlayerCount(2)}>2</Button>
                        <Button className='text-lg font-poppinslight' onClick={() => setPlayerCount(3)}>3</Button>
                        <Button className='text-lg font-poppinslight' onClick={() => setPlayerCount(4)}>4</Button>
                    </ButtonGroup>
                    <p className='font-poppinslight text-lg text-white'>{playerCount} joueurs</p>
                    {[...Array(playerCount)].map((_, index) => (
                        <Input
                            key={index}
                            type="text"
                            placeholder={`Pseudo du Joueur ${index + 1}`}
                            onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                            crossOrigin={undefined} />
                    ))}
                    <Button variant="gradient" className="flex items-center gap-2 font-poppins text-lg" color="yellow" onClick={handleStartGame} >
                        Lancer
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                        </svg>
                    </Button>
                </div>
            )}
            {gameState == 'game' && (
                <Game gameData={gameData} setGameData={setGameData} playerCount={playerCount} setGameState={setGameState} />
            )}
            {gameState === 'end' && (
                <div className='flex flex-col items-center gap-9'>
                    <p className='text-xl font-poppinslight text-white'>{gameData.winner} a gagné la partie !</p>
                    <Button
                        variant='gradient'
                        className='flex items-center gap-2 font-poppins text-lg'
                        color='yellow'
                        onClick={() => setGameState('menu')}
                    >
                        Rejouer
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke-width='1.5'
                            stroke='currentColor'
                            className='w-6 h-6'
                        >
                            <path stroke-linecap='round' stroke-linejoin='round' d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99' />
                        </svg>
                    </Button>
                    <DbSelector selectedDb={selectedDb} setSelectedDb={setSelectedDb} />
                    <Button
                        variant='gradient'
                        className='flex items-center gap-2 font-poppins text-lg'
                        color='green'
                        onClick={handleSendToAPI}
                    >
                        Envoyer en base
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </Button>
                </div>
            )}
        </>
    );
}