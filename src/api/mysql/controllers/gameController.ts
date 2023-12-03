import { Request, Response } from 'express';
import { createPool, Pool } from 'mysql2/promise';

const pool: Pool = createPool({
  host: 'localhost',
  user: 'root', // Change with your MySQL username
  password: 'password', // Change with your MySQL password
  database: 'games',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Créer une partie
export const createGame = async (req: Request, res: Response) => {
  try {
    const { players, moves } = req.body;
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    await pool.query('INSERT INTO games (players, moves, date) VALUES (?, ?, ?)', [players, JSON.stringify(moves), date]);

    res.status(201).json(req.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir toutes les parties
export const getGames = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM games');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir une partie par ID
export const getGameById = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM games WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Game not found' });
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour une partie
export const updateGame = async (req: Request, res: Response) => {
  try {
    const { players, moves } = req.body;
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const [result] = await pool.query('UPDATE games SET players = ?, moves = ?, date = ? WHERE id = ?', [players, JSON.stringify(moves), date, req.params.id]);
    const affectedRows = result.affectedRows;

    if (affectedRows === 0) {
      res.status(404).json({ error: 'Game not found' });
    } else {
      res.status(200).json({ id: req.params.id, ...req.body });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer une partie
export const deleteGame = async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query('DELETE FROM games WHERE id = ?', [req.params.id]);
    const affectedRows = result.affectedRows;

    if (affectedRows === 0) {
      res.status(404).json({ error: 'Game not found' });
    } else {
      res.status(204).end();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
