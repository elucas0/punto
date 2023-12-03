import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { gameRoutes } from "./routes/gameRoutes";
import cors from "cors";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.use("/api/games", gameRoutes);

const mongoUrl = "mongodb://localhost:27017/games";
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`MongoDB server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
