import express from 'express';
import bodyParser from 'body-parser';
import { gameRoutes } from '../mongodb/routes/gameRoutes';

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Configure and use routes
app.use('/api/games', gameRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
