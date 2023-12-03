import express from "express";
import {
  createPlayer,
  deletePlayer,
  getPlayerById,
  getPlayers,
  updatePlayer,
} from "../controllers/playerController";

export const playerRoutes = express.Router();

playerRoutes.post("/", createPlayer);
playerRoutes.get("/", getPlayers);
playerRoutes.get("/:id", getPlayerById);
playerRoutes.put("/:id", updatePlayer);
playerRoutes.delete("/:id", deletePlayer);
