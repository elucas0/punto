import { Request, Response } from 'express';
import { Game } from '../models/gameModel';

// Créer une partie
export const createGame = async (req: Request, res: Response) => {
  try {
    const newGame = new Game(req.body);
    const savedGame = await newGame.save();
    res.status(201).json(savedGame);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir toutes les parties
export const getGames = async (_req: Request, res: Response) => {
  try {
    const games = await Game.find();
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir une partie par ID
export const getGameById = async (req: Request, res: Response) => {
  try {
    const game = await Game.findById(req.params.id);
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour une partie
export const updateGame = async (req: Request, res: Response) => {
  try {
    const updatedGame = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedGame);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer une partie
export const deleteGame = async (req: Request, res: Response) => {
  try {
    await Game.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
