import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { gameRoutes } from "./routes/gameRoutes";

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Configure and use routes
app.use("/api/games", gameRoutes);

// Connect to MongoDB
const mongoUrl = "mongodb://localhost:27017/games";
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
