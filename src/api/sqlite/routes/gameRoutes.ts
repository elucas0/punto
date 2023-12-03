import express from 'express';
import { createGame, deleteGame, getGameById, getGames, updateGame } from '../controllers/gameController';

export const gameRoutes = express.Router();

gameRoutes.post('/', createGame);
gameRoutes.get('/', getGames);
gameRoutes.get('/:id', getGameById);
gameRoutes.put('/:id', updateGame);
gameRoutes.delete('/:id', deleteGame);
