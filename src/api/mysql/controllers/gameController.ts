import { Request, Response } from "express";
import { createPool, Pool } from "mysql2/promise";

const pool: Pool = createPool({
  host: "localhost",
  user: "root",
  password: "U!ZJvq?5aFPN",
  database: "games",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Créer une partie
export const createGame = async (req: Request, res: Response) => {
  try {
    const { players, moves } = req.body;
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");

    await pool.query(
      "INSERT INTO games (players, moves, date) VALUES (?, ?, ?)",
      [players, JSON.stringify(moves), date]
    );

    res.status(201).json({ players, moves, date });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir toutes les parties
export const getGames = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        games.*, 
        GROUP_CONCAT(DISTINCT player_names.name) AS players,
        winner.name AS winner,
        COUNT(moves.id) AS moves
      FROM 
        games 
      LEFT JOIN 
        players AS winner ON games.winner = winner.id 
      LEFT JOIN 
        moves ON games.id = moves.game_id
      LEFT JOIN 
        players AS player_names ON moves.player_id = player_names.id
      GROUP BY 
        games.id, winner.name;
    `
    );
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir une partie par ID
export const getGameById = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM games WHERE game_id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      res.status(404).json({ error: "Game not found" });
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
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");

    const [result] = await pool.query(
      "UPDATE games SET players = ?, moves = ?, date = ? WHERE game_id = ?",
      [players, JSON.stringify(moves), date, req.params.id]
    );
    const affectedRows = result.affectedRows;

    if (affectedRows === 0) {
      res.status(404).json({ error: "Game not found" });
    } else {
      res.status(200).json({ game_id: req.params.id, players, moves, date });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer une partie
export const deleteGame = async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query("DELETE FROM games WHERE game_id = ?", [
      req.params.id,
    ]);
    const affectedRows = result.affectedRows;

    if (affectedRows === 0) {
      res.status(404).json({ error: "Game not found" });
    } else {
      res.status(204).end();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
