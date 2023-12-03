import express from "express";
import bodyParser from "body-parser";
import { gameRoutes } from "./routes/gameRoutes";
import { playerRoutes } from "./routes/playerRoutes";
import { moveRoutes } from "./routes/moveRoutes";
import cors from "cors";

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Configure and use routes
app.use("/api/games", gameRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/moves", moveRoutes);

app.listen(port, () => {
  console.log(`MySQL server running on port ${port}`);
});
