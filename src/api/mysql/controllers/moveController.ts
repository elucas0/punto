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

// Créer un mouvement
export const createMove = async (req: Request, res: Response) => {
  try {
    const { gameId, player, move } = req.body;
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");

    await pool.query(
      "INSERT INTO moves (game_id, player, move, date) VALUES (?, ?, ?, ?)",
      [gameId, player, move, date]
    );

    res.status(201).json({ gameId, player, move, date });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir tous les mouvements d'une partie
export const getMovesByGameId = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM moves WHERE game_id = ?", [
      req.params.gameId,
    ]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir un mouvement par ID
export const getMoveById = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM moves WHERE move_id = ?", [
      req.params.moveId,
    ]);
    if (rows.length === 0) {
      res.status(404).json({ error: "Move not found" });
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un mouvement
export const updateMove = async (req: Request, res: Response) => {
  try {
    const { player, move } = req.body;
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");

    const [result] = await pool.query(
      "UPDATE moves SET player = ?, move = ?, date = ? WHERE move_id = ?",
      [player, move, date, req.params.moveId]
    );
    const affectedRows = result.affectedRows;

    if (affectedRows === 0) {
      res.status(404).json({ error: "Move not found" });
    } else {
      res.status(200).json({ move_id: req.params.moveId, player, move, date });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un mouvement
export const deleteMove = async (req: Request, res: Response) => {
  try {
    const [result] = await pool.query("DELETE FROM moves WHERE move_id = ?", [
      req.params.moveId,
    ]);
    const affectedRows = result.affectedRows;

    if (affectedRows === 0) {
      res.status(404).json({ error: "Move not found" });
    } else {
      res.status(204).end();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
