import { Button, ButtonGroup } from '@material-tailwind/react';
import { useState } from 'react';
import { Game } from './components/Game';

type GameState = 'menu' | 'game' | 'end';


export function MainMenu() {
    const [gameState, setGameState] = useState<GameState>('menu')
    const [playerCount, setPlayerCount] = useState<number>(2)


    return (
        <>
            {gameState == 'menu' && (
                <div className='flex flex-col items-center gap-3'>
                    <p className='text-xl font-poppinslight text-white'>Choisissez le nombre de joueurs</p>
                    <ButtonGroup color="purple" variant="gradient" size='lg'>
                        <Button className='text-lg font-poppinslight' onClick={() => setPlayerCount(2)}>2</Button>
                        <Button className='text-lg font-poppinslight' onClick={() => setPlayerCount(3)}>3</Button>
                        <Button className='text-lg font-poppinslight' onClick={() => setPlayerCount(4)}>4</Button>
                    </ButtonGroup>
                    <p className='font-poppinslight text-lg text-white'>{playerCount} joueurs</p>
                    <Button variant="gradient" className="flex items-center gap-2 font-poppins text-lg" color="yellow" onClick={() => setGameState('game')} >
                        Lancer
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                        </svg>
                    </Button>
                </div>
            )}
            {gameState == 'game' && (
                <Game />
            )}
            {gameState == 'end' && (
                <div className='flex flex-col items-center gap-9'>
                    <p className='text-2xl'>Fin de la partie</p>
                    <button onClick={() => setGameState('menu')}>Rejouer</button>
                </div>
            )}
        </>
    )
}