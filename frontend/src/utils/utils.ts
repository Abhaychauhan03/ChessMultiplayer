import { Square } from "chess.js";
import { chess } from "./constants";

export const convertToSquare = (move: string) =>
  move.match(/[a-h][1-8]/)?.[0] || null;

export const getValidMoves = (from: Square) => {
  return chess.moves({ square: from }).map((move) => convertToSquare(move));
};
