import cors from "cors";
import express from "express";
import sqlite3 from "sqlite3";
import { gameRoutes } from "./routes/gameRoutes";
import { playerRoutes } from "./routes/playerRoutes";
import { moveRoutes } from "./routes/moveRoutes";

const app = express();
const port = 3002;

const db = new sqlite3.Database('./games.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the games database.');
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      winner INTEGER,
      date TEXT
      FOREIGN KEY (winner) REFERENCES players(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS moves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER,
      player_id INTEGER,
      card_row INTEGER,
      card_col INTEGER,
      color TEXT,
      number INTEGER,
      round INTEGER,
      FOREIGN KEY (game_id) REFERENCES games(id),
      FOREIGN KEY (player_id) REFERENCES players(id)
    )
  `);
});

app.use(express.json());
app.use(cors());

app.use("/api/games", gameRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/moves", moveRoutes);

app.listen(port, () => {
  console.log(`SQLite server running on port ${port}`);
});
