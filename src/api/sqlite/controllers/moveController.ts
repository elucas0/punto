import { Request, Response } from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Utilisez un fichier SQLite local, changez le chemin selon votre configuration
const dbPath = "path/to/your/sqlite.db";

// Créez une connexion SQLite
const db = await open({
  filename: dbPath,
  driver: sqlite3.Database,
});

// Créer un mouvement
export const createMove = async (req: Request, res: Response) => {
  try {
    const { gameId, player, move } = req.body;
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");

    await db.run(
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
    const rows = await db.all("SELECT * FROM moves WHERE game_id = ?", [
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
    const row = await db.get("SELECT * FROM moves WHERE move_id = ?", [
      req.params.moveId,
    ]);
    if (!row) {
      res.status(404).json({ error: "Move not found" });
    } else {
      res.status(200).json(row);
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

    const result = await db.run(
      "UPDATE moves SET player = ?, move = ?, date = ? WHERE move_id = ?",
      [player, move, date, req.params.moveId]
    );

    if (result.changes === 0) {
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
    const result = await db.run("DELETE FROM moves WHERE move_id = ?", [
      req.params.moveId,
    ]);

    if (result.changes === 0) {
      res.status(404).json({ error: "Move not found" });
    } else {
      res.status(204).end();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
