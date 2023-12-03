import express from "express";
import {
  createMove,
  deleteMove,
  getMoveById,
  getMovesByGameId,
  updateMove,
} from "../controllers/moveController";

export const moveRoutes = express.Router();

moveRoutes.post("/", createMove);
moveRoutes.get("/", getMovesByGameId);
moveRoutes.get("/:id", getMoveById);
moveRoutes.put("/:id", updateMove);
moveRoutes.delete("/:id", deleteMove);
