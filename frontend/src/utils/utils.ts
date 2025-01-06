import { Square } from "chess.js";
import { chess } from "./constants";

export const convertToSquare = (move: string) =>
  move.match(/[a-h][1-8]/)?.[0] || null;

export const getValidMoves = (from: Square) => {
  return chess.moves({ square: from }).map((move) => convertToSquare(move));
};

export const indexToSquare = (num: number) => {
  return (String.fromCharCode((num % 8) + 97) +
    (8 - Math.floor(num / 8))) as Square;
};

export const findSquareColor = (index: number) => {
  const isEvenRow = Math.floor(index / 8) % 2 !== 0;
  const isEvenColumn = index % 2 == 0;
  return isEvenRow
    ? isEvenColumn
      ? "bg-lime-700"
      : "bg-amber-100"
    : isEvenColumn
    ? "bg-amber-100"
    : "bg-lime-700";
};
