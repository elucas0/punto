import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();
const port = 3000;

// Connectez-vous à la base de données SQLite (ou créez-la si elle n'existe pas)
const db = new sqlite3.Database('games.db');

// Créez la table des joueurs s'il n'existe pas
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    )
  `);

  // Créez la table des parties s'il n'existe pas
  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT
    )
  `);

  // Créez la table des mouvements s'il n'existe pas
  db.run(`
    CREATE TABLE IF NOT EXISTS moves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gameId INTEGER,
      playerId INTEGER,
      coordinates TEXT,
      color TEXT,
      number INTEGER,
      FOREIGN KEY (gameId) REFERENCES games (id),
      FOREIGN KEY (playerId) REFERENCES players (id)
    )
  `);
});

// Middleware pour parser le corps de la requête en JSON
app.use(express.json());

// Routes CRUD pour les joueurs
// ...

// Routes CRUD pour les parties
// ...

// Routes CRUD pour les mouvements
// ...

// Lancez le serveur
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});