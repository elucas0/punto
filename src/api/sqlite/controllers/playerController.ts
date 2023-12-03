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

// Créer un joueur
export const createPlayer = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    await db.run("INSERT INTO players (name) VALUES (?)", [name]);

    res.status(201).json({ name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir tous les joueurs
export const getPlayers = async (_req: Request, res: Response) => {
  try {
    const rows = await db.all("SELECT * FROM players");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir un joueur par ID
export const getPlayerById = async (req: Request, res: Response) => {
  try {
    const row = await db.get("SELECT * FROM players WHERE player_id = ?", [
      req.params.playerId
    ]);
    if (!row) {
      res.status(404).json({ error: "Player not found" });
    } else {
      res.status(200).json(row);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un joueur
export const updatePlayer = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const result = await db.run(
      "UPDATE players SET name = ? WHERE player_id = ?",
      [name, req.params.playerId]
    );
    const affectedRows = result.changes;

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
    const result = await db.run(
      "DELETE FROM players WHERE player_id = ?",
      [req.params.playerId]
    );
    const affectedRows = result.changes;

    if (affectedRows === 0) {
      res.status(404).json({ error: "Player not found" });
    } else {
      res.status(204).end();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
