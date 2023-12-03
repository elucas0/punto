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

// Créer un joueur
export const createPlayer = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    await pool.query("INSERT INTO players (name) VALUES (?)", [name]);

    res.status(201).json({ name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir tous les joueurs
export const getPlayers = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM players");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir un joueur par ID
export const getPlayerById = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM players WHERE player_id = ?",
      [req.params.playerId]
    );
    if (rows.length === 0) {
      res.status(404).json({ error: "Player not found" });
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un joueur
export const updatePlayer = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const [result] = await pool.query(
      "UPDATE players SET name = ? WHERE player_id = ?",
      [name, req.params.playerId]
    );
    const affectedRows = result.affectedRows;

    if (affectedRows === 0) {
      res.status(404).json({ error: "Player not found" });
    } else {
      res.status(200).json({ player_id: req.params.playerId, name });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un joueur
export const deletePlayer = async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM players WHERE player_id = ?",
      [req.params.playerId]
    );
    const affectedRows = result.affectedRows;

    if (affectedRows === 0) {
      res.status(404).json({ error: "Player not found" });
    } else {
      res.status(204).end();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
