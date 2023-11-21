import express, { Request, Response } from 'express';
import { MongoClient, Db } from 'mongodb';

const app = express();
const port = 3001;

const url = 'mongodb://localhost:27017';
const dbName = 'mydatabase';
const collectionName = 'game';
const clientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

let db: Db;

async function connectToMongo() {
  const client = await MongoClient.connect(url, clientOptions);
  console.log('Connecté à la base de données MongoDB');
  db = client.db(dbName);
}

app.use(express.json());

// Middleware pour vérifier si la connexion à la base de données est établie avant de traiter les routes
app.use((req, res, next) => {
  if (db) {
    next();
  } else {
    res.status(500).json({ error: 'La connexion à la base de données n\'est pas établie.' });
  }
});

// Route pour obtenir tous les documents dans la collection "game"
app.get('/api/games', async (req, res) => {
  const games = await db.collection(collectionName).find({}).toArray();
  res.json(games);
});

// Route pour obtenir un document spécifique dans la collection "game" par son ID
app.get('/api/games/:id', async (req, res) => {
  const gameId = req.params.id;
  const game = await db.collection(collectionName).findOne({ _id: new MongoClient.ObjectID(gameId) });

  if (game) {
    res.json(game);
  } else {
    res.status(404).json({ error: 'La partie spécifiée n\'a pas été trouvée.' });
  }
});

// Route pour insérer un nouveau document dans la collection "game"
app.post('/api/games', async (req, res) => {
  const newGame = req.body;
  await db.collection(collectionName).insertOne(newGame);
  res.json({ success: true });
});

// Route pour mettre à jour un document existant dans la collection "game" par son ID
app.put('/api/games/:id', async (req, res) => {
  const gameId = req.params.id;
  const updatedGame = req.body;
  await db.collection(collectionName).updateOne({ _id: new MongoClient.ObjectID(gameId) }, { $set: updatedGame });
  res.json({ success: true });
});

// Route pour supprimer un document spécifique dans la collection "game" par son ID
app.delete('/api/games/:id', async (req, res) => {
  const gameId = req.params.id;
  await db.collection(collectionName).deleteOne({ _id: new MongoClient.ObjectID(gameId) });
  res.json({ success: true });
});

// Démarrer le serveur Express
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
  connectToMongo();
});
