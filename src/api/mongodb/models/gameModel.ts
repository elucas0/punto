import mongoose, { Schema } from "mongoose";

export interface GameDocument extends mongoose.Document {
  players: string[];
  moves: {
    player: string;
    coordinates: { row: number; col: number };
    color: string;
    number: number;
    round: number;
  }[];
  winner?: string;
  date?: Date;
}

const gameSchema = new Schema<GameDocument>({
  players: { type: [String], required: true },
  moves: {
    type: [
      {
        player: { type: String, required: true },
        coordinates: {
          row: { type: Number, required: true },
          col: { type: Number, required: true },
        },
        color: { type: String, required: true },
        number: { type: Number, required: true },
        round: { type: Number, required: true },
      },
    ],
    default: [],
  },
  winner: { type: String, required: false },
  date: { type: Date, default: Date.now, required: false },
});

export const Game = mongoose.model<GameDocument>("Game", gameSchema);
